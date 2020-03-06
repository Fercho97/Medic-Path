import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DiagnosticService } from '../diagnostic/diagnostic.service';
import { Regla } from '../../inferencia/regla.class';
import { Atomo } from '../../inferencia/atomo.class';
import { MemoriaTrabajo } from '../../inferencia/memoriaTrabajo.class';
import { ToastrService } from 'ngx-toastr';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { questions } from '../utils/questions.const';
import { ErrorMsg } from '../utils/error_msg.const';
import * as moment from 'moment-timezone';
moment.locale('es');
import { ApiService } from '../services/api.service';
import { HistoryOfflineManagerService } from '../services/history-offline-manager.service';
import { NetworkService, ConnectionStatus } from '../services/network.service';
@Component({
  selector: 'app-guided-diagnostic',
  templateUrl: './guided-diagnostic.page.html',
  styleUrls: ['./guided-diagnostic.page.scss'],
  providers: [DiagnosticService]
})
export class GuidedDiagnosticPage implements OnInit {

  hasPregunta : boolean = false;
  question : any = {};
  descripcion : string = "";
  baseConocimiento : any[] = [];
  memoriaDeTrabajo = new MemoriaTrabajo();
  conocimientoEvaluado : any[] = [];
  reglaEvaluar = new Regla();
  preguntas : any[] = [];
  atomosCondicion : Atomo[] = [];
  contador : number = 0;
  hasResult : boolean = false;
  breadcrumb : string = "";
  idResultado : string = '';
  selectedUser : boolean;
  public usuarios : any = [];
  public usuario : any;
  public sintomas : any = [];
  public sintomasSeleccionados : any = [];
  public allSymptoms : any = [];
  public isSelection : boolean = false;
  public descs : any = [];
  public nextObjective : any = [];
  public questionTypes = questions.QUESTIONS;
  public numeric : FormGroup;
  public scale : FormGroup;
  public errores_Diag = ErrorMsg.ERROR_DIAG;
  public painIndex = 1;
  public niveles : any = { "Ninguno" : [], "Bajo" : [], "Medio" : [], "Alto" : [], "Severo" : []};
  public color = "secondary";
  constructor(private diagServ : DiagnosticService, private toast : ToastrService,
              private router : Router, private api : ApiService, private network : NetworkService,
              private histServ : HistoryOfflineManagerService) { }

  ngOnInit() {
    this.api.obtenerUsuarios().subscribe((res: any) =>{

      this.usuarios = res;
    })

    this.api.getAllSymptoms().subscribe(res =>{
      console.log(res);
      this.allSymptoms = res;
      this.sintomas = this.allSymptoms.filter(sintoma => sintoma['compuesto']==false);
    })
    console.log(this.allSymptoms);
    
  }

  iniciarDiagnostico(){
    console.log("inicia")
    let mira : string = "";
    this.diagServ.consulta(mira).subscribe((res : any)  =>{
      //this.hasPregunta = true;
      console.log(res.body);
      
     res.body.reglas.forEach(element => {
        let rule = new Regla();
        this.baseConocimiento.push(rule.desgloseReglas(element));
      });

      console.log(this.baseConocimiento);
      this.hasPregunta = true;
      this.inferencia();
    }, error =>{
      this.toast.error("Hubo un error al conectarse con la base de datos", 'Error');
    })

    }

    inferencia(){
      let indice;
      if(this.nextObjective.length==0){
      indice = this.pathSelection();
      console.log(indice);
      this.reglaEvaluar = this.baseConocimiento[indice];
      }else{
        this.reglaEvaluar = this.nextObjective.pop();
        indice = this.searchNextObjectiveCurrentIndex();
      }
      let middleAtomRule = this.hasMiddleAtom();
      if(middleAtomRule!=undefined){
        this.nextObjective.push(this.reglaEvaluar);
        //console.log(this.nextObjective);
        this.reglaEvaluar= this.baseConocimiento[middleAtomRule];
        indice=middleAtomRule;
      }

      this.conocimientoEvaluado.push(this.baseConocimiento.splice(indice,1));
        for  (var element of this.reglaEvaluar.partesCondicion){
          if(element instanceof Atomo){
            let almacenado = null;

            almacenado =  this.memoriaDeTrabajo.estaAlmacenado(element);
            console.log("Esta en la memoria?" + almacenado)
            if(almacenado===false){
            this.atomosCondicion.push(new Atomo(element.desc,element.estado,element.obj,element.padecimiento,element.sintoma));
            let question = this.questionGen(element.desc); 
            if(question!=null){
              this.preguntas.push(question);
            }else{
            this.preguntas.push({message: "¿Ha tenido " + element.desc + " ?", type: "boolean"});
            }
             this.descs.push(element.sintoma);
            }
          }
        };
        //console.log(this.atomosCondicion);
        //console.log(this.preguntas);
        this.contador++;
        if(this.preguntas.length!=0){
          this.mostrarPregunta();
          }
        else{
          this.analize();
        }
    }

    mostrarPregunta(){
      this.question = this.preguntas.pop();
      console.log(this.question);
      if(this.question.type==='boolean'){
      let id = this.descs.pop();
      console.log(id);
      
      let found = this.sintomas.find(item => item['idSint'].toString() === id);

      if(found!=undefined){
      this.descripcion = found.descripcion;
      }
    }let id = this.descs.pop();
    }

    responder(resp : any){
      let atomoEvaluado = this.atomosCondicion.pop();
      if(resp=='Si'){
        atomoEvaluado.estado = true; 
        this.breadcrumb = this.breadcrumb + atomoEvaluado.desc + "->"
        this.evaluateSypmtom(atomoEvaluado.sintoma);
        console.log(this.preguntas);
      }
      else{
        atomoEvaluado.estado = false; 
      }
      this.memoriaDeTrabajo.almacenarAtomo(atomoEvaluado);

      if(this.atomosCondicion.length>0 || this.preguntas.length>0){
        this.mostrarPregunta();
      }
      else{
        this.analize();
      }
    }

    analize(){
      let condicion = false;
      condicion = this.reglaEvaluar.checarCondicion(this.memoriaDeTrabajo)
      console.log(condicion);
      if(condicion===true){
        let atomos = this.reglaEvaluar.disparadorReglas(this.memoriaDeTrabajo)
        for(var atomo of atomos){
        this.memoriaDeTrabajo.almacenarAtomo(atomo);
        if(this.reglaEvaluar.objetivo===false)
        this.breadcrumb = this.breadcrumb + atomo.desc + "->"
        }

        if(this.reglaEvaluar.objetivo===true){
          this.showWhy();
        }
      }else{
        console.log("No se cumplio: " + this.reglaEvaluar.partesConclusion)
        for(var noCumplido of this.reglaEvaluar.partesConclusion){
          let atomoNoCumplido = new Atomo(noCumplido.desc,false,noCumplido.obj,noCumplido.padecimiento,noCumplido.sintoma);
          this.memoriaDeTrabajo.almacenarAtomo(atomoNoCumplido);
        }
      }
      
      console.log(this.memoriaDeTrabajo)
      console.log(this.contador);
      console.log(this.baseConocimiento.length);
      if(this.contador<this.baseConocimiento.length && this.hasResult==false){
      this.inferencia();
      }else if(this.hasResult==false){
        this.question={message: "Lo sentimos, no se pudo encontrar su padecimiento conforme sus respuestas"};
      }
    }

    showWhy(){
      console.log(this.reglaEvaluar.partesConclusion[0].desc)
      this.question={message: "Su paciente padece de : " + this.reglaEvaluar.partesConclusion[0].desc }
      this.hasResult=true;
      this.idResultado=this.reglaEvaluar.partesConclusion[0].padecimiento;
      console.log(this.sintomasSeleccionados);
      this.reglaEvaluar.partesCondicion.forEach(element => {
          if((element!=="&") && (element!=="!")){
          this.sintomasSeleccionados.push(this.memoriaDeTrabajo.estaAfirmado(element));
         }
      });
      this.checkUrgencyLevels();
        this.guardar();
      
    }

    guardar(){
      var fecha = moment().tz('America/Mexico_City').format();
      let values = new HttpParams()
      .set('detalles', this.breadcrumb.replace(/->/g,","))
      .set('usuario', this.usuario)
      .set('padecimiento_final', this.idResultado)
      .set('visible', 'true')
      .set('fecha', fecha.toString());

      this.api.guardarHistorial(values).subscribe(res =>{
        if(this.network.getCurrentNetworkStatus() == ConnectionStatus.Online){
          this.toast.success('Se ha guardado con éxito en el historial del paciente', 'Guardado Exitoso!');
        }
    }, error =>{
        console.log("Error", error.error);
        this.toast.error(error.error, 'Error');
        this.router.navigate(['/landing'])
    })
    }

    selectUser(event : any){
      this.usuario = event.target.value;
      this.selectedUser=true;
    }

    selection(){
      this.isSelection=true;
    }

    cancel(){
      this.isSelection=false;
    }

    fromSintomasIniciales(){
      console.log(this.sintomasSeleccionados);
      this.sintomasSeleccionados.forEach(element => {
        //Generar atomo//TODO get sintoma id;
        let atomoRegla = new Atomo(element,true,false,null,null);
        
        //Guardar en memoria de trabajo
        this.memoriaDeTrabajo.almacenarAtomo(atomoRegla);
        this.breadcrumb = this.breadcrumb + element + "->"
      });
      
     this.iniciarDiagnostico();
    }

    pathSelection(){
      let bestStart;
      let atomsInRule;
      let commonAtoms;
      let bestPorcentage = 0;
      let porcentage;
      let index = 0;
      this.baseConocimiento.forEach((element:Regla)=> {
        atomsInRule=0;
        commonAtoms=0;
        index++;
        element.partesCondicion.forEach(parte =>{
          if(parte instanceof Atomo){
            atomsInRule++;
          }
          if(this.memoriaDeTrabajo.atomosAfirmados.some(atom => atom.desc === parte.desc)){
            commonAtoms++;
          }
        });
        porcentage = commonAtoms * 100 / atomsInRule;
        if(porcentage > bestPorcentage){
          bestPorcentage = porcentage;
          bestStart = index;
        }
      });
      if(bestStart==undefined){
      bestStart = Math.floor(Math.random() * this.baseConocimiento.length) + 1;
      }
      return bestStart - 1;
    }

    hasMiddleAtom(){
      console.log(this.reglaEvaluar);
      let previousRuleIndex;
       this.reglaEvaluar.partesCondicion.forEach(condition => {
         if(!this.memoriaDeTrabajo.estaAlmacenado(condition)){
         this.baseConocimiento.forEach(function(rule,index){
           if((condition!="&") && (condition!="!")){
               if(condition.desc === rule.partesConclusion[0].desc){
                 previousRuleIndex = index;
               }
           }
         });
       }
       });
 
       return previousRuleIndex;
     }
 
     searchNextObjectiveCurrentIndex(){
       let lastId;
       let currentObjective = this.reglaEvaluar.partesConclusion[0].desc;
       this.baseConocimiento.forEach(function(element, index) {
 
         if(currentObjective==element.partesConclusion[0].desc){
           lastId = index;
         }
       })
 
       return lastId;
     }

     checkUrgencyLevels(){
      
            this.memoriaDeTrabajo.atomosAfirmados.forEach(atomo =>{
              let atomSymp = this.allSymptoms.find(item => item['nombre_sint'].toString() === atomo.desc);
              if(atomSymp!=null){
              console.log(atomSymp.nivel_urgencia);
              let sympLev = {sintoma: atomSymp.nombre_sint};
              if(atomSymp.nivel_urgencia>=0 && atomSymp.nivel_urgencia<0.2){
                this.niveles.Ninguno.push(sympLev);
              }else if(atomSymp.nivel_urgencia>=0.2 && atomSymp.nivel_urgencia<0.4){
                this.niveles.Bajo.push(sympLev);
              }else if(atomSymp.nivel_urgencia>=0.4 && atomSymp.nivel_urgencia<0.6){
                this.niveles.Medio.push(sympLev);
              }else if(atomSymp.nivel_urgencia>=0.6 && atomSymp.nivel_urgencia<0.8){
                this.niveles.Alto.push(sympLev);
              }else if(atomSymp.nivel_urgencia>=0.8 && atomSymp.nivel_urgencia<1){
                this.niveles.Severo.push(sympLev);
              }
              }
            })
           }
      
           questionGen(sint: any){
      
            let hasCertainQuestion = questions.QUESTIONS[sint.toLowerCase()];
      
            if(hasCertainQuestion!=undefined){
              return hasCertainQuestion[0];
            }else{
              return null;
            }
            
           }
      
           numericAnswer(){
             let expectedValue = this.question.validValue;
      
             let atomoEvaluado = this.atomosCondicion.pop();
             if(this.numeric.value.temp >= expectedValue){
               atomoEvaluado.estado = true; 
               this.breadcrumb = this.breadcrumb + atomoEvaluado.desc + "->"
             }
             else{
               atomoEvaluado.estado = false; 
             }
             this.memoriaDeTrabajo.almacenarAtomo(atomoEvaluado);
       
             if(this.atomosCondicion.length>0){
               this.mostrarPregunta();
             }
             else{
               this.analize();
             }
           }
      
           evaluateSypmtom(symp : any){
            let atomSymp = this.allSymptoms.find(item => item['idSint'].toString() === symp);
            let sympIndex = this.allSymptoms.findIndex(item => item['idSint'].toString() === symp);
            if(atomSymp.nivel_urgencia==0.4){
              this.preguntas.push({message:'Del 1 al 10 que rango de molestia le causa a su paciente el tener ' + atomSymp.nombre_sint, type: 'scale', index: sympIndex});
            }
           }
      
           scaleAnswer(index : any){
          let atomSymp = this.allSymptoms[index];
          let calculatedUrgency = (atomSymp.nivel_urgencia*this.painIndex)/4;
          this.allSymptoms[index].nivel_urgencia = calculatedUrgency;
          this.painIndex=1;
          if(this.preguntas.length>0){
          this.mostrarPregunta();
          }else{
          this.analize();
          }
           }

           rangeDynamic(){
            
                      if(this.painIndex> 1 && this.painIndex<3){
                        this.color="primary";
                      }
                      else if(this.painIndex> 3 && this.painIndex<6){
                        this.color="success";
                      }
                      else if(this.painIndex> 6 && this.painIndex<8){
                        this.color="warning";
                      }
                      else if(this.painIndex>= 8 && this.painIndex<=10){
                        this.color="danger";
                      }
                    }
}

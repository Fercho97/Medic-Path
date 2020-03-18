import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Regla } from '../../inferencia/regla.class';
import { Atomo } from '../../inferencia/atomo.class';
import { MemoriaTrabajo } from '../../inferencia/memoriaTrabajo.class';
import { ToastrService } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';
import {Router} from '@angular/router';
import { questions } from '../utils/questions.const';
import { Calculus } from '../../inferencia/calculus.class';
import { ErrorMsg } from '../utils/error_msg.const';
import { ApiService } from '../services/api.service';
import { HistoryOfflineManagerService } from '../services/history-offline-manager.service';
import { NetworkService, ConnectionStatus } from '../services/network.service';
import { CurrentUserService } from "../services/current-user.service";
import { AlertsManagerService} from '../services/alerts-manager.service'
import * as moment from 'moment-timezone';
moment.locale('es');
@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.page.html',
  styleUrls: ['./diagnostic.page.scss'],
  providers: [HistoryOfflineManagerService, ApiService, NetworkService,CurrentUserService]
})
export class DiagnosticPage implements OnInit {

  hasPregunta : boolean = false;
  question : any = {};
  descripcion : string = "";
  baseConocimiento : any[] = [];
  memoriaDeTrabajo = new MemoriaTrabajo();
  conocimientoEvaluado : any[] = [];
  reglaEvaluar = new Regla();
  calculusClass = new Calculus();
  preguntas : any[] = [];
  atomosCondicion : Atomo[] = [];
  hasResult : boolean = false;
  breadcrumb : string = "";
  idResultado : string = '';
  user : boolean = false;
  public sintomas : any = [];
  public sintomasSeleccionados : any = [];
  public sintomasExtras : any =[];
  public sintomasResultado : any = [];
  public selectableSymptoms : any = [];
  public descs : any = [];
  public nextObjective : any = [];
  public niveles : any = { "Ninguno" : [], "Bajo" : [], "Medio" : [], "Alto" : [], "Severo" : []};
  public questionTypes = questions.QUESTIONS;
  public numeric : FormGroup;
  public scale : FormGroup;
  public errores_Diag = ErrorMsg.ERROR_DIAG;
  public nivelesInfo = ErrorMsg.LEVEL_EXPLAIN;
  public painIndex = 1;
  public color = "secondary";
  public atomos_opciones : any = [];
  public isSelection : boolean = false;
  public fromSelected = false;
  constructor(private histServ : HistoryOfflineManagerService, private toast : ToastrService,
              private router : Router, private nav : NavController,
              private api : ApiService, private network : NetworkService, private session : CurrentUserService,
              private alertServ : AlertsManagerService) { 
    this.numeric = new FormGroup({
      temp: new FormControl('', [Validators.required,Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]) 
    });
  }

  ngOnInit() {
    this.api.getAllSymptoms().subscribe(res =>{
      this.sintomas = res;
      this.selectableSymptoms = this.sintomas.filter(sintoma => sintoma['compuesto']==false);
      console.log(this.sintomas);
    })
  }

  iniciarDiagnostico(){
    console.log("inicia")
    let mira : string = "";
    this.api.consulta(mira).subscribe((res : any)  =>{
      //this.hasPregunta = true;
      
     res.forEach(element => {
        let rule = new Regla();
        this.baseConocimiento.push(rule.desgloseReglas(element));
      });

      this.hasPregunta = true;
      this.inferencia();
    }, error =>{
      this.toast.error("Hubo un error al conectarse con la base de datos", 'Error');
    })

    }

    inferencia(){
      let indice;
      if(this.nextObjective.length==0){
      indice = this.calculusClass.pathSelection(this.baseConocimiento,this.memoriaDeTrabajo);
      
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
          //console.log(element);
          if(element instanceof Atomo){
            let almacenado = null;

            almacenado =  this.memoriaDeTrabajo.estaAlmacenado(element);
            //console.log("Esta en la memoria?" + almacenado)
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
    }
    }

    responder(resp : any){
      let atomoEvaluado = this.atomosCondicion.pop();
      if(resp=='Si'){
        atomoEvaluado.estado = true; 
        this.breadcrumb = this.breadcrumb + atomoEvaluado.desc + "->"
        this.evaluateSypmtom(atomoEvaluado.sintoma);
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
      console.log(this.reglaEvaluar);
      condicion = this.reglaEvaluar.checarCondicion(this.memoriaDeTrabajo)
     // console.log(condicion);
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
      if(this.baseConocimiento.length!=0 && this.hasResult==false){
      this.inferencia();
      }else if(this.hasResult==false){
        this.question={message: "Lo sentimos, no se pudo encontrar su padecimiento conforme sus respuestas"};
        this.hasResult=true;
        this.sintomasExtras = this.calculusClass.calculateCloseness(this.conocimientoEvaluado,this.baseConocimiento,this.memoriaDeTrabajo);
      
      }
    }

    async guardar(){
      let details = "";
      for(var atom of this.sintomasResultado){
        details = details + atom.desc + ",";
      }

      var fecha = moment().tz('America/Mexico_City').format();
      var user = await this.session.obtainSessionId();
      let values = new HttpParams()
      .set('detalles', details)
      .set('usuario', user)
      .set('padecimiento_final', this.idResultado)
      .set('visible', "true")
      .set('fecha', fecha.toString())
      .set('detalles_especificos', JSON.stringify(this.niveles));
      
      this.api.guardarHistorial(values).subscribe(res =>{
        if(this.network.getCurrentNetworkStatus() == ConnectionStatus.Online){
        this.toast.success('Se ha guardado con éxito en su historial', 'Guardado Exitoso!');
        
        }else{
         this.histServ.addHistoryToLocal(fecha.toString(),details,this.idResultado,JSON.stringify(this.niveles));
        }
    }, error =>{
        console.log("Error", error.error);
        this.toast.error(error.error, 'Error');
        this.router.navigate(['/landing'])
    })
    }

    showWhy(){
      console.log(this.reglaEvaluar.partesConclusion[0].desc)
      this.question={message: "Usted padece de : " + this.reglaEvaluar.partesConclusion[0].desc }
      this.hasResult=true;
      this.idResultado=this.reglaEvaluar.partesConclusion[0].padecimiento;
     
      this.reglaEvaluar.partesCondicion.forEach(element => {
          if((element!=="&") && (element!=="!")){
          this.sintomasResultado.push(this.memoriaDeTrabajo.estaAfirmado(element));
         }
      });
      this.sintomasExtras = this.calculusClass.calculateCloseness(this.conocimientoEvaluado,this.baseConocimiento,this.memoriaDeTrabajo);
      console.log(this.sintomasExtras);
      this.checkUrgencyLevels();
        this.guardar();
      
    }

    hasMiddleAtom(){
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
        let sintoma = this.sintomas.find(sint => sint['nombre_sint'] == element);
      
        //Guardar en memoria de trabajo
        this.memoriaDeTrabajo.almacenarAtomo(atomoRegla);
        this.breadcrumb = this.breadcrumb + element + "->"
        this.evaluateSypmtom(sintoma.idSint);
      });
      this.avoidUnnecesaryQuestions();
      console.log(this.memoriaDeTrabajo);
      if(this.preguntas.length>0){
        this.hasPregunta = true;
        this.fromSelected=true;
        this.mostrarPregunta();
      }else{
        this.iniciarDiagnostico();
      }
    }

    avoidUnnecesaryQuestions(){
      this.memoriaDeTrabajo.atomosAfirmados.forEach(sintoma =>{
        let multiOption = this.checkMultipleTypes(sintoma.desc);

        if(multiOption.length>1){
          multiOption.forEach(option =>{
            let atomo = new Atomo(option.nombre_sint,false,false,null,null);
            console.log(this.memoriaDeTrabajo.estaAfirmado(atomo));
            if(this.memoriaDeTrabajo.estaAlmacenado(atomo)===false){
              this.memoriaDeTrabajo.almacenarAtomo(atomo);
            }
          })
        }
      })
    }

    checkUrgencyLevels(){
      
            this.memoriaDeTrabajo.atomosAfirmados.forEach(atomo =>{
              let atomSymp = this.sintomas.find(item => item['nombre_sint'].toString() === atomo.desc);
              if(atomSymp!=null){
              console.log(atomSymp.nivel_urgencia);
              let sympLev = {sintoma: atomSymp.nombre_sint, descripcion: atomSymp.descripcion};
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
            let multiOption = this.checkMultipleTypes(sint);
            if(hasCertainQuestion!=undefined){
              return hasCertainQuestion[0];
            }
            else if(multiOption.length>1){
              hasCertainQuestion = this.generateMultiOptionQuestion(multiOption,sint);
              return hasCertainQuestion;
            }
            else{
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
            let atomSymp = this.sintomas.find(item => item['idSint'].toString() === symp.toString());
            let sympIndex = this.sintomas.findIndex(item => item['idSint'].toString() === symp.toString());
            if(atomSymp.nivel_urgencia==0.4){
              this.preguntas.push({message:'Del 1 al 10 que rango de molestia le causa el tener ' + atomSymp.nombre_sint, type: 'scale', index: sympIndex});
            }
           }
      
        scaleAnswer(index : any){
          let atomSymp = this.sintomas[index];
          let calculatedUrgency = (atomSymp.nivel_urgencia*this.painIndex)/4;
          this.sintomas[index].nivel_urgencia = calculatedUrgency;
          this.painIndex=1;
          if(this.preguntas.length>0){
            this.mostrarPregunta();
            }else if(this.fromSelected==true){
              this.iniciarDiagnostico();
            }else{
            this.analize();
            }
        }

        goToHistory(){
          this.nav.navigateRoot(["/history-list"]);
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

        checkMultipleTypes(sint:any){
          let sintoma = this.sintomas.find(symp => symp['nombre_sint']==sint);
          let sameSynts = this.sintomas.filter(symp => symp['categoria_sint']==sintoma.categoria_sint && symp['keyWord'].toLowerCase()==sintoma.keyWord.toLowerCase());
          return sameSynts;
        }
   
   
        generateMultiOptionQuestion(options :any, sint: any){
         var nombres:any = [];
   
         options.forEach(element => {
           nombres.push(element.nombre_sint);
         });
   
   
         let resultado = this.calculusClass.getDifferencesBetweenNames(nombres,sint);
   
         let diferencias = resultado[0];
   
         return {message: '¿Ha tenido ' + resultado[1] +"?", type: 'option', options: diferencias, normal: resultado[1], atoms: nombres}
        }
   
        optionAnswer(opciones: any, text : any, atomos : any, answer){
          //console.log(opciones.length);
          if(answer==="Si"){
            let atomsSize = atomos.length;
            this.atomos_opciones.push( atomos.slice());
            console.log(this.atomos_opciones);
            let buttonOptions = [];
            for(var i = 0; i<atomsSize; i++){
              let showOption  = "";
              let atomo = atomos.pop();
    
              if(opciones.length!=0){
              showOption = opciones.pop();
              }else{
                showOption = "General";
              }
              let sintoma = this.sintomas.find(symp => symp['nombre_sint']==atomo);
              let button = {message: showOption, value: atomo, desc: sintoma.descripcion};
              buttonOptions.push(button);
            }
            console.log(buttonOptions);
            let messageShow = questions.MULTIQUESTIONS[text.toLowerCase()];
            this.preguntas.push({message: messageShow[0].message,buttons: buttonOptions, type: 'selection'});
          }else{
            let atomoEvaluado = this.atomosCondicion.pop();
            atomoEvaluado.estado=false;
            this.memoriaDeTrabajo.almacenarAtomo(atomoEvaluado);
            atomos.forEach(atom =>{
              if(atom!==atomoEvaluado.desc){
                let negado = new Atomo(atom,false,false,null,null);
                this.memoriaDeTrabajo.almacenarAtomo(negado);
              }
            })
    
          }
          if(this.preguntas.length>0){
            this.mostrarPregunta();
            }else{
            this.analize();
            }
        }
   
       showInfo(label : any){
        console.log(label);
        let mensaje = this.nivelesInfo[label].message;
        this.alertServ.infoAlert(mensaje);
      }

       selectedOption(selectedAtom : any){
         let atomoEvaluado = this.atomosCondicion.pop();
         let atom : any;
         let atomId : any;
         if(atomoEvaluado.desc===selectedAtom){
           atomoEvaluado.estado=true;
           this.memoriaDeTrabajo.almacenarAtomo(atomoEvaluado);
           this.breadcrumb = this.breadcrumb + atomoEvaluado.desc + "->";
           atomId = atomoEvaluado.sintoma;
         }else{
           let sint = this.sintomas.find(symp => symp['nombre_sint']==selectedAtom);
           atom = new Atomo(selectedAtom,true,false,null,sint.idSint);
           this.memoriaDeTrabajo.almacenarAtomo(atom);
           this.breadcrumb = this.breadcrumb + atom.desc + "->"
           atomId = atom.sintoma;
         }
   
         let opciones = this.atomos_opciones.pop();
         opciones.forEach(atomo =>{
           if(atomo!==selectedAtom){
             let negAtom = new Atomo(atomo,false,false,null,null);
             this.memoriaDeTrabajo.almacenarAtomo(negAtom);
           }
         })
   
         this.evaluateSypmtom(atomId);
         console.log(this.memoriaDeTrabajo)
         if(this.preguntas.length>0){
           this.mostrarPregunta();
           }else{
           this.analize();
           }
       }
}

import { Component, OnInit } from '@angular/core';
import { DiagnosticService } from './diagnostic.service';
import { Regla } from '../../inferencia/regla.class';
import { Atomo } from '../../inferencia/atomo.class';
import { MemoriaTrabajo } from '../../inferencia/memoriaTrabajo.class';
import { ToastrService } from 'ngx-toastr';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.page.html',
  styleUrls: ['./diagnostic.page.scss'],
  providers: [DiagnosticService]
})
export class DiagnosticPage implements OnInit {

  constructor(private diagServ : DiagnosticService, private toast : ToastrService, private router : Router) { }

  hasPregunta : boolean = false;
  message : string = "";
  descripcion : string = "";
  baseConocimiento : any[] = [];
  memoriaDeTrabajo = new MemoriaTrabajo();
  conocimientoEvaluado : any[] = [];
  reglaEvaluar = new Regla();
  preguntas : string[] = [];
  atomosCondicion : Atomo[] = [];
  hasResult : boolean = false;
  breadcrumb : string = "";
  idResultado : string = '';
  user : boolean = false;
  public iniciales : any = [];
  public sintomasSeleccionados : any = [];
  public sintomasExtras : any =[];
  public isSelection : boolean = false;
  public descs : any = [];
  public nextObjective : any = [];

  ngOnInit() {
    this.diagServ.getComponents().subscribe(res =>{
      this.iniciales = res.body;
      console.log(this.iniciales);
    })
  }

  iniciarDiagnostico(){
    console.log("inicia")
    let mira : string = "";
    this.diagServ.consulta(mira).subscribe((res : any)  =>{
      //this.hasPregunta = true;
      
     res.body.reglas.forEach(element => {
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
      indice = this.pathSelection();
      
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
            this.atomosCondicion.push(new Atomo(element.desc,element.estado,element.obj,element.padecimiento));
             this.preguntas.push("¿Ha tenido " + element.desc + " ?");
             this.descs.push(element.desc);
            }
          }
        };
        if(this.preguntas.length!=0){
          this.generarPregunta();
          }
        else{
          this.analize();
        }
    }

    generarPregunta(){
      let id = this.descs.pop();
      this.message = this.preguntas.pop();
      let found = this.iniciales.find(item => item['nombre_sint'].toString() === id);

      if(found!=undefined){
      this.descripcion = found.descripcion;
      }

    }

    responder(resp : any){
      let atomoEvaluado = this.atomosCondicion.pop();
      if(resp=='Si'){
        atomoEvaluado.estado = true; 
        this.breadcrumb = this.breadcrumb + atomoEvaluado.desc + "->"
      }
      else{
        atomoEvaluado.estado = false; 
      }
      this.memoriaDeTrabajo.almacenarAtomo(atomoEvaluado);

      if(this.atomosCondicion.length>0){
        this.generarPregunta();
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
          let atomoNoCumplido = new Atomo(noCumplido.desc,false,noCumplido.obj,noCumplido.padecimiento);
          this.memoriaDeTrabajo.almacenarAtomo(atomoNoCumplido);
        }
      }
      if(this.baseConocimiento.length!=0 && this.hasResult==false){
      this.inferencia();
      }else if(this.hasResult==false){
        this.message="Lo sentimos, no se pudo encontrar su padecimiento conforme sus respuestas";
      }
    }

    guardar(){
      let values = new HttpParams()
      .set('detalles', this.breadcrumb.replace(/->/g,","))
      .set('usuario', window.localStorage.getItem('id'))
      .set('padecimiento_final', this.idResultado)
      .set('visible', "true");

      this.diagServ.guardarHistorial(values).subscribe(res =>{
        
        this.toast.success('Se ha guardado con éxito en su historial', 'Guardado Exitoso!');
        
    }, error =>{
        console.log("Error", error.error);
        this.toast.error(error.error, 'Error');
        this.router.navigate(['/landing'])
    })
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
      return bestStart-1;
    }

    showWhy(){
      console.log(this.reglaEvaluar.partesConclusion[0].desc)
      this.message="Usted padece de : " + this.reglaEvaluar.partesConclusion[0].desc;
      this.hasResult=true;
      this.idResultado=this.reglaEvaluar.partesConclusion[0].padecimiento;
      console.log(this.sintomasSeleccionados);
      this.reglaEvaluar.partesCondicion.forEach(element => {
          if((element!=="&") && (element!=="!")){
          this.sintomasSeleccionados.push(this.memoriaDeTrabajo.estaAfirmado(element));
         }
      });
        this.calculateCloseness();
        this.guardar();
      
    }

    calculateCloseness(){
      let atomsInRule;
      let commonAtoms;
      let percentage;
      this.conocimientoEvaluado.forEach(element => {
         if(element[0].partesConclusion[0].obj==true){
        atomsInRule=0;
        commonAtoms=0;
        element[0].partesCondicion.forEach(parte =>{
          if(parte instanceof Atomo){
            atomsInRule++;
          }
          if(this.memoriaDeTrabajo.atomosAfirmados.some(atom => atom.desc === parte.desc)){
            commonAtoms++;
          }
        });
        percentage = commonAtoms * 100 / atomsInRule;
        if(percentage > 10 && percentage != 100){
          let showPercentage = percentage*0.01;
          let closeness = {padecimiento: element[0].partesConclusion[0].desc, porcentaje: Math.floor(percentage), showPorcentaje: showPercentage.toFixed(1)};
          this.sintomasExtras.push(closeness);
        }
      }
      });
      this.baseConocimiento.forEach(element => {
        if(element.partesConclusion[0].obj==true){
        atomsInRule=0;
        commonAtoms=0;
        element.partesCondicion.forEach(parte =>{
          if(parte instanceof Atomo){
            atomsInRule++;
          }
          if(this.memoriaDeTrabajo.atomosAfirmados.some(atom => atom.desc === parte.desc)){
            commonAtoms++;
          }
        });
        percentage = commonAtoms * 100 / atomsInRule;
        if(percentage > 10 && percentage != 100){
          let showPercentage = percentage*0.01;
          let closeness = {padecimiento: element.partesConclusion[0].desc, porcentaje: Math.floor(percentage), showPorcentaje: showPercentage.toFixed(1)};
         console.log(closeness);
          this.sintomasExtras.push(closeness);
        }
      }
      });

      console.log(this.sintomasExtras);
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
}

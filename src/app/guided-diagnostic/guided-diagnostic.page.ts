import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DiagnosticService } from '../diagnostic/diagnostic.service';
import { Regla } from '../../inferencia/regla.class';
import { Atomo } from '../../inferencia/atomo.class';
import { MemoriaTrabajo } from '../../inferencia/memoriaTrabajo.class';
import { ToastrService } from 'ngx-toastr';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-guided-diagnostic',
  templateUrl: './guided-diagnostic.page.html',
  styleUrls: ['./guided-diagnostic.page.scss'],
  providers: [DiagnosticService]
})
export class GuidedDiagnosticPage implements OnInit {

  hasPregunta : boolean = false;
  message : string = "";
  baseConocimiento : any[] = [];
  memoriaDeTrabajo = new MemoriaTrabajo();
  reglaEvaluar = new Regla();
  preguntas : string[] = [];
  atomosCondicion : Atomo[] = [];
  contador : number = 0;
  hasResult : boolean = false;
  breadcrumb : string = "";
  idResultado : string = '';
  selectedUser : boolean;
  public usuarios : any = [];
  public usuario : any;
  public iniciales : any = [];
  public sintomasSeleccionados : any = [];
  public isSelection : boolean = false;
  constructor(private diagServ : DiagnosticService, private toast : ToastrService,
              private router : Router) { }

  ngOnInit() {
    this.diagServ.obtenerUsuarios().subscribe((res: any) =>{
      console.log(res.body);
      this.usuarios = res.body.usuarios;
    })

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
        if(this.isSelection==true){
          indice = this.evaluacionInicial();
          if(indice!=undefined){
            this.contador++;
          }
          this.isSelection=false;
        }
        if(indice==undefined){
        this.reglaEvaluar = this.baseConocimiento[this.contador];
        }else{
          this.reglaEvaluar = this.baseConocimiento[indice-1];
        }
        
        //console.log("Entro regla");
        //console.log(this.reglaEvaluar);
        for  (var element of this.reglaEvaluar.partesCondicion){
          //console.log(element);
          if(element instanceof Atomo){
            let almacenado = null;

            almacenado =  this.memoriaDeTrabajo.estaAlmacenado(element);
            console.log("Esta en la memoria?" + almacenado)
            if(almacenado===false){
            this.atomosCondicion.push(new Atomo(element.desc,element.estado,element.obj,element.padecimiento));
             this.preguntas.push("¿Ha tenido " + element.desc + " ?");
            }
          }
        };
        //console.log(this.atomosCondicion);
        //console.log(this.preguntas);
        this.contador++;
        if(this.preguntas.length!=0){
          this.generarPregunta();
          }
        else{
          this.analize();
        }
    }

    generarPregunta(){
      this.message = this.preguntas.pop();
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
          console.log(this.reglaEvaluar.partesConclusion[0].desc)
          this.message="Usted padece de : " + this.reglaEvaluar.partesConclusion[0].desc;
          this.hasResult=true;
          console.log(this.reglaEvaluar.partesConclusion[0]);
          this.idResultado=this.reglaEvaluar.partesConclusion[0].padecimiento;
            this.guardar();
          
        }
      }else{
        console.log("No se cumplio: " + this.reglaEvaluar.partesConclusion)
        for(var noCumplido of this.reglaEvaluar.partesConclusion){
          let atomoNoCumplido = new Atomo(noCumplido.desc,false,noCumplido.obj,noCumplido.padecimiento);
          this.memoriaDeTrabajo.almacenarAtomo(atomoNoCumplido);
        }
      }
      
      console.log(this.memoriaDeTrabajo)
      console.log(this.contador);
      console.log(this.baseConocimiento.length);
      if(this.contador<this.baseConocimiento.length && this.hasResult==false){
      this.inferencia();
      }else if(this.hasResult==false){
        this.message="Lo sentimos, no se pudo encontrar su padecimiento conforme sus respuestas";
      }
    }

    guardar(){
      console.log("se envia");
      let values = new HttpParams()
      .set('detalles', this.breadcrumb.replace(/->/g,","))
      .set('usuario', this.usuario)
      .set('padecimiento_final', this.idResultado)
      .set('visible', 'true');

      this.diagServ.guardarHistorial(values).subscribe(res =>{
        console.log("Ok", res)
        
      this.toast.success('Se ha guardado con éxito en el historial del paciente', 'Guardado Exitoso!');
      
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
      this.sintomasSeleccionados.forEach(element => {
        //Generar atomo
        let atomoRegla = new Atomo(element,true,false,null);
        
        //Guardar en memoria de trabajo
        this.memoriaDeTrabajo.almacenarAtomo(atomoRegla);
        this.breadcrumb = this.breadcrumb + element + "->"
      });
      
     this.iniciarDiagnostico();
    }

    evaluacionInicial(){
      let bestStart;
      let atomsInRule;
      let commonAtoms;
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
        if(porcentage => 60){
          bestStart = index;
        }
      });
      return bestStart;
    }

}

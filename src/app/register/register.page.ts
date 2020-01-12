import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { RegisterService } from './register.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  datos_registro : FormGroup;

  mensajes_error = {
    'nickname' : [
      {type: 'required', message: 'El campo de nickname es requerido'},
      {type: 'minlength', message: 'El nickname debe ser mayor a 3 caracteres'},
      {type: 'maxlength', message: 'El nickname debe ser menor a 20 caracteres'}
    ],
    'nombres' : [
      {type: 'required', message: 'El nombre no se puede quedar vacio'},
      {type: 'minlength', message: 'La longitud debe ser mayor a 3 caracteres'},
      {type: 'maxlength', message: 'La longitud debe ser menor a 50 caracteres'}
    ],
    'apellidos' : [
      {type: 'required', message: 'Los apellidos no pueden quedar vacios'},
      {type: 'minlength', message: 'La longitud debe ser mayor a 3 caracteres'},
      {type: 'maxlength', message: 'La longitud debe ser menor a 50 caracteres'}
    ],
    'email' : [
      {type: 'required', message: 'Es necesario ingresar un correo'},
      {type: 'pattern', message: 'El texto ingresado no representa un correo'}
    ],
    'fecha_nacimiento' : [
      {type: 'required', message: 'Debe seleccionar una fecha'}
    ],
    'password' : [
      {type: 'required', message: 'Debe ingresar una contraseña'},
      {type: 'minlength', message: 'La contraseña debe tener más de 5 caracteres'}
    ],
    'passwordVerif' : [
      {type: 'required', message: 'Valide su contraseña'}
    ],
    'same_password' : [
      {type: 'equalPasswords', message: 'Las contraseñas no son iguales'}
    ]
  }
  sexo : string = "";
  private values : HttpParams;
  public samePass : boolean = true;
  constructor(private regServ : RegisterService, private toast : ToastrService, private router : Router) {

    this.datos_registro = new FormGroup({
      nombres : new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      apellidos : new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]),
      nickname : new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]),

      password_validations : new FormGroup({
      password : new FormControl('', [Validators.required, Validators.minLength(5)]),
      passwordVerif : new FormControl('', Validators.required),
      }, (formGroup : FormGroup) => {
          return this.equalPasswords(formGroup);
      }),
      genero : new FormControl('', Validators.required),
      fecha_nacimiento : new FormControl('', Validators.required)
    })
   }

  ngOnInit() {
  }

  registry() {
    console.log(this.datos_registro.value.genero)
    this.values = new HttpParams()
    .set('nickname', this.datos_registro.value.nickname)
    .set('email', this.datos_registro.value.email)
    .set('sexo', this.datos_registro.value.genero)
    .set('nombres', this.datos_registro.value.nombres)
    .set('apellidos', this.datos_registro.value.apellidos)
    .set('password', this.datos_registro.value.password_validations.password)
    .set('passwordVerif', this.datos_registro.value.password_validations.passwordVerif)
    .set('tipoUsuario', '1')
    .set('fecha_nacimiento', this.datos_registro.value.fecha_nacimiento);
    this.regServ.checkRegister(this.values).subscribe(res =>{
      console.log("Ok", res)
      this.toast.success('Le hemos enviado un correo para confirmar su cuenta', 'Registro Exitoso!');
    this.router.navigate([''])
  }, error =>{
      console.log("Error", error.error);
      this.toast.error(error.error, 'Error');
      this.router.navigate([''])
  })
  }

  radioSelection(event){
    this.sexo = event.detail.value;
    console.log(this.sexo);
  }

  equalPasswords(formGroup : FormGroup){
    let val;
    let valid = true;

    for(let key in formGroup.controls){
      if(formGroup.controls.hasOwnProperty(key)){
        let control : FormControl = <FormControl>formGroup.controls[key];
        if(val === undefined){
           val = control.value
        }else{
          if(val !== control.value){
             valid = false;
             break;
          }
        }
      }
    }
    if(valid){
      return null;
    }
    return{
      equalPasswords : true
    }
  }

}

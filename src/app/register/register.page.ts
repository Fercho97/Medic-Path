import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { RegisterService } from './register.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorMsg } from '../utils/error_msg.const';
import { NicknameValidator } from "../validators/NicknameValidator";
import { EmailValidator } from "../validators/EmailValidator";
import { DateValidator } from "../validators/DateValidator";
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  datos_registro : FormGroup;

  mensajes_error = ErrorMsg.ERROR_MSG_REGISTER;
  sexo : string = "";
  private values : HttpParams;
  public samePass : boolean = true;
  constructor(private regServ : RegisterService, private toast : ToastrService,
              private router : Router, private nickVal : NicknameValidator,
              private emailVal : EmailValidator) {

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
      ], [this.emailVal.existingEmail()]),
      nickname : new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ],[this.nickVal.existingNickname()]),

      password_validations : new FormGroup({
      password : new FormControl('', [Validators.required, Validators.minLength(5)]),
      passwordVerif : new FormControl('', Validators.required),
      }, (formGroup : FormGroup) => {
          return this.equalPasswords(formGroup);
      }),
      genero : new FormControl('', Validators.required),
      fecha_nacimiento : new FormControl('', [Validators.required,DateValidator.isFutureDate,DateValidator.noValidAge])
    })
   }

  ngOnInit() {
  }

  registry() {
    //console.log(this.datos_registro.value.genero)
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
      //console.log("Ok", res)
      this.toast.success('Le hemos enviado un correo para confirmar su cuenta', 'Registro Exitoso!');
    this.router.navigate([''])
  }, error =>{
      //console.log("Error", error.error);
      this.toast.error(error.error, 'Error');
      this.router.navigate([''])
  })
  }

  radioSelection(event){
    this.sexo = event.detail.value;
    //console.log(this.sexo);
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

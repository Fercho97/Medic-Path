import { Component, OnInit } from '@angular/core';
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

  sexo : string = "";
  private values : HttpParams;
  public samePass : boolean = true;
  constructor(private regServ : RegisterService, private toast : ToastrService, private router : Router) { }

  ngOnInit() {
  }

  registry(form) {
    console.log(form.value.fecha)
    if(this.samePass==true){
    this.values = new HttpParams()
    .set('nickname', form.value.nickname)
    .set('email', form.value.email)
    .set('sexo', this.sexo)
    .set('nombres', form.value.nombres)
    .set('apellidos', form.value.apellidos)
    .set('password', form.value.password)
    .set('passwordVerif', form.value.passwordVerif)
    .set('tipoUsuario', '1')
    .set('fecha_nacimiento', form.value.fecha);
    this.regServ.checkRegister(this.values).subscribe(res =>{
      console.log("Ok", res)
      this.toast.success('Le hemos enviado un correo para confirmar su cuenta', 'Registro Exitoso!');
    this.router.navigate([''])
  }, error =>{
      console.log("Error", error.error);
      this.toast.error(error.error, 'Error');
      this.router.navigate([''])
  })
  }else{
    this.toast.error("Las contraseñas no son iguales", 'Error');
  }
  }

  radioSelection(event){
    this.sexo = event.detail.value;
    console.log(this.sexo);
  }

  comparePass(form){
    if(form.value.password != form.value.passwordVerif){
      this.samePass = false;
    }else{
      this.samePass = true;
    }
  }
}

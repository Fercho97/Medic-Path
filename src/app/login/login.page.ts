import { Component } from '@angular/core';
import {FormGroup} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { LoginService } from './login.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { CurrentUserService } from '../services/current-user.service';
@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  providers: [ApiService]
})
export class LoginPage {
  private values : HttpParams;
  constructor(private logServ : LoginService, private api: ApiService,private toast : ToastrService, 
              private router : Router, private storage : Storage, private session : CurrentUserService) {}

 ionViewWillEnter(){
  this.api.updateLocalDatabase();
 }

  login(form){
    console.log(form.value.email);
    this.values = new HttpParams()
    .set('nickOrEmail', form.value.email)
    .set('password', form.value.password)
    .set('mobile', "true");
    this.logServ.checkLogin(this.values).subscribe( (res : any) =>{
      
    if(res.body.message=="Verificacion"){
      this.toast.info('Su cuenta aun no se encuentra verificada, favor de verificarla mediante su correo.', 'Cuenta sin verificar');
    }else{
      console.log(res.body);
      window.localStorage.setItem('username',res.body.usuario.nickname);
      window.localStorage.setItem('id', res.body.usuario.id);
      window.localStorage.setItem('token', res.body.token);
      window.localStorage.setItem('hash', res.body.usuario.hash_id);
      window.localStorage.setItem('tipoUsuario', res.body.usuario.tipoUsuario);

      this.session.setCurrentUserSession(res);
    this.toast.success('Bienvenido al sistema Medic Path ' +  res.body.usuario.nickname, 'Éxito!');
    this.router.navigate(['/landing']);
    }
  }, error =>{
      console.log("Error", error.error.message);
      this.toast.error(error.error.message, 'Error');
  })
  }
}

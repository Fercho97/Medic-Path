import { Component } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Storage } from '@ionic/storage';
import { ApiService } from '../services/api.service';
import { CurrentUserService } from '../services/current-user.service';
import { LoadingService } from "../services/loading.service";
import { NetworkService, ConnectionStatus } from '../services/network.service';
@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  providers: [ApiService, LoadingService]
})
export class LoginPage {
  private values : HttpParams;
  constructor(private api: ApiService,private toast : ToastrService, private router : Router, 
              private storage : Storage, private session : CurrentUserService, private loadServ : LoadingService,
              private networkServ : NetworkService) {}

 ionViewWillEnter(){
  this.storage.get('newKey-currentUser').then(user =>{
    if(user!=undefined && user!=null){
      this.router.navigate(['/landing']);
    }
  })
 }

  login(form){
    this.loadServ.present();
    if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Online){
    this.values = new HttpParams()
    .set('nickOrEmail', form.value.email)
    .set('password', form.value.password)
    .set('mobile', "true");
    this.api.checkLogin(this.values).subscribe( (res : any) =>{
      
    if(res.body.message=="Verificacion"){
      this.toast.info('Su cuenta aun no se encuentra verificada, favor de verificarla mediante su correo.', 'Cuenta sin verificar');
      this.loadServ.dismiss();
    }else{
      this.loadServ.dismiss();
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
      //console.log("Error", error.error.message);
      this.toast.error(error.error.message, 'Error');
  })
  }else{
    this.loadServ.dismiss();
    this.toast.error('En necesario tener conexión a intenet para iniciar sesión','Error');
  }
  }
}

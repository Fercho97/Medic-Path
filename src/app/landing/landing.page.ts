import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../login/login.service';
import {Router} from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {
  username : string = "";
  isDoctor : boolean = false;

  constructor(private toast : ToastrService, private logServ : LoginService, private router : Router, private alertCtr : AlertController) { }
  ionViewWillEnter(){
    console.log(window.localStorage.getItem('username'));
    console.log(window.localStorage.getItem('token'));
    this.username=window.localStorage.getItem('username')
    
    if(window.localStorage.getItem('tipoUsuario')=="2"){
      this.isDoctor=true;
    }
  }

  underConstruction(){
    this.toast.warning('Vista y funcionalidad en construcción', 'En proceso');
  }

  logout(){

    this.logoutAlert();

    
  }

  async logoutAlert(){
    const alert = await this.alertCtr.create({
      header: 'Logout',
      message: '¿Desea salir de la aplicación?',
      buttons : [{
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () =>{

        }
      },{
        text: 'Si',
        handler: () =>{
          this.logServ.logout(window.localStorage.getItem('token')).subscribe( (res: any) =>{
            window.localStorage.clear();
            this.router.navigate([''])
          },
        error =>{
            console.log(error);
        })
        }
      }
    ]
    });

    await alert.present();
  }

}

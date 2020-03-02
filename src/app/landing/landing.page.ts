import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../login/login.service';
import {Router} from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UtilService } from '../utils/util.service';
import { Storage } from '@ionic/storage';
import {OfflineRequestsManager } from '../services/offline-manager.service'
import { ApiService } from '../services/api.service';
import { CurrentUserService } from '../services/current-user.service';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  providers: [UtilService]
})
export class LandingPage {
  username : string = "";
  isDoctor : boolean;
  symptomsNew : any;
  roosterNews: any;
  constructor(private logServ : LoginService, private router : Router, 
              private alertCtr : AlertController, private session : CurrentUserService,
              private utilServ : UtilService, private storage : Storage,
              private offline : OfflineRequestsManager, private api : ApiService) { }

  async ionViewWillEnter(){
    this.isDoctor = false;
    this.username= await this.session.obtainSessionUsername();
    console.log(this.username);
    this.api.updateLocalDatabase();
    let userType = await this.session.obtainSessionUserType();
    console.log(userType);
    if(userType=="2"){
      this.isDoctor=true;
      
      this.utilServ.getLastSymptoms().subscribe((res:any) =>{
        this.symptomsNew = res.body.resultado;
      });
    }else{
      this.utilServ.getRoosterUpdates().subscribe((res:any) =>{
        console.log(res.body.resultados);
        this.roosterNews = res.body.resultados;
      })
    }
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

import { Component} from '@angular/core';
import {Router} from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UtilService } from '../utils/util.service';
import { Storage } from '@ionic/storage';
import {OfflineRequestsManager } from '../services/offline-manager.service'
import { ApiService } from '../services/api.service';
import { CurrentUserService } from '../services/current-user.service';
import { NetworkService, ConnectionStatus } from '../services/network.service';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  providers: [UtilService]
})
export class LandingPage {
  username : string = "";
  isDoctor : boolean;
  symptomsNew : any = [];
  roosterNews: any = [];
  searching=false;
  constructor(private router : Router, private alertCtr : AlertController, 
              private session : CurrentUserService, private storage : Storage,
              private offline : OfflineRequestsManager, private api : ApiService,
              private networkServ : NetworkService) { }

  async ionViewWillEnter(){
    this.isDoctor = false;
    this.username= await this.session.obtainSessionNames();
    
    
    let userType = await this.session.obtainSessionUserType();
  
    if(userType=="2"){
      this.isDoctor=true;
      this.searching=true;
      this.api.getLastSymptoms().subscribe((res:any) =>{
        this.searching=false;
        this.symptomsNew = res;
      });
    }else{
      let id = await this.session.obtainSessionId();
      //console.log(id);
      this.searching=true;
      this.api.getNotifications(id).subscribe((res:any) =>{
        this.searching=false;
        this.roosterNews = res;
      })
    }

    if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Online){
      this.api.updateLocalDatabase(userType);
    }
  }

  logout(){

    this.logoutAlert();

    
  }

  async logoutAlert(){
    const alert = await this.alertCtr.create({
      header: 'Logout',
      message: '¿Desea salir de la aplicación?'+ 
               'Esto cerrara su sesión por completo',
      buttons : [{
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () =>{

        }
      },{
        text: 'Si',
        handler: () =>{
          this.api.logout(window.localStorage.getItem('token')).subscribe( (res: any) =>{
            window.localStorage.clear();
            this.storage.remove("newKey-currentUser");
            this.router.navigate([''])
          },
        error =>{
            //console.log(error);
        })
        }
      }
    ]
    });

    await alert.present();
  }

}

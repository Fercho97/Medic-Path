import { NetworkService, ConnectionStatus} from './services/network.service';
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OfflineRequestsManager } from './services/offline-manager.service';
import { ApiService } from './services/api.service';
import {Router} from '@angular/router';
import { CurrentUserService } from './services/current-user.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  isDoctor : boolean;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private networkService :NetworkService,
    private offlineManager :OfflineRequestsManager,
    private router : Router, 
    private alertCtr : AlertController, 
    private storage : Storage,
    private api : ApiService,
    private session : CurrentUserService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) =>{
        if(status == ConnectionStatus.Online){
          this.offlineManager.checkForEvents().subscribe();
        }else if(status == ConnectionStatus.Offline){
        }
      })
    });
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
            console.log(error);
        })
        }
      }
    ]
    });

    await alert.present();
  }

  getUserType(){
    this.isDoctor = false;
    
    
    let userType = localStorage.getItem('tipoUsuario');
  
    if(userType=="2"){
      this.isDoctor=true;
    }
  }
}

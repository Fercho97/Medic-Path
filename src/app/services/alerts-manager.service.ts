import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AlertsManagerService {

  constructor(private alertCtr : AlertController) { }

  async infoAlert(mensaje : any){
    const alert = await this.alertCtr.create({
      header: 'Info',
      message: mensaje,
      buttons : [{
        text: 'Okay',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () =>{

        }
      }
    ]
    });

    await alert.present();
  }
}

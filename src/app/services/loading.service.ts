import { Injectable } from '@angular/core';
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading = false;

  constructor(public loadingContr : LoadingController) { }

  async present(){
    this.loading = true;
    return await this.loadingContr.create({
      duration: 5000,
    }).then(load =>{
      load.present().then(() =>{
        if (!this.loading){
          load.dismiss().then(() => console.log());
        }
      })
    })
  }

  async dismiss(){
    this.loading = false;
    return await this.loadingContr.dismiss().then(() => console.log());
  }
}

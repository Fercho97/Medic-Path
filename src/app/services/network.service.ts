import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import {Platform, ToastController} from '@ionic/angular';

export enum ConnectionStatus{
    Online,
    Offline
}

@Injectable({
    providedIn: 'root'
})
export class NetworkService{
    isBrowser : boolean;
    private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

    constructor(private network: Network, private toastController: ToastController, private plt: Platform){
        this.plt.ready().then(() =>{
            //this.isBrowser = this.plt.is('mobileweb');
            //console.log(window.navigator.onLine);
            this.initializeNetworkEvents();
            let status = null;
           // if(this.isBrowser==false){
             status = this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
            //}else{
            // status = window.navigator.onLine === true ? ConnectionStatus.Online : ConnectionStatus.Offline;
           // }
            
            this.status.next(status);
            //console.log(this.status.getValue());
        });
    }

    public initializeNetworkEvents(){
      //  if(this.isBrowser=false){
        this.network.onDisconnect().subscribe(() =>{
            if (this.status.getValue() === ConnectionStatus.Online){
                //console.log("OFFLINE");
                this.updateNetworkStatus(ConnectionStatus.Offline);
            }
        });

        this.network.onConnect().subscribe(() =>{
            if(this.status.getValue() === ConnectionStatus.Offline){
                //console.log("Online");
                this.updateNetworkStatus(ConnectionStatus.Online);
            }
        });
    /**}else{
        window.addEventListener('online', () =>{
            if(this.status.getValue() === ConnectionStatus.Offline){
                this.updateNetworkStatus(ConnectionStatus.Online);
            }
        })

        window.addEventListener('offline', () =>{
            if (this.status.getValue() === ConnectionStatus.Online){
                this.updateNetworkStatus(ConnectionStatus.Offline);
            }
        })
    }**/
    }

    private async updateNetworkStatus(status : ConnectionStatus){
        this.status.next(status);
        let connection = status == ConnectionStatus.Offline ? 'sin conexión' : 'con conexión';
        let toast = this.toastController.create({
            message: 'Se encuentra ' + connection,
            duration: 3000,
            position: 'bottom'
        });
        toast.then(toast => toast.present());
    }

    public onNetworkChange(): Observable<ConnectionStatus>{
        return this.status.asObservable();
    }

    public getCurrentNetworkStatus(): ConnectionStatus {
        return this.status.getValue();
    }

}
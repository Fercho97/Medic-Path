import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, of , forkJoin } from 'rxjs';
import { switchMap, finalize} from  'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

const STORAGE_REQ_KEY = "request";

interface Requests {
    url: string,
    type: string,
    data: any,
    time: number,
    id: string
}

@Injectable({
    providedIn: 'root'
})
export class OfflineRequestsManager{
    
    constructor(private storage: Storage, private http: HttpClient, private toast : ToastController){ }

    checkForEvents(): Observable<any> {
        return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
            switchMap(storedOperations =>{
                let storeObj = JSON.parse(storedOperations);
                if(storeObj && storeObj.length>0){
                return this.sendRequest(storeObj).pipe(
                    finalize(() =>{
                        let toasty = this.toast.create({
                            message: 'Se ha sincronizado la información con el servidor con éxito',
                            duration: 4000,
                            position: 'bottom'
                        });
                        toasty.then(toast => toast.present());

                        this.storage.remove(STORAGE_REQ_KEY);
                    })
                );
            } else {
                //console.log('No hay datos locales que sincronizar');
                return of(false);
            }
            })
        )
    }

    storeRequest(url,type,data){
        let toasty = this.toast.create({
            message: 'La información ha sido almacenada de forma local, se sincronizara en cuanto exista conexión a internet',
            duration: 8000,
            position: 'bottom'
        });
        toasty.then(toast => toast.present());

        let action: Requests = {
            url: url,
            type: type,
            data: data,
            time: new Date().getTime(),
            id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0,5)
        };
        //console.log(action);
        //console.log(this.storage.get(STORAGE_REQ_KEY));
        return this.storage.get(STORAGE_REQ_KEY).then(storesOperations =>{
            let storeObj = JSON.parse(storesOperations);

            if(storeObj){
                storeObj.push(action);
            }else{
                storeObj = [action];
            }

            return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storeObj));
            
        });
        
    }

    sendRequest(operations: Requests[]){
        let obs = [];

        for(let op of operations){
            //console.log(op.data);
            let oneObs = this.http.request(op.type,op.url, {body:op.data,headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded')});
            //console.log(oneObs);
            obs.push(oneObs);

        }

        return forkJoin(obs);
    }
}
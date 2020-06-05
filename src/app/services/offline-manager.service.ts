import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, of , forkJoin, concat } from 'rxjs';
import { switchMap, finalize, delay, concatMap} from  'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { CurrentUserService } from './current-user.service'
const STORAGE_REQ_KEY = "request";

interface Requests {
    url: string,
    type: string,
    data: any,
    time: number,
    id: string,
    token: string
}

@Injectable({
    providedIn: 'root'
})
export class OfflineRequestsManager{
    
    constructor(private storage: Storage, private http: HttpClient, 
                private toast : ToastController, private userServ : CurrentUserService){ }

    checkForEvents(): Observable<any> {
        return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
            switchMap( async storedOperations =>{
                let storeObj = JSON.parse(storedOperations);
                if(storeObj && storeObj.length>0){
                await this.sendRequest(storeObj,0).then(res =>{
                        let toasty = this.toast.create({
                            message: 'Se ha sincronizado la información válida con el servidor',
                            duration: 4000,
                            position: 'bottom'
                        });
                        toasty.then(toast => toast.present());

                        this.storage.remove(STORAGE_REQ_KEY);
                }
                );
            } else {
                //console.log('No hay datos locales que sincronizar');
                return of(false);
            }
            })
        )
    }

    async storeRequest(url,type,data){
        let toasty = this.toast.create({
            message: 'La información ha sido almacenada de forma local, se sincronizara en cuanto exista conexión a internet',
            duration: 5000,
            position: 'bottom'
        });
        toasty.then(toast => toast.present());
        let token = await this.userServ.obtainSessionToken()
        let action: Requests = {
            url: url,
            type: type,
            data: data,
            time: new Date().getTime(),
            id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0,5),
            token: token
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

    async sendRequest(operations: Requests[],index){
        
        //console.log(operations.length);
        //console.log(index);
        for await (let op of operations){
            
            //console.log(op);
            const headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'authorization':op.token,'mobile': 'true'});
            await this.http.request(op.type,op.url, {body:op.data,headers: headers,observe: 'response'}).toPromise();
            
        }
            return of(true);
        
    }
}
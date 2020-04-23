import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
const STORAGE_REQ_KEY = "newKey-historiales";
const STORAGE_PAD_KEY = "newKey-padecimientos";
const STORAGE_NOTIF_KEY = "newKey-notifications";
import * as moment from 'moment-timezone';
moment.locale('es');

interface History {
  detalles: string,
  fecha_consulta: string,
  hashId: string,
  categoria: string,
  nombre_pad: string,
  descripcion: string,
  url_imagen_pad: string,
  nombre_esp: string,
  detalles_especificos: string,
  recomendaciones_especialista: string,
  especialista_seleccionado: string,
}

@Injectable({
  providedIn: 'root'
})
export class HistoryOfflineManagerService {

  constructor(private storage: Storage) { }

  addHistoryToLocal(fecha,descripcion,padecimiento,detalles,hash,recomendacion){
    let result;
    this.storage.get(STORAGE_PAD_KEY).then(padecimientos =>{
      //console.log(padecimientos);
      padecimientos.forEach(element => {
          if(padecimiento==element.idPad){
                let action: History = {
                  detalles: descripcion,
                  fecha_consulta: moment(fecha).tz('America/Mexico_City').format('LLL').toString(),
                  hashId: hash,
                  categoria: element.categoria,
                  nombre_pad: element.nombre_pad,
                  descripcion: element.descripcion,
                  url_imagen_pad: element.url_imagen_pad,
                  nombre_esp: element.nombre_esp,
                  detalles_especificos: detalles,
                  recomendaciones_especialista: recomendacion,
                  especialista_seleccionado: null
              };
            
              return this.storage.get(STORAGE_REQ_KEY).then(storesOperations =>{
                let storeObj = storesOperations;
            
                if(storeObj){
                    storeObj.push(action);
                }else{
                    storeObj = [action];
                }
            
                return this.storage.set(STORAGE_REQ_KEY,storeObj);
                
              });
          }
      });
    });
  }

  addFeedback(hash, feedback){
    
    this.storage.get(STORAGE_REQ_KEY).then(historiales =>{
      
      var foundIndex = historiales.findIndex(hist => hist.hashId == hash);

      historiales[foundIndex].especialista_seleccionado = feedback;

      this.storage.set(STORAGE_REQ_KEY, historiales);

    });
  }

  removeFromLocalNotifications(hash){

    this.storage.get(STORAGE_NOTIF_KEY).then(notificaciones =>{
      
      var foundIndex = notificaciones.findIndex(hist => hist.hashId == hash);

      if(foundIndex!=null || foundIndex!=undefined){
       notificaciones.splice(foundIndex,1);
      }
      this.storage.set(STORAGE_NOTIF_KEY, notificaciones);

    });
  }
}

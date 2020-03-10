import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
const STORAGE_REQ_KEY = "newKey-historiales";
const STORAGE_PAD_KEY = "newKey-padecimientos";
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
  detalles_especificos: string
}

@Injectable({
  providedIn: 'root'
})
export class HistoryOfflineManagerService {

  constructor(private storage: Storage) { }

  addHistoryToLocal(fecha,descripcion,padecimiento,detalles){
    let result;
    this.storage.get(STORAGE_PAD_KEY).then(padecimientos =>{
      console.log(padecimientos);
      padecimientos.forEach(element => {
          if(padecimiento==element.idPad){
                let action: History = {
                  detalles: descripcion,
                  fecha_consulta: moment(fecha).tz('America/Mexico_City').format('LLL').toString(),
                  hashId: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0,5),
                  categoria: element.categoria,
                  nombre_pad: element.nombre_pad,
                  descripcion: element.descripcion,
                  url_imagen_pad: element.url_imagen_pad,
                  nombre_esp: element.nombre_esp,
                  detalles_especificos: detalles
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
}

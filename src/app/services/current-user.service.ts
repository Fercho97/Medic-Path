import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
const STORAGE_USR_KEY = "newKey-currentUser";
import * as moment from 'moment-timezone';
moment.locale('es');
import { from } from 'rxjs';
interface User {
  nickname: string,
  nombres: string,
  apellidos: string,
  email: string,
  sessionToken: string,
  user_hash: string,
  id: number,
  genero: string,
  tipo: string,
}

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  constructor(private storage: Storage) { }

  setCurrentUserSession(res: any){
    let session: User = {
      nickname: res.body.usuario.nickname,
      nombres: res.body.usuario.nombres,
      apellidos: res.body.usuario.apellidos,
      email: res.body.usuario.email,
      sessionToken: res.body.token,
      user_hash: res.body.usuario.hash_id,
      id: res.body.usuario.id,
      genero: res.body.usuario.sexo,
      tipo: res.body.usuario.tipoUsuario
  };

  return this.storage.set(STORAGE_USR_KEY,session);

  }

  obtainSessionHash(){
    return this.storage.get(STORAGE_USR_KEY).then(session =>{
      return session.user_hash;
    })
  }

  obtainSessionId(){
    return this.storage.get(STORAGE_USR_KEY).then(session =>{
      return session.id;
    })
  }

  obtainSessionUsername(){
    return this.storage.get(STORAGE_USR_KEY).then(session =>{
      return session.nickname;
    })
  }

  obtainSessionUserType(){
    return this.storage.get(STORAGE_USR_KEY).then(session =>{
      return session.tipo;
    })
  }
}

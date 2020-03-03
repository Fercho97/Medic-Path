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
  sexo: string,
  tipo: string,
  fecha_nacimiento: string
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
      sexo: res.body.usuario.sexo,
      tipo: res.body.usuario.tipoUsuario,
      fecha_nacimiento: res.body.usuario.fecha_nacimiento
  };

  return this.storage.set(STORAGE_USR_KEY,session);

  }

  updateCurrentSessionInfo(res: any){
    this.storage.get(STORAGE_USR_KEY).then(usuario =>{
      let user = usuario;
      user.nickname = res.nickname;
      user.nombres = res.nombres;
      user.apellidos = res.apellidos;

      this.storage.set(STORAGE_USR_KEY,user);
    })
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

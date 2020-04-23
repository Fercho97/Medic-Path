import { Injectable } from '@angular/core';
import { OfflineRequestsManager } from './offline-manager.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { NetworkService, ConnectionStatus } from './network.service';
import { Storage} from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { tap, map, catchError} from 'rxjs/operators';
import { CurrentUserService } from './current-user.service'

const API_STORAGE_KEY = 'newKey';

const apiUrl = 'https://medicpath.herokuapp.com/';
               //'http://localhost:3000/'

const saveHistory = apiUrl + 'historial/create';

const _urlListado = apiUrl + 'historial/historialComplete/';

const _urlNotifications = apiUrl + 'historial/notification/withoutFeedback/';

const _url = apiUrl + 'consulta/getReglas';

const _allSymptoms = apiUrl + "sintomas/sintlist";

const _allAilments = apiUrl + "padecimientos/allPads";

const _urlIndividual = apiUrl+"historial/usuarioHist/"

const _urlAllDocs = apiUrl+ "usuarios/doctorlist/";

const _urlDoctor = apiUrl + "usuarios/doctor/";

const _registeredUsers = apiUrl + "usuarios/pacientslist";

const _urlPerfil = apiUrl + "usuarios/";

const _urlActSintomas = apiUrl + 'sintomas/news/lastCreations';

const urlLogin = apiUrl + 'usuarios/login';

const urlLogout = apiUrl + 'usuarios/logout';

const urlEspecialista = apiUrl + 'historial/selectedEspecializacion/';

const withFeedback = apiUrl + 'historial/withFeedBack/returnFeedback';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private networkServ : NetworkService, 
              private storage : Storage, private offlineManager : OfflineRequestsManager,
              private userServ : CurrentUserService) { }


  historyList(user : any){

    if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Offline){
      return from(this.getLocalData('historiales'));
    }else{
    const headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'X-Requested-With':'XMLHttpRequest'});
    //console.log(_urlListado);
    return this.http.get(_urlListado + encodeURIComponent(user),
        {
          headers: headers,
          observe : 'response'
        },
    ).pipe(map(res => res['body']['historiales']),
          tap(res =>{
            this.setLocalData('historiales', res);
          }))
    }
}

getHistory(id : any){
  if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Offline){
    return from(this.getLocalData('historiales').then(histo=>{
        return histo.find(hist => hist['hashId']==id);
    }));
  }else{
    const headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'X-Requested-With':'XMLHttpRequest'});
    
    return this.http.get(_urlIndividual + encodeURIComponent(id),
        {
            headers: headers,
            observe : 'response' 
        }
    ).pipe(map(res => res['body']['resultado']))
  }
}

guardarHistorial(valores : HttpParams){
  //console.log(valores.toString());
  if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Offline){

    return from(this.offlineManager.storeRequest(saveHistory, 'POST', valores.toString()));
  }else{
  return this.http.post(saveHistory,
      valores.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded'),
        observe : 'response'
      },
    )
    }
}

getNotifications(id: any){
  if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Offline){
    return from(this.getLocalData('notifications'));
  }else{
  const headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'X-Requested-With':'XMLHttpRequest'});
  
  return this.http.get(_urlNotifications + id,
      {
        headers: headers,
        observe : 'response'
      },
  ).pipe(map(res => res['body']['resultados']),
  tap(res =>{
    this.setLocalData('notifications', res);
  }))
}
}

getAllAilments(){
  if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Offline){
    return from(this.getLocalData('padecimientos'));
  }else{
    const headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'X-Requested-With':'XMLHttpRequest'});
  
  return this.http.get(_allAilments,
      {
        headers: headers,
        observe : 'response'
      },
  ).pipe(map(res => res['body']['padecimientos']),
  tap(res =>{
    this.setLocalData('padecimientos', res);
  }))
  }
}

consulta(mira : any){
  if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Offline){
    return from(this.getLocalData('rules'));
  }
  else{
  return this.http.get(_url,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded'),
        observe : 'response'
      },
    ).pipe(map(res => res['body']['reglas']),
    tap(res =>{
      this.setLocalData('rules', res);
    }))
  }
}

getAllSymptoms() {
  if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Offline){
    return from(this.getLocalData('sintomas'));
  }
  else{
  return this.http.get(_allSymptoms, {
    headers: new HttpHeaders().set(
      "Content-Type",
      "application/x-www-form-urlencoded"
    ),
    observe: "response"
  }).pipe(map(res => res['body']),
  tap(res =>{
    this.setLocalData('sintomas', res);
  }));
}
}

getDoctors(tipo : any){
  if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Offline){
    if(tipo=="all"){
      return from(this.getLocalData('medicos'));
    }else{
      return from(this.getLocalData('medicos').then(medicos =>{
         return medicos.filter(medico => medico['especializacions'].find(esp => esp["nombre_esp"]==tipo));
      }))
    }
  }else{
    return this.http.get(_urlAllDocs + tipo, {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    }).pipe(map(res => res['body']),
    tap(res =>{
      if(tipo=="all"){
        this.setLocalData('medicos', res);
      }
    }));
  }
}

getDoctorInfo(hash: any){

  if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Offline){
    return from(this.getLocalData('medicos').then(medicos=>{
      return medicos.find(med => med['hash_id']==hash);
  }));
  }else{
      return this.http.get(_urlDoctor + encodeURIComponent(hash), {
        headers: new HttpHeaders().set(
          "Content-Type",
          "application/x-www-form-urlencoded"
        ),
        observe: "response"
      }).pipe(map(res => res['body']['usuario']));
  }
}

obtenerUsuarios(){
  if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Offline){
    return from(this.getLocalData('patients'));
  }else{
        return this.http.get(_registeredUsers,
        {
              headers: new HttpHeaders()
              .set('Content-Type', 'application/x-www-form-urlencoded'),
            observe : 'response'
        },
      ).pipe(map(res => res['body']['usuarios']),
      tap(res =>{
        this.setLocalData('patients', res);
      }));
 }
}

getUser(hash : any){
  if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Offline){
    return from(this.getLocalData('currentUser'));
  }else{
    const headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'X-Requested-With':'XMLHttpRequest'});
    
    return this.http.get(_urlPerfil + encodeURIComponent(hash),
        {
          headers: headers,
          observe : 'response'
        },
    ).pipe(map(res => res['body']['resultado']),
    tap(res =>{
      this.userServ.updateCurrentSessionInfo(res);
    }));
 }
}

getLastSymptoms(){
  if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Offline){
    return from(this.getLocalData('updates'));
  }else{
  const headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'X-Requested-With':'XMLHttpRequest'});

  return this.http.get(_urlActSintomas,
      {
        headers: headers,
        observe : 'response'
      },
  ).pipe(map(res => res['body']['resultado']),
  tap(res =>{
    this.setLocalData('updates', res);
  }));
  }
}

actualizacionEspecialista(hash : any, value){
  if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Offline){

    return from(this.offlineManager.storeRequest(urlEspecialista + encodeURIComponent(hash), 'PUT', value.toString()));
  }else{
  return this.http.put(urlEspecialista + encodeURIComponent(hash), value.toString(),
  {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded'),
      observe : 'response' 
  });
}
}

checkLogin(valores : HttpParams){
  return this.http.post(urlLogin,
      valores.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded'),
        observe : 'response'
      },
    )
}

logout(token : any){
  const values = new HttpParams()
   .set('token', token)
   if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Offline){

    return from(this.offlineManager.storeRequest(urlLogout, 'POST', values.toString()));
  }else{
   return this.http.post(urlLogout,
       values.toString(),
       {
         headers: new HttpHeaders()
           .set('Content-Type', 'application/x-www-form-urlencoded'),
         observe : 'response'
       },
     )
  }
}

withFeedback(){
  return this.http.get(withFeedback,
    {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded'),
      observe : 'response'
    },
)
}

private setLocalData(key, data){
  this.storage.set(API_STORAGE_KEY+"-"+key,data);
}

private getLocalData(key){
  return this.storage.get(API_STORAGE_KEY+"-"+key);
}

updateLocalDatabase(){
  this.consulta('any').subscribe();
  this.getAllSymptoms().subscribe();
  this.getAllAilments().subscribe();
  this.getDoctors('all').subscribe();

  this.obtenerUsuarios().subscribe();
  //console.log('updated');
}
}

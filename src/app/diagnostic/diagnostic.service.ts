import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export class DiagnosticService{
    _url : string = '';
    _saveUrl : string = '';
    _registeredUsers : string = '';
    _allSymptoms : string = '';
    _urlCompList : string = '';

    constructor(private _http : HttpClient){
        this._url = "https://medicpath.herokuapp.com/consulta/getReglas"
       //"http://localhost:3000/consulta/getReglas";
        this._saveUrl = "https://medicpath.herokuapp.com/historial/create"
        //"http://localhost:3000/historial/create"
        this._allSymptoms = "https://medicpath.herokuapp.com/sintomas/sintlist";
        //'http://localhost:3000/sintomas/sintlist/'
        this._registeredUsers = "https://medicpath.herokuapp.com/usuarios/pacientslist"
        //"http://localhost:3000/usuarios/pacientslist";
        this._urlCompList = "https://medicpath.herokuapp.com/sintomas/comp/getComponents/";
        //'http://localhost:3000/sintomas/comp/getComponents/';
    }

    consulta(mira : any){
        return this._http.get(this._url,
            {
              headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded'),
              observe : 'response'
            },
          )
    }

    guardarHistorial(valores : HttpParams){
        return this._http.post(this._saveUrl,
            valores.toString(),
            {
              headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded'),
              observe : 'response'
            },
          )
    }

    obtenerUsuarios(){
      return this._http.get(this._registeredUsers,
      {
            headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded'),
          observe : 'response'
      },
    )
    }

    getAllSymptoms() {
      return this._http.get(this._allSymptoms, {
        headers: new HttpHeaders().set(
          "Content-Type",
          "application/x-www-form-urlencoded"
        ),
        observe: "response"
      });
    }

    getComponents() {
      return this._http.get(this._urlCompList, {
        headers: new HttpHeaders().set(
          "Content-Type",
          "application/x-www-form-urlencoded"
        ),
        observe: "response"
      });
    }
}
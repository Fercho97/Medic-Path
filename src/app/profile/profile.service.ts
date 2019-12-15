import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export class ProfileService{
    _urlIndividual : string = '';
    _urlEditar : string = '';
    constructor(private _http: HttpClient) {
        this._urlIndividual = "https://medicpath.herokuapp.com/usuarios/";
        //'http://localhost:3000/usuarios/'
        this._urlEditar = "https://medicpath.herokuapp.com/usuarios/update/";
        //'http://localhost:3000/usuarios/update/'
    }


    getUser(id : any){
        return this._http.get(this._urlIndividual + id,
            {
              headers: new HttpHeaders()
              .set('Content-Type', 'application/x-www-form-urlencoded'),
              observe : 'response'
            },
        )
    }

    updateUser(id : any,valores : HttpParams){
        return this._http.put(this._urlEditar + id,
            valores.toString(),
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded'),
                observe : 'response' 
            }
        )
    }
}
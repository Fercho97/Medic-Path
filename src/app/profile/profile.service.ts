import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export class ProfileService{
    _urlIndividual : string = '';
    constructor(private _http: HttpClient) {
        this._urlIndividual = 'http://localhost:3000/usuarios/'
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
}
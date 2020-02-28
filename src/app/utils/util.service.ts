import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export class UtilService{
    _urlActSintomas : string = '';
    _urlActDoctors : string = '';
    constructor(private _http: HttpClient) {
        this._urlActSintomas = "https://medicpath.herokuapp.com/sintomas/news/lastCreations";
        //'http://localhost:3000/sintomas/news/lastCreations';

        this._urlActDoctors = "https://medicpath.herokuapp.com/usuarios/news/latestDoctors"
        //'http://localhost:3000/usuarios/news/latestDoctors';
    }


    getLastSymptoms(){
        const headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'X-Requested-With':'XMLHttpRequest'});
    
        return this._http.get(this._urlActSintomas,
            {
              headers: headers,
              observe : 'response'
            },
        )
    }

    getRoosterUpdates(){
        const headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'X-Requested-With':'XMLHttpRequest'});
        
        return this._http.get(this._urlActDoctors,
            {
              headers: headers,
              observe : 'response'
            },
        )
    }
}
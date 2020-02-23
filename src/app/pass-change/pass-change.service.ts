import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class PassChangeService{
    _urlChange : string = '';
    private router: Router;
    constructor(private _http: HttpClient) {

        this._urlChange = 'https://medicpath.herokuapp.com/usuarios/cambiarPassword/';
        //'http://localhost:3000/usuarios/cambiarPassword/';
    }

    changePassword(userHash : any, pass : any){
        return this._http.put(this._urlChange + encodeURIComponent(userHash),
                pass.toString(),
            {
              headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded'),
              observe : 'response'
            },
          )
    }
}
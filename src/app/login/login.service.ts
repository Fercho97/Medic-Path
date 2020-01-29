import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class LoginService{
    _url : string = '';
    _logoutUrl: string = '';
    private router: Router;
    constructor(private _http: HttpClient) {
        this._url = "https://medicpath.herokuapp.com/usuarios/login"
        //'http://localhost:3000/usuarios/login';
        this._logoutUrl = "https://medicpath.herokuapp.com/usuarios/logout"
        //'http://localhost:3000/usuarios/logout';
    }

    checkLogin(valores : HttpParams){
        return this._http.post(this._url,
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
        return this._http.post(this._logoutUrl,
            values.toString(),
            {
              headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded'),
              observe : 'response'
            },
          )
    }
}
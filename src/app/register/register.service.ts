import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class RegisterService{
    _url : string = '';
    private router: Router;
    constructor(private _http: HttpClient) {
        this._url = "https://medicpath.herokuapp.com/usuarios/create";
        //'http://localhost:3000/usuarios/create';
    }

    checkRegister(valores : HttpParams){
        console.log(this._url);
        console.log(valores.toString());
        return this._http.post(this._url,
            valores.toString(),
            {
              headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded'),
              observe : 'response'
            },
          )
    }
}
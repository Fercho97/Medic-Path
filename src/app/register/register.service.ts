import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class RegisterService{
    _url : string = '';
    _checkEmail : string = '';
    _checkUserName : string = '';
    private router: Router;
    constructor(private _http: HttpClient) {
        this._url = "https://medicpath.herokuapp.com/usuarios/create";
        //'http://localhost:3000/usuarios/create';
        this._checkUserName = 'https://medicpath.herokuapp.com/usuarios/checkUsername/';
        //'http://localhost:3000/usuarios/checkUsername/'
        this._checkEmail = 'https://medicpath.herokuapp.com/usuarios/checkEmail/';
        //'http://localhost:3000/usuarios/checkEmail/'
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

    checkNickname(nickname : any){
        return this._http.get(this._checkUserName + nickname,
        {
            headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded'),
          observe : 'response'
        })
    }

    checkEmail(email : any){
        return this._http.get(this._checkEmail + email,
        {
            headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded'),
          observe : 'response'
        })
    }
}
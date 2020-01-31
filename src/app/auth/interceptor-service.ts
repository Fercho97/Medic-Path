import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private router:Router){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        const token : string = localStorage.getItem('token');

        let request = req;

        if(token){
            request = req.clone({
                setHeaders:{
                    authorization: token
                }
            });
        }

        return next.handle(request);
    }
}
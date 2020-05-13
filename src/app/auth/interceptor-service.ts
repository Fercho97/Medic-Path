import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { ToastrService } from 'ngx-toastr';
@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private router:Router, private storage : Storage, private toast : ToastrService){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        const token : string = localStorage.getItem('token');

        let request = req;

        if(token){
            request = req.clone({
                setHeaders:{
                    authorization: token,
                    mobile : 'true'
                }
            });
        }

        return <any>next.handle(request).pipe(
            catchError((err: HttpErrorResponse) =>{

                if(err.status === 401){
                    localStorage.clear();
                    this.storage.remove("newKey-currentUser");
                    this.storage.remove("newKey-patients");
                    this.storage.remove("newKey-updates");
                    this.storage.remove("newKey-historiales");
                    this.storage.remove("newKey-notifications");
                    this.router.navigate(['']);
                    this.toast.warning('Sesión terminada');
                }

                return throwError( err );
            })
        );
    }
}
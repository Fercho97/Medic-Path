import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { ToastrService } from 'ngx-toastr';
import { CurrentUserService } from '../services/current-user.service';
@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private router:Router, private storage : Storage,
                private toast : ToastrService, private session : CurrentUserService){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return from(this.session.obtainSessionToken())
            .pipe(
                switchMap(token => {
                    let request = req;
                    //console.log(token)
                    if (token) {
                        request = request.clone({
                            setHeaders:{
                                authorization: token,
                                mobile : 'true'
                            }
                        });
                    }


                    return next.handle(request).pipe(
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
                })
            );
    }
}
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import{ Observable, of } from "rxjs";
import { map, debounceTime, take, switchMap} from "rxjs/operators";

import { RegisterService } from '../register/register.service';

function isEmptyInputValue(value: any): boolean {
    return value === null || value.length === 0;
}

@Injectable({
    providedIn: "root"
})
export class EmailValidator {
    constructor(private regisServ: RegisterService){}

    existingEmail(initialValue: string = "") : AsyncValidatorFn{
        return (control: AbstractControl): | Promise<{ [key: string]: any} | null>
                                           | Observable<{[key: string]: any} | null> =>{
                                               if(isEmptyInputValue(control.value)){
                                                   return of(null);
                                               }else if (control.value === initialValue){
                                                   return of(null);
                                               }else{
                                                   return control.valueChanges.pipe(
                                                       debounceTime(500),
                                                       take(1),
                                                       switchMap(_ => this.regisServ
                                                        .checkEmail(control.value)
                                                        .pipe(map((json:any) =>  json.body.message=="Libre" ? null : {emailTaken: true}))
                                                    )
                                                   )
                                               }
                                           }
    }
}
import { Component} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpParams, HttpClient} from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { PassChangeService } from './pass-change.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorMsg } from '../utils/error_msg.const';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-pass-change',
  templateUrl: './pass-change.page.html',
  styleUrls: ['./pass-change.page.scss'],
})
export class PassChangePage {
  reset: FormGroup;
  private values : HttpParams;
  private hash : string = '';
  isValid : boolean = false;
  fromProfile: boolean = false;
  mensajes_error = ErrorMsg.ERROR_MSG_REGISTER;
  
  constructor(private passServ : PassChangeService, private logServ : LoginService, 
              private http : HttpClient, private router : Router, private toast : ToastrService,
              private storage : Storage) {
    this.reset = new FormGroup({
      
              password_validations : new FormGroup({
                newPass : new FormControl('', [Validators.required, Validators.minLength(5)]),
                verifiedPassword : new FormControl('', Validators.required),
                }, (formGroup : FormGroup) => {
                    return this.equalPasswords(formGroup);
                })
          });
   }

   ionViewWillEnter() {

   }

  changePassword(){
      this.hash = localStorage.getItem('hash');
      
        this.values = new HttpParams()
        .set('newPassword', this.reset.value.password_validations.newPass);

        this.passServ.changePassword(this.hash,this.values).subscribe( (res : any) =>{
        this.toast.success('Se ha modificado su contraseña con éxito es necesario que vuelva a iniciar sesión ', 'Éxito!');
        this.reset.reset();
        this.logout();
      }, error =>{
          console.log("Error", error.error.message);
          this.toast.error(error.error.message, 'Error');
      })
    
  }

  equalPasswords(formGroup : FormGroup){
    let val;
    let valid = true;

    for(let key in formGroup.controls){
      if(formGroup.controls.hasOwnProperty(key)){
        let control : FormControl = <FormControl>formGroup.controls[key];
        if(val === undefined){
           val = control.value
        }else{
          if(val !== control.value){
             valid = false;
             break;
          }
        }
      }
    }
    if(valid){
      return null;
    }
    return{
      equalPasswords : true
    }
  }

  logout(){
    this.logServ.logout(window.localStorage.getItem('token')).subscribe( (res: any) =>{
      window.localStorage.clear();
      this.storage.remove("newKey-currentUser");
      this.router.navigate([''])
    }, error =>{
      console.log("Error", error.error.message);
      this.toast.error(error.error.message, 'Error');
  })
  }
}

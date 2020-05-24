import { Component, OnInit } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ResetService } from './pass-reset.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ErrorMsg } from '../utils/error_msg.const';
@Component({
  selector: 'app-pass-reset',
  templateUrl: './pass-reset.page.html',
  styleUrls: ['./pass-reset.page.scss'],
})
export class PassResetPage implements OnInit {
  values : HttpParams;
  reset : FormGroup;
  mensajes_error = ErrorMsg.ERROR_MSG_REGISTER;
  
  constructor(private recServ : ResetService, private toastr : ToastrService, private router : Router) {

    this.reset = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]),
    })
   }

  ngOnInit() {
  }

  sendReset(){
    this.values = new HttpParams()
    .set('email', this.reset.value.email);

    this.recServ.resetRequest(this.values).subscribe((res :any) =>{
      this.toastr.info("Si la dirección que indico se encuentra registrada en el sistema se le enviará un correo", "Enviado");
      this.router.navigate(['']);
    }, error =>{
      //console.log(error);
      this.router.navigate(['']);
    })
    
  }

  ionViewWillLeave(){
    this.reset.reset();
  }
}

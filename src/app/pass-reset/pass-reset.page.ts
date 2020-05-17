import { Component, OnInit } from '@angular/core';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ResetService } from './pass-reset.service';
import {Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pass-reset',
  templateUrl: './pass-reset.page.html',
  styleUrls: ['./pass-reset.page.scss'],
})
export class PassResetPage implements OnInit {
  values : HttpParams;
  constructor(private recServ : ResetService, private toastr : ToastrService, private router : Router) { }

  ngOnInit() {
  }

  sendReset(form){
    this.values = new HttpParams()
    .set('email', form.value.email);

    this.recServ.resetRequest(this.values).subscribe((res :any) =>{
      this.toastr.info("Si la dirección que indico se encuentra registrada en el sistema se le enviará un correo", "Enviado");
      this.router.navigate(['']);
    }, error =>{
      //console.log(error);
      this.router.navigate(['']);
    })
    
  }
}

import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ErrorMsg } from '../utils/error_msg.const';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [ProfileService]
})
export class ProfilePage{

  datos_perfil : FormGroup;

  mensajes_error = ErrorMsg.ERROR_MSG_REGISTER;
  id = window.localStorage.getItem('id');
  private values : HttpParams;
  usuario = {} as any;
  soloVista : boolean = true;
  constructor(private profileServ : ProfileService, private toast : ToastrService) {

    this.datos_perfil = new FormGroup({
      nombres : new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      apellidos : new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      nickname : new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ])
    })
   }

  ionViewWillEnter() {
    this.profileServ.getUser(this.id).subscribe( (res: any) =>{
      this.usuario = res.body;
      console.log(this.usuario);
    },
  error =>{
      console.log(error);
  })
  }

  underConstruction(){
    this.toast.warning('Vista y funcionalidad en construcción', 'En proceso');
  }

  comenzarEdicion(){
    this.soloVista=false;
  }

  cancelar(){
    this.soloVista=true;
  }

  actualizarDatos(){
        this.values = new HttpParams()
        .set('nickname', this.datos_perfil.value.nickname)
        .set('nombres', this.datos_perfil.value.nombres)
        .set('apellidos', this.datos_perfil.value.apellidos)
        this.profileServ.updateUser(this.id, this.values).subscribe( (res: any) =>{
          this.soloVista=true;
          window.localStorage.setItem('username',this.datos_perfil.value.nickname);
          this.toast.success('Datos Modificados con éxito', 'Modificación Exitosa!');
        },
      error =>{
        console.log(error.message);
          this.toast.error(error.error.message,'Error');
      })
    
  }
}

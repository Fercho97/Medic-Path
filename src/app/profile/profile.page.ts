import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ErrorMsg } from '../utils/error_msg.const';
import {Router} from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [ProfileService]
})
export class ProfilePage{

  datos_perfil : FormGroup;

  mensajes_error = ErrorMsg.ERROR_MSG_REGISTER;
  hash = window.localStorage.getItem('hash');
  private values : HttpParams;
  formData: any = new FormData();
  selectedFile : File = null;
  usuario = {} as any;
  soloVista : boolean = true;
  public url : string = "";
  constructor(private profileServ : ProfileService, private toast : ToastrService, private router : Router) {

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
      ]),
      picture : new FormControl('')
    })
   }

  ionViewWillEnter() {
    this.profileServ.getUser(this.hash).subscribe( (res: any) =>{
      this.usuario = res.body.resultado;
      console.log(this.usuario);

      if(this.usuario.imagen_perfil!=null){
        this.url = 'data:image/jpg;base64,' + this.usuario.imagen_perfil.toString();
      }
    },
  error =>{
      console.log(error);
  })
  }

  createFormData(event){
    this.selectedFile = <File>event.target.files[0];
    this.formData.append('image', this.selectedFile, this.selectedFile.name);
    console.log(this.formData.get('image'));
  }

  comenzarEdicion(){
    this.soloVista=false;
  }

  cancelar(){
    this.soloVista=true;
  }

  actualizarDatos(){
    this.formData.append('nickname', this.datos_perfil.value.nickname);
    this.formData.append('nombres', this.datos_perfil.value.nombres);
    this.formData.append('apellidos', this.datos_perfil.value.apellidos);
        this.profileServ.updateUser(this.hash, this.formData).subscribe( (res: any) =>{
          this.soloVista=true;
          window.localStorage.setItem('username',this.datos_perfil.value.nickname);
          this.toast.success('Datos Modificados con éxito', 'Modificación Exitosa!');
          this.formData = new FormData();
        },
      error =>{
        console.log(error.message);
          this.toast.error(error.error.message,'Error');
      })
    
  }
}

import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [ProfileService]
})
export class ProfilePage{

  id = window.localStorage.getItem('id');
  private values : HttpParams;
  usuario = {} as any;
  soloVista : boolean = true;
  constructor(private profileServ : ProfileService, private toast : ToastrService) { }

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

  actualizarDatos(form){
    if(form.value.nickname=="" || form.value.nombres=="" || form.value.apellidos==""){
      this.toast.error("No debe dejar ningun campo vacio",'Campo vacio');
    }
    else{
        this.values = new HttpParams()
        .set('nickname', form.value.nickname)
        .set('nombres', form.value.nombres)
        .set('apellidos', form.value.apellidos)
        this.profileServ.updateUser(this.id, this.values).subscribe( (res: any) =>{
          this.soloVista=true;
          this.toast.success('Datos Modificados con éxito', 'Modificación Exitosa!');
        },
      error =>{
        console.log(error.message);
          this.toast.error(error.error.message,'Error inesperado');
      })
    }
  }
}

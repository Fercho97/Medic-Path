import { Component} from '@angular/core';
import { ProfileService } from './profile.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams} from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ErrorMsg } from '../utils/error_msg.const';
import { NicknameValidator } from "../validators/NicknameValidator";
import { CurrentUserService } from "../services/current-user.service";
import { ApiService } from "../services/api.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [ProfileService]
})
export class ProfilePage{

  datos_perfil : FormGroup;

  mensajes_error = ErrorMsg.ERROR_MSG_REGISTER;
  hash = "";
  private values : HttpParams;
  formData: any = new FormData();
  formDataImg: any = new FormData()
  selectedFile : File = null;
  usuario = {} as any;
  soloVista : boolean = true;
  hasImage : boolean = false;
  public url : string = "";
  public originalValue : string = "";
  constructor(private profileServ : ProfileService, private toast : ToastrService, 
              private nickVal : NicknameValidator, private sessionServ : CurrentUserService,
              private api : ApiService) {

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

  async ionViewWillEnter() {
    this.hash = await this.sessionServ.obtainSessionHash();
    this.api.getUser(this.hash).subscribe( (res: any) =>{
      this.usuario = res;
      this.originalValue = res.nickname;

      if(this.usuario.imagen_perfil!=null && this.usuario.imagen_perfil!=""){
        this.url = this.usuario.imagen_perfil.toString();
      }
      this.datos_perfil.controls['nickname'].setValue(this.usuario.nickname, {onlySelf : true});
      this.datos_perfil.controls['nombres'].setValue(this.usuario.nombres, {onlySelf : true});
      this.datos_perfil.controls['apellidos'].setValue(this.usuario.apellidos, {onlySelf : true});
    },
  error =>{
      console.log(error);
  })
  }

  createFormData(event){
    this.selectedFile = <File>event.target.files[0];
    this.formDataImg.append('image', this.selectedFile, this.selectedFile.name);
    console.log(this.formDataImg.get('image'));
    this.hasImage=true;
  }

  comenzarEdicion(){
    this.soloVista=false;
  }

  cancelar(){
    this.soloVista=true;
  }

  actualizarDatos(){
    console.log(this.datos_perfil.value);
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

  guardarImg(){
    this.profileServ.updateProfilePic(this.hash, this.formDataImg).subscribe( (res: any) =>{
      this.formDataImg = new FormData();
      window.location.reload();
      this.toast.success('Imagen cambiada con éxito!', 'Modificación Exitosa!');
    },
  error =>{
    console.log(error.message);
      this.toast.error(error.error.message,'Error');
  })

}

  check(){
    console.log("check")
    if(this.originalValue.toLowerCase()!=this.datos_perfil.get('nickname').value.toString().toLowerCase()){
      console.log("lol")
      this.datos_perfil.get('nickname').updateValueAndValidity();
      this.datos_perfil.get('nickname').setAsyncValidators(this.nickVal.existingNickname());
      
    }else{
      this.datos_perfil.get('nickname').clearAsyncValidators();
      this.datos_perfil.get('nickname').updateValueAndValidity();
    }
  }
}

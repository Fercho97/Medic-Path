import { Component, OnInit} from '@angular/core';
import { ProfileService } from './profile.service';
import { ToastrService } from 'ngx-toastr';
import { HttpParams} from '@angular/common/http';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ErrorMsg } from '../utils/error_msg.const';
import { NicknameValidator } from "../validators/NicknameValidator";
import { CurrentUserService } from "../services/current-user.service";
import { ApiService } from "../services/api.service";
import { LoadingService } from "../services/loading.service";
import { NetworkService, ConnectionStatus } from '../services/network.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [ProfileService]
})
export class ProfilePage implements OnInit{

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
  public url : string = "/assets/default-image.jpg";
  public originalValue : string = "";
  constructor(private profileServ : ProfileService, private toast : ToastrService, 
              private nickVal : NicknameValidator, private sessionServ : CurrentUserService,
              private api : ApiService, private loadServ : LoadingService,
              private networkServ : NetworkService) {

    this.datos_perfil = new FormGroup({
      nickname : new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern('^([a-zA-Z0-9 ]+ )*[a-zA-Z0-9]+$')
      ]),
      picture : new FormControl('')
    })
   }

  async ngOnInit() {
    this.hash = await this.sessionServ.obtainSessionHash();
    this.api.getUser(this.hash).subscribe( (res: any) =>{
      this.usuario = res;
      this.originalValue = res.nickname;
      if(this.usuario.imagen_perfil!=null && this.usuario.imagen_perfil!=""){
        this.url = this.usuario.imagen_perfil;
      }
      this.datos_perfil.controls['nickname'].setValue(this.usuario.nickname, {onlySelf : true});
    },
  error =>{
    this.toast.error('Hubo un error al conseguir la información de su perfil, favor de intentarlo de nuevo', 'Error')
      //console.log(error);
  })
  }

  createFormData(event){
    this.selectedFile = <File>event.target.files[0];
    this.formDataImg.append('image', this.selectedFile, this.selectedFile.name);
    //console.log(this.formDataImg.get('image'));
    this.hasImage=true;
  }

  comenzarEdicion(){
    this.soloVista=false;
  }

  cancelar(){
    this.soloVista=true;
  }

  actualizarDatos(){
    //console.log(this.datos_perfil.value);
    this.loadServ.present();
    this.formData.append('nickname', this.datos_perfil.value.nickname);
        this.api.updateUser(this.hash, this.formData).subscribe( (res: any) =>{
          this.soloVista=true;
          window.localStorage.setItem('username',this.datos_perfil.value.nickname);
          if(res.body.message=="No hubo cambios"){
            this.toast.info('No se hicieron cambios');
          }else{
            this.toast.success('Datos Modificados con éxito', 'Modificación Exitosa!');
          }
          this.formData = new FormData();
          this.loadServ.dismiss();
        },
      error =>{
        //console.log(error.message);
        this.soloVista=true;
        if(this.networkServ.getCurrentNetworkStatus() == ConnectionStatus.Online){
          this.toast.error(error.error.message,'Error');
        }else{
          this.toast.error('Hubo un error al actualizar su información','Error');
        }
          this.formData = new FormData();
          this.loadServ.dismiss();
      })
    
  }

  guardarImg(){
        this.loadServ.present();
        this.api.updateProfilePic(this.hash, this.formDataImg).subscribe( (res: any) =>{
          this.formDataImg = new FormData();
          this.loadServ.dismiss();
          window.location.reload();
          this.toast.success('Imagen cambiada con éxito!', 'Modificación Exitosa!');
        },
      error =>{
        //console.log(error.message);
        this.loadServ.dismiss();
          this.toast.error('Hubo un error al cambiar su imagen, favor de reintentarlo','Error');
          this.formData = new FormData();
      })
}

  check(){
    //console.log("check")
    if(this.originalValue.toLowerCase()!=this.datos_perfil.get('nickname').value.toString().toLowerCase()){
      //console.log("lol")
      this.datos_perfil.get('nickname').updateValueAndValidity();
      this.datos_perfil.get('nickname').setAsyncValidators(this.nickVal.existingNickname());
      
    }else{
      this.datos_perfil.get('nickname').clearAsyncValidators();
      this.datos_perfil.get('nickname').updateValueAndValidity();
    }
  }
}

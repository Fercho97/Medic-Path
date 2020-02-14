import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../login/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {
  username : string = "";
  isDoctor : boolean = false;

  constructor(private toast : ToastrService, private logServ : LoginService, private router : Router) { }
  ionViewWillEnter(){
    console.log(window.localStorage.getItem('username'));
    console.log(window.localStorage.getItem('token'));
    this.username=window.localStorage.getItem('username')
    
    if(window.localStorage.getItem('tipoUsuario')=="2"){
      this.isDoctor=true;
    }
  }

  underConstruction(){
    this.toast.warning('Vista y funcionalidad en construcción', 'En proceso');
  }

  logout(){

    this.logServ.logout(window.localStorage.getItem('token')).subscribe( (res: any) =>{
      window.localStorage.clear();
      this.router.navigate([''])
    },
  error =>{
      console.log(error);
  })
  }

}

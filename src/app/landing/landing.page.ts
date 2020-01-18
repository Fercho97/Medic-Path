import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {
  username : string = "";

  pages = [
    {
      title: "Mi Historial",
      url: "/history-list"
    },
    {
      title: "Consulta",
      url: "/diagnostic"
    },
    {
      title: "Perfil",
      url: "/profile"
    },
    {
      title: "Logout",
      url: ""
    }
]
  constructor(private toast : ToastrService) { }
  ionViewWillEnter(){
    console.log(window.localStorage.getItem('username'));
    console.log(window.localStorage.getItem('token'));
    this.username=window.localStorage.getItem('username')
  }

  underConstruction(){
    this.toast.warning('Vista y funcionalidad en construcción', 'En proceso');
  }

}

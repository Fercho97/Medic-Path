import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [ProfileService]
})
export class ProfilePage implements OnInit {

  id = window.localStorage.getItem('id');
  usuario = {} as any;
  constructor(private profileServ : ProfileService, private toast : ToastrService) { }

  ngOnInit() {
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
}

import { Component, OnInit } from '@angular/core';
import { DirectoryService } from '../directory.service';
import {Router, ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-directory-detail',
  templateUrl: './directory-detail.page.html',
  styleUrls: ['./directory-detail.page.scss'],
  providers: [DirectoryService]
})
export class DirectoryDetailPage implements OnInit {

  public infoDoc : any[] = [];
  public especializaciones : any[] = [];
  public url : string = "";
  public  hasInfo : boolean = false;
  constructor(private direcServ: DirectoryService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.direcServ.getDoctorInfo(this.route.snapshot.params.hash).subscribe( (res : any) =>{
      console.log(res.body);

      this.infoDoc = res.body.usuario;
      this.especializaciones = res.body.especializaciones;

      if(res.body.usuario.imagen_perfil==null){
        this.url = "../../../../assets/default-image.jpg"
      }else{
        this.hasInfo = true;
        this.url = res.body.usuario.imagen_perfil.toString();
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { DirectoryService } from '../directory.service';
import { ActivatedRoute} from '@angular/router';
import { ApiService } from "../../services/api.service";
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
  constructor(private direcServ: DirectoryService, private api: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.api.getDoctorInfo(this.route.snapshot.params.hash).subscribe( (res : any) =>{
      console.log(res);

      this.infoDoc = res;
      this.especializaciones = res.especializacions;

      if(res.imagen_perfil==null || res.imagen_perfil==""){
        this.hasInfo = true;
        this.url = "/assets/default-image.jpg";
      }else{
        this.hasInfo = true;
        this.url = res.imagen_perfil.replace('http','https');
      }
    });
  }

}

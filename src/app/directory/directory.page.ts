import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { DirectoryService } from './directory.service';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.page.html',
  styleUrls: ['./directory.page.scss'],
  providers: [DirectoryService]
})
export class DirectoryPage implements OnInit {
  medicos : any[] = [];
  tipo = "all";
  hasEspe = false;
  constructor(private route : ActivatedRoute, private direcServ : DirectoryService) { }

  ngOnInit() {
    if(this.route.snapshot.params.type){
      this.tipo = this.route.snapshot.params.type
      this.hasEspe = true;
    }
    console.log(this.tipo);
    this.direcServ.getDoctors(this.tipo).subscribe((res: any) =>{
      console.log(res.body);
      this.medicos = res.body;

    });
  }

}

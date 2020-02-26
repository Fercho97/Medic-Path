import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { DirectoryService } from './directory.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from "rxjs/operators";
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
  public searchControl : FormControl;
  medicosFilter: any;
  searching=false;
  constructor(private route : ActivatedRoute, private direcServ : DirectoryService) {
    this.searchControl = new FormControl();
   }

  ngOnInit() {
    if(this.route.snapshot.params.type){
      this.tipo = this.route.snapshot.params.type
      this.hasEspe = true;
    }
    console.log(this.tipo);
    this.direcServ.getDoctors(this.tipo).subscribe((res: any) =>{
      console.log(res.body);
      this.medicos = res.body;
      this.medicosFilter = this.medicos;
    });

    this.searchControl.valueChanges.pipe(debounceTime(800))
    .subscribe(search => {
      this.searching=false;
      this.filter(search);
    });
  }

  filter(search : any){
    this.medicosFilter = this.medicos.filter(hist =>{
        return hist.fullname.toLowerCase().indexOf(search.toLowerCase()) > -1;
    });
  }

  searchInput(){
    this.searching=true;
  }
}

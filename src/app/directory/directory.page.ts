import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { DirectoryService } from './directory.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from "rxjs/operators";
import { LoadingService } from "../services/loading.service";
import { ApiService } from "../services/api.service";
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
  public waiting : any = false;
  medicosFilter: any;
  searching=false;
  constructor(private route : ActivatedRoute, private direcServ : DirectoryService, 
              private loadServ : LoadingService, private api : ApiService) {
    this.searchControl = new FormControl();
   }

  ngOnInit() {
    this.loadServ.present();
    if(this.route.snapshot.params.type){
      this.tipo = this.route.snapshot.params.type
      this.hasEspe = true;
    }
    //console.log(this.tipo);
    this.waiting=true;
    this.api.getDoctors(this.tipo).subscribe((res: any) =>{
      //console.log(res);
      this.medicos = res;
      //console.log(this.medicos);
      this.waiting=false;
      this.medicosFilter = this.medicos;
      this.loadServ.dismiss();
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

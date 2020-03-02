import { Component, OnInit } from '@angular/core';
import { ConsultService } from './history-list.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { debounceTime } from "rxjs/operators";
import { ApiService } from '../services/api.service';
import { LoadingService } from "../services/loading.service";

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.page.html',
  styleUrls: ['./history-list.page.scss'],
  providers: [ConsultService,ApiService,LoadingService]
})
export class HistoryListPage{
  hash = window.localStorage.getItem('hash');
  public searchControl : FormControl;
  historialesFromDb =[] as any;
  historiales: any;
  searching=false;
  public loading;
  public loaded = false;
  constructor(private loadServ : LoadingService, private api : ApiService ) {
    this.searchControl = new FormControl();
   }

  ionViewWillEnter(){
    this.loadServ.present();
    //console.log(this.id);
    this.api.historyList(this.hash).subscribe( (res: any) =>{
      console.log(res);
      this.historialesFromDb = res;
      this.historiales = this.historialesFromDb;
      this.loadServ.dismiss();
    },
  error =>{
      console.log(error);
  })

  this.searchControl.valueChanges.pipe(debounceTime(800))
  .subscribe(search => {
    this.searching=false;
    this.filter(search);
  });
  }

  filter(search : any){
    console.log(this.historialesFromDb);
    this.historiales = this.historialesFromDb.filter(hist =>{
        return hist.fecha_consulta.toLowerCase().indexOf(search.toLowerCase()) > -1;
    });
  }

  searchInput(){
    this.searching=true;
  }
}

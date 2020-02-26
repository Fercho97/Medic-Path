import { Component, OnInit } from '@angular/core';
import { ConsultService } from './history-list.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { debounceTime } from "rxjs/operators";
@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.page.html',
  styleUrls: ['./history-list.page.scss'],
  providers: [ConsultService]
})
export class HistoryListPage{
  id = window.localStorage.getItem('id');
  public searchControl : FormControl;
  historialesFromDb =[] as any;
  historiales: any;
  searching=false;
  constructor(private consultServ : ConsultService, private toast : ToastrService ) {
    this.searchControl = new FormControl();
   }

  ionViewWillEnter(){
    //console.log(this.id);
    this.consultServ.historyList(this.id).subscribe( (res: any) =>{
      this.historialesFromDb = res.body.resultados;
      this.historiales = this.historialesFromDb;
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

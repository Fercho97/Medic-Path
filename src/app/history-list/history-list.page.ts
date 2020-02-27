import { Component, OnInit } from '@angular/core';
import { ConsultService } from './history-list.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { debounceTime } from "rxjs/operators";
import { LoadingController } from "@ionic/angular";

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
  private loading;
  constructor(private consultServ : ConsultService, private toast : ToastrService, private loadCtr : LoadingController ) {
    this.searchControl = new FormControl();
   }

  ionViewWillEnter(){
    this.loadCtr.create({
      message: "Cargando"
    }).then((overlay) =>{
      this.loading = overlay;
      this.loading.present();
    })
    //console.log(this.id);
    this.consultServ.historyList(this.id).subscribe( (res: any) =>{
      this.historialesFromDb = res.body.resultados;
      this.historiales = this.historialesFromDb;
      this.loading.dismiss();
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

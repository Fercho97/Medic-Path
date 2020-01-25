import { Component, OnInit } from '@angular/core';
import { ConsultService } from './history-list.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.page.html',
  styleUrls: ['./history-list.page.scss'],
  providers: [ConsultService]
})
export class HistoryListPage{
  id = window.localStorage.getItem('id');
  historiales =[] as any;
  
  constructor(private consultServ : ConsultService, private toast : ToastrService ) { }

  ionViewWillEnter(){
    //console.log(this.id);
    this.consultServ.historyList(this.id,window.localStorage.getItem('token')).subscribe( (res: any) =>{
      this.historiales = res.body;
      //console.log(this.historiales);
    },
  error =>{
      console.log(error);
  })
  }

}

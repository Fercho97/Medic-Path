import { Component, OnInit } from '@angular/core';
import { ConsultService } from './history-list.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.page.html',
  styleUrls: ['./history-list.page.scss'],
  providers: [ConsultService]
})
export class HistoryListPage implements OnInit {
  id = window.localStorage.getItem('id');
  historiales =[] as any;
  constructor(private consultServ : ConsultService, private toast : ToastrService ) { }

  ngOnInit() {
    this.consultServ.historyList(this.id).subscribe( (res: any) =>{
      this.historiales = res.body;
    },
  error =>{
      console.log(error);
  })
  }

}

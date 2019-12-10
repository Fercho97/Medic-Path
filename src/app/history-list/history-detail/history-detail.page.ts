import { Component, OnInit } from '@angular/core';
import { ConsultService } from '../history-list.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.page.html',
  styleUrls: ['./history-detail.page.scss'],
  providers: [ConsultService]
})
export class HistoryDetailPage {
  historial = {} as any;
  padecimientoInfo = {} as any;
  constructor(private consultServ : ConsultService, private toast : ToastrService, private route : ActivatedRoute) { }

  ionViewWillEnter() {
    this.consultServ.getHistory(this.route.snapshot.params.id).subscribe( (res: any) =>{
      this.historial = res.body[0];
      this.padecimientoInfo = res.body[1];
      console.log(res.body);
    },
  error =>{
      console.log(error);
  })
  }

}
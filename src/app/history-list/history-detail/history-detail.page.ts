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
  public url : string = '';
  sintomas = [] as any;
  constructor(private consultServ : ConsultService, private toast : ToastrService, private route : ActivatedRoute) { }

  ionViewWillEnter() {
    this.consultServ.getHistory(this.route.snapshot.params.id).subscribe( (res: any) =>{
      this.historial = res.body.resultado;
      this.sintomas = res.body.resultado.detalles.split(",");
      if(this.historial.url_imagen_pad!= null){
      this.url = 'data:image/jpg;base64,' + this.historial.url_imagen_pad.toString();
      }
      console.log(res.body);
    },
  error =>{
      console.log(error);
  })
  }

}

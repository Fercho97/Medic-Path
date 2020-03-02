import { Component, OnInit } from '@angular/core';
import { ConsultService } from '../history-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
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
  constructor(private api : ApiService, private route : ActivatedRoute) { }

  ionViewWillEnter() {
    this.api.getHistory(this.route.snapshot.params.id).subscribe( (res: any) =>{
      console.log(res);
      this.historial = res;
      this.sintomas = res.detalles.split(",").filter(item => item);
      if(this.historial.url_imagen_pad!= null){
      this.url = this.historial.url_imagen_pad.toString();
      }
      console.log(res.body);
    },
  error =>{
      console.log(error);
  })
  }

}

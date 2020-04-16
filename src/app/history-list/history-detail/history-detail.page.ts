import { Component } from '@angular/core';
import { ConsultService } from '../history-list.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AlertsManagerService } from '../../services/alerts-manager.service';
import { ErrorMsg } from '../../utils/error_msg.const';
import { ToastrService } from 'ngx-toastr';
import { HttpParams} from '@angular/common/http';
import { NetworkService, ConnectionStatus } from '../../services/network.service';
import { HistoryOfflineManagerService } from '../../services/history-offline-manager.service';
@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.page.html',
  styleUrls: ['./history-detail.page.scss'],
  providers: [ConsultService,NetworkService,HistoryOfflineManagerService]
})
export class HistoryDetailPage {
  historial = {} as any;
  public url : string = "/assets/default-image.jpg";
  sintomas = [] as any;
  niveles = "";
  public nivelesInfo = ErrorMsg.LEVEL_EXPLAIN;
  public recomendaciones : any = [];
  public seleccionado = "";
  public hasOneSelected = false;
  constructor(private api : ApiService, private route : ActivatedRoute,
              private alertServ : AlertsManagerService, private toast : ToastrService,
              private network : NetworkService,private histServ : HistoryOfflineManagerService) { }

  ionViewWillEnter() {
    console.log(this.nivelesInfo)
    this.api.getHistory(this.route.snapshot.params.id).subscribe( (res: any) =>{
      console.log(res);
      this.historial = res;
      this.sintomas = res.detalles.split(",").filter(item => item);
      if(this.historial.detalles_especificos!=null){
        this.niveles = JSON.parse(this.historial.detalles_especificos);
      }
      if(this.historial.url_imagen_pad!= null){
      this.url = this.historial.url_imagen_pad.toString();
      }
      if(this.historial.recomendaciones_especialista!=null){
        this.recomendaciones = JSON.parse(this.historial.recomendaciones_especialista);
      }

      if(this.historial.especialista_seleccionado!=null){
        this.seleccionado = this.historial.especialista_seleccionado;
        this.hasOneSelected=true;
      }
      console.log(res.body);
    },
  error =>{
      console.log(error);
  })
  }

  showInfo(label : any){
    console.log(label);
    let mensaje = this.nivelesInfo[label].message;
    this.alertServ.infoAlert(mensaje);
  }

  actualizar(){

    let values = new HttpParams()
      .set('seleccion', this.seleccionado)
    this.api.actualizacionEspecialista(this.historial.hashId, values).subscribe( (res: any) =>{
      if(this.network.getCurrentNetworkStatus() == ConnectionStatus.Online){
        this.toast.success('Gracias por su retroalimentación!', 'Guardado exitoso!'); 
        this.hasOneSelected=true;
      }else{
        this.histServ.addFeedback(this.historial.hashId, this.seleccionado);
        this.histServ.removeFromLocalNotifications(this.historial.hashId);
        this.hasOneSelected=true;
      }
      
  }, error =>{
      console.log("Error", error.error);
      this.toast.error(error.error.message, 'Error');
  }
    );
  }

}

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
import { LoadingService } from "../../services/loading.service";
@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.page.html',
  styleUrls: ['./history-detail.page.scss'],
  providers: [ConsultService,NetworkService,HistoryOfflineManagerService]
})
export class HistoryDetailPage {
  historial = {} as any;
  public url : string = "";
  sintomas = [] as any;
  niveles = "";
  public nivelesInfo = ErrorMsg.LEVEL_EXPLAIN;
  public recomendaciones : any = [];
  public seleccionado = null;
  public hasOneSelected = false;
  constructor(private api : ApiService, private route : ActivatedRoute,
              private alertServ : AlertsManagerService, private toast : ToastrService,
              private network : NetworkService,private histServ : HistoryOfflineManagerService,
              private loadServ : LoadingService) { }

  ionViewWillEnter() {
    //console.log(this.nivelesInfo)
    this.api.getHistory(this.route.snapshot.params.id).subscribe( (res: any) =>{
      //console.log(res);
      this.historial = res;
      if(this.historial!=null){
      this.sintomas = res.detalles.split(",").filter(item => item);
      if(this.historial.detalles_especificos!=null){
        this.niveles = JSON.parse(this.historial.detalles_especificos);
      }
      
      if(res.url_imagen_pad== null || res.url_imagen_pad== "" || this.network.getCurrentNetworkStatus() == ConnectionStatus.Offline){
        this.url = "/assets/default-image.jpg";
      }else{
        this.url = res.url_imagen_pad;
      }

      if(this.historial.recomendaciones_especialista!=null){
        this.recomendaciones = JSON.parse(this.historial.recomendaciones_especialista);
      }

      if(this.historial.especialista_seleccionado!=null){
        this.seleccionado = this.historial.especialista_seleccionado;
        this.hasOneSelected=true;
      }}else{
        this.toast.error("No ha sido posible el acceder a la información de esta consulta de manera local", 'Error');
      }
      //console.log(res.body);
    },
  error =>{
      //console.log(error);
  })
  }

  showInfo(label : any){
    //console.log(label);
    let mensaje = this.nivelesInfo[label].message;
    this.alertServ.infoAlert(mensaje);
  }

  actualizar(){
    this.loadServ.present();
    if(this.seleccionado=='ninguno'){
      this.seleccionado='';
    }
    let values = new HttpParams()
      .set('seleccion', this.seleccionado)
    this.api.actualizacionEspecialista(this.historial.hashId, values).subscribe( (res: any) =>{
      if(this.network.getCurrentNetworkStatus() == ConnectionStatus.Online){
        this.toast.success('Gracias por su retroalimentación!', 'Guardado exitoso!'); 
      }
      this.loadServ.dismiss();
        this.histServ.addFeedback(this.historial.hashId, this.seleccionado);
        this.histServ.removeFromLocalNotifications(this.historial.hashId);
        this.hasOneSelected=true;
      
      
  }, error =>{
      //console.log("Error", error.error);
      this.loadServ.dismiss();
      this.toast.error(error.error.message, 'Error');
  }
    );
  }

}

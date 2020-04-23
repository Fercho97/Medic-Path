import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() sintomas : any;
  @Input() sintomasSeleccionados : any;
  @Input() label : any;
  constructor(private modalCtrl : ModalController) { }

  ngOnInit() {
    //console.log(this.sintomas);
  }

  dismiss(){
    this.modalCtrl.dismiss(this.sintomasSeleccionados);
  }
}

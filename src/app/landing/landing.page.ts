import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {
  username : string = "";
  constructor() { }
  ionViewWillEnter(){
    console.log(window.localStorage.getItem('username'));
    this.username=window.localStorage.getItem('username')
  }

}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the RelatorioLancamentos page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-relatorio-lancamentos',
  templateUrl: 'relatorio-lancamentos.html'
})
export class RelatorioLancamentosPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RelatorioLancamentosPage');
  }

}

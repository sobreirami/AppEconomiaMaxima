import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SegurancaPage } from '../seguranca/seguranca'

@Component({
  selector: 'page-configucacoes',
  templateUrl: 'configucacoes.html'
})
export class ConfigucacoesPage {

  public nav: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.nav = navCtrl;
  }

  public seguranca() {
    this.nav.push(SegurancaPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigucacoesPage');
  }

}

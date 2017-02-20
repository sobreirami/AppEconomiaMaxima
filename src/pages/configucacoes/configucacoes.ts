import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SegurancaPage } from '../seguranca/seguranca'
import { NotificacoesPage } from '../notificacoes/notificacoes'
import { PerfilPage } from '../perfil/perfil'

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

  public notificacao() {
    this.nav.push(NotificacoesPage);
  }

  public seguranca() {
    this.nav.push(SegurancaPage);
  }

  public perfil() {
    this.nav.push(PerfilPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigucacoesPage');
  }

}

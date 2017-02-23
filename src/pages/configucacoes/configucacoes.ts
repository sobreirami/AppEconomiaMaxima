import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SegurancaPage } from '../seguranca/seguranca'
import { NotificacoesPage } from '../notificacoes/notificacoes'
import { PerfilPage } from '../perfil/perfil'
import { DbUsuarios } from '../../providers/db-usuarios'

declare var cordova: any;

@Component({
  selector: 'page-configucacoes',
  templateUrl: 'configucacoes.html'
})
export class ConfigucacoesPage {

  public nav: any;
  db: any;
  username: any;
  email: any;
  lastImage: string = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.nav = navCtrl;
    this.db = new DbUsuarios();
    this.username = '';
    this.email = '';
  }

  public load() {
    this.db.getUser().then((result) => {
      this.username = result.username;
      this.email = result.email;
      if(result.imagem) {
        this.lastImage = result.imagem;
      }
    });
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

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  imagemPerfil() {
    if(this.lastImage) {
      return this.pathForImage(this.lastImage);
    } else {
      return 'assets/images/default-avatar.png';
    }
  }

  ionViewDidLoad() {
    this.load();
    console.log('ionViewDidLoad ConfigucacoesPage');
  }

}

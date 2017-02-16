import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { PermissoesDevice } from '../../providers/permissoes-device'

@Component({
  selector: 'page-notificacoes',
  templateUrl: 'notificacoes.html'
})
export class NotificacoesPage {

  calendario: any;
  notifications: any;
  db: any;
  userNotifications: any;
  userCalendario: any;
  horaNotificacao: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController
  ) {
    this.calendario = false;
    this.notifications = false;
    this.userNotifications = false;
    this.userCalendario = false;
    this.db = new PermissoesDevice();
  }

  load() {
    this.db.permissoes().then((result) => {
      if(result.notificacao == 1) {
        this.notifications = true;
        this.userNotifications = true;
      }
      if(result.calendario == 1) {
        this.calendario = true;
        this.userCalendario = true;
      }

      if(result.horaNotificacao == '0') {
        result.horaNotificacao = 12;
      }

      let horaNotificacaoInt = result.horaNotificacao + ":00";

      if((horaNotificacaoInt.length) == 4) {
        this.horaNotificacao = "0" + result.horaNotificacao + ":00";
      } else {
        this.horaNotificacao = result.horaNotificacao + ":00";
      }
      console.log(this.horaNotificacao);
    });
  }

  habilitarNotificacao() {
    if(this.notifications == true && this.userNotifications == false) {
      this.db.notificacaoPermission();
      this.db.atualizarNotificacaoPermissao(1).then((data) => {
        let toast = this.toastCtrl.create({
          message: 'Notificações habilitada',
          duration: 3000
        });
        toast.present();
        this.load();
      });
    } else if(this.notifications == false && this.userNotifications == true) {
      this.db.atualizarNotificacaoPermissao(0).then((data) => {
        let toast = this.toastCtrl.create({
          message: 'Notificações desabilitada',
          duration: 3000
        });
        toast.present();
        this.load();
      });
    }
  }

  habilitarCalendario() {
    if(this.calendario == true && this.userCalendario == false) {
      this.db.atualizarCalendarioPermissao(1).then((data) => {
        let toast = this.toastCtrl.create({
          message: 'Calendário habilitada',
          duration: 3000
        });
        toast.present();
        this.load();
      });
    } else if(this.calendario == false && this.userCalendario == true) {
      this.db.atualizarCalendarioPermissao(0).then((data) => {
        let toast = this.toastCtrl.create({
          message: 'Calendário desabilitada',
          duration: 3000
        });
        toast.present();
        this.load();
      });
    }
  }

  alteraHoraNotificacao() {
    let separa = this.horaNotificacao.split(":");
    let hora = separa[0];

    if(hora > '10') {
      this.db.atualizarHoraNotificacao(hora).then((data) => {
        let toast = this.toastCtrl.create({
          message: 'Hora notificação atualizada',
          duration: 3000
        });
        toast.present();
        this.load();
      });
      console.log(hora);
    } else {
      if(hora == '12') {
        this.db.atualizarHoraNotificacao(0).then((data) => {
          let toast = this.toastCtrl.create({
            message: 'Hora notificação atualizada',
            duration: 3000
          });
          toast.present();
          this.load();
        });
        console.log(0);
      } else {
        this.db.atualizarHoraNotificacao(hora.replace(0,"")).then((data) => {
          let toast = this.toastCtrl.create({
            message: 'Hora notificação atualizada',
            duration: 3000
          });
          toast.present();
          this.load();
        });
        console.log(hora.replace(0,""));
      }
    }
  }

  ionViewDidLoad() {
    this.load();
    console.log('ionViewDidLoad NotificacoesPage');
  }

}

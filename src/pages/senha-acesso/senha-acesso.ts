import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { DbUsuarios } from '../../providers/db-usuarios'

@Component({
  selector: 'page-senha-acesso',
  templateUrl: 'senha-acesso.html'
})
export class SenhaAcessoPage {

  nav: any;
  view: any;
  alert: any;
  db: any;
  titulo: string;
  password: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {
    this.view = viewCtrl;
    this.nav = navCtrl;
    this.alert = alertCtrl;
    this.db = new DbUsuarios();
    this.password = "";
  }

  load() {
    this.db.getUser().then((usuario) => {
      if(usuario.password) {
        console.log('Tem senha cadastrada');
        this.titulo = "Alterar senha";
      } else {
        this.titulo = "Cadastrar senha";
        console.log('Não tem senha cadastrada');
      }
    }, (error) => {
      console.log(error);
    });
  }

  salvar() {
    if(this.validInput(this.password)) {
      this.view.dismiss(this.password);
    } else {
      this.nav.push(this.alert.create({
         title: "Atenção!",
         message: "Preencha os campos obrigatórios.",
         buttons: [
           {
             text: "Ok"
           }
         ]
      }));
    }
  }

  cancelar() {
    this.view.dismiss();
  }

  ionViewDidLoad() {
    this.load();
    console.log('ionViewDidLoad SenhaAcessoPage');
  }

  validInput(data) {
    let validar = true;

    if(!data) {
      validar = false;
    }

    return validar;
  }

}

import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-modal-fornecedores',
  templateUrl: 'modal-fornecedores.html'
})
export class ModalFornecedoresPage {

  nav: any;
  view: any;
  fornecedor: any;
  titulo: string;
  alert: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController
  ) {
    this.nav = navCtrl;
    this.view = viewCtrl;
    this.alert = alertCtrl;
    this.fornecedor = navParams.get("parametro") || {descricao: ""};

    if(this.fornecedor.descricao) {
      this.titulo = this.fornecedor.descricao;
    } else {
      this.titulo = 'Novo fornecedor';
    }

  }

  cancel() {
    this.view.dismiss();
  }

  salvar() {

    if(this.validInput(this.fornecedor)) {
      this.view.dismiss(this.fornecedor);
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

  validInput(data) {
    let validar = true;

    if(!data.descricao) {
      validar = false;
    }
    return validar;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalFornecedoresPage');
  }

}

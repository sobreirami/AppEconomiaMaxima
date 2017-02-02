import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-modal-fornecedores',
  templateUrl: 'modal-fornecedores.html'
})
export class ModalFornecedoresPage {

  view: any;
  fornecedor: any;
  titulo: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {
    this.view = viewCtrl;
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
    this.view.dismiss(this.fornecedor);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalFornecedoresPage');
  }

}

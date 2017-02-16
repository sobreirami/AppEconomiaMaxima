import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { DataUtil } from '../../providers/data-util'
import { DbFornecedores } from '../../providers/db-fornecedores'

@Component({
  selector: 'page-modal-lancamentos',
  templateUrl: 'modal-lancamentos.html'
})
export class ModalLancamentosPage {

  nav: any;
  view: any;
  lancamento: any;
  descricao: any;
  valor: any;
  data: any;
  fornecedor: any;
  entradaSaida: any;
  pago: any;
  fornecedores: any;
  titulo: string;
  alert: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private dbFornecedores: DbFornecedores,
    public alertCtrl: AlertController
  ) {
    this.view = viewCtrl;
    this.nav = navCtrl;
    this.alert = alertCtrl;
    this.lancamento = navParams.get("parametro") || {descricao: ""};

    this.descricao = this.lancamento.descricao;
    this.valor = this.lancamento.valor;
    this.data = this._getDate(this.lancamento.data);

    this.fornecedor = this.lancamento.fornecedor;
    this.entradaSaida = this.lancamento.entradaSaida;
    this.pago = this.lancamento.pago;


    if(this.descricao) {
      this.titulo = this.descricao;
    } else {
      this.titulo = 'Novo lançamento';
    }

    this.dbFornecedores.getList().then((result) => {
        this.fornecedores = <Array<Object>> result;
    }, (error) => {
        console.log("ERROR: ", error);
    });

  }

  cancel() {
    this.view.dismiss();
  }

  salvar() {
    let dataUtil = new DataUtil;
    let data = dataUtil.parseData(this.data);

    this.lancamento.descricao = this.descricao;
    this.lancamento.valor = parseFloat(this.valor);
    this.lancamento.data = data.getTime();
    this.lancamento.pago = this.pago ? 1 : 0;
    this.lancamento.fornecedor = this.fornecedor;
    this.lancamento.entradaSaida = this.entradaSaida;

    if(this.validInput(this.lancamento)) {
      this.view.dismiss(this.lancamento);
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
    if(!data.valor) {
      validar = false;
    }
    if(!data.data) {
      validar = false;
    }
    if(!data.entradaSaida) {
      validar = false;
    }
    return validar;
  }

  _getDate(data) {
    let dataUtil = new DataUtil();

    if(!data) {
      data = new Date();
    }

    return dataUtil.formatDate(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalLancamentosPage');
  }

}

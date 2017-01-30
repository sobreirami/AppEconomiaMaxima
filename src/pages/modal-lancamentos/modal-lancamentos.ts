import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { DataUtil } from '../../providers/data-util'
import { DbFornecedores } from '../../providers/db-fornecedores'

@Component({
  selector: 'page-modal-lancamentos',
  templateUrl: 'modal-lancamentos.html'
})
export class ModalLancamentosPage {

  view: any;
  lancamento: any;
  descricao: any;
  valor: any;
  data: any;
  fornecedor: any;
  entradaSaida: any;
  pago: any;
  fornecedores: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private dbFornecedores: DbFornecedores
  ) {
    this.view = viewCtrl;
    this.lancamento = navParams.get("parametro") || {descricao: ""};

    this.descricao = this.lancamento.descricao;
    this.valor = this.lancamento.valor;
    this.data = this._getDate(this.lancamento.data);

    this.fornecedor = this.lancamento.fornecedor;
    this.entradaSaida = this.lancamento.entradaSaida;
    this.pago = this.lancamento.pago;

    this.dbFornecedores.getList().then((result) => {
        this.fornecedores = <Array<Object>> result;
    }, (error) => {
        console.log("ERROR: ", error);
    });

  }

  cancel() {
    this.view.dismiss();
  }

  save() {
    let dataUtil = new DataUtil;
    let data = dataUtil.parseData(this.data);

    this.lancamento.descricao = this.descricao;
    this.lancamento.valor = parseFloat(this.valor);
    this.lancamento.data = data.getTime();
    this.lancamento.pago = this.pago ? 1 : 0;
    this.lancamento.fornecedor = this.fornecedor;
    this.lancamento.entradaSaida = this.entradaSaida;

    this.view.dismiss(this.lancamento);
  }

  _getDate(data) {
    let dataUtil = new DataUtil();
    return dataUtil.formatDate(data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalLancamentosPage');
  }

}

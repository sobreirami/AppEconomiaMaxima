import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { DataUtil } from '../../providers/data-util'
import { DbFornecedores } from '../../providers/db-fornecedores'

@Component({
  selector: 'page-modal-filtro-relatorio-lancamentos',
  templateUrl: 'modal-filtro-relatorio-lancamentos.html'
})
export class ModalFiltroRelatorioLancamentosPage {

  view: any;
  lancamento: any;
  fornecedores: any;
  fornecedor: any;
  pago: any;
  naoPago: any;
  dataInicial: any;
  dataFinal: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private dbFornecedores: DbFornecedores
  ) {
    this.view = viewCtrl;

    this.lancamento = {};

    this.dbFornecedores.getList().then((result) => {
        this.fornecedores = <Array<Object>> result;
    }, (error) => {
        console.log("ERROR: ", error);
    });
  }

  public voltar() {
    this.view.dismiss();
  }

  public pesquisar() {

    let pagoNaoPago;
    let dataUtil = new DataUtil;
    let dataIni = dataUtil.parseData(this.dataInicial);
    let dataFim = dataUtil.parseData(this.dataFinal);

    if(this.pago && !this.naoPago) {
      pagoNaoPago = '1';
    } else if(!this.pago && this.naoPago) {
      pagoNaoPago = '0';
    } else {
      pagoNaoPago = '0,1';
    }

    this.lancamento.dataInicial = dataIni.getTime();
    this.lancamento.dataFinal = dataFim.getTime();
    this.lancamento.fornecedor = this.fornecedor;
    this.lancamento.pagoNaoPago = pagoNaoPago;

    this.view.dismiss(this.lancamento);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalFiltroRelatorioLancamentosPage');
  }

}

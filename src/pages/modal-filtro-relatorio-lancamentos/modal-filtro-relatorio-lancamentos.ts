import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { DataUtil } from '../../providers/data-util'

@Component({
  selector: 'page-modal-filtro-relatorio-lancamentos',
  templateUrl: 'modal-filtro-relatorio-lancamentos.html'
})
export class ModalFiltroRelatorioLancamentosPage {

  view: any;
  lancamento: any;
  dataInicial: any;
  dataFinal: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.view = viewCtrl;
    this.lancamento = {};

    let dataUtil = new DataUtil();

    this.dataInicial = dataUtil.formatDate(dataUtil.getFirstDay(new Date()));
    this.dataFinal = dataUtil.formatDate(dataUtil.getLastDay(new Date()));
  }

  public voltar() {
    this.view.dismiss();
  }

  public pesquisar() {

    let dataUtil = new DataUtil;
    let dataIni = dataUtil.parseData(this.dataInicial);
    let dataFim = dataUtil.parseData(this.dataFinal);

    this.lancamento.dataInicial = dataIni;
    this.lancamento.dataFinal = dataFim;

    this.view.dismiss(this.lancamento);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalFiltroRelatorioLancamentosPage');
  }

}

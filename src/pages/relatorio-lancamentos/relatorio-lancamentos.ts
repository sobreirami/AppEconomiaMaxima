import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { DataUtil } from  '../../providers/data-util'
import { DbLancamentos } from '../../providers/db-lancamentos'
import { ModalFiltroRelatorioLancamentosPage } from '../modal-filtro-relatorio-lancamentos/modal-filtro-relatorio-lancamentos'

@Component({
  selector: 'page-relatorio-lancamentos',
  templateUrl: 'relatorio-lancamentos.html'
})
export class RelatorioLancamentosPage {

  nav: any;
  dataFiltro: any;
  entradaSaida: string;
  listaContas: any;
  resumo: any;
  texto: string;
  total: any;
  modal: any;
  dataInicio: any;
  dataFim: any;
  dataUtil:any;

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private DbLancamentos: DbLancamentos,
     public modalCtrl: ModalController,
  ) {
    this.nav = navCtrl;
    this.entradaSaida = "entrada";
    this.modal = modalCtrl;

    this.dataUtil = new DataUtil();
    this.dataFiltro = new Date();
    this.dataInicio = this.dataUtil.getFirstDay(this.dataFiltro);
    this.dataFim = this.dataUtil.getLastDay(this.dataFiltro);

    this._getList(this.entradaSaida);
  }

  public _getList(entradaSaida) {
    this.DbLancamentos.getListGroupByConta(this.dataInicio, this.dataFim, entradaSaida).then((listaContas) => {

      if(listaContas) {
        this.listaContas = listaContas;
        this._calcPercentual();
        this.getResumo();
      } else {
        this.listaContas = [];
        this._calcPercentual();
        this.getResumo();
      }

    });
  }

  public getResumo() {

    if(this.entradaSaida == 'entrada') {
      this.texto = 'Total de entradas';
    } else {
      this.texto = 'Total de saídas';
    }

    this.total = this._calcTotal();
  }

  public _calcTotal() {
    let total = 0;

    for (var i = 0; i < this.listaContas.length; i++) {
      total += this.listaContas[i].saldo;
    }

    return total;
  }

  public _calcPercentual() {
    let total = this._calcTotal();

    for (var i = 0; i < this.listaContas.length; i++) {
      this.listaContas[i].percentual = (this.listaContas[i].saldo / total) * 100;
    }
  }

  public onSelect(entradaSaida) {
    this.entradaSaida = entradaSaida;
    this._getList(entradaSaida);
  }

  public tipoLancamento(entradaSaida) {

    if(entradaSaida == "entrada")
      return "entrada-chart";
    else
      return "saida-chart";

  }

  public tipoLancamentoResumo(entradaSaida) {
    if(entradaSaida == "entrada")
      return "background-resumo-entrada";
    else
      return "background-resumo-saida";
  }

  public filtroRelatorio() {
    let modalfiltroRelatorio = this.modal.create(ModalFiltroRelatorioLancamentosPage);
    modalfiltroRelatorio.onDidDismiss((data) => {
      if(data) {
        this.DbLancamentos.getListGroupByConta(data.dataInicial, data.dataFinal, this.entradaSaida).then((listaContas) => {

          this.dataInicio = data.dataInicial;
          this.dataFim = data.dataFinal;

          if(listaContas) {
            this.listaContas = listaContas;
            this._calcPercentual();
            this.getResumo();
          } else {
            this.listaContas = [];
            this._calcPercentual();
            this.getResumo();
          }

        });
      }
    });
    this.nav.push(modalfiltroRelatorio);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RelatorioLancamentosPage');
  }

}

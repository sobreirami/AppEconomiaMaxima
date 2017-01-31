import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataUtil } from  '../../providers/data-util'
import { DbLancamentos } from '../../providers/db-lancamentos'

@Component({
  selector: 'page-relatorio-lancamentos',
  templateUrl: 'relatorio-lancamentos.html'
})
export class RelatorioLancamentosPage {

  nav: any;
  dataFiltro: any;
  entradaSaida: string;
  listaContas: any;

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private DbLancamentos: DbLancamentos
  ) {
    this.nav = navCtrl;
    this.dataFiltro = new Date();
    this.entradaSaida = "entrada";
    this._getList(this.entradaSaida)
  }

  public _getList(entradaSaida) {
    let dataUtil = new DataUtil();

    let dataInicio = dataUtil.getFirstDay(this.dataFiltro);
    let dataFim = dataUtil.getLastDay(this.dataFiltro);

    this.DbLancamentos.getListGroupByConta(dataInicio, dataFim, entradaSaida).then((listaContas) => {
      this.listaContas = listaContas;
      this._calcPercentual();
    });
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
    console.log(entradaSaida);
    this._getList(entradaSaida);
  }

  public tipoLancamento(entradaSaida) {

    if(entradaSaida == "entrada")
      return "entrada-chart";
    else
      return "saida-chart";
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RelatorioLancamentosPage');
  }

}

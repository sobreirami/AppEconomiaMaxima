import { Component } from '@angular/core';
import { Events, PopoverController, ModalController, NavController } from 'ionic-angular';
import { DbLancamentos }  from '../../providers/db-lancamentos'
import { PopoverPage } from '../popover/popover'
import { DataUtil } from '../../providers/data-util'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public saldo: any;
  public db: any;
  public totalEntrada: any;
  public totalSaida: any;
  public totalReceber: any;
  public totalPagar: any;
  public dataInicial: any;
  public dataFinal: any;
  public saldoMesPassado: any;
  public saldoPrevisto: any;

  constructor(
    public events: Events,
    private popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public navCtrl: NavController
  ) {
    this.db = new DbLancamentos();

    let dataUtil = new DataUtil();
    this.dataInicial = dataUtil.getFirstDay(new Date());
    this.dataFinal = dataUtil.getLastDay(new Date());

    events.subscribe("indicadores:updated", (indicadores) => {
      this.totalEntrada = parseFloat(indicadores.totalEntrada);
      this.totalSaida = parseFloat(indicadores.totalSaida);
      this.saldo = parseFloat(indicadores.saldo);
      this.saldoMesPassado = parseFloat(indicadores.saldoMesPassado);
      this.totalReceber = parseFloat(indicadores.totalReceber);
      this.totalPagar = parseFloat(indicadores.totalPagar);
      
      this.saldoPrevisto = this.saldo + this.totalReceber - this.totalPagar;
    });
  }

  public load() {
    this.db.getSaldo(this.dataInicial, this.dataFinal).then((indicadores) => {
      this.totalEntrada = indicadores.totalEntrada;
      this.totalSaida = indicadores.totalSaida;
      this.saldo = indicadores.saldo;
      this.saldoMesPassado = indicadores.saldoMesPassado;
      this.totalReceber = indicadores.totalReceber;
      this.totalPagar = indicadores.totalPagar;

      this.saldoPrevisto = this.saldo + this.totalReceber - this.totalPagar;
    });
  }

  public openMenu(ev) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: ev
    });
  }

  ionViewDidLoad() {
    this.load();
    console.log('ionViewDidLoad');
  }

  ionViewDidEnter() {
    this.load();
    console.log('ionViewDidEnter');
  }

}

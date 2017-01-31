import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { DbLancamentos }  from '../../providers/db-lancamentos'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public saldo: any;

  constructor(
    private DbLancamentos: DbLancamentos,
    public events: Events
  ) {

    events.subscribe("saldo:updated", (saldo) => {
      this.saldo = parseFloat(saldo);
    });

  }

  public load() {
    this.DbLancamentos.getSaldo().then((saldo) => {
      this.saldo = saldo;
    });
  }

  ionViewDidLoad() {
    this.load();
    console.log('ionViewDidLoad');
  }

}

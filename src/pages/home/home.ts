import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { DbLancamentos }  from '../../providers/db-lancamentos'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public saldo: any;
  public db: any;

  constructor(
    public events: Events
  ) {
    this.db = new DbLancamentos();

    events.subscribe("saldo:updated", (saldo) => {
      this.saldo = parseFloat(saldo);
    });
  }

  public load() {
    this.db.getSaldo().then((saldo) => {
      this.saldo = saldo;
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

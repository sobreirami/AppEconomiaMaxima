import { Component } from '@angular/core';
import { Events, PopoverController } from 'ionic-angular';
import { DbLancamentos }  from '../../providers/db-lancamentos'
import { PopoverPage } from '../popover/popover'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public saldo: any;
  public db: any;

  constructor(
    public events: Events,
    private popoverCtrl: PopoverController
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

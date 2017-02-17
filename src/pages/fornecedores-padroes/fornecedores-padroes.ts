import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';

@Component({
  template: `
    <ion-list no-lines>
      <button menuClose ion-item (click)="fornecedoresPadroes()">
        Fornecedores padrões
      </button>
    </ion-list>
  `
})
export class FornecedoresPadroesPage {

  nav: any;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
  ) {
    this.nav = navCtrl;
  }

  close() {
    this.viewCtrl.dismiss();
  }

  fornecedoresPadroes() {
    this.viewCtrl.dismiss('clickButton');
  }

}

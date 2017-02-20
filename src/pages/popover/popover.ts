import { Component } from '@angular/core';
import { App, ViewController, NavController } from 'ionic-angular';
import { FornecedoresPage } from '../fornecedores/fornecedores'
import { RelatorioLancamentosPage } from '../relatorio-lancamentos/relatorio-lancamentos'
import { ConfigucacoesPage } from '../configucacoes/configucacoes'

@Component({
  template: `
    <ion-list no-lines>
      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
        {{p.title}}
      </button>
    </ion-list>
  `
})
export class PopoverPage {

  pages: Array<{title: string, component: any}>;
  nav: any;

  constructor(
    public viewCtrl: ViewController,
    public appCtrl: App,
    public navCtrl: NavController,
  ) {
    this.nav = navCtrl;

    this.pages = [
      { title: 'Fornecedores', component: FornecedoresPage },
      { title: 'Relatórios de lançamentos', component: RelatorioLancamentosPage },
      { title: 'Configurações', component: ConfigucacoesPage }
    ];
  }

  close() {
    this.viewCtrl.dismiss();
  }

  openPage(page) {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(page.component);
  }

}

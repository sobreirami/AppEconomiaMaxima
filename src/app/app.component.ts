import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { FornecedoresPage } from '../pages/fornecedores/fornecedores'
import { RelatorioLancamentosPage } from '../pages/relatorio-lancamentos/relatorio-lancamentos'
import { Database } from '../providers/database'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public db: Database
  ) {
      this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.overlaysWebView(true);
      StatusBar.backgroundColorByHexString('#1768f3');
    }).then(() => {
      this.db.openDatabase().then(() => this.db.createTable()).then(() => {
        this.rootPage = TabsPage;
        this.pages = [
          { title: 'Home', component: TabsPage },
          { title: 'Fornecedores', component: FornecedoresPage },
          { title: 'Relatórios', component: RelatorioLancamentosPage }
        ];
      });
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}

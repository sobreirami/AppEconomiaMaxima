import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
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

  constructor(
    public platform: Platform,
    public db: Database,
    public app: App
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
      });
    });
  }

}

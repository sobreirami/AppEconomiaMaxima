import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { Database } from '../providers/database'
import { DbUsuarios } from '../providers/db-usuarios'
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = null;

  public dbUser: any;

  constructor(
    public platform: Platform,
    public db: Database,
    public app: App,
  ) {
      Splashscreen.show();
      this.dbUser = new DbUsuarios();
      this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.overlaysWebView(true);
      StatusBar.backgroundColorByHexString('#1768f3');
    }).then(() => {
      this.db.openDatabase().then(() => this.db.createTable()).then(() => {
        this.dbUser.getUser().then((usuario) => {
          if(usuario.token || usuario.password) {
            this.rootPage = LoginPage;
            Splashscreen.hide();
          } else {
            this.rootPage = TabsPage;
            Splashscreen.hide();
          }
        }, (error) => {
          this.rootPage = TabsPage;
          Splashscreen.hide();
        });
      });
    });
  }

}

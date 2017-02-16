import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AndroidFingerprintAuth } from 'ionic-native';
import { DbUsuarios } from '../../providers/db-usuarios'
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public nav: any;
  public db: any;
  public finferPrint: boolean;
  public userToken: any;
  public userPass: any;
  public suportefingerPrint: any;
  public password: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController
  ) {
    this.nav = navCtrl;
    this.db = new DbUsuarios();
    this.finferPrint = false;
    this.userToken = "";
    this.password = "";
  }

  load() {
    this.db.getUser().then((usuario) => {
      if(usuario.token) {
        this.userToken = usuario.token;
        this.finferPrint = true;
      }
      if(usuario.password) {
        this.userPass = usuario.password;
      }
    });
  }

  loginSenha() {
    if(this.userPass == this.password) {
      console.log("Successful password authentication.");
      this.nav.push(TabsPage);
    } else {
      let toast = this.toastCtrl.create({
        message: 'Senha inválida',
        duration: 3000
      });
      toast.present();
    }
  }

  loginBiometria() {
    AndroidFingerprintAuth.decrypt({
      clientId: "economiamaxima",
      username: "economiamaxima",
      token: this.userToken,
      disableBackup: true,
      locale: "pt"
    })
    .then(result => {
      if (result.withFingerprint) {
        console.log("Successful biometric authentication.");
        this.nav.push(TabsPage);
      } else {
        let toast = this.toastCtrl.create({
          message: 'Impressão digital inválida',
          duration: 3000
        });
        toast.present();
      }
    })
    .catch(error => {
      let toast = this.toastCtrl.create({
        message: 'Impressão digital inválida',
        duration: 3000
      });
      toast.present();
    });
  }

  ionViewDidLoad() {
    this.load();
    console.log('ionViewDidLoad LoginPage');
  }
}

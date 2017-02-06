import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AndroidFingerprintAuth } from 'ionic-native';
import { DbUsuarios } from '../../providers/db-usuarios'
import { SenhaAcessoPage } from '../senha-acesso/senha-acesso'

@Component({
  selector: 'seguranca',
  templateUrl: 'seguranca.html'
})
export class SegurancaPage {

  public nav: any;
  public modal: any;
  public db: any;
  public finferPrint: boolean;
  public userToken: any;
  public labelSenha: any;
  public suportefingerPrint: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) {
    this.nav = navCtrl;
    this.modal = modalCtrl;
    this.finferPrint = false;
    this.db = new DbUsuarios();
    this.userToken = false;
    this.suportefingerPrint = false;
  }

  load() {
    this.isAvailablefingerPrint();

    this.db.getUser().then((usuario) => {
      if(usuario.token) {
        console.log('Tem biometria cadastrada');
        this.userToken = true;
        this.finferPrint = true;
      } else {
        console.log('Não tem token cadastrada');
        this.finferPrint = false;
        this.userToken = false;
      }
      if(usuario.password) {
        console.log('Tem senha cadastrada');
        this.labelSenha = "Alterar senha";
      } else {
        this.labelSenha = "Cadastrar senha";
        console.log('Não tem senha cadastrada');
      }
    }, (error) => {
      console.log(error);
    });
  }

  senha() {
    let ModalSenhaAcesso = this.modal.create(SenhaAcessoPage);
    ModalSenhaAcesso.onDidDismiss((password) => {
      if(password) {
        this.db.senhaUser(password).then((result) => {
          this.load();
        }, (error) => {
          console.log("ERROR: ", error);
        });
      }
    });
    this.nav.push(ModalSenhaAcesso);
  }

  isAvailablefingerPrint() {
    AndroidFingerprintAuth.isAvailable()
    .then((result)=> {
      if(result.isAvailable) {
        this.suportefingerPrint = true;
      } else {
        this.suportefingerPrint = false;
      }
    });
  }

  habilitarFingerPrint() {

    console.log(this.finferPrint);
    console.log(this.userToken);

    if(this.finferPrint == true && this.userToken == false) {
      AndroidFingerprintAuth.isAvailable()
      .then((result)=> {
        if(result.isAvailable){
          AndroidFingerprintAuth.encrypt({
            clientId: "economiamaxima",
            username: "economiamaxima",
            disableBackup: true,
            locale: "pt"
           })
            .then(result => {
               if (result.withFingerprint) {
                   console.log("Successfully encrypted credentials.");
                   console.log("Encrypted credentials: " + result.token);
                   this.db.biometriaUser(result.token).then((result) => {
                     this.load();
                   }, (error) => {
                     console.log("ERROR: ", error);
                   });
               } else if (result.withBackup) {
                 console.log('Successfully authenticated with backup password!');
               } else console.log('Didn\'t authenticate!');
            })
            .catch(error => {
               if (error === "Cancelled") {
                 console.log("Fingerprint authentication cancelled");
                 this.finferPrint == false;
               } else console.error(error)
            });

        } else {
          console.log('Não disponivel');
          this.finferPrint == false;
        }
      })
      .catch(error => console.error(error));
    } else if(this.finferPrint == false && this.userToken == true) {
      AndroidFingerprintAuth.delete({
        clientId: "economiamaxima",
        username: "economiamaxima"
      })
      .then((result) => {
        console.log("Successfully deleted cipher: " + JSON.stringify(result));
        this.db.biometriaUser("").then((result) => {
          this.load();
        }, (error) => {
          console.log("ERROR: ", error);
        });
        this.finferPrint == false;
      })
      .catch(error => {
         console.log(error);
         this.finferPrint == false;
      });
    }
  }

  ionViewDidLoad() {
    this.load();
    console.log('ionViewDidLoad SenhaAcessoPage');
  }

}

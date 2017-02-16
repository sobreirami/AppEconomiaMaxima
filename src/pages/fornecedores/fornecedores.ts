import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController,
   Keyboard, ToastController } from 'ionic-angular';
import { DbFornecedores } from '../../providers/db-fornecedores'
import { ModalFornecedoresPage } from "../modal-fornecedores/modal-fornecedores"

@Component({
  selector: 'page-fornecedores',
  templateUrl: 'fornecedores.html'
})
export class FornecedoresPage {
  @ViewChild('searchbar') searchBar;

  listarFornecedores: Array<Object>;
  modal: any;
  nav: any;
  alert: any;
  searchMode: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private dbFornecedores: DbFornecedores,
    public alertCtrl: AlertController,
    public keyboard: Keyboard,
    public toastCtrl: ToastController
  ) {
      this.nav = navCtrl;
      this.modal = modalCtrl;
      this.alert = alertCtrl;
      this.searchMode = false;
  }

  public ionViewDidLoad() {
    this.load();
  }

  public load() {
    this.dbFornecedores.getList().then((result) => {
        this.listarFornecedores = <Array<Object>> result;
    }, (error) => {
        console.log("ERROR: ", error);
    });
  }

  public insert() {
    console.log('Click insert');
    let modalFornecedores = this.modal.create(ModalFornecedoresPage);
    modalFornecedores.onDidDismiss((data) => {
      if(data) {
        this.dbFornecedores.insert(data).then((result) => {
          let toast = this.toastCtrl.create({
            message: 'Fornecedor cadastrado com sucesso',
            duration: 3000
          });
          toast.present();
          this.load();
        }, (error) => {
          console.log("ERROR: ", error);
        });
      }
    });
    this.nav.push(modalFornecedores);
  }

  public edit(fornecedor) {
    console.log('Click edit');
    let modalFornecedores = this.modal.create(ModalFornecedoresPage, {parametro: fornecedor});
    modalFornecedores.onDidDismiss((data) => {
      if(data) {
        this.dbFornecedores.edit(data).then((result) => {
          let toast = this.toastCtrl.create({
            message: 'Fornecedor alterado com sucesso',
            duration: 3000
          });
          toast.present();
          this.load();
        }, (error) => {
          console.log("ERROR: ", error);
        });
      }
    });
    this.nav.push(modalFornecedores);
  }

  public delete(fornecedor) {
    console.log('Click delete');
    let confirm = this.alert.create({
      title: "Excluir",
      message: "Gostaria de realmente excluir o Fornecedor " + fornecedor.descricao + "?",
      buttons: [
        {
          text: "Sim",
          handler: () => {
            this.dbFornecedores.delete(fornecedor).then((result) => {
              let pos = this.listarFornecedores.indexOf(fornecedor);
              this.listarFornecedores.splice(pos, 1);
              let toast = this.toastCtrl.create({
                message: 'Fornecedor excluído com sucesso',
                duration: 3000
              });
              toast.present();
            })
          }
        },
        {
          text: "Não"
        }
      ]
    });
    this.nav.push(confirm);
  }

  public clickbuscarFornecedores() {
    this.searchMode = true;

    setTimeout(() => {
      //Keyboard.show();
      this.searchBar.setFocus();
    }, 450);
  }

  public InputbuscarFornecedores(ev: any) {

    this.dbFornecedores.getList().then((result) => {
        this.listarFornecedores = <Array<Object>> result;

        let val = ev.target.value;
        if (val && val.trim() != '') {
          this.listarFornecedores = this.listarFornecedores.filter((item: any) => {
            return (item.descricao.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }

    }, (error) => {
        console.log("ERROR: ", error);
    });
  }

  public CancelbuscarFornecedores() {
    this.searchMode = false;
    this.searchBar._searchbarInput.nativeElement.autofocus = false;
  }

}

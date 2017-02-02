import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController,
  ActionSheetController, Events, PopoverController, Searchbar, Keyboard } from 'ionic-angular';
import { DbLancamentos }  from '../../providers/db-lancamentos'
import { DataUtil } from  '../../providers/data-util'
import { ModalLancamentosPage } from '../modal-lancamentos/modal-lancamentos'
import { PopoverPage } from '../popover/popover'

@Component({
  selector: 'page-lancamentos',
  templateUrl: 'lancamentos.html'
})
export class LancamentosPage {
  @ViewChild('searchbar') searchBar;

  listarLancamentos: Array<Object>;
  modal: any;
  nav: any;
  alert: any;
  dataFiltro: any;
  searchMode: any;
  db: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private DataUtil: DataUtil,
    public actionSheetCtrl: ActionSheetController,
    private events: Events,
    private popoverCtrl: PopoverController,
    public keyboard: Keyboard
  ) {
    this.nav = navCtrl;
    this.modal = modalCtrl;
    this.alert = alertCtrl;
    this.dataFiltro = new Date();
    this.searchMode = false;
    this.db = new DbLancamentos();
  }

  public load() {

    let dataUtil = new DataUtil();
    let dataInicio = dataUtil.getFirstDay(this.dataFiltro);
    let dataFim = dataUtil.getLastDay(this.dataFiltro);

    this.db.getList(dataInicio, dataFim).then((result) => {
        this.listarLancamentos = <Array<Object>> result;
    }, (error) => {
        console.log("ERROR: ", error);
    });
  }

  public insert() {
    console.log('Click insert');
    let modalLancamentos = this.modal.create(ModalLancamentosPage);
    modalLancamentos.onDidDismiss((data) => {
      if(data) {
        this.db.insert(data).then((result) => {
          this.updateSaldo();
          this.load();
        }, (error) => {
          console.log("ERROR: ", error);
        });
      }
    });
    this.nav.push(modalLancamentos);
  }

  public edit(lancamento) {
    console.log('Click edit');
    let modalLancamentos = this.modal.create(ModalLancamentosPage, {parametro: lancamento});
    modalLancamentos.onDidDismiss((data) => {
      if(data) {
        this.db.edit(data).then((result) => {
          this.updateSaldo();
          this.load();
        }, (error) => {
          console.log("ERROR: ", error);
        });
      }
    });
    this.nav.push(modalLancamentos);
  }

  public delete(lancamento) {
    console.log('Click delete');
    let confirm = this.alert.create({
      title: "Excluir",
      message: "Gostaria de realmente excluir o Lançamento " + lancamento.descricao + "?",
      buttons: [
        {
          text: "Sim",
          handler: () => {
            this.db.delete(lancamento).then((result) => {
              let pos = this.listarLancamentos.indexOf(lancamento);
              this.listarLancamentos.splice(pos, 1);
              this.updateSaldo();
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

  updateMonth(data) {
    this.dataFiltro = data;
    this.load();
    this.updateSaldo();
  }

  getDate(lancamento) {
    let dataUtil = new DataUtil;
    return dataUtil.parseString(lancamento.data);
  }

  situacaoLancamento(lancamento) {
    return lancamento.pago ? "Pago" : "Não pago"
  }

  lancamentoEntrada(lancamento) {
    return lancamento.entradaSaida == "entrada";
  }

  updateSaldo() {
    this.db.getSaldo().then((saldo) => {
      this.events.publish("saldo:updated", saldo);
    });
  }

  paymentButtonText(lancamento) {
    return lancamento.pago ? "Reabrir" : "Pagar";
  }

  changePaymentStatus(lancamento) {
    lancamento.pago = lancamento.pago ? 0 : 1;

    this.db.edit(lancamento);
    this.updateSaldo();
  }

  presentActionSheet(lancamento) {
    let actionSheet = this.actionSheetCtrl.create({
      title: lancamento.descricao,
      buttons: [
        {
          text: 'Editar',
          icon: 'create',
          handler: () => {
            this.edit(lancamento);
          }
        },{
          text: this.paymentButtonText(lancamento),
          icon: 'cash',
          handler: () => {
            this.changePaymentStatus(lancamento);
          }
        },{
          text: 'Excluir',
          icon: 'trash',
          handler: () => {
            this.delete(lancamento);
          }
        },{
          text: 'Cancelar',
          icon: 'arrow-back',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  public clickbuscarLancamentos() {
    this.searchMode = true;

    setTimeout(() => {
      //Keyboard.show();
      this.searchBar.setFocus();
    }, 350);
  }

  public InputbuscarLancamentos(ev: any) {
    let dataUtil = new DataUtil();
    let dataInicio = dataUtil.getFirstDay(this.dataFiltro);
    let dataFim = dataUtil.getLastDay(this.dataFiltro);

    this.db.getList(dataInicio, dataFim).then((result) => {
        this.listarLancamentos = <Array<Object>> result;
        let val = ev.target.value;
        if (val && val.trim() != '') {
          this.listarLancamentos = this.listarLancamentos.filter((item: any) => {
            return (item.descricao.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }
    }, (error) => {
        console.log("ERROR: ", error);
    });
  }

  public CancelbuscarLancamentos() {
    this.searchMode = false;
    this.searchBar._searchbarInput.nativeElement.autofocus = false;
  }

  public openMenu(ev) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: ev
    });
  }

  ionViewDidLoad() {
    this.load();
  }

}

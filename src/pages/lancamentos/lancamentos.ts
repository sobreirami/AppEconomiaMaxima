import { Component, ViewChild } from '@angular/core';
import { Calendar, LocalNotifications } from 'ionic-native';
import { NavController, NavParams, ModalController, AlertController,
  ActionSheetController, Events, PopoverController, Keyboard,
  ToastController } from 'ionic-angular';
import { DbLancamentos }  from '../../providers/db-lancamentos'
import { DataUtil } from  '../../providers/data-util'
import { ModalLancamentosPage } from '../modal-lancamentos/modal-lancamentos'
import { PopoverPage } from '../popover/popover'
import { PermissoesDevice } from '../../providers/permissoes-device'

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
  permissoes: any;
  notificacoesPermissoes: any;
  calendarioPermissoes: any;
  horaNotificacoes: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private DataUtil: DataUtil,
    public actionSheetCtrl: ActionSheetController,
    private events: Events,
    private popoverCtrl: PopoverController,
    public keyboard: Keyboard,
    public toastCtrl: ToastController
  ) {
    this.nav = navCtrl;
    this.modal = modalCtrl;
    this.alert = alertCtrl;
    this.dataFiltro = new Date();
    this.searchMode = false;
    this.db = new DbLancamentos();
    this.permissoes = new PermissoesDevice();

    this.notificacoesPermissoes = false;
    this.calendarioPermissoes = false;
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

    this.permissoes.permissoes().then((result) => {
      if(result.notificacao == 1) {
        this.notificacoesPermissoes = true;
      }
      if(result.calendario == 1) {
        this.calendarioPermissoes = true;
      }
      this.horaNotificacoes = result.horaNotificacao;
    });
  }

  public insert() {
    console.log('Click insert');
    let modalLancamentos = this.modal.create(ModalLancamentosPage);
    modalLancamentos.onDidDismiss((data) => {
      if(data) {
        if(!data.fornecedor) {
          data.fornecedor = 'Não informado';
        }
        if(data.descricao && data.valor && data.entradaSaida) {
          this.db.insert(data).then((result) => {
            let toast = this.toastCtrl.create({
              message: 'Lançamento cadastrado com sucesso',
              duration: 3000
            });
            toast.present();
            this.updateSaldo();
            this.notificacao(data);
            this.calendario(data, result);
            this.load();
          }, (error) => {
            console.log("ERROR: ", error);
          });
        }
      }
    });
    this.nav.push(modalLancamentos);
  }

  public edit(lancamento) {
    console.log('Click edit');
    let modalLancamentos = this.modal.create(ModalLancamentosPage, {parametro: lancamento});
    modalLancamentos.onDidDismiss((data) => {
      if(data) {
        if(!data.fornecedor) {
          data.fornecedor = 'Não informado';
        }
        if(data.descricao && data.valor && data.entradaSaida) {
          this.db.edit(data).then((result) => {
            let toast = this.toastCtrl.create({
              message: 'Lançamento editado com sucesso',
              duration: 3000
            });
            toast.present();
            this.updateSaldo();
            this.notificacao(data);
            this.load();
          }, (error) => {
            console.log("ERROR: ", error);
          });
        }
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
              let toast = this.toastCtrl.create({
                message: 'Lançamento excluído com sucesso',
                duration: 3000
              });
              toast.present();
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
    let dataUtil = new DataUtil();
    let dataInicial = dataUtil.getFirstDay(new Date());
    let dataFinal = dataUtil.getLastDay(new Date());

    this.db.getSaldo(dataInicial, dataFinal).then((indicadores) => {
      this.events.publish("indicadores:updated", indicadores);
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
    }, 150);
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

  public calendario(evento, lancamento) {
    if(this.calendarioPermissoes) {
      if(evento.pago == 0) {
        let dataUtil = new DataUtil();
        if(dataUtil.parseCompare(evento.data, this.horaNotificacoes) == 'Maior') {
          let title = evento.descricao;
          let location = "";
          let notes = "";
          if(evento.entradaSaida == "saida") {
            notes = "Pagar " + evento.descricao + " no valor de R$" + evento.valor +
              " para o fornecedor " + evento.fornecedor;
          } else {
            notes = "Receber " + evento.descricao + " no valor de R$" + evento.valor +
              " do fornecedor " + evento.fornecedor;
          }

          let startDate = dataUtil.parseCalendar(evento.data, this.horaNotificacoes);
          let endDate = dataUtil.parseCalendar(evento.data, this.horaNotificacoes);

          let calOptions = Calendar.getCalendarOptions();
          calOptions.calendarName = "Economia máxima";
          calOptions.calendarId = 4;

          Calendar.createEventWithOptions(title, location, notes, startDate, endDate, calOptions).then(function (result) {
            console.log("Event created successfully");
            console.log(result);
          }, function (err) {
            console.error("There was an error: " + err);
          });
        }
      }
    }
  }

  public notificacao(lancamento) {
    if(this.notificacoesPermissoes) {
      if(lancamento.pago == 0) {
        let dataUtil = new DataUtil();
        if(dataUtil.parseCompare(lancamento.data, this.horaNotificacoes) == 'Maior') {
          let dataNoti = dataUtil.parseCalendar(lancamento.data, this.horaNotificacoes);
          let title = "";
          let text = "";
          if(lancamento.entradaSaida == "saida") {
            title = "Conta de " + lancamento.descricao;
            text = "Pagar a conta de " + lancamento.descricao + " do fornecedor " +
              lancamento.fornecedor +" com vencimento para hoje no valor de R$" + lancamento.valor;
          } else {
            title = "Receber " + lancamento.descricao;
            text = "Receber " + lancamento.descricao + " do fornecedor " +
              lancamento.fornecedor +" com vencimento para hoje no valor de R$" + lancamento.valor;
          }
          LocalNotifications.schedule([{
            id: 1,
            title: title,
            text: text,
            at: dataNoti,
            icon: 'res://icon',
            smallIcon: 'res://icon_small'
          }]);
        }
      }
    }
  }

  ionViewDidLoad() {
    this.load();
  }

}

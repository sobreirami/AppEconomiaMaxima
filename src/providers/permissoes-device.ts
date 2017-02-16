import { Injectable } from '@angular/core';
import { SQLite, Calendar, LocalNotifications } from 'ionic-native';

@Injectable()
export class PermissoesDevice {

  private db: SQLite = null;
  private isOpen: boolean;

  constructor() {
    if(!this.isOpen) {
      this.db = new SQLite();
      this.db.openDatabase({ name: "data.db", location: "default" });
    }
  }

  permissoes() {
    return new Promise((resolve, reject) => {
      this.db.openDatabase({ name: "data.db", location: "default" }).then(() => {
        this.db.executeSql("SELECT * FROM configuracoes LIMIT 1", []).then((data) => {
          let permissoes = {};
          if(data.rows.length > 0) {
            for(let i = 0; i < data.rows.length; i++) {
              permissoes = {
                notificacao: data.rows.item(i).notificacao,
                calendario: data.rows.item(i).calendario,
                horaNotificacao: data.rows.item(i).horaNotificacao
              };
            }
          }
          console.log(permissoes);
          resolve(permissoes);
        }, (error) => {
          console.error("Não foi possivel carregar a tabela configuracoes", error);
          reject(error);
        });
      });
    });
  }

  notificacaoPermission() {
    return new Promise((resolve, reject) => {
      this.db.openDatabase({ name: "data.db", location: "default" }).then(() => {
        this.db.executeSql("SELECT notificacao FROM configuracoes LIMIT 1", []).then((data) => {
          let notificacaoData = {};
          if(data.rows.length > 0) {
            for(let i = 0; i < data.rows.length; i++) {
              let notificacao = data.rows.item(i).notificacao;
              if(notificacao == 1) {
                console.log("Notificacao: " + notificacao);
                LocalNotifications.hasPermission().then((result) => {
                  console.log("Resultado " + result);
                  if(result == false) {
                    LocalNotifications.registerPermission();
                  }
                });
              }
              notificacaoData = {
                notificacao: notificacao
              }
            }
          }
          console.log(notificacaoData);
          resolve(notificacaoData);
        }, (error) => {
          console.error("Não foi possivel carregar a tabela configuracoes", error);
          reject(error);
        });
      });
    });
  }

  calendarPermission() {
    return new Promise((resolve, reject) => {
      this.db.openDatabase({ name: "data.db", location: "default" }).then(() => {
        this.db.executeSql("SELECT calendario, idCalendario FROM configuracoes LIMIT 1", []).then((data) => {
          let caledarioData = {};
          if(data.rows.length > 0) {
            for(let i = 0; i < data.rows.length; i++) {
              let permissao = data.rows.item(i).calendario;
              if(permissao == 1) {
                Calendar.hasReadWritePermission().then((result) => {
                  if(result == false) {
                    Calendar.requestReadWritePermission();
                  }
                });
              }
              caledarioData = {
                permissao: permissao,
                idCalendario: data.rows.item(i).idCalendario
              };
            }
          }
          console.log(caledarioData);
          resolve(caledarioData);
        }, (error) => {
          console.error("Não foi possivel carregar a tabela configuracoes", error);
          reject(error);
        });
      });
    });
  }

  atualizarNotificacaoPermissao(notificacao) {
    return new Promise((resolve, reject) => {
      this.db.executeSql("UPDATE configuracoes SET notificacao = ?", [notificacao]).then((data) => {
        console.log("Notificação atualizada com sucesso");
        resolve(data);
      }, (error) => {
        console.log("Erro ao editar notificação: ", error);
        reject(error);
      });
    });
  }

  atualizarCalendarioPermissao(calendario) {
    return new Promise((resolve, reject) => {
      this.db.executeSql("UPDATE configuracoes SET calendario = ?", [calendario]).then((data) => {
        console.log("Calendario atualizada com sucesso");
        resolve(data);
      }, (error) => {
        console.log("Erro ao editar calendario: ", error);
        reject(error);
      });
    });
  }

  atualizarHoraNotificacao(hora) {
    return new Promise((resolve, reject) => {
      this.db.executeSql("UPDATE configuracoes SET horaNotificacao = ?", [hora]).then((data) => {
        console.log("Hora notificacao atualizada com sucesso");
        resolve(data);
      }, (error) => {
        console.log("Erro ao editar hora notificacao: ", error);
        reject(error);
      });
    });
  }

}

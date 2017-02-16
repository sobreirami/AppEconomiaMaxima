import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

@Injectable()
export class DbUsuarios {

  private db: SQLite = null;
  private isOpen: boolean;

  constructor() {
    if(!this.isOpen) {
      this.db = new SQLite();
      this.db.openDatabase({ name: "data.db", location: "default" });
    }
  }

  public getUser() {
    return new Promise((resolve, reject) => {
        this.db.openDatabase({ name: "data.db", location: "default" }).then(() => {
          this.db.executeSql("SELECT * FROM usuarios LIMIT 1",[]).then((data) => {
            if(data.rows.length > 0) {
              for(let i = 0; i < data.rows.length; i++) {
                let usuario = {
                  id: data.rows.item(i).id,
                  username: data.rows.item(i).username,
                  password: data.rows.item(i).password,
                  token: data.rows.item(i).token
                }
                console.log("Usuário carregado com sucesso");
                resolve(usuario);
              }
            }
          }, (error) => {
            console.error("Não foi possivel carregar o usuário", error);
            reject(false);
          });
        });
    });
  }

  public biometriaUser(token) {
    return new Promise((resolve, reject) => {
      this.db.executeSql("UPDATE usuarios SET token = ? where username = 'economiamaxima'", [token]).then((data) => {
        console.log("Biometria alterada com sucesso");
        resolve(data);
      }, (error) => {
        console.log("Erro ao alterar biometria: ", error);
        reject(error);
      });
    });
  }

  public senhaUser(password) {
    return new Promise((resolve, reject) => {
      this.db.executeSql("UPDATE usuarios SET password = ? where username = 'economiamaxima'", [password]).then((data) => {
        console.log("Senha alterada com sucesso");
        resolve(data);
      }, (error) => {
        console.log("Erro ao alterar senha: ", error);
        reject(error);
      });
    });
  }

}

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
                  email: data.rows.item(i).email,
                  password: data.rows.item(i).password,
                  token: data.rows.item(i).token,
                  imagem: data.rows.item(i).imagem,
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
      this.db.executeSql("UPDATE usuarios SET token = ?", [token]).then((data) => {
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
      this.db.executeSql("UPDATE usuarios SET password = ?", [password]).then((data) => {
        console.log("Senha alterada com sucesso");
        resolve(data);
      }, (error) => {
        console.log("Erro ao alterar senha: ", error);
        reject(error);
      });
    });
  }

  public editUser(user) {
    return new Promise((resolve, reject) => {

      console.log(user.email);

      this.db.executeSql("UPDATE usuarios SET username = ?, email = ?, imagem = ?",
      [user.username, user.email, user.imagem]).then((data) => {
        console.log("Usuário alterada com sucesso");
        resolve(data);
      }, (error) => {
        console.log("Erro ao alterar usuário: ", error);
        reject(error);
      });
    });
  }

}

import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

@Injectable()
export class DbFornecedores {

  private db: SQLite = null;
  private isOpen: boolean;

  constructor() {
    if(!this.isOpen) {
      this.db = new SQLite();
      this.db.openDatabase({ name: "data.db", location: "default" });
    }
  }

  public getList() {
    return new Promise((resolve, reject) => {
      this.db.openDatabase({ name: "data.db", location: "default" }).then(() => {
        this.db.executeSql("SELECT id, descricao FROM fornecedores ORDER BY descricao ASC", {}).then((data) => {
          let fornecedores = [];

          if(data.rows.length > 0) {
            for(let i = 0; i < data.rows.length; i++) {
              fornecedores.push({
                id: data.rows.item(i).id,
                descricao: data.rows.item(i).descricao
              });
            }
          }
          console.log("Tabela fornecedores carregada com sucesso");
          resolve(fornecedores);
        }, (error) => {
          console.error("Não foi possivel carregar a tabela fornecedores", error);
          reject(error);
        });
      });
    });
  }

  public insert(fornecedor) {
    return new Promise((resolve, reject) => {
      this.db.executeSql("INSERT INTO fornecedores (descricao) VALUES (?)", [fornecedor.descricao]).then((data) => {
        fornecedor.id = data.insertId;
        console.log("Inserido com sucesso na tabela fornecedores");
        resolve(data);
      }, (error) => {
        console.log("Erro ao inserir na tabela fornecedores");
        reject(error);
      });
    });
  }

  public edit(fornecedor) {
    return new Promise((resolve, reject) => {
      this.db.executeSql("UPDATE fornecedores SET descricao = ? where id = ?", [fornecedor.descricao, fornecedor.id]).then((data) => {
        console.log("Fornecedor editado com sucesso");
        resolve(data);
      }, (error) => {
        console.log("Erro ao editar fornecedor: ", error);
        reject(error);
      });
    });
  }

  public delete(fornecedor) {
    return new Promise((resolve, reject) => {
      this.db.executeSql("DELETE FROM fornecedores WHERE id = ?", [fornecedor.id]).then((data) => {
        console.log("Fornecedor excluído com sucesso");
        resolve(data);
      }, (error) => {
        console.log("Erro ao excluir fornecedor: ", error);
        reject(error);
      });
    });
  }

}

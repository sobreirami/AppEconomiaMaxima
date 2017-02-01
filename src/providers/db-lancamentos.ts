import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

@Injectable()
export class DbLancamentos {

  private db: SQLite = null;
  private isOpen: boolean;

  constructor() {
    if(!this.isOpen) {
      this.db = new SQLite();
      this.db.openDatabase({ name: "data.db", location: "default" });
    }
  }

  public getList(dataInicio, dataFim) {
    return new Promise((resolve, reject) => {
      this.db.openDatabase({ name: "data.db", location: "default" }).then(() => {
        this.db.executeSql("SELECT * FROM lancamentos WHERE data >= ? and data <= ? ORDER BY data ASC",
        [dataInicio.getTime(), dataFim.getTime()]).then((data) => {
          let lancamentos = [];

          if(data.rows.length > 0) {
            for(let i = 0; i < data.rows.length; i++) {
              lancamentos.push({
                id: data.rows.item(i).id,
                descricao: data.rows.item(i).descricao,
                valor: data.rows.item(i).valor,
                data: data.rows.item(i).data,
                fornecedor: data.rows.item(i).fornecedor,
                entradaSaida: data.rows.item(i).entradaSaida,
                pago: data.rows.item(i).pago
              });
            }
          }
          console.log("Tabela lançamentos carregada com sucesso");
          resolve(lancamentos);
        }, (error) => {
          console.error("Não foi possivel carregar a tabela lançamentos", error);
          reject(error);
        });
      });
    });
  }

  public insert(lancamento) {
    return new Promise((resolve, reject) => {
      this.db.executeSql("INSERT INTO lancamentos(descricao, valor, data, fornecedor, entradaSaida, pago) VALUES (?, ?, ?, ?, ?, ?)", [lancamento.descricao, lancamento.valor, lancamento.data,
        lancamento.fornecedor, lancamento.entradaSaida, lancamento.pago]).then((data) => {
        lancamento.id = data.insertId;
        console.log("Inserido com sucesso na tabela lancamentos");
        resolve(data);
      }, (error) => {
        console.log("Erro ao inserir na tabela lancamentos");
        reject(error);
      });
    });
  }

  public edit(lancamento) {
    return new Promise((resolve, reject) => {
      this.db.executeSql("UPDATE lancamentos SET descricao = ?, valor = ?, data = ?, fornecedor = ?, entradaSaida = ?, pago = ? WHERE id = ?", [lancamento.descricao, lancamento.valor,
      lancamento.data, lancamento.fornecedor, lancamento.entradaSaida, lancamento.pago, lancamento.id]).then((data) => {
        console.log("Lançamento editado com sucesso");
        resolve(data);
      }, (error) => {
        console.log("Erro ao editar lançamento: ", error);
        reject(error);
      });
    });
  }

  public delete(lancamento) {
    return new Promise((resolve, reject) => {
      this.db.executeSql("DELETE FROM lancamentos WHERE id = ?", [lancamento.id]).then((data) => {
        console.log("Fornecedor excluído com sucesso");
        resolve(data);
      }, (error) => {
        console.log("Erro ao excluir fornecedor: ", error);
        reject(error);
      });
    });
  }

  public getSaldo() {
    return new Promise((resolve, reject) => {
      this.db.openDatabase({ name: "data.db", location: "default" }).then(() => {
        this.db.executeSql(`SELECT TOTAL(valor) as saldo, entradaSaida from lancamentos
          where pago = 1 and entradaSaida = 'entrada'
          UNION
          SELECT TOTAL(valor), entradaSaida as saldo from lancamentos
          where pago = 1 and entradaSaida = 'saida'`,[]).then((data) => {
          let saldo = 0;

          if(data.rows.length > 0) {
            for(let i = 0; i < data.rows.length; i++) {
              let lancamento = data.rows.item(i);

              if (lancamento.entradaSaida == "entrada")
                saldo += lancamento.saldo;
              else
                saldo -= lancamento.saldo;
            }
          }
          console.log("Saldo carregado com sucesso");
          resolve(saldo);
        }, (error) => {
          console.error("Não foi possivel carregar o saldo", error);
          reject(error);
        });
      });
    });
  }

  public getListGroupByConta(dataInicio, dataFim, entradaSaida) {
    return new Promise((resolve, reject) => {
      this.db.openDatabase({ name: "data.db", location: "default" }).then(() => {
        this.db.executeSql(`
          SELECT fornecedor, TOTAL(valor) as saldoFornecedor FROM lancamentos
          where data >= ? and data <= ? and entradaSaida = ?
          and pago = 1
          GROUP BY fornecedor
          `, [dataInicio.getTime(), dataFim.getTime(), entradaSaida]).then((data) => {
            let lista = [];

            if(data.rows.length > 0) {
              for(let i = 0; i < data.rows.length; i++) {

                let item = data.rows.item(i);
                let fornecedor = {
                  fornecedor: item.fornecedor,
                  saldo: item.saldoFornecedor,
                  percentual: 0
                };
                lista.push(fornecedor);
              }
              console.log("getListGroupByConta carregada com sucesso");
              resolve(lista);
            }
          }, (error) => {
            console.error("Não foi possivel carregar getListGroupByConta", error);
            reject(error);
          });
        });
      });
  }

}

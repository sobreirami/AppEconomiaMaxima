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

  public getSaldo(dataInicio, dataFim) {
    return new Promise((resolve, reject) => {
      this.db.openDatabase({ name: "data.db", location: "default" }).then(() => {
        this.db.executeSql(`SELECT TOTAL(valor) as saldo, entradaSaida, 1 as TP from lancamentos
        WHERE pago = 1 AND entradaSaida = 'entrada' AND data >= ? and data <= ?
        UNION
        SELECT TOTAL(valor) as saldo, entradaSaida, 2 as TP  from lancamentos
        where pago = 1 AND entradaSaida = 'saida' AND data >= ? and data <= ?
        UNION
        SELECT TOTAL(valor) as saldo, entradaSaida, 3 as TP  from lancamentos
        where pago = 1 AND entradaSaida = 'entrada' AND data < ?
        UNION
        SELECT TOTAL(valor) as saldo, entradaSaida, 4 as TP  from lancamentos
        where pago = 1 AND entradaSaida = 'saida' AND data < ?
        UNION
        SELECT TOTAL(valor) as saldo, entradaSaida, 5 as TP  from lancamentos
        where pago = 0 AND entradaSaida = 'entrada' AND data >= ? and data <= ?
        UNION
        SELECT TOTAL(valor) as saldo, entradaSaida, 6 as TP  from lancamentos
        where pago = 0 AND entradaSaida = 'saida' AND data >= ? and data <= ?`,
        [
          dataInicio.getTime(), dataFim.getTime(),
          dataInicio.getTime(), dataFim.getTime(),
          dataInicio.getTime(),
          dataInicio.getTime(),
          dataInicio.getTime(), dataFim.getTime(),
          dataInicio.getTime(), dataFim.getTime()
        ]).then((data) => {

          let saldo = 0;
          let totalEntrada = 0;
          let totalSaida = 0;
          let saldoMesPassado = 0;
          let totalReceber = 0;
          let totalPagar = 0;

          if(data.rows.length > 0) {
            for(let i = 0; i < data.rows.length; i++) {
              let lancamento = data.rows.item(i);

              if (lancamento.entradaSaida == "entrada") {
                if(lancamento.TP == 1) {
                  saldo += lancamento.saldo;
                  totalEntrada = lancamento.saldo;
                } else if(lancamento.TP == 3) {
                  saldo += lancamento.saldo;
                  saldoMesPassado += lancamento.saldo;
                } else if(lancamento.TP == 5) {
                  totalReceber += lancamento.saldo;
                }
              } else {
                if(lancamento.TP == 2) {
                  saldo -= lancamento.saldo;
                  totalSaida = lancamento.saldo;
                } else if(lancamento.TP == 4) {
                  saldo -= lancamento.saldo;
                  saldoMesPassado -= lancamento.saldo;
                } else if(lancamento.TP == 6) {
                  totalPagar += lancamento.saldo;
                }
              }
            }
          }

          let indicadores = {
            totalEntrada: totalEntrada,
            totalSaida: totalSaida,
            saldo: saldo,
            saldoMesPassado: saldoMesPassado,
            totalReceber: totalReceber,
            totalPagar: totalPagar
          };
          console.log("Saldo carregado com sucesso");
          resolve(indicadores);
        }, (error) => {
          console.error("Não foi possivel carregar o saldo", error);
          reject(false);
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
            } else {
              resolve(false);
            }
          }, (error) => {
            console.error("Não foi possivel carregar getListGroupByConta", error);
            reject(error);
          });
        });
      });
  }
}

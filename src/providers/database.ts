import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

@Injectable()
export class Database {

  private db: SQLite = null;

  constructor() {
    this.db = new SQLite();
  }

  createTable(){
    let sqlLancamentos = 'CREATE TABLE IF NOT EXISTS lancamentos(id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, valor REAL, data INTEGER, fornecedor TEXT, entradaSaida TEXT, pago INTEGER)';
    this.db.executeSql(sqlLancamentos, []);

    let sqlFornecedores = 'CREATE TABLE IF NOT EXISTS fornecedores(id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT)';
    this.db.executeSql(sqlFornecedores, []);

    let sqlUsuarios = 'CREATE TABLE IF NOT EXISTS usuarios(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, token TEXT)';
    this.db.executeSql(sqlUsuarios, []);

    let sqlCriaUsuario = "INSERT OR REPLACE INTO usuarios (username) VALUES ('economiamaxima')"
    this.db.executeSql(sqlCriaUsuario, []);

    let sqlConfiguracoes = "CREATE TABLE IF NOT EXISTS configuracoes(id INTEGER PRIMARY KEY AUTOINCREMENT, calendario INTEGER, notificacao INTEGER, idCalendario INTEGER)";
    this.db.executeSql(sqlConfiguracoes, []).then(() => {
      this.db.executeSql("SELECT * FROM configuracoes LIMIT 1", []).then((data) => {
        if(data.rows.length == 0) {
          this.db.executeSql("INSERT INTO configuracoes (calendario, notificacao) VALUES (?, ?)", [1, 1]);
          console.log("Permissoes padroes setada com sucesso");
        }
      } , (error) => {
        console.log(error);
      });
    });


    this.db.executeSql("SELECT * FROM fornecedores", []).then((data) => {
        if(data.rows.length == 0) {
          let sqlFornecedoresPadroes = "INSERT INTO fornecedores ( descricao ) VALUES ('Tim'),('Oi'),('Claro'),('Vivo'),('Banco do Brasil'),('Itaú'),('Tim'),('Bradesco'),('Banco Santander'),('Caixa Econômica Federal'),('Banco HSBC'),('Sabesp'),('Eletropaulo'),('Mercado'),('Posto de Gasolina'),('Saúde'),('Lazer'),('Outros'),('Salário'),('Educação'),('Estacionamento')";
          this.db.executeSql(sqlFornecedoresPadroes,[]).then((data) => {
            console.log("Fornecedores padrões lançados com sucesso!");
          }, (error) => {
            console.log(error);
          });
        }
    } , (error) => {
      console.log(error);
    });

    let sqlConfiguracoesAlterTable = "ALTER TABLE configuracoes ADD COLUMN horaNotificacao INTEGER";
    this.db.executeSql(sqlConfiguracoesAlterTable, []).then(() => {
      this.db.executeSql("UPDATE configuracoes SET horaNotificacao = ?", [8]).then((data) => {
        console.log("Hora notificacao padrao setada com sucesso");
      } , (error) => {
        console.log(error);
      });
    }, (error) => {
      console.log(error);
    });

  }

  openDatabase(){
    return this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    });
  }

}

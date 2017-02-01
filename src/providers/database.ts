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
  }

  openDatabase(){
    return this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    });
  }

}

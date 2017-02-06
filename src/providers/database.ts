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
  }

  openDatabase(){
    return this.db.openDatabase({
      name: 'data.db',
      location: 'default' // the location field is required
    });
  }

}

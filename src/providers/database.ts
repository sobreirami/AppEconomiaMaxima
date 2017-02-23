import { Injectable } from '@angular/core';
import { SQLite } from 'ionic-native';

@Injectable()
export class Database {

  private db: SQLite = null;

  constructor() {
    this.db = new SQLite();
  }

  createTable(){
    return new Promise((resolve, reject) => {
      let sqlLancamentos = 'CREATE TABLE IF NOT EXISTS lancamentos(id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, valor REAL, data INTEGER, fornecedor TEXT, entradaSaida TEXT, pago INTEGER)';
      this.db.executeSql(sqlLancamentos, []);

      let sqlFornecedores = 'CREATE TABLE IF NOT EXISTS fornecedores(id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT)';
      this.db.executeSql(sqlFornecedores, []).then((data) => {

        let sqlFornecedoresUnicos = 'CREATE UNIQUE INDEX IF NOT EXISTS ux_fornecedor_unique ON fornecedores(descricao)';
        this.db.executeSql(sqlFornecedoresUnicos, []);

        this.db.executeSql("SELECT * FROM fornecedores", []).then((data) => {

          console.log("data.rows.length : " + data.rows.length);

            if(data.rows.length == 0) {
              console.log("data.rows.length : " + data.rows.length);
              let sqlFornecedoresPadroes = "INSERT OR REPLACE INTO fornecedores ( descricao ) VALUES ('Tim'),('Oi'),('Claro'),('Vivo'),('Banco do Brasil'),('Itaú'),('Tim'),('Bradesco'),('Banco Santander'),('Caixa Econômica Federal'),('Banco HSBC'),('Sabesp'),('Eletropaulo'),('Mercado'),('Posto de Gasolina'),('Saúde'),('Lazer'),('Outros'),('Salário'),('Educação'),('Estacionamento'),('Veterinário'),('Convênio médico'),('Convênio odontológico')";
              this.db.executeSql(sqlFornecedoresPadroes,[]).then((data) => {
                console.log("Fornecedores padrões lançados com sucesso!");
              }, (error) => {
                console.log(error);
              });
            }
        } , (error) => {
          console.log(error);
        });

      }, (error) => {
        console.log(error);
      });

      let sqlUsuarios = 'CREATE TABLE IF NOT EXISTS usuarios(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, token TEXT)';
      this.db.executeSql(sqlUsuarios, []).then((data) => {
        let sqlUsuariosUnicos = 'CREATE UNIQUE INDEX IF NOT EXISTS ux_usuario_unique ON usuarios(username)';
        this.db.executeSql(sqlUsuariosUnicos, []).then(() => {
          this.db.executeSql("SELECT * FROM usuarios", []).then((data) => {
            if(data.rows.length == 0) {
              console.log('usuario setado com sucesso!');
              let sqlCriaUsuario = "INSERT OR REPLACE INTO usuarios (username) VALUES ('')"
              this.db.executeSql(sqlCriaUsuario, []);
            }
          });
        });

        console.log('User antes alter');

        let sqlAlterUsuariosEmail = "ALTER TABLE usuarios ADD COLUMN email TEXT";
        this.db.executeSql(sqlAlterUsuariosEmail, []).then(() => {
          console.log("Alter email usuarios realizado com sucesso!");
        }, (error) => {
          console.log(error);
        });

        let sqlAlterUsuariosImagem = "ALTER TABLE usuarios ADD COLUMN imagem TEXT";
        this.db.executeSql(sqlAlterUsuariosImagem, []).then(() => {
          console.log("Alter imagem usuarios realizado com sucesso!");
        }, (error) => {
          console.log(error);
        });

      }, (error) => {
        console.log(error);
      });

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

        let sqlConfiguracoesAlterTable = "ALTER TABLE configuracoes ADD COLUMN horaNotificacao INTEGER";
        this.db.executeSql(sqlConfiguracoesAlterTable, []).then(() => {
          this.db.executeSql("UPDATE configuracoes SET horaNotificacao = 8", []).then((data) => {
            console.log("Hora notificacao padrao setada com sucesso");
          } , (error) => {
            console.log(error);
          });
        }, (error) => {
          console.log(error);
        });

      });

      setTimeout(function(){ return resolve(true); }, 3000);
    });
  }

  openDatabase(){
    return this.db.openDatabase({
      name: 'data.db',
      location: 'default'
    });
  }

}

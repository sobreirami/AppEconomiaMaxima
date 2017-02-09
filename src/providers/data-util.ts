import { Injectable } from '@angular/core';

@Injectable()
export class DataUtil {

  parseCalendar(dataMiliseconds, horaNotificacoes) {

    if(horaNotificacoes == null) {
      horaNotificacoes = 8;
    }

    let data = new Date(dataMiliseconds);
    let ano = data.getFullYear();
    let mes = data.getMonth();
    let dia = data.getDate();
    let hora = data.getHours() + horaNotificacoes;
    return new Date(ano, mes, dia, hora);
  }

  parseCompare(data1, horaNotificacoes) {

    if(horaNotificacoes == null) {
      horaNotificacoes = 8;
    }

    let data = new Date(data1);
    let ano = data.getFullYear();
    let mes = data.getMonth();
    let dia = data.getDate();
    let hora = data.getHours() + horaNotificacoes;
    data1 = new Date(ano, mes, dia, hora);

    data = new Date();
    ano = data.getFullYear();
    mes = data.getMonth();
    dia = data.getDate();
    hora = data.getHours();
    let data2 = new Date(ano, mes, dia, hora);

    if(data1.getTime() < data2.getTime()) {
      return 'Menor';
    } else {
      return 'Maior';
    }
  }

  parseData(data) {
    var parts = data.split("-");
    return new Date(parts[0], parts[1]-1, parts[2]);
  }

  parseString(data) {
    return new Date(data).toLocaleDateString();
  }

  formatDate(dataMiliseconds) {
    let data = new Date(dataMiliseconds);
    let inicio = "00";

    let ano = data.getFullYear();
    let mes = (inicio + ( data.getMonth() + 1)).slice(-inicio.length);
    let dia = (inicio + data.getDate()).slice(-inicio.length);

    return ano + "-" + mes + "-" + dia;
  }

  getMonthName(data) {
    let meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return meses[data.getMonth()];
  }

  getFirstDay(data) {
    let ano = data.getFullYear();
    let mes = data.getMonth();

    return new Date(ano, mes, 1);
  }

  getLastDay(data) {
    let ano = data.getFullYear();
    let mes = data.getMonth() + 1;

    return new Date(ano, mes, 0);
  }

}

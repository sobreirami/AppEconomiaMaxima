import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { FornecedoresPage } from '../pages/fornecedores/fornecedores'
import { DbFornecedores } from '../providers/db-fornecedores'
import { ModalFornecedoresPage } from '../pages/modal-fornecedores/modal-fornecedores'
import { LancamentosPage } from '../pages/lancamentos/lancamentos'
import { DbLancamentos } from '../providers/db-lancamentos'
import { DataUtil } from '../providers/data-util'
import { ModalLancamentosPage } from '../pages/modal-lancamentos/modal-lancamentos'
import { DataFilterComponent } from '../components/data-filter/data-filter'
import { RelatorioLancamentosPage } from '../pages/relatorio-lancamentos/relatorio-lancamentos'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    FornecedoresPage,
    ModalFornecedoresPage,
    LancamentosPage,
    ModalLancamentosPage,
    DataFilterComponent,
    RelatorioLancamentosPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'top',
      tabsHideOnSubPages: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    FornecedoresPage,
    ModalFornecedoresPage,
    LancamentosPage,
    ModalLancamentosPage,
    DataFilterComponent,
    RelatorioLancamentosPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
     DbFornecedores, DbLancamentos, DataUtil
  ]
})
export class AppModule {}
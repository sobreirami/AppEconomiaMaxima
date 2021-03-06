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
import { DbUsuarios } from '../providers/db-usuarios'
import { ModalLancamentosPage } from '../pages/modal-lancamentos/modal-lancamentos'
import { DataFilterComponent } from '../components/data-filter/data-filter'
import { RelatorioLancamentosPage } from '../pages/relatorio-lancamentos/relatorio-lancamentos'
import { Database } from '../providers/database'
import { PopoverPage } from '../pages/popover/popover'
import { ModalFiltroRelatorioLancamentosPage } from '../pages/modal-filtro-relatorio-lancamentos/modal-filtro-relatorio-lancamentos'
import { ConfigucacoesPage } from '../pages/configucacoes/configucacoes'
import { SegurancaPage } from '../pages/seguranca/seguranca'
import { SenhaAcessoPage } from '../pages/senha-acesso/senha-acesso'
import { LoginPage } from '../pages/login/login';
import { PermissoesDevice } from '../providers/permissoes-device'
import { NotificacoesPage } from '../pages/notificacoes/notificacoes'
import { FornecedoresPadroesPage } from '../pages/fornecedores-padroes/fornecedores-padroes'
import { PerfilPage } from '../pages/perfil/perfil'

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
    RelatorioLancamentosPage,
    PopoverPage,
    ModalFiltroRelatorioLancamentosPage,
    ConfigucacoesPage,
    SegurancaPage,
    SenhaAcessoPage,
    LoginPage,
    NotificacoesPage,
    FornecedoresPadroesPage,
    PerfilPage
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
    RelatorioLancamentosPage,
    PopoverPage,
    ModalFiltroRelatorioLancamentosPage,
    ConfigucacoesPage,
    SegurancaPage,
    SenhaAcessoPage,
    LoginPage,
    NotificacoesPage,
    FornecedoresPadroesPage,
    PerfilPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
     Database, DbFornecedores, DbLancamentos, DataUtil, DbUsuarios,
     PermissoesDevice
  ]
})
export class AppModule {}

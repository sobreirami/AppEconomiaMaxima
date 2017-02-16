import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { LancamentosPage } from '../lancamentos/lancamentos';
import { FornecedoresPage } from '../fornecedores/fornecedores'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = LancamentosPage;
  tab3Root: any = FornecedoresPage;

  constructor() {
     
  }
}

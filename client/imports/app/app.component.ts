import { Component } from '@angular/core';
import template from './app.component.html';
import { AccountsService } from './services/accounts.service';
import { NavigationService } from './services/navigation.service';

declare var EthTools;

@Component({
  selector: 'app-root',
  template
})
export class AppComponent {

  currentUser: any;
  currencies = ['ether', 'usd', 'eur', 'btc', 'finney', 'wei'];
  formData: any = {};

  constructor(private accountsService: AccountsService,
              private navigationService: NavigationService) {
    this._initAutorun();
  }

  _initAutorun() {
    Tracker.autorun(() => {
      this.formData.currency = EthTools.getUnit();
    });
  }

  changeCurrency() {
    if (this.formData.currency) {
      EthTools.setUnit(this.formData.currency);
    }
  }

  logout() {

  }

  get isLoggedIn() {
    return true;
  }

}
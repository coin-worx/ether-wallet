import { Component, OnInit } from '@angular/core';
import template from './app.component.html';
import { AccountsService } from './core/services/accounts.service';

declare var EthTools;

@Component({
  selector: 'app-root',
  template
})
export class AppComponent implements OnInit {

  currentUser: any;
  currencies = ['ether', 'usd', 'eur', 'btc', 'finney', 'wei'];
  formData: any = {};

  constructor(private accountsService: AccountsService) {
  }

  ngOnInit(): void {
    this._initAutorun();
  }

  _initAutorun() {
    Tracker.autorun(() => {
      this.formData.currency = EthTools.getUnit();
      this.currentUser = this.accountsService.getCurrentUserAccount();
    });
  }

  changeCurrency() {
    if (this.formData.currency) {
      EthTools.setUnit(this.formData.currency);
    }
  }

  logout() {
    this.accountsService.logout();
  }

  get isLoggedIn() {
    return this.accountsService.isLoggedIn();
  }

}
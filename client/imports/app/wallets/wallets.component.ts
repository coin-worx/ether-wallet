/*****************************************************************************
 * Copyright 2016 Aurora Solutions
 *
 *    http://www.aurorasolutions.io
 *
 * Aurora Solutions is an innovative services and product company at
 * the forefront of the software industry, with processes and practices
 * involving Domain Driven Design(DDD), Agile methodologies to build
 * scalable, secure, reliable and high performance products.
 *
 * Ether Wallet is a Cryptocurrency Wallet Dapp for Ethereum.
 * Developed with MeteorJS, Angular2, MongoDB and JQuery on the Ethereum
 * platform, the Dapp can be used to transfer funds, manage shared wallets
 * and start crowdfunding campaigns using the blockchain functionality of
 * Ethereum.
 * Key features: Account and permission management, Wallet creation,
 * Withdrawals and Deposits in the Wallet, funds transfer,
 * view Crypto and Fiat Currency conversion rates, etc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *****************************************************************************/

import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Wallets } from '../../../../collections/wallets.collection';
import { AccountsService } from '../core/services/accounts.service';

import template from './wallets.component.html';

declare var web3;

@Component({
  selector: 'wallets-list',
  template
})
export class WalletsComponent implements OnInit {
  private wallets: Mongo.Cursor<Wallet>;
  private autorunComputation: Tracker.Computation;
  private currentUser: Account;
  private isCreateWallet: boolean = false;
  private formData: any = {};

  constructor(private accountsService: AccountsService,
              private router: Router,
              private zone: NgZone) {
    this._initAutorun();
  }

  ngOnInit() {
    this.resetData();
    this.resetErrors();
  }

  _initAutorun(): void {
    let self = this;
    this.autorunComputation = Tracker.autorun(() => {
      this.zone.run(() => {
        if (!self.accountsService.isLoggedIn() && !self.accountsService.isLoggingIn()) {
          self.router.navigate(['/login']);
        }
        else {
          self.currentUser = self.accountsService.getCurrentUserAccount();
          if (self.currentUser) {
            self.wallets = Wallets.find({$or: [{'owner.email': self.currentUser.email}, {'contributors.email': self.currentUser.email}]});
          }
        }
      });
    });
  }

  resetData() {
    this.formData.wallet_title = '';
    this.formData.isCreating = false;
  }

  resetErrors() {
    this.formData.message = '';
    this.formData.errors = [];
  }

  createWallet(e) {
    e.preventDefault();
    this.formData.isCreating = true;
    this.resetErrors();
    if (this.currentUser) {
      let wallet_title = this.formData.wallet_title;
      let random_str = null;
      while (random_str == null) {
        random_str = (Math.random() + 10).toString(36).substr(2, 10);
      }
      let self = this;
      web3.personal.newAccount(random_str, function(error, result) {
        if (!error) {
          Wallets.insert({
            title: wallet_title,
            balance: 0,
            owner: self.currentUser,
            eth_address: result,
            eth_password: random_str,
            created_at: new Date()
          });
          self.formData.message = 'Wallet created successfully.';
          self.resetData();
          self.isCreateWallet = false;
        }
        else {
          self.formData.errors.push('Unable to create wallet. Please try again!');
          self.formData.isCreating = false;
        }
      });
    }
    else {
      this.formData.errors.push('Some error occurred. Please refresh the page and try again.');
      this.formData.isCreating = false;
    }
  }
}
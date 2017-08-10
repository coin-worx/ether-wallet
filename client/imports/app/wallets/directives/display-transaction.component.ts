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

import { Component, Input, OnInit } from '@angular/core';
import { AccountsService } from '../../core/services/accounts.service';

import template from './display-transaction.component.html';

@Component({
  selector: '[display-transaction]',
  template
})
export class DisplayTransactionComponent implements OnInit {
  @Input()
  private transaction: Transaction;
  @Input()
  private wallet: Wallet;
  private userAccount: Account;

  constructor(private accountsService: AccountsService) {
  }

  ngOnInit() {
    if (this.transaction.from_address == this.wallet.eth_address) {
      this.userAccount = this.accountsService.findUserAccount(this.transaction.to_address, 'profile.eth_address');
    }
    else if (this.transaction.to_address == this.wallet.eth_address) {
      this.userAccount = this.accountsService.findUserAccount(this.transaction.from_address, 'profile.eth_address');
    }
  }
}
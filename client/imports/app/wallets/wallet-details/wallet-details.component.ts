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
import { ActivatedRoute, Router } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { Transactions } from '../../../../../collections/transactions.collection';
import { Wallets } from '../../../../../collections/wallets.collection';
import { AccountsService } from '../../core/services/accounts.service';

import template from './wallet-details.component.html';

declare var EthAccounts;
declare var EthTools;
declare var web3;

@Component({
  selector: 'wallet-details',
  template
})
export class WalletDetailsComponent implements OnInit {
  private autorunComputation: Tracker.Computation;
  private walletId: string;
  private wallet: Wallet;
  private currentUser: Account;
  private formData: any = {};
  private wallet_permissions: Array<any>;
  private isAddContributor: boolean = false;
  private isWithdraw: boolean = false;
  private isDeposit: boolean = false;
  private wallet_transactions: Mongo.Cursor<Transaction>;

  constructor(private route: ActivatedRoute,
              private zone: NgZone,
              private accountsService: AccountsService,
              private router: Router) {
    this.wallet_permissions = [
      {value: 'view_only', label: 'View only'},
      {value: 'admin', label: 'Admin'},
      {value: 'int_trans', label: 'Internal transfers only'},
      {value: 'ext_int_trans', label: 'External and Internal transfers only'}
    ];
    this._initAutorun();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.walletId = params['walletId'];
      let self = this;
      Tracker.autorun(() => {
        self.zone.run(() => {
          self.currentUser = self.accountsService.getCurrentUserAccount();
          if (self.currentUser) {
            self.wallet = Wallets.findOne({$and: [{_id: self.walletId}, {$or: [{'owner.email': self.currentUser.email}, {'contributors.email': self.currentUser.email}]}]});
            if (self.wallet) {
              let wallet_ethAccount = EthAccounts.findOne({address: self.wallet.eth_address});
              if (wallet_ethAccount && self.wallet.balance != wallet_ethAccount.balance) {
                Wallets.update({_id: self.wallet._id}, {$set: {balance: wallet_ethAccount.balance}});
              }
              self.wallet_transactions = Transactions.find({$or: [{from_address: self.wallet.eth_address}, {to_address: self.wallet.eth_address}]});
            }
            else {
              self.router.navigate(['/wallets']);
            }
          }
        });
      });
    });
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
          // self.currentUser = self.accountsService.getCurrentUserAccount();
        }
      });
    });
  }

  resetData(type = 'all') {
    switch (type) {
      case 'contributor':
        this.formData.contributor_email = '';
        this.formData.contributor_permission = this.wallet_permissions[0].value;
        this.formData.isAddingContributor = false;
        this.formData.isUpdatingContributor = false;
        break;
      case 'withdraw':
        this.formData.target_email = '';
        this.formData.withdraw_amount = 0;
        this.formData.isWithdrawing = false;
        break;
      case 'deposit':
        this.formData.eth_password = '';
        this.formData.deposit_amount = 0;
        this.formData.isDepositing = false;
        break;
      case 'all':
        this.formData.contributor_email = '';
        this.formData.contributor_permission = this.wallet_permissions[0].value;
        this.formData.target_email = '';
        this.formData.withdraw_amount = 0;
        this.formData.eth_password = '';
        this.formData.deposit_amount = 0;
        this.formData.isAddingContributor = false;
        this.formData.isUpdatingContributor = false;
        this.formData.isWithdrawing = false;
        this.formData.isDepositing = false;
        break;
    }
  }

  resetErrors(type = 'all') {
    switch (type) {
      case 'contributor':
        this.formData.contributor_message = '';
        this.formData.contributor_errors = [];
        break;
      case 'withdraw':
        this.formData.withdraw_message = '';
        this.formData.withdraw_errors = [];
        break;
      case 'deposit':
        this.formData.deposit_message = '';
        this.formData.deposit_errors = [];
        break;
      case 'delete-wallet':
        this.formData.wallet_delete_errors = [];
        break;
      case 'all':
        this.formData.contributor_message = '';
        this.formData.contributor_errors = [];
        this.formData.withdraw_message = '';
        this.formData.withdraw_errors = [];
        this.formData.deposit_message = '';
        this.formData.deposit_errors = [];
        this.formData.wallet_delete_errors = [];
        break;
    }

  }

  checkPermission(permission: string = 'view_only'): boolean {
    let userId = this.currentUser._id;
    return this.wallet.owner._id == userId || this.wallet.permissions[userId] == permission;
  }

  getPermissionLabel(contributor: Account) {
    let contr_permission = this.wallet.permissions[contributor._id];
    if (contr_permission) {
      return this.wallet_permissions.find((permission) => {
        return permission.value == contr_permission;
      }).label;
    }
  }

  addContributor(e) {
    e.preventDefault();
    this.formData.isAddingContributor = true;
    this.resetErrors();
    if (this.wallet) {
      if (this.checkPermission('admin')) {
        if (this.formData.isUpdatingContributor && this.formData.contributor_account) {
          this.wallet.permissions[this.formData.contributor_account._id] = this.formData.contributor_permission;
          Wallets.update({_id: this.walletId}, {
            $set: {permissions: this.wallet.permissions}
          });
          this.formData.contributor_message = 'Contributor\'s permission updated successfully.';
          this.resetData('contributor');
          this.isAddContributor = false;
        }
        else {
          let contributor_email = this.formData.contributor_email;
          let contributor: any = Meteor.users.findOne({'emails.address': contributor_email});
          if (contributor) {
            if (contributor_email == this.wallet.owner.email) {
              this.formData.contributor_errors.push('You cannot add owner of wallet as contributor.');
            }
            else {
              let checkContributor = Wallets.findOne({$and: [{_id: this.wallet._id}, {'contributors.email': contributor.emails[0].address}]});
              if (checkContributor) {
                this.formData.contributor_errors.push('Contributor is already added in wallet.');
              }
              else {
                let contributor_account: Account = {
                  _id: contributor._id,
                  name: contributor.profile.name,
                  email: contributor.emails[0].address,
                  eth_address: contributor.profile.eth_address,
                  identicon: blockies.create({
                    seed: contributor.eth_address,
                    size: 8,
                    scale: 8
                  }).toDataURL()
                };

                if (!this.wallet.permissions) {
                  this.wallet.permissions = {};
                }
                this.wallet.permissions[contributor_account._id] = this.formData.contributor_permission;
                Wallets.update({_id: this.walletId}, {
                  $addToSet: {contributors: contributor_account},
                  $set: {permissions: this.wallet.permissions}
                });
                this.resetData('contributor');
                this.formData.contributor_message = 'Contributor added successfully.';
                this.isAddContributor = false;
              }
            }
          }
          else {
            this.formData.contributor_errors.push('Contributor not found. Please recheck contributor\'s email and try again.');
          }
        }
      }
      else {
        this.formData.contributor_errors.push('Access denied!');
      }

    }
    else {
      this.formData.contributor_errors.push('Wallet not found. Please refresh the page and try again.');
    }
    this.formData.isAddingContributor = false;
  }

  editContributor(contributor: Account) {
    this.resetErrors('contributor');
    if (this.checkPermission('admin')) {
      this.formData.contributor_permission = this.wallet.permissions[contributor._id];
      this.formData.contributor_email = contributor.email;
      this.formData.isUpdatingContributor = true;
      this.formData.contributor_account = contributor;
      this.isAddContributor = true;
    }
    else {
      this.formData.contributor_errors.push('Access denied!');
    }
  }

  removeContributor(contributor: Account) {
    this.resetErrors('contributor');
    if (this.checkPermission('admin')) {
      Wallets.update({_id: this.walletId}, {$pull: {contributors: contributor}});
      this.formData.contributor_message = 'Contributor (email: ' + contributor.email + ') removed from wallet successfully.';
    }
    else {
      this.formData.contributor_errors.push('Access denied!');
    }
  }

  withdraw(e) {
    e.preventDefault();
    this.formData.isWithdrawing = true;
    this.resetErrors('withdraw');

    if (this.checkPermission('admin') || this.checkPermission('int_trans')) {
      let targetAccount = Meteor.users.findOne({'emails.address': this.formData.target_email});
      if (!targetAccount) {
        this.formData.withdraw_errors.push('Target account not found');
      }

      let amount = this.formData.withdraw_amount;
      let amountInWei = null;
      if (_.isEmpty(amount) || amount === '0' || !_.isFinite(amount) || amount < 0) {
        this.formData.withdraw_errors.push('Amount should be greater than 0');
      }
      else {
        amountInWei = EthTools.toWei(amount);
        if (new BigNumber(amountInWei, 10).gt(new BigNumber(this.wallet.balance, 10))) {
          this.formData.withdraw_errors.push('Not enough balance');
        }
      }

      if (this.formData.withdraw_errors.length == 0) {
        let sourceAddress = this.wallet.eth_address;
        let targetAddress = targetAccount.profile.eth_address;
        web3.personal.unlockAccount(sourceAddress, this.wallet.eth_password, (err, result) => {
          if (err) {
            this.formData.withdraw_errors.push('Some internal error occurred. Please refresh the page and try again.');
            this.formData.isWithdrawing = false;
          }
          else {
            web3.eth.sendTransaction({
              from: sourceAddress,
              to: targetAddress,
              value: amountInWei
            }, (err, address) => {
              if (err) {
                this.formData.withdraw_errors.push('Some internal error occurred. Please refresh the page and try again.');
                this.formData.isWithdrawing = false;
              }
              else {
                Transactions.insert({
                  from_address: this.wallet.eth_address,
                  to_address: targetAccount.profile.eth_address,
                  amount: amountInWei,
                  created_by: this.currentUser._id,
                  created_at: new Date()
                });

                this.formData.withdraw_message = 'Balance withdrawn successfully.';
                this.resetData('withdraw');
                this.isWithdraw = false;
              }
            });
          }
        });

      }
      else {
        this.formData.isWithdrawing = false;
      }
    }
    else {
      this.formData.withdraw_errors.push('Access denied!');
      this.formData.isWithdrawing = false;
    }
  }

  deposit(e) {
    e.preventDefault();
    this.formData.isDepositing = true;
    this.resetErrors('deposit');
    if (this.checkPermission('admin') || this.checkPermission('int_trans')) {
      let amount = this.formData.deposit_amount;
      let amountInWei = null;
      if (_.isEmpty(amount) || amount === '0' || !_.isFinite(amount) || amount < 0) {
        this.formData.deposit_errors.push('Amount should be greater than 0');
      }
      else {
        let current_ethAccount = EthAccounts.findOne({address: this.currentUser.eth_address});
        amountInWei = EthTools.toWei(amount);
        if (new BigNumber(amountInWei, 10).gt(new BigNumber(current_ethAccount.balance, 10))) {
          this.formData.deposit_errors.push('Not enough balance');
        }
      }

      if (this.formData.deposit_errors.length == 0) {
        let targetAddress = this.wallet.eth_address;
        let sourceAddress = this.currentUser.eth_address;
        let self = this;

        web3.personal.unlockAccount(sourceAddress, this.formData.eth_password, (err, result) => {
          if (err) {
            self.formData.deposit_errors.push('Invalid ethereum password');
            self.formData.isDepositing = false;
          }
          else {
            web3.eth.sendTransaction({
              from: sourceAddress,
              to: targetAddress,
              value: amountInWei
            }, (err, address) => {
              if (err) {
                self.formData.deposit_errors.push('Some internal error occurred. Please refresh the page and try again.');
                self.formData.isDepositing = false;
              }
              else {
                Transactions.insert({
                  from_address: self.currentUser.eth_address,
                  to_address: this.wallet.eth_address,
                  amount: amountInWei,
                  created_by: self.currentUser._id,
                  created_at: new Date()
                });
                this.formData.deposit_message = 'Balance deposited successfully.';
                self.resetData('deposit');
                self.isDeposit = false;
              }
            });
          }
        });
      }
      else {
        this.formData.isDepositing = false;
      }
    }
    else {
      this.formData.deposit_errors.push('Access denied!');
      this.formData.isDepositing = false;
    }

  }

  deleteWallet() {
    this.formData.isDeletingWallet = true;
    this.resetErrors('wallet-delete');
    if (this.checkPermission('admin')) {
      web3.eth.getGasPrice((error1, gasPrice) => {
        if (error1) {
          this.formData.wallet_delete_errors.push('Some internal error occured. Please refresh the page and try again.');
        }
        else {
          web3.eth.estimateGas({
            from: this.wallet.eth_address,
            to: this.currentUser.eth_address,
            value: this.wallet.balance
          }, (error2, estimatedGas) => {
            if (error2) {
              this.formData.wallet_delete_errors.push('Some internal error occured. Please refresh the page and try again.');
            }
            else {
              estimatedGas = estimatedGas + 100000;
              let transactionCost = gasPrice.times(estimatedGas);
              let amount = new BigNumber(this.wallet.balance, 10).minus(transactionCost);
              web3.personal.unlockAccount(this.wallet.eth_address, this.wallet.eth_password, (error3, result3) => {
                if (error3) {
                  this.formData.wallet_delete_errors.push('Some internal error occured. Please refresh the page and try again.');
                }
                else {
                  web3.eth.sendTransaction({
                    from: this.wallet.eth_address,
                    to: this.currentUser.eth_address,
                    value: amount
                  }, (error4, result4) => {
                    if (error4) {
                      this.formData.wallet_delete_errors.push('Some internal error occured. Please refresh the page and try again.');
                    }
                    else {
                      Wallets.remove({_id: this.walletId});
                      this.router.navigate(['/wallets']);
                    }
                  });
                }
              });
            }
          });

        }

      });

    }
  }
}
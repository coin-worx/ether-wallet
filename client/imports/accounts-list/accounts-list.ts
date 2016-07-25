import {Component}   from '@angular/core';
import {Accounts}     from '../../../collections/accounts';
import {AccountsForm} from '../accounts-form/accounts-form';
import {Mongo}       from 'meteor/mongo';
import {ROUTER_DIRECTIVES}  from '@angular/router';
import {web3} from "../../lib/eth_init";


import template from './accounts-list.html';

@Component({
    selector: 'accounts-list',
    template,
    directives: [AccountsForm, ROUTER_DIRECTIVES]
})
export class AccountsList {
    accounts: Mongo.Cursor<Account>;

    constructor() {
        this.accounts = Accounts.find();
    }

    getBalance(account: Account): string{
        return web3.fromWei(web3.eth.getBalance(account.eth_address), "ether");
    }


    removeAccount(account: Account) {
        Accounts.remove(account._id);
    }
}
import {Component}   from '@angular/core';
import {Accounts}     from '../../../collections/accounts';
import {AccountsForm} from '../accounts-form/accounts-form';
import {Mongo}       from 'meteor/mongo';
import {ROUTER_DIRECTIVES}  from '@angular/router';
import {LoginButtons} from 'angular2-meteor-accounts-ui';

import template from './accounts-list.html';

@Component({
    selector: 'accounts-list',
    template,
    directives: [AccountsForm, ROUTER_DIRECTIVES, LoginButtons]
})
export class AccountsList {
    accounts: Mongo.Cursor<Account>;

    constructor() {
        this.accounts = Accounts.find();
    }

    removeAccount(account: Account) {
        Accounts.remove(account._id);
    }
}
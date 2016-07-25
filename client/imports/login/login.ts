import {Component, NgZone} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {AccountsService} from "../services/accounts.service";

import template from './login.html';

@Component({
    selector: 'login-form',
    template,
    providers: [AccountsService],
    directives: [ROUTER_DIRECTIVES]
})
export class Login {
    private autorunComputation: Tracker.Computation;
    private currentUser: Meteor.User;
    private showLogin: boolean;
    private credentials: SignupCredentials;

    constructor(private zone: NgZone, private accountsService: AccountsService) {
        this._initAutorun();
        this.showLogin = true;
        this._resetCredentialsFields();
    }

    _initAutorun(): void {
        this.autorunComputation = Tracker.autorun(() => {
            this.zone.run(() => {
                this.currentUser = this.accountsService.getCurrentUser();
            })
        });
    }

    _resetCredentialsFields() {
        this.credentials = {name: '', email: '', password: '', eth_password: '', profile: {}};
    }

    login() {
        this.accountsService.login(this.credentials);
    }

    signup() {
        this.accountsService.signup(this.credentials);
    }


}
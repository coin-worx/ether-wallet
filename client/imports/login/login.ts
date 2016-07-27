import {Component, NgZone, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {AccountsService} from "../services/accounts.service";

//noinspection TypeScriptCheckImport
import template from './login.html';
//noinspection TypeScriptCheckImport
import style from './login.css';
@Component({
    selector: 'login-form',
    template,
    style,
    directives: [ROUTER_DIRECTIVES]
})
export class LoginComponent implements OnInit{
    private autorunComputation: Tracker.Computation;
    // private currentUser: Meteor.User;
    private showLogin: boolean = true;
    private credentials: SignupCredentials;

    constructor(private zone: NgZone,
                private accountsService: AccountsService,
                private router: Router) {
        this._initAutorun();
        this.showLogin = true;
        this._resetCredentialsFields();
    }

    ngOnInit(){
        if(this.accountsService.isLoggedIn()){
            this.router.navigate(['/']);
        }
    }

    _initAutorun(): void {
        this.autorunComputation = Tracker.autorun(() => {
            this.zone.run(() => {
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
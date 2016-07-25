import {Injectable, NgZone} from "@angular/core";
import {Accounts} from 'meteor/accounts-base';
import {Tracker} from 'meteor/tracker';
import {Meteor} from 'meteor/meteor';
import {web3} from "../../lib/eth_init";
import {AccountsCollection} from "../../../collections/accounts.collection";

@Injectable()
export class AccountsService {
    autorunComputation: Tracker.Computation;
    currentUser: Meteor.User;
    currentUserId: string;
    loggingIn: boolean;
    loggedIn: boolean;
    services: Array<any>;
    errors: Array<string>;
    isSignup: boolean;
    message: string;

    constructor(private zone: NgZone) {
        this._initAutorun();
        this.services = this._getLoginServices();
        // this.resetErrors();
        this.isSignup = false;
        // this._resetCredentialsFields();
    }

    // _resetCredentialsFields() {
    //     this.credentials = { name: '', email: '', password: '', eth_password: '' };
    // }

    resetErrors() {
        this.errors = [];
        this.message = "";
    }

    singleService(): Object {
        let services = this._getLoginServices();

        return services[0];
    }

    displayName(): string {
        let user: any = this.currentUser;

        if(!user)
            return '';

        if(user.profile && user.profile.name)
            return user.profile.name;

        if(user.username)
            return user.username;

        if(user.emails && user.emails[0] && user.emails[0].address)
            return user.emails[0].address;

        return '';
    };

    login(credentials: SignupCredentials): void {
        this.resetErrors();

        let email: string = credentials.email;
        let password: string = credentials.password;

        Meteor.loginWithPassword(email, password, (error) => {
            if(error) {
                this.errors.push(error.reason || "Unknown error");
            }
            else {
                // this._resetCredentialsFields();
            }
        });
    }

    // recover() {
    //     this.resetErrors();
    //
    //     Accounts.forgotPassword({ email: this.credentials.email }, (error) => {
    //         if (error) {
    //             this.errors.push(error.reason || "Unknown error");
    //         }
    //         else {
    //             this.message = "You will receive further instruction to you email address!";
    //             this._resetCredentialsFields();
    //         }
    //     });
    // }

    logout(): void {
        Meteor.logout();
    }

    signup(credentials: SignupCredentials): void {
        this.resetErrors();

        Accounts.createUser(credentials, (error) => {
            if(error) {
                this.errors.push(error.reason || "Unknown error");
            }
            else {
                let userId = Meteor.userId();
                let self = this;
                web3.personal.newAccount(credentials.eth_password, function(error, result) {
                    if(!error){
                        Meteor.users.update(userId, {$set: {"profile.eth_address": result}});
                    }
                    else{
                        Meteor.users.remove(userId);
                        Meteor.logout();
                        self.errors.push("Unable to create account. Please try again!");
                    }
                });
            }
        });
    }

    _hasPasswordService(): boolean {
        return !!Package['accounts-password'];
    }

    _getLoginServices(): Array<any> {
        let services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames(): [];
        services.sort();

        if(this._hasPasswordService())
            services.push('password');

        return _.map(services, function(name) {
            return {name: name};
        });
    }

    _initAutorun(): void {
        this.autorunComputation = Tracker.autorun(() => {
            this.zone.run(() => {
                this.currentUser = Meteor.user();
                this.currentUserId = Meteor.userId();
                this.loggingIn = Meteor.loggingIn();
                this.loggedIn = !!Meteor.user();
            })
        });
    }

    getCurrentUser(): Meteor.User {
        return this.currentUser;
    }

    isLoggedIn(): boolean {
        return this.loggedIn;
    }

    isLoggingIn(): boolean{
        return this.loggingIn;
    }

    getErrors() {
        return this.errors;
    }
}
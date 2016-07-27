import {Component, NgZone, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {AccountsService} from "../services/accounts.service";
import {LoginComponent} from "../login/login";

//noinspection TypeScriptCheckImport
import template from './home.html';
//noinspection TypeScriptCheckImport
import style from './home.css';

@Component({
    selector: 'home',
    template,
    style,
    directives: [LoginComponent, ROUTER_DIRECTIVES]
})
export class HomeComponent implements OnInit{
    private autorunComputation: Tracker.Computation;
    private currentUser: Account;

    constructor(private zone: NgZone,
                private accountsService: AccountsService,
                private router: Router) {
        this._initAutorun();
    }

    ngOnInit(){
        if(!this.accountsService.isLoggedIn()){
            this.router.navigate(['/login']);
        }
        else{
            let user = this.accountsService.getCurrentUser();
            this.currentUser = {
                name: user.profile.name,
                email: user.emails[0].address,
                eth_address: user.profile.eth_address
            }
        }
    }

    _initAutorun(): void {
        this.autorunComputation = Tracker.autorun(() => {
            this.zone.run(() => {
            })
        });
    }

}
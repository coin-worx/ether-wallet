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
export class HomeComponent implements OnInit {
    private autorunComputation: Tracker.Computation;
    private currentUser: Account;
    private currentEthAccount: any;

    constructor(private zone: NgZone,
                private accountsService: AccountsService,
                private router: Router) {
        this._initAutorun();
    }

    ngOnInit() {
        if(!this.accountsService.isLoggedIn()) {
            this.router.navigate(['/login']);
        }
        else {
            // this.currentUser = this.accountsService.getCurrentUserAccount();
            // this.currentEthAccount = EthAccounts.findOne({address: this.currentUser.eth_address});
            // this.currentEthAccount.balance_unit = EthTools.formatBalance(this.currentEthAccount.balance, '0,0.0[00] unit');
        }
    }

    _initAutorun(): void {
        let self = this;
        this.autorunComputation = Tracker.autorun(() => {
            this.zone.run(() => {
                if(self.accountsService.isLoggedIn()) {
                    self.currentUser = self.accountsService.getCurrentUserAccount();
                    if(self.currentUser) {
                        self.currentEthAccount = EthAccounts.findOne({address: self.currentUser.eth_address});
                        if(self.currentEthAccount) {
                            self.currentEthAccount.balance_unit = EthTools.formatBalance(self.currentEthAccount.balance, '0,0.0[00] unit');
                        }
                    }
                }
            });
        });
    }


}
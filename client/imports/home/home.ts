import {Component, NgZone, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {AccountsService} from "../services/accounts.service";
import {LoginComponent} from "../login/login";

//noinspection TypeScriptCheckImport
import template from './home.html';
//noinspection TypeScriptCheckImport
import style from './home.css';
import {NavigationService} from "../services/navigation.service";

@Component({
	selector: 'home',
	template,
	style,
	directives: [LoginComponent, ROUTER_DIRECTIVES]
})
export class HomeComponent implements OnInit{
	private autorunComputation: Tracker.Computation;
	private currentUser: Account;
	private currentEthAccount: any;
	private isBalanceUpdated: boolean = false;

	constructor(private zone: NgZone,
				private accountsService: AccountsService,
				private navigationService: NavigationService,
				private router: Router){
		this._initAutorun();
	}

	ngOnInit(){
		this.navigationService.setActivePage('home');
	}

	_initAutorun(): void{
		let self = this;
		this.autorunComputation = Tracker.autorun(() =>{
			this.zone.run(() =>{
				if(self.accountsService.isLoggedIn()){
					self.currentUser = self.accountsService.getCurrentUserAccount();
					if(self.currentUser){
						self.currentEthAccount = EthAccounts.findOne({address: self.currentUser.eth_address});
						if(self.currentEthAccount){
							self.currentEthAccount.balance_unit = self.accountsService.formatBalance(self.currentEthAccount.balance);
							self.isBalanceUpdated = false;
							setTimeout(()=>{
								self.isBalanceUpdated = true;
							}, 100);
						}
					}
				}
				else if(!self.accountsService.isLoggingIn()){
					self.router.navigate(['/login']);
				}
			});
		});
	}


}
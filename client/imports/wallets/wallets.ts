import {Component, NgZone, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

//noinspection TypeScriptCheckImport
import template from './wallets.html';
import {AccountsService} from "../services/accounts.service";
import {NavigationService} from "../services/navigation.service";
import {Wallets} from "../../../collections/wallets.collection";

@Component({
	selector: 'wallets-list',
	template,
	directives: [ROUTER_DIRECTIVES]
})
export class WalletsComponent implements OnInit{
	private wallets: Mongo.Cursor<Wallet>;
	private autorunComputation: Tracker.Computation;
	private currentUser: Account;
	private isCreateWallet: boolean = false;
	private formData: any = {};

	constructor(private accountsService: AccountsService,
				private navigationService: NavigationService,
				private router: Router,
				private zone: NgZone){
		this._initAutorun();
	}

	ngOnInit(){
		this.navigationService.setActivePage('wallets');
		this.resetData();
		this.resetErrors();
	}

	_initAutorun(): void{
		let self = this;
		this.autorunComputation = Tracker.autorun(() =>{
			this.zone.run(() =>{
				if(!self.accountsService.isLoggedIn() && !self.accountsService.isLoggingIn()){
					self.router.navigate(['/login']);
				}
				else{
					self.currentUser = self.accountsService.getCurrentUserAccount();
					if(self.currentUser && !self.currentUser.isSurveyCompleted){
						self.router.navigate(['/survey']);
					}
					else if(self.currentUser){
						self.wallets = Wallets.find({$or: [{owner: self.currentUser}, {"contributors.email": self.currentUser.email}]});
					}
				}
			})
		});
	}

	resetData(){
		this.formData.wallet_title = "";
		this.formData.isCreating = false;
	}

	resetErrors(){
		this.formData.message = "";
		this.formData.errors = [];
	}

	createWallet(e){
		e.preventDefault();
		this.formData.isCreating = true;
		this.resetErrors();
		if(this.currentUser){
			let wallet_title = this.formData.wallet_title;
			let random_str = null;
			while(random_str == null){
				random_str = (Math.random()+10).toString(36).substr(2, 10);
			}
			let self = this;
			web3.personal.newAccount(random_str, function(error, result){
				if(!error){
					Wallets.insert({
						title: wallet_title,
						balance: 0,
						owner: self.currentUser,
						eth_address: result,
						eth_password: random_str
					});
					self.formData.message = "Wallet created successfully.";
					self.resetData();
					self.isCreateWallet = false;
				}
				else{
					self.formData.errors.push("Unable to create wallet. Please try again!");
					self.formData.isCreating = false;
				}
			});
		}
		else{
			this.formData.errors.push("Some error occurred. Please refresh the page and try again.");
			this.formData.isCreating = false;
		}
	}
}
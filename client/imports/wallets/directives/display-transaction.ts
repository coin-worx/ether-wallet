import {Component, OnInit, Input} from '@angular/core';

//noinspection TypeScriptCheckImport
import template from './display-transaction.html';
import {AccountsService} from "../../services/accounts.service";

@Component({
	selector: '[display-transaction]',
	template
})
export class DisplayTransactionComponent implements OnInit{
	@Input()
	private transaction: Transaction;
	@Input()
	private wallet: Wallet;
	private userAccount: Account;

	constructor(private accountsService: AccountsService){
	}

	ngOnInit(){
		if(this.transaction.from_address == this.wallet.eth_address){
			this.userAccount = this.accountsService.findUserAccount(this.transaction.to_address,'profile.eth_address');
		}
		else if(this.transaction.to_address == this.wallet.eth_address){
			this.userAccount = this.accountsService.findUserAccount(this.transaction.from_address,'profile.eth_address');
		}
	}
}
import 'reflect-metadata';
import {Component, provide, OnInit} from '@angular/core';
import {bootstrap} from 'angular2-meteor-auto-bootstrap';
import {provideRouter, RouterConfig, ROUTER_DIRECTIVES} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';
import {HomeComponent} from "./imports/home/home";

//noinspection TypeScriptCheckImport
import template from './app.html';
//noinspection TypeScriptCheckImport
import style from './style.css';

import {AccountsService} from "./imports/services/accounts.service";
import {appInjector} from "./lib/app-injector";
import {ROUTER_PROVIDERS} from "@angular/router-deprecated";
import {LoginComponent} from "./imports/login/login";
import {NavigationService} from "./imports/services/navigation.service";
import {TransferFundsComponent} from "./imports/transfer-funds/transfer-funds";
import {WalletsComponent} from "./imports/wallets/wallets";
import {WalletDetailsComponent} from "./imports/wallets/wallet-details/wallet-details";

@Component({
	selector: 'app',
	template,
	style,
	providers: [AccountsService, NavigationService],
	directives: [ROUTER_DIRECTIVES]
})
class PoC implements OnInit{
	private activePage: string;
	private currencies: Array<string>;
	private formData: any;

	constructor(private accountsService: AccountsService,
				private navigationService: NavigationService){
		this.currencies = ['ether','usd','eur','btc','finney','wei'];
		this.formData = {};
		this._initAutorun();
	}

	ngOnInit(){

	}

	_initAutorun(){
		Tracker.autorun(()=>{
			this.activePage = this.navigationService.getActivePage();
			this.formData.currency = EthTools.getUnit();
		});
	}

	changeCurrency(data){
		let currency = data;
		if(this.currencies.indexOf(currency) > -1){
			EthTools.setUnit(currency);
		}
	}
}

const routes: RouterConfig = [
	{path: '', component: HomeComponent},
	{path: 'login', component: LoginComponent},
	{path: 'transfer-funds', component: TransferFundsComponent},
	{path: 'wallets', component: WalletsComponent},
	{path: 'wallet/:walletId', component: WalletDetailsComponent},
];

const APP_ROUTER_PROVIDERS = [
	provideRouter(routes)
];

bootstrap(PoC, [APP_ROUTER_PROVIDERS, ROUTER_PROVIDERS, provide(APP_BASE_HREF, {useValue: '/'})])
	.then((appRef) =>{
		// store a reference to the injector
		appInjector(appRef.injector);
	});

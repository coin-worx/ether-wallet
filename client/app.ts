/***************************************************************************** 
* Copyright 2016 Aurora Solutions 
* 
*    http://www.aurorasolutions.io 
* 
* Aurora Solutions is an innovative services and product company at 
* the forefront of the software industry, with processes and practices 
* involving Domain Driven Design(DDD), Agile methodologies to build 
* scalable, secure, reliable and high performance products.
* 
* Ether Wallet is a Cryptocurrency Wallet Dapp for Ethereum.
* Developed with MeteorJS, Angular2, MongoDB and JQuery on the Ethereum
* platform, the Dapp can be used to transfer funds, manage shared wallets
* and start crowdfunding campaigns using the blockchain functionality of
* Ethereum.
* Key features: Account and permission management, Wallet creation,
* Withdrawals and Deposits in the Wallet, funds transfer,
* view Crypto and Fiat Currency conversion rates, etc.
* 
* Licensed under the Apache License, Version 2.0 (the "License"); 
* you may not use this file except in compliance with the License. 
* You may obtain a copy of the License at 
* 
*    http://www.apache.org/licenses/LICENSE-2.0 
* 
* Unless required by applicable law or agreed to in writing, software 
* distributed under the License is distributed on an "AS IS" BASIS, 
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
* See the License for the specific language governing permissions and 
* limitations under the License. 
*****************************************************************************/


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

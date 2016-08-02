import {Component, NgZone, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {AccountsService} from "../services/accounts.service";

//noinspection TypeScriptCheckImport
import template from './login.html';
//noinspection TypeScriptCheckImport
import style from './login.css';
import {NavigationService} from "../services/navigation.service";
@Component({
	selector: 'login-form',
	template,
	style,
	directives: [ROUTER_DIRECTIVES]
})
export class LoginComponent implements OnInit{
	private autorunComputation: Tracker.Computation;
	private showLogin: boolean = true;
	private credentials: SignupCredentials;
	private isLoggedIn: boolean = false;

	constructor(private zone: NgZone,
				private accountsService: AccountsService,
				private navigationService: NavigationService,
				private router: Router){
		this._initAutorun();
		this.showLogin = true;
		this._resetCredentialsFields();
	}

	ngOnInit(){

	}

	_initAutorun(): void{
		let self = this;
		this.autorunComputation = Tracker.autorun(() =>{
			this.zone.run(() =>{
				self.isLoggedIn = self.accountsService.isLoggedIn();
				if(self.isLoggedIn && self.navigationService.getCurrentUrl() == "/login"){
					self.router.navigate(['/']);
				}
			})
		});
	}

	_resetCredentialsFields(){
		this.credentials = {name: '', email: '', password: '', eth_password: '', profile: {}};
	}

	login(){
		this.accountsService.login(this.credentials);
	}

	signup(){
		this.accountsService.signup(this.credentials);
	}


}
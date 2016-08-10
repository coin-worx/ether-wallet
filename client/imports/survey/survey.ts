import {Component, NgZone, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {AccountsService} from "../services/accounts.service";

//noinspection TypeScriptCheckImport
import template from './survey.html';
//noinspection TypeScriptCheckImport
import {NavigationService} from "../services/navigation.service";
import {Projects} from "../../../collections/projects.collection";

@Component({
	selector: 'survey-form',
	template,
	directives: [ROUTER_DIRECTIVES]
})
export class SurveyComponent implements OnInit{
	private autorunComputation: Tracker.Computation;
	private isSurveyComplete: boolean;
	private result: any = {};
	private formData: any;

	constructor(private zone: NgZone,
				private accountsService: AccountsService,
				private navigationService: NavigationService,
				private router: Router){
		this._initAutorun();
	}

	ngOnInit(){
		this.navigationService.setActivePage('survey');
		this.isSurveyComplete = false;
		this.formData = {risk_level: "low"};
	}

	_initAutorun(): void{
		let self = this;
		this.autorunComputation = Tracker.autorun(() =>{
			this.zone.run(() =>{
				if(!self.accountsService.isLoggedIn() && !self.accountsService.isLoggingIn()){
					self.router.navigate(['/login']);
				}
			});
		});
	}

	submitSurvey(e){
		e.preventDefault();
		this.result.projects = Projects.find({risk_level: {$regex: new RegExp(this.formData.risk_level, "i")}});
		this.isSurveyComplete = true;
	}
}
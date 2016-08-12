import {Component, NgZone, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {AccountsService} from "../services/accounts.service";

//noinspection TypeScriptCheckImport
import template from './survey.html';
//noinspection TypeScriptCheckImport
import {NavigationService} from "../services/navigation.service";
import {Projects} from "../../../collections/projects.collection";
import user = Accounts.user;

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
		this.navigationService.setActivePage('home');
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
				else{
					let currentUser = self.accountsService.getCurrentUserAccount();
					if(currentUser && currentUser.isSurveyCompleted){
						self.router.navigate(['/']);
					}
				}
			});
		});
	}

	submitSurvey(e){
		e.preventDefault();
		let risk_level = this.formData.risk_level;
		// this.result.projects = Projects.find({risk_level: {$regex: new RegExp(risk_level, "i")}});
		let userId = Meteor.userId();
		Meteor.users.update(userId, {
			$set: {
				"profile.isSurveyCompleted": true,
				"profile.survey": {"risk_level": risk_level}
			}
		});
		// this.isSurveyComplete = true;
		setTimeout(()=>{
			this.router.navigate(['/']);
		}, 100);
	}
}
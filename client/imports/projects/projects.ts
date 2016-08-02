import {Component, NgZone, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {Projects} from "../../../collections/projects.collection";

//noinspection TypeScriptCheckImport
import template from './projects.html';
import {AccountsService} from "../services/accounts.service";
import {NavigationService} from "../services/navigation.service";

@Component({
	selector: 'projects-list',
	template,
	directives: [ROUTER_DIRECTIVES]
})
export class ProjectsComponent implements OnInit{
	private projects: Mongo.Cursor<Project>;
	private autorunComputation: Tracker.Computation;

	constructor(private accountsService: AccountsService,
				private navigationService: NavigationService,
				private router: Router,
				private zone: NgZone){
		this._initAutorun();
	}

	ngOnInit(){
		this.projects = Projects.find();
		this.navigationService.setActivePage('projects');
	}

	_initAutorun(): void{
		let self = this;
		this.autorunComputation = Tracker.autorun(() =>{
			this.zone.run(() =>{
				if(!self.accountsService.isLoggedIn() && !self.accountsService.isLoggingIn()){
					self.router.navigate(['/login']);
				}
			})
		});
	}
}
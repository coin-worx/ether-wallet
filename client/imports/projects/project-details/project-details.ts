import {Component, NgZone, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute, Router} from '@angular/router';
import {Projects} from "../../../../collections/projects.collection";

//noinspection TypeScriptCheckImport
import template from './project-details.html';
import {AccountsService} from "../../services/accounts.service";
import {NavigationService} from "../../services/navigation.service";

@Component({
    selector: 'project-details',
    template,
    directives: [ROUTER_DIRECTIVES]
})
export class ProjectDetailsComponent implements OnInit {
    private autorunComputation: Tracker.Computation;
    private projectId: string;
    private project: Project;

    constructor(private route: ActivatedRoute,
                private zone: NgZone,
                private accountsService: AccountsService,
                private navigationService: NavigationService,
                private router: Router) {
        this._initAutorun();
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.projectId = params['projectId'];
                    this.project = Projects.findOne(this.projectId);
        });
        this.navigationService.setActivePage('projects');
    }

    _initAutorun(): void{
        let self = this;
        this.autorunComputation = Tracker.autorun(() =>{
            this.zone.run(() =>{
                if(!self.accountsService.isLoggedIn() && !self.accountsService.isLoggingIn()){
                    self.router.navigate(['/login']);
                }
                else if(self.projectId){
                    self.project = Projects.findOne(self.projectId);
                }
            })
        });
    }
}
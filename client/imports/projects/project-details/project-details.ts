import {Component, NgZone} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';
import {Projects} from "../../../../collections/projects.collection";

//noinspection TypeScriptCheckImport
import template from './project-details.html';
import {AccountsService} from "../../services/accounts.service";

@Component({
    selector: 'project-details',
    template,
    directives: [ROUTER_DIRECTIVES]
})
export class ProjectDetailsComponent {
    private projectId: string;
    private project: Project;

    constructor(private route: ActivatedRoute,
                private ngZone: NgZone,
                private accountsService: AccountsService) {
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.projectId = params['projectId'];

            Tracker.autorun(() => {
                this.ngZone.run(() => {
                    this.project = Projects.findOne(this.projectId);
                });
            });
        });
    }
}
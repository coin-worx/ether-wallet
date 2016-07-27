import {Component, NgZone, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {Projects} from "../../../collections/projects.collection";

//noinspection TypeScriptCheckImport
import template from './projects.html';

import {isLoggedIn} from "../../lib/checkComponentAccess";

import {CanActivate} from "@angular/router-deprecated";
import {AccountsService} from "../services/accounts.service";

@Component({
    selector: 'projects-list',
    template,
    directives: [ROUTER_DIRECTIVES]
})
// @CanActivate((to, from) => {
//     console.log("canActivate");
//     return isLoggedIn(to, from);
// })
export class ProjectsComponent implements OnInit{
    private projects: Mongo.Cursor<Project>;

    constructor(private accountsService: AccountsService,
                private router: Router){
        this.projects = Projects.find();
    }

    ngOnInit(){
        if(!this.accountsService.isLoggedIn()){
            this.router.navigate(['/']);
        }
    }
}
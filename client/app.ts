import 'reflect-metadata';
import {Component, provide} from '@angular/core';
import {bootstrap} from 'angular2-meteor-auto-bootstrap';
import {provideRouter, RouterConfig, ROUTER_DIRECTIVES} from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import {Home} from "./imports/home/home";

//noinspection TypeScriptCheckImport
import template from './app.html';
import style from './style.css';

import {ProjectsComponent} from "./imports/projects/projects";
import {ProjectDetailsComponent} from "./imports/projects/project-details/project-details";
import {AccountsService} from "./imports/services/accounts.service";
import {appInjector} from "./lib/app-injector";
import {ROUTER_PROVIDERS} from "@angular/router-deprecated";

@Component({
    selector: 'app',
    template,
    style,
    providers: [AccountsService],
    directives: [ROUTER_DIRECTIVES]
})
class PoC {
    constructor(private accountsService: AccountsService){
    }
}

const routes: RouterConfig = [
    { path: '', component: Home },
    { path: 'projects', component: ProjectsComponent},
    { path: 'project/:projectId',	component: ProjectDetailsComponent},
];

const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];

bootstrap(PoC, [APP_ROUTER_PROVIDERS, ROUTER_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })])
    .then((appRef) => {
        // store a reference to the injector
        appInjector(appRef.injector);
    });

import {Component, NgZone} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Projects} from "../../../collections/projects.collection";

import template from './projects.html';

@Component({
    selector: 'projects-list',
    template,
    directives: [ROUTER_DIRECTIVES]
})
export class ProjectsComponent {
    private projects: Mongo.Cursor<Project>;

    constructor(){
        this.projects = Projects.find();
    }
}
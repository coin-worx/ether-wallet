import 'reflect-metadata';
import {Component, provide} from '@angular/core';
import {bootstrap} from 'angular2-meteor-auto-bootstrap';
import {provideRouter, RouterConfig, ROUTER_DIRECTIVES} from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import {Home} from "./imports/home/home";

import template from './app.html';

@Component({
    selector: 'app',
    template,
    directives: [ROUTER_DIRECTIVES]
})
class PoC {
}

const routes: RouterConfig = [
    { path: '', component: Home },
];

const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];

bootstrap(PoC, [APP_ROUTER_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);

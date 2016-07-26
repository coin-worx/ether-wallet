import {Component, NgZone} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {AccountsService} from "../services/accounts.service";
import {Login} from "../login/login";

//noinspection TypeScriptCheckImport
import template from './home.html';

@Component({
    selector: 'home',
    template,
    directives: [Login, ROUTER_DIRECTIVES]
})
export class Home {
    private autorunComputation: Tracker.Computation;
    
    constructor(private zone: NgZone, private accountsService: AccountsService) {
        this._initAutorun();
    }

    _initAutorun(): void {
        this.autorunComputation = Tracker.autorun(() => {
            this.zone.run(() => {
            })
        });
    }

}
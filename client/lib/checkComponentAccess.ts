import {appInjector} from './app-injector';
import {Router} from '@angular/router';
import {AccountsService} from "../imports/services/accounts.service";

export const isLoggedIn = (to, from) => {
    let injector = appInjector();
    let router = injector.get(Router);
    let accountsService = injector.get(AccountsService);
    console.log("accountsService: ", accountsService);

    if(accountsService.isLoggedIn()){
        return true;
    }
    else{
        router.navigate(['/']);
        return false;
    }
};
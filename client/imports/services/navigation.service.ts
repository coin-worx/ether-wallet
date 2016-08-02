import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable()
export class NavigationService{
	private activePage: string;
	private trackerDependency: Tracker.Dependency;

	constructor(private router: Router){
		this.trackerDependency = new Tracker.Dependency;
	}

	getCurrentUrl(): string{
		let currentUrl = this.router.location._platformStrategy._platformLocation.pathname;
		return currentUrl;
	}

	getActivePage(){
		this.trackerDependency.depend();
		return this.activePage;
	}

	setActivePage(activePage: string){
		this.activePage = activePage;
		this.trackerDependency.changed();
	}
}
import {Component, NgZone, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute, Router} from '@angular/router';

//noinspection TypeScriptCheckImport
import template from './wallet-details.html';
import {AccountsService} from "../../services/accounts.service";
import {NavigationService} from "../../services/navigation.service";
import {Wallets} from "../../../../collections/wallets.collection";

@Component({
	selector: 'wallet-details',
	template,
	directives: [ROUTER_DIRECTIVES]
})
export class WalletDetailsComponent implements OnInit{
	private autorunComputation: Tracker.Computation;
	private walletId: string;
	private wallet: Wallet;
	private formData: any = {};
	private isAddContributor: boolean = false;

	constructor(private route: ActivatedRoute,
				private zone: NgZone,
				private accountsService: AccountsService,
				private navigationService: NavigationService,
				private router: Router){
		this._initAutorun();
	}

	ngOnInit(){
		this.route.params.subscribe((params) =>{
			this.walletId = params['walletId'];
			this.wallet = Wallets.findOne(this.walletId);
		});
		this.navigationService.setActivePage('wallets');
		this.resetData();
		this.resetErrors();
	}

	_initAutorun(): void{
		let self = this;
		this.autorunComputation = Tracker.autorun(() =>{
			this.zone.run(() =>{
				if(!self.accountsService.isLoggedIn() && !self.accountsService.isLoggingIn()){
					self.router.navigate(['/login']);
				}
				else{
					let currentUser = self.accountsService.getCurrentUserAccount();
					if(currentUser && !currentUser.isSurveyCompleted){
						self.router.navigate(['/survey']);
					}
					else if(self.walletId){
						self.wallet = Wallets.findOne(self.walletId);
					}
				}
			})
		});
	}

	resetData(){
		this.formData.contributor_email = "";
	}

	resetErrors(){
		this.formData.message = "";
		this.formData.errors = [];
	}

	addContributor(e){
		e.preventDefault();
		this.formData.isCreating = true;
		this.resetErrors();

		if(this.wallet){
			let contributor_email = this.formData.contributor_email;
			let contributor = Meteor.users.findOne({"emails.address": contributor_email});
			if(contributor){
				if(contributor_email == this.wallet.owner.email){
					this.formData.errors.push("You cannot add owner of wallet as contributor.");
				}
				else{
					let checkContributor = Wallets.findOne({"contributors.email": contributor.emails[0].address});
					if(checkContributor){
						this.formData.errors.push("Contributor is already added in wallet.");
					}
					else{
						let contributor_account: Account = {
							_id: contributor._id,
							name: contributor.profile.name,
							email: contributor.emails[0].address,
							eth_address: contributor.profile.eth_address,
							identicon: blockies.create({
								seed: contributor.eth_address,
								size: 8,
								scale: 8
							}).toDataURL(),
							isSurveyCompleted: contributor.profile.isSurveyCompleted,
							survey: contributor.profile.survey
						};

						Wallets.update({_id: this.walletId},{$addToSet: {contributors: contributor_account}});
						this.resetData();
						this.formData.message = "Contributor added successfully.";
						this.isAddContributor = false;
					}
				}
			}
			else{
				this.formData.errors.push("Contributor not found. Please recheck contributor's email and try again.");
			}
		}
		else{
			this.formData.errors.push("Wallet not found. Please refresh the page and try again.");
		}
		this.formData.isCreating = false;
	}

	removeContributor(contributor: Account){
		Wallets.update({_id: this.walletId},{$pull:{contributors: contributor}});
		this.formData.message = "Contributor (email: "+contributor.email+") removed from wallet successfully.";
	}
}
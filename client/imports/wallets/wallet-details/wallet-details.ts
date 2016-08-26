import {Component, NgZone, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute, Router} from '@angular/router';

//noinspection TypeScriptCheckImport
import template from './wallet-details.html';
import {AccountsService} from "../../services/accounts.service";
import {NavigationService} from "../../services/navigation.service";
import {Wallets} from "../../../../collections/wallets.collection";
import {Transactions} from "../../../../collections/transactions.collection";
import {DisplayTransactionComponent} from "../directives/display-transaction";

@Component({
	selector: 'wallet-details',
	template,
	directives: [ROUTER_DIRECTIVES, DisplayTransactionComponent]
})
export class WalletDetailsComponent implements OnInit{
	private autorunComputation: Tracker.Computation;
	private walletId: string;
	private wallet: Wallet;
	private formData: any = {};
	private isAddContributor: boolean = false;
	private isWithdraw: boolean = false;
	private isDeposit: boolean = false;
	private wallet_transactions: Mongo.Cursor<Transaction>;

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
			let self = this;
			Tracker.autorun(()=>{
				self.zone.run(()=>{
					self.wallet = Wallets.findOne(self.walletId);
					if(self.wallet){
						let wallet_ethAccount = EthAccounts.findOne({address: self.wallet.eth_address});
						if(wallet_ethAccount && self.wallet.balance != wallet_ethAccount.balance){
							Wallets.update({_id: self.wallet._id}, {$set: {balance: wallet_ethAccount.balance}});
						}
						self.wallet_transactions = Transactions.find({$or: [{from_address: self.wallet.eth_address}, {to_address: self.wallet.eth_address}]});
					}
				});
			});
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
				}
			})
		});
	}

	resetData(type = 'all'){
		switch(type){
			case 'contributor':
				this.formData.contributor_email = "";
				this.formData.isAddingContributor = false;
				break;
			case 'withdraw':
				this.formData.target_email = "";
				this.formData.withdraw_amount = 0;
				this.formData.isWithdrawing = false;
				break;
			case 'deposit':
				this.formData.eth_password = "";
				this.formData.deposit_amount = 0;
				this.formData.isDepositing = false;
				break;
			case 'all':
				this.formData.contributor_email = "";
				this.formData.target_email = "";
				this.formData.withdraw_amount = 0;
				this.formData.eth_password = "";
				this.formData.deposit_amount = 0;
				this.formData.isAddingContributor = false;
				this.formData.isWithdrawing = false;
				this.formData.isDepositing = false;
				break;
		}
	}

	resetErrors(type = 'all'){
		switch(type){
			case 'contributor':
				this.formData.contributor_message = "";
				this.formData.contributor_errors = [];
				break;
			case 'withdraw':
				this.formData.withdraw_message = "";
				this.formData.withdraw_errors = [];
				break;
			case 'deposit':
				this.formData.deposit_message = "";
				this.formData.deposit_errors = [];
				break;
			case 'all':
				this.formData.contributor_message = "";
				this.formData.contributor_errors = [];
				this.formData.withdraw_message = "";
				this.formData.withdraw_errors = [];
				this.formData.deposit_message = "";
				this.formData.deposit_errors = [];
				break;
		}

	}

	addContributor(e){
		e.preventDefault();
		this.formData.isAddingContributor = true;
		this.resetErrors();

		if(this.wallet){
			let contributor_email = this.formData.contributor_email;
			let contributor = Meteor.users.findOne({"emails.address": contributor_email});
			if(contributor){
				if(contributor_email == this.wallet.owner.email){
					this.formData.contributor_errors.push("You cannot add owner of wallet as contributor.");
				}
				else{
					let checkContributor = Wallets.findOne({"contributors.email": contributor.emails[0].address});
					if(checkContributor){
						this.formData.contributor_errors.push("Contributor is already added in wallet.");
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

						Wallets.update({_id: this.walletId}, {$addToSet: {contributors: contributor_account}});
						this.resetData();
						this.formData.contributor_message = "Contributor added successfully.";
						this.isAddContributor = false;
					}
				}
			}
			else{
				this.formData.contributor_errors.push("Contributor not found. Please recheck contributor's email and try again.");
			}
		}
		else{
			this.formData.contributor_errors.push("Wallet not found. Please refresh the page and try again.");
		}
		this.formData.isAddingContributor = false;
	}

	removeContributor(contributor: Account){
		Wallets.update({_id: this.walletId}, {$pull: {contributors: contributor}});
		this.formData.contributor_message = "Contributor (email: " + contributor.email + ") removed from wallet successfully.";
	}

	withdraw(e){
		e.preventDefault();
		this.formData.isWithdrawing = true;
		this.resetErrors('withdraw');

		let targetAccount = Meteor.users.findOne({"emails.address": this.formData.target_email});
		if(!targetAccount){
			this.formData.withdraw_errors.push("Target account not found");
		}

		let amount = this.formData.withdraw_amount;
		if(_.isEmpty(amount) || amount === '0' || !_.isFinite(amount) || amount < 0){
			this.formData.withdraw_errors.push("Amount should be greater than 0");
		}
		let amountInWei = EthTools.toWei(amount);
		if(new BigNumber(amountInWei, 10).gt(new BigNumber(this.wallet.balance, 10))){
			this.formData.withdraw_errors.push("Not enough balance");
		}

		if(this.formData.withdraw_errors.length == 0){
			let sourceAddress = this.wallet.eth_address;
			let targetAddress = targetAccount.profile.eth_address;
			web3.personal.unlockAccount(sourceAddress, this.wallet.eth_password, (err, result)=>{
				if(err){
					this.formData.withdraw_errors.push("Some internal error occurred. Please refresh the page and try again.");
					this.formData.isWithdrawing = false;
				}
				else{
					web3.eth.sendTransaction({
						from: sourceAddress,
						to: targetAddress,
						value: amountInWei
					}, (err, address) =>{
						if(err){
							this.formData.withdraw_errors.push("Some internal error occurred. Please refresh the page and try again.");
							this.formData.isWithdrawing = false;
						}
						else{
							Transactions.insert({
								from_address: this.wallet.eth_address,
								to_address: targetAccount.profile.eth_address,
								amount: amountInWei,
								created_at: new Date()
							});

							this.formData.withdraw_message = "Balance withdrawn successfully.";
							this.resetData('withdraw');
							this.isWithdraw = false;
						}
					});
				}
			});



		}
		else{
			this.formData.isWithdrawing = false;
		}

	}

	deposit(e){
		e.preventDefault();
		this.formData.isDepositing = true;
		this.resetErrors('deposit');
		let amount = this.formData.deposit_amount;
		if(_.isEmpty(amount) || amount === '0' || !_.isFinite(amount) || amount < 0){
			this.formData.deposit_errors.push("Amount should be greater than 0");
		}
		let current_account = this.accountsService.getCurrentUserAccount();
		let current_ethAccount = EthAccounts.findOne({address: current_account.eth_address});
		let amountInWei = EthTools.toWei(amount);
		if(new BigNumber(amountInWei, 10).gt(new BigNumber(current_ethAccount.balance, 10))){
			this.formData.deposit_errors.push("Not enough balance");
		}
		if(this.formData.deposit_errors.length == 0){
			let targetAddress = this.wallet.eth_address;
			let sourceAddress = current_account.eth_address;
			let self = this;

			web3.personal.unlockAccount(sourceAddress, this.formData.eth_password, (err, result)=>{
				if(err){
					self.formData.deposit_errors.push("Invalid ethereum password");
					self.formData.isDepositing = false;
				}
				else{
					web3.eth.sendTransaction({
						from: sourceAddress,
						to: targetAddress,
						value: amountInWei
					}, (err, address) =>{
						if(err){
							self.formData.deposit_errors.push("Some internal error occurred. Please refresh the page and try again.");
							self.formData.isDepositing = false;
						}
						else{
							Transactions.insert({
								from_address: current_account.eth_address,
								to_address: this.wallet.eth_address,
								amount: amountInWei,
								created_at: new Date()
							});
							this.formData.deposit_message = "Balance deposited successfully.";
							self.resetData('deposit');
							self.isDeposit = false;
						}
					});
				}
			});
		}
		else{
			this.formData.isDepositing = false;
		}
	}
}
import {Mongo} from 'meteor/mongo';

export let Wallets = new Mongo.Collection<Wallet>('wallets');

Wallets.allow({
	insert: function(){
		let user = Meteor.user();

		return !!user;
	},
	update: function(){
		let user = Meteor.user();

		return !!user;
	},
	remove: function(){
		let user = Meteor.user();

		return !!user;
	}
});
import {Mongo} from 'meteor/mongo';

export let Transactions = new Mongo.Collection<Transaction>('transactions');

Transactions.allow({
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
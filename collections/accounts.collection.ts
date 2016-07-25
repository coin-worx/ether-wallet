import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export let AccountsCollection = new Mongo.Collection<Account>('accounts');

// Accounts.allow({
//     insert: function() {
//         let user = Meteor.user();
//
//         return !!user;
//     },
//     update: function() {
//         let user = Meteor.user();
//
//         return !!user;
//     },
//     remove: function() {
//         let user = Meteor.user();
//
//         return !!user;
//     }
// });
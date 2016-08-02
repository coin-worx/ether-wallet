import {Mongo} from 'meteor/mongo';

export let Projects = new Mongo.Collection<Project>('projects');

Projects.allow({
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
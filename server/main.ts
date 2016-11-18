import {Meteor} from 'meteor/meteor';


Meteor.users.allow({
	remove: (userId, doc) =>{
		return true;
	}
});

Meteor.publish("allUsers", function () {
	return Meteor.users.find({});
});
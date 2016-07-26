import {loadProjects} from './load-projects.ts';
import {Meteor} from 'meteor/meteor';

Meteor.startup(loadProjects);

Meteor.users.allow({
    remove: (userId, doc) => {
        return true;
    }
});
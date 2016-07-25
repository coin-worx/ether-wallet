
Meteor.users.allow({
    remove: (userId, doc) => {
        return true;
    }
});
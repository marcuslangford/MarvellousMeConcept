import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

export const Notes = new Mongo.Collection('notes');
export const Notifications = new Mongo.Collection('notifications');
export const Activites = new Mongo.Collection('activites');
export const Saved = new Mongo.Collection('saved');
export const Messages = new Mongo.Collection('messages');
export const Badges = new Mongo.Collection('badges');

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});
export const Activities = new Mongo.Collection('activities');
export const Saved = new Mongo.Collection('saved');
export const Messages = new Mongo.Collection('messages');
export const Badges = new Mongo.Collection('badges');
export const HomeTasks = new Mongo.Collection('hometasks');
export const Events = new Mongo.Collection('events');
export const Students = new Mongo.Collection('students');

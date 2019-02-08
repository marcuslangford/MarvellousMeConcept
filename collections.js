import { Mongo } from 'meteor/mongo';

export const Notes = new Mongo.Collection('notes');
export const Notifications = new Mongo.Collection('notifications');
export const Activites = new Mongo.Collection('activites');
export const Messages = new Mongo.Collection('messages');
export const Badges = new Mongo.Collection('badges');

import { Mongo } from 'meteor/mongo';


export const Activities = new Mongo.Collection('activities');

export const Messages = new Mongo.Collection('messages');
export const Badges = new Mongo.Collection('badges');
export const HomeTasks = new Mongo.Collection('hometasks');
export const Events = new Mongo.Collection('events');
export const Students = new Mongo.Collection('students');
export const Saved = new Mongo.Collection('saved');

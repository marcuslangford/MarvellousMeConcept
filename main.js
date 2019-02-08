import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Notes } from '../lib/collections.js';
import { Notifications } from '../lib/collections.js';
import { Activites } from '../lib/collections.js';
import { Badges } from '../lib/collections.js';
import { Saved } from '../lib/collections.js';
import { Messages } from '../lib/collections.js';
import { Mongo } from 'meteor/mongo'
import './main.html';

var user = "Marcus";



Template.body.helpers({


  notifications(){
    var item;

    //Find all new items in collections which are new
    newActivities = Activites.find({new : true});
    newMessages = Messages.find({new : true});
    newBadges = Badges.find({new : true});

    //Update items so they are no longer new and add an item to the notifications collection
    newActivities.forEach(function(item){
      Activites.update(
        {_id: item._id},
        {
          $set: {"new": false}
        }
      )
      Notifications.insert({"type" : "activity","text" : "Marcus Learned an Activity", "obID" : item._id})
    })
    newMessages.forEach(function(message){
      console.log(message._id._str)
      Messages.update(
        {_id: message._id},
        {
          $set: {"new": false}
        }
      )
      Notifications.insert({"type" : "Message","text" : "New Message!", "obID" : message._id})
    })
    newBadges.forEach(function(badge){
      console.log(badge._id._str)
      Badges.update(
        {_id: badge._id},
        {
          $set: {"new": false}
        }
      )
      Notifications.insert({"type" : "Badge","text" : "Marcus earned a new badge!", "obID" : badge._id})
    })
    //find the notification button from html
    x = document.getElementById('notify');
    //if there are notifications, make the notifications button pulse
    if(Notifications.find({}).count() != 0){
      x.className = "rightbtn waves-effect waves-light btn blue modal-trigger pulse";
    }
    else {
      x.className = "rightbtn waves-effect waves-light btn blue modal-trigger";
    }


    return Notifications.find({});


  },

  activites(){


    var start =  new Date();
    start.setHours(0,0,0,0);
    var end = new Date();
    end.setHours(23,59,59,999);
    if(Activites.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }}).count()!= 0){
      Session.set("atotal", Activites.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }}).count());
      console.log(Session.get("atotal"))
      getTotal();
    }

    switch(Session.get("anewTime")){

      case '1':

        if(Session.get("subjectFilter") != null){
          return Activites.find (
            {
              createdAt: {$gte: start, $lt: end},
              subject  : Session.get("subjectFilter")
            }
          );

        } else{

          return Activites.find({createdAt: {$gte: start, $lt: end}});
        }


      case '2':
        Session.set("atotal", Activites.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }}).count());
        getTotal();
        if(Session.get("subjectFilter") != null){

          return Activites.find (
              {
                createdAt: { $gt: new Date(start - (7*24*60*60*1000)) },
                subject  : Session.get("subjectFilter")
              }
          );
        }else{return Activites.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }})}

      case '3':
        if(Session.get("subjectFilter") != null){
          return Activites.find ({subject  : Session.get("subjectFilter")});
          break;
        }else{return Activites.find({})};

      case '4':
        return Activites.find ({ saved: true});

      case '5':
      dateSelected = document.getElementById('timePicker').value;

      document.getElementById('timePicker').value = "";
      if(Session.get("subjectFilter") != null){

        return Activites.find (
            {
              createdAt: { $eq: new Date(dateSelected) },
              subject  : Session.get("subjectFilter")
            }
        );

      }else{
        return Activites.find({createdAt: { $eq: new Date(dateSelected) }})

      }

    }




  },

  messages(){
    return Messages.find({});
  },

  badges(){
    var start =  new Date();
    start.setHours(0,0,0,0);
    var end = new Date();
    end.setHours(23,59,59,999);
    Session.set("btotal", Badges.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }}).count())
    getTotal();

    switch(Session.get("bnewTime")){

      case '1':

        return Badges.find({createdAt: {$gte: start, $lt: end}});

      case '2':

        return Badges.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }});

      case '3':

        return Badges.find({});

      case '4':

        return Badges.find({"saved" : true});

    }
  }



})
Template.notification.events({
  'click .delete-note': function(){
    Notifications.remove(this._id);
    return false;
  }
})

Template.message.events({
  'click .delete-message': function(){
    Messages.remove(this._id);
    return false;
  }
})



Template.ainputForm.onCreated(function(){
  Session.set("anewTime", "1" );
  Session.set("bnewTime", "1" );
  Session.set("subjectFilter", null);
});

Template.ainputForm.events({
  'click #asubmitTime' : function(event, template){
    console.log(event.target)
    Session.set("anewTime", "")
    if(document.getElementById("timePicker").value == ""){
      if(document.getElementById("r1").checked){
        Session.set("anewTime", "1");
      }
      else if(document.getElementById("r2").checked){
        Session.set("anewTime", "2");
      }
      else if(document.getElementById("r3").checked){
        Session.set("anewTime", "3");
      }
      else if(document.getElementById("r4").checked){
        Session.set("anewTime", "4");
      }
    }
    else if(document.getElementById("timePicker").value != ""){
      Session.set("anewTime", "5");
    }

    if(document.getElementById("s1").checked){
      Session.set("subjectFilter", "Maths");
    }
    else if(document.getElementById("s2").checked){
      Session.set("subjectFilter", "English");
    }
    else if(document.getElementById("s3").checked){
      Session.set("subjectFilter", "PE");
    }
    else if(document.getElementById("s4").checked){
      Session.set("subjectFilter", "Science");
    }
    else{Session.set("subjectFilter", null)};



  }
})

Template.binputForm.events({
  'click #bsubmitTime' : function(event, template){
    console.log(event.target)
    Session.set("bnewTime", "")
    if(document.getElementById("timePicker").value == ""){
      if(document.getElementById("b1").checked){
        Session.set("bnewTime", "1");
      }
      else if(document.getElementById("b2").checked){
        Session.set("bnewTime", "2");
      }
      else if(document.getElementById("b3").checked){
        Session.set("bnewTime", "3");
      }
      else if(document.getElementById("b4").checked){
        Session.set("bnewTime", "4");
      }
    }
    else if(document.getElementById("timePicker").value != ""){
      Session.set("bnewTime", "5");
    }
  }
})

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('MM-DD-YYYY');
});


Template.activity.events({
  'click .save-activity': function(){
    event.target.className = "save-activity material-icons right saved";

    Activites.update(
      {_id: this._id},
      {
        $set: {"saved": true}
      }
    )
    return false;
  }

});

Template.badge.events({
  'click .save-activity': function(){

    Badges.update(
      {_id: this._id},
      {
        $set: {"saved": true}
      }
    )
    return false;
  }

});

function getTotal(){
  x = document.getElementById('activitiesTotal');
  y = document.getElementById('badgesTotal');
  x.innerHTML = Session.get("atotal");
  y.innerHTML = Session.get("btotal");
}

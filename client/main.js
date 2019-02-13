import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Notes } from '../lib/collections.js';
import { Notifications } from '../lib/collections.js';
import { Activities } from '../lib/collections.js';
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
    newActivities = Activities.find({new : true});
    newMessages = Messages.find({new : true});
    newBadges = Badges.find({new : true});

    //Update items so they are no longer new and add an item to the notifications collection
    newActivities.forEach(function(item){
      console.log(item.student)
      Activities.update(
        {_id: item._id},
        {
          $set: {"new": false}
        }
      )
      Notifications.insert({"type" : "activity","text" : item.student +  " Learned an Activity", "obID" : item._id})
    })
    newMessages.forEach(function(message){
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

  activities(){

    var start =  new Date();
    start.setHours(0,0,0,0);
    var end = new Date();
    end.setHours(23,59,59,999);
    currentStudent = Session.get("student");

    if(Activities.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }}).count()!= 0){
      Session.set("atotal", Activities.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }, student : currentStudent}).count());
      console.log(Session.get("atotal"))
      getTotal();
    }
    y = document.getElementById('aempty');
    switch(Session.get("anewTime")){

      case '1':
        if(Activities.find({createdAt: {$gte: start, $lt: end}}).count() == 0){
          y.style.display = "block";
          y.innerHTML = "No new Activities today! "
        }
        else{y.style.display = "none"}

        if(Session.get("subjectFilter") != null){
          return Activities.find (
            {
              createdAt: {$gte: start, $lt: end},
              subject  : Session.get("subjectFilter"),
              student : currentStudent
            });

        } else{

          return Activities.find (
            {
              createdAt: {$gte: start, $lt: end},
              student  : currentStudent
            });
        }


      case '2':
        y.style.display = "none";
        Session.set("atotal", Activities.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }}).count());
        getTotal();
        if(Session.get("subjectFilter") != null){

          return Activities.find (
              {
                createdAt: { $gt: new Date(start - (7*24*60*60*1000)) },
                subject  : Session.get("subjectFilter"),
                student : currentStudent
              }
          );
        }else{return Activities.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }, student : currentStudent}, {sort : {createdAt: -1}})}

      case '3':
        y.style.display = "none";
        if(Session.get("subjectFilter") != null){
          return Activities.find ({subject  : Session.get("subjectFilter"), student : currentStudent});
          break;
        }else{return Activities.find({student : currentStudent}, {sort : {createdAt: -1}})};

      case '4':
        y.style.display = "none";
        return Activities.find ({ saved: true});

      case '5':
        y.style.display = "none";
        dateSelected = document.getElementById('timePicker').value;

        document.getElementById('timePicker').value = "";
        if(Session.get("subjectFilter") != null){

          return Activities.find (
              {
                createdAt: { $eq: new Date(dateSelected) },
                subject  : Session.get("subjectFilter"),
                student : currentStudent
              }
          );

        }else{
          return Activities.find({createdAt: { $eq: new Date(dateSelected) }, student : currentStudent})

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
    Session.set("btotal", Badges.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }, student : currentStudent}).count())
    getTotal();
    x = document.getElementById('bempty');
    switch(Session.get("bnewTime")){

      case '1':

        if(Badges.find({createdAt: {$gte: start, $lt: end}}).count() == 0){
          x.style.display = "block";
          x.innerHTML = "No new Badges today!"
        }

        return Badges.find({createdAt: {$gte: start, $lt: end}});

      case '2':
        x.style.display = "none";

        return Badges.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }});

      case '3':
        x.style.display = "none";

        return Badges.find({});

      case '4':
        x.style.display = "none";

        return Badges.find({"saved" : true});

    }
  }



})
Template.notification.events({
  'click .delete-note': function(){
    Notifications.remove(this._id);
    return false;
  }
});



Template.message.events({
  'click .delete-message': function(){
    Messages.remove(this._id);
    return false;
  }
})


Template.body.onCreated(function(){
  Session.set("anewTime", "1" );
  Session.set("bnewTime", "1" );
  Session.set("subjectFilter", null);
  Session.set("student", "James");



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

    Activities.update(
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

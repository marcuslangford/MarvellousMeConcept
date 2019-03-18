import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Notes } from '../lib/collections.js';
import { Notifications } from '../lib/collections.js';
import { Activities } from '../lib/collections.js';
import { HomeTasks } from '../lib/collections.js';
import { Badges } from '../lib/collections.js';
import { Saved } from '../lib/collections.js';
import { Messages } from '../lib/collections.js';
import { Students } from '../lib/collections.js';
import { Mongo } from 'meteor/mongo'
import './main.html';


var user = "Marcus";
var selected = [];
var lastPosition = 0;
console.log(selected);

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

    switch(Session.get("newTime")){

      case '1':
        if(Session.get("subjectFilter") != null){
          return Activities.find (
            {
              createdAt: {$gte: start, $lt: end},
              subject  : Session.get("subjectFilter"),
            });

        } else{

          return Activities.find (
            {
              createdAt: {$gte: start, $lt: end},
              student : {$in : currentStudent},
            });
        }


      case '2':
        if(Session.get("subjectFilter") != null){

          return Activities.find (
              {
                createdAt: { $gt: new Date(start - (7*24*60*60*1000)) },
                subject  : Session.get("subjectFilter"),
                student : {$in : currentStudent}
              }
          );
        }else{return Activities.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }, student : {$in : currentStudent}}, {sort : {createdAt: Session.get("order")}})}

      case '3':
        if(Session.get("subjectFilter") != null){
          return Activities.find ({subject  : Session.get("subjectFilter"), student : {$in : currentStudent}});
          break;
        }else{return Activities.find({student : {$in : currentStudent}}, {sort : {createdAt: Session.get("order")}})};

      case '4':
        return Activities.find ({ saved: true, student : {$in : currentStudent}});

      case '5':
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
    switch(Session.get("newTime")){

      case '1':
        return Badges.find({createdAt: {$gte: start, $lt: end}, student : {$in : currentStudent}});

      case '2':

        return Badges.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }, student : {$in : currentStudent}});

      case '3':

        return Badges.find({student : {$in : currentStudent}});

      case '4':

        return Badges.find({saved : true, student : {$in : currentStudent}});

    }
    return Badges.find({});
  },

  hometasks(){
    // var start =  new Date();
    // start.setHours(0,0,0,0);
    // var end = new Date();
    // end.setHours(23,59,59,999);
    // Session.set("btotal", Badges.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }, student : currentStudent}).count())
    // getTotal();
    // x = document.getElementById('bempty');
    // // switch(Session.get("bnewTime")){
    // //
    // //   case '1':
    // //
    // //     if(Badges.find({createdAt: {$gte: start, $lt: end}}).count() == 0){
    // //       x.style.display = "block";
    // //       x.innerHTML = "No new Badges today!"
    // //     }else{x.style.display = "none"}
    // //
    // //     return Badges.find({createdAt: {$gte: start, $lt: end}, student : currentStudent});
    // //
    // //   case '2':
    // //     x.style.display = "none";
    // //
    // //     return Badges.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }, student : currentStudent});
    // //
    // //   case '3':
    // //     x.style.display = "none";
    // //
    // //     return Badges.find({student : currentStudent});
    // //
    // //   case '4':
    // //     x.style.display = "none";
    // //
    // //     return Badges.find({saved : true, student : currentStudent});
    // //
    // // }

    return HomeTasks.find({});
  },

  applySettings(){
    document.getElementById('settingsSubmit').addEvent = function(){
      console.log(123)
    }
  },

  students(){
    return Students.find({});
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




Template.body.onRendered(function(){


  Session.set("newTime", "1" );
  Session.set("subjectFilter", null);
  Session.set("student", ["Marcus Langford", "James Langford"]);
  Session.set("selected", []);
  Session.set("showImg", true);
  Session.set("colourFull", false);
  document.getElementById('settingsSubmit').addEventListener("click", saveSettings, false)
  document.getElementById('delete').addEventListener("click", removeSelected, false)
  document.getElementById('studentsSubmit').addEventListener("click", function(){
    Session.set("newTime", temp);
    $('#studentsModal').modal('close');


  }, false)
  Session.set("order", "-1");
  $(window).scroll(function(event){
    didScroll = false
    if(selected.length == 0){
      if (this.window.scrollY >= lastPosition && didScroll == false) {
          didScroll = true
          lastPosition = this.window.scrollY;
          document.getElementById('priBlue').className = "priBlue hidden animated slideInDown delay-2s"
      }
      else if(didScroll == false){
          lastPosition = this.window.scrollY;
          document.getElementById('priBlue').className = "priBlue animated slideInUp delay-2s"
      }
    }


  });



});

Template.activity.onRendered(function(){
  $('.materialboxed').materialbox();
  getColour(Template.instance());
  console.log(Template.instance())
  if(this.data.img == "" || Session.get("showImg") == false){
    this.firstNode.childNodes[1].childNodes[1].childNodes[11].children[0].style = "display: none"
  }
});

Template.badge.onRendered(function(){
  if(this.data.student == "James Langford"){
    this.firstNode.childNodes[1].childNodes[1].className = "card-content student1 black-text"
  }else if(this.data.student == "Marcus Langford"){
    this.firstNode.childNodes[1].childNodes[1].className = "card-content student2 black-text"
  }


});

Template.inputForm.events({
  'click #asubmitTime' : function(event, template){

    var students = []
    Session.set("student", [])
    Session.set("newTime", "")
    if(document.getElementById("timePicker").value == ""){
      if(document.getElementById("r1").checked){
        document.getElementById('title').innerHTML = "Today"
        Session.set("newTime", "1");
      }
      else if(document.getElementById("r2").checked){
        document.getElementById('title').innerHTML = "This Week"
        Session.set("newTime", "2");
      }
      else if(document.getElementById("r3").checked){
        document.getElementById('title').innerHTML = "All"
        Session.set("newTime", "3");
      }
      else if(document.getElementById("r4").checked){
        Session.set("newTime", "4");
      }
    }
    else if(document.getElementById("timePicker").value != ""){
      Session.set("newTime", "5");
    }
    for(i = 0; i < 2; i++){
      if (document.getElementsByClassName('studentCheck')[i].checked){
        students.push(document.getElementsByClassName('studentCheck')[i].value)
      }
    }
    Session.set("student", students);
    if(Session.get("student").length == 0){
      var $toastContent = $('<span>Select at least one student!</span>').add($('<button id = "back" class="btn-flat toast-action">Back</button>'));
      Materialize.toast($toastContent, 10000, 'topToast');
      document.getElementById('back').addEventListener("click", function(){
        $('#FilterModal').modal('open');
      }, false)
    }

    if(document.getElementsByClassName('chip selected').length != 0){

      Session.set("subjectFilter", document.getElementsByClassName('chip selected')[0].childNodes[0].textContent)
    }
    else{Session.set("subjectFilter", null)}
    refresh();

  }
})

Template.registerHelper('formatDate', function(date) {
  switch(Session.get("newTime")){
    case '1':
      return moment(date).fromNow();

    case '2':
      return moment(date).format('dddd'+' MM-DD-YYYY');
    case '3':
      return moment(date).format('MM-DD-YYYY');
  }
});



Template.activity.events({
  'click .more': function(){
    $('#moreModal').modal('open');
    Session.set("eventAction", this);

  },

  'click .open': function(){


    if(selected == "" && event.target.id == "select"){
      document.getElementById('delete').style = "display: block";
      document.getElementById('filter').style = "display: none"
      document.getElementById('priBlue').className = "priBlue hidden animated slideInDown delay-2s"

    }else if(selected.length == 1 && event.target.className == "open selected card-content white"){
      document.getElementById('delete').style = "display: none";
      document.getElementById('filter').style = "display: block"
      document.getElementById('priBlue').className = "priBlue animated slideInUp delay-2s"
    }

    if(event.target.id == "select"){
      if(event.target.className == "open selected card-content white"){
        event.target.className = "open card-content white"
        selected.pop(this);
      }else{
        event.target.className = "open selected card-content white"
        selected.push(this);
      }
     }




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

Template.student.onRendered(function(){

  this.lastNode.childNodes[1].childNodes[1].id = this.data._id._str
  this.lastNode.childNodes[1].childNodes[1].addEventListener("change", function(){
    console.log(this)
    Students.update(
      {_id: new Mongo.ObjectID(this.id)},
      {
        $set: {"colour": this.value}
      }
    )
    refresh();

  }, false)

});

Template.studentFormAdd.events({
  'click #addStudentBtn': function(){
    Students.insert(
      {"_id" : new Mongo.ObjectID, "name" : document.getElementById('first_name').value + ' ' + document.getElementById('last_name').value, "colour" : document.getElementById('addStudentColour').value}
    )
  }
})

Template.activityActions.events({
  'click .saveActivity': function(){
    a = (Session.get("eventAction"))
    console.log(a._id)
    Saved.insert({"_id" : a._id, "subject" : a.subject, "text" : a.text, "createdAt": a.createdAt, "saved" : true, "student" : a.student, "img" : a.img})
    var $toastContent = $('<span>Event added to favourites</span>').add($('<button id = "undoSave" class="btn-flat toast-action">Undo</button>'));
    Materialize.toast($toastContent, 10000, 'topToast');
    document.getElementById('undoSave').addEventListener("click", undoSave, false)
  },
  'click .deleteActivity' : function(){
    a = (Session.get("eventAction"))
    selected.push(a);
    removeSelected();
  }

})

function saveSettings(){
  if(document.getElementById('s2').checked){
    Session.set("order", "1");

  }else{Session.set("order", "-1")}

  if(document.getElementById('hideImg').checked){
    Session.set("showImg", false);
  }
  if(document.getElementById('colourCard').checked){
    Session.set("colourFull", true);
    refresh();
  }
  else if(document.getElementById('colourCard').checked == false){
    Session.set("colourFull", false);
    refresh();
  }
}

function getColour(a){
  b = Students.findOne({"name" : a.data.student})
  if(Session.get("colourFull") == true){
    a.firstNode.childNodes[1].childNodes[1].style = "background-color:" + b.colour +"!important";
    a.firstNode.childNodes[1].childNodes[1].className = "open card-content white white-text";
  }
  else{
    a.firstNode.childNodes[1].childNodes[1].style = "background: linear-gradient(to right, white 95%, " + b.colour + " 50%);"
  }

}

function removeSelected(){
  num = selected.length
  for(i = 0; i < num; i++){
    Activities.remove(
      {_id: selected[i]._id}
    )
  }
  var $toastContent = $('<span>'+num+' events deleted</span>').add($('<button id = "undo" class="btn-flat toast-action">Undo</button>'));
  Materialize.toast($toastContent, 10000, 'topToast');
  document.getElementById('undo').addEventListener("click", undoRemove, false)
  tempSelected = selected;
  selected = [];
  document.getElementById('delete').style = "display: none";
  document.getElementById('filter').style = "display: block"
}

function undoRemove(){
  for(i = 0; i < num; i++){
    Activities.insert(
      {"_id" : tempSelected[i]._id, "subject" : tempSelected[i].subject, "text" : tempSelected[i].text, "createdAt": tempSelected[i].createdAt, "saved" : false, "student" : tempSelected[i].student, "img" : tempSelected[i].img}
    )
  }
  var $toastContent = $('<span>'+num+' events re-added </span>')
  Materialize.toast($toastContent, 10000, 'topToast');
  var toastElement = $('.toast').first()[0];
  var toastInstance = toastElement.M_Toast;
  toastInstance.remove();
  refresh();
}

function undoSave(a){
  console.log(Session.get("eventAction"))
  Activities.update(
    {_id: a._id},
    {
      $set: {"saved": false}
    }
  )
  var $toastContent = $('<span>Event removed from favourites</span>')
  Materialize.toast($toastContent, 10000, 'topToast');
  var toastElement = $('.toast').first()[0];
  var toastInstance = toastElement.M_Toast;
  toastInstance.remove();

}

function refresh(){
  temp = Session.get("newTime");
  Session.set("newTime", "0");
  setTimeout(function(){ Session.set("newTime", temp); }, 500);
}

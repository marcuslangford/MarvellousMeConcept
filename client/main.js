import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Activities } from '../lib/collections.js';
import { HomeTasks } from '../lib/collections.js';
import { Badges } from '../lib/collections.js';
import { Saved } from '../lib/collections.js';
import { Messages } from '../lib/collections.js';
import { Students } from '../lib/collections.js';
import { Mongo } from 'meteor/mongo'
import './main.html';


var selected = [];
var students = [];
var subjects = [];
var defaultStudents = [];
var lastPosition = 0;
var selectedChips = []
var selectedChipsSubject = []

Template.body.helpers({




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
              subject  : {$in : Session.get("subjectFilter")},
            });

        } else{

          return Activities.find (
            {
              createdAt: {$gte: start, $lt: end},
              student : {$in : currentStudent}},
              {sort : {createdAt: Session.get("order")}}
          )};



      case '2':
        if(Session.get("subjectFilter") != null){

          return Activities.find (
              {
                createdAt: { $gt: new Date(start - (7*24*60*60*1000)) },
                subject  : {$in : Session.get("subjectFilter")},
                student : {$in : currentStudent}
              }
          );
        }else{return Activities.find({createdAt: { $gt: new Date(start - (7*24*60*60*1000)) }, student : {$in : currentStudent}}, {sort : {createdAt: Session.get("order")}})}

      case '3':
        if(Session.get("subjectFilter") != null){
          return Activities.find ({subject  : {$in : Session.get("subjectFilter")}, student : {$in : currentStudent}});
          break;
        }else{return Activities.find(
          {
            student : {$in : currentStudent}},
           {sort : {createdAt: Session.get("order")}}
       )};

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

  applySettings(){
    document.getElementById('settingsSubmit').addEvent = function(){
      console.log(123)
    }
  },

  students(){
    return Students.find({});
  },

  saved(){
    return Saved.find ({});
  }


})


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
  if(this.data.img == "" || Session.get("showImg") == false){
    this.firstNode.childNodes[1].childNodes[1].childNodes[11].children[0].style = "display: none"
  }
  if(Session.get("cardSize") == "compact"){
    console.log(this)
    this.firstNode.childNodes[1].childNodes[1].childNodes[9].attributes[1].textContent = "display:none"
    this.firstNode.childNodes[1].childNodes[1].childNodes[13].style = "display : block";
  }
  else{
    this.firstNode.childNodes[1].childNodes[1].childNodes[9].style == "display:block"
    this.firstNode.childNodes[1].childNodes[1].childNodes[13].style = "display : none";
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


    Session.set("newTime", "")
    if(document.getElementById("timePicker").value == ""){
      if(document.getElementById("r1").checked){
        document.getElementById('main').style = "display: block"
        document.getElementById('savedContainer').style = "display: none"
        Session.set("newTime", "1");
      }
      else if(document.getElementById("r2").checked){
        document.getElementById('main').style = "display: block"
        document.getElementById('savedContainer').style = "display: none"
        Session.set("newTime", "2");
      }
      else if(document.getElementById("r3").checked){
        document.getElementById('main').style = "display: block"
        document.getElementById('savedContainer').style = "display: none"
        Session.set("newTime", "3");
      }
      else if(document.getElementById("r4").checked){
        document.getElementById('main').style = "display: none"
        document.getElementById('savedContainer').style = "display: block"
        Session.set("newTime", "4");
      }
    }
    else if(document.getElementById("timePicker").value != ""){
      Session.set("newTime", "5");
    }


    if(document.getElementsByClassName('chip selected').length != 0){

      Session.set("subjectFilter", document.getElementsByClassName('chip selected')[0].childNodes[0].textContent)
    }
    else{Session.set("subjectFilter", null)}
    refresh(100);

  }
})

Template.registerHelper('formatDate', function(date) {
  switch(Session.get("newTime")){
    case '1':
      return moment(date).fromNow();
    case '2':
      return moment(date).format('dddd');
    case '3':
      return moment(date).format('DD-MM-YYYY');
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




  },
  'click .activityExpand': function(){
    if(Session.get("cardSize") == "compact"){
      if(event.path[2].childNodes[9].attributes[1].nodeValue == "display:block"){
        event.path[2].childNodes[9].attributes[1].nodeValue = "display:none"
      }else{
        event.path[2].childNodes[9].attributes[1].nodeValue = "display:block"
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
    refresh(500);

  }, false)

});



Template.studentFormAdd.events({
  'click #addStudentBtn': function(){
    addStudent();
  }
})


Template.topFilter.events({
  'click .chips-student': function(){
    var data= $('.chips-student').material_chip('data');
    for(i = 0; i < data.length; i++){
      b = Students.findOne({"name" : data[i].value})
      if(data[i].value.match(event.target.innerText)){
        if(selectedChips.includes(data[i].value)){
          selectedChips.splice(selectedChips.indexOf(data[i].value), 1)
          students.splice(students.indexOf(data[i].value),1)
          event.target.style = "background-color : inherit !important; color : rgba(0,0,0,0.6) !important"
          Session.set("student", students)
          // refresh();
        }
        else{

          selectedChips.push(data[i].value)
          students.push(data[i].value)
          if (i == 0){
            event.target.className = "chip chipleft";
          }else if(i == data.length-1){
            event.target.className = "chip chipright";
          }else{
            event.target.className = "chip chipMiddle"
          }
          event.target.style = "background-color :"+ b.colour + " !important; color : white !important"

          Session.set("student", students)
          // refresh();
        }


      }
    }
    refresh(100);


  },

  'click .chips-time': function(){

    x = document.getElementsByClassName('chips-time')[0].childNodes
    for(i = 0; i < x.length; i++){
      x[i].style = "background-color : inherit !important; color : rgba(0,0,0,0.6) !important"

    }

    var selectedTime = null
    var dataTime = $('.chips-time').material_chip('data');
    for(i = 0; i < dataTime.length; i++){

      if(dataTime[i].tag.match(event.target.innerText)){
        console.log(i)
        if (i == 0){
          event.target.className = "chip chipleft";
        }else if(i == dataTime.length-1){
          event.target.className = "chip chipright";
        }else{
          event.target.className = "chip chipMiddle"
        }
        selectedTime = dataTime[i].value
        Session.set("newTime", selectedTime);
        event.target.style = "background-color : #ffb300 !important; color : white !important";
        refresh(500);


      }
    }
  },
  'click .chips-subject': function(){
    var data= $('.chips-subject').material_chip('data');
    for(i = 0; i < data.length; i++){

      if(data[i].value.match(event.target.innerText)){
        if(selectedChipsSubject.includes(data[i].value)){
          selectedChipsSubject.splice(selectedChipsSubject.indexOf(data[i].value), 1)
          subjects.splice(subjects.indexOf(data[i].value),1)
          event.target.style = "background-color : inherit !important; color : rgba(0,0,0,0.6) !important"
          console.log(subjects)
          if(subjects.length == 0){
            Session.set("subjectFilter", null)
          }else{
            Session.set("subjectFilter", subjects)
          }

        }
        else{

          selectedChipsSubject.push(data[i].value)
          subjects.push(data[i].value)
          if (i == 0){
            event.target.className = "chip chipleft";
          }else if(i == data.length-1){
            event.target.className = "chip chipright";
          }else{
            event.target.className = "chip chipMiddle"
          }
          event.target.style = "background-color : rgb(220, 92, 92) !important; color : white !important"

          Session.set("subjectFilter", subjects)
        }


      }
    }

    refresh(100);


  }
})

Template.activityActions.onRendered(function(){
  a = Session.get("eventAction")

});

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
  }else {
    Session.set("showImg", true);
  }
  if(document.getElementById('colourCard').checked){
    Session.set("colourFull", true);

  }
  else if(document.getElementById('colourCard').checked == false){
    Session.set("colourFull", false);

  }
  if(document.getElementById('c2').checked){
    Session.set("cardSize", "compact");

  }else{Session.set("cardSize", "full")}

  refresh(500);

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
  document.getElementById('priBlue').className = "priBlue animated slideInUp delay-2s";
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
  refresh(500);
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

function addStudent(){
  first= document.getElementById('first_name').value
  last = document.getElementById('last_name').value
  var letters = /^[A-Za-z]+$/;

  var letters = /^[A-Za-z]+$/;
  if(first.match(letters) && last.match(letters))
  {
    Students.insert(
      {"_id" : new Mongo.ObjectID, "name" : first + ' ' + last, "colour" : document.getElementById('addStudentColour').value}
    )
    return true
  }
  else
  {
    alert('Only Enter Letters!');
    return false;
  }

}

function refresh(t){
  temp = Session.get("newTime");
  Session.set("newTime", "0");
  setTimeout(function(){ Session.set("newTime", temp); }, t);
}

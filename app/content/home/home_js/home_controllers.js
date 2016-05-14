'use strict';

/* Controllers */

var NCMainControllers = angular.module('NCMainControllers', ['ngCookies']);

NCMainControllers.controller('LoginCheck', function($scope, $cookies, $location) {
  var absUrl = "";
  console.log("Cookie check controller initialised");

  //check for cookie, if exists keep login, if not redirect the user to login page
  var cookie = $cookies.get('sessionCookie');
  console.log(cookie);

  if (cookie == undefined) {
    //to do if user is not logged in
    window.alert("You are not logged in.");
    absUrl = $location.absUrl();
    absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
    absUrl = absUrl + "/login/login.html";
    window.location.replace(absUrl);
  }

  $scope.logOut = function() {
    //delete cookie here
    console.log("Deleting cookie");
    $cookies.remove('sessionCookie', {path: '/app/content/home/home.html'});
    var cookie = $cookies.get('sessionCookie');
    console.log(cookie);
    absUrl = $location.absUrl();
    absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
    absUrl = absUrl + "/login/login.html";
    window.location.replace(absUrl);
  }
});

NCMainControllers.controller('EventListCtrl', function($scope, $firebaseArray) {
    var $load = $('<div class="loading"><img class="loadingimg" src="../../img/loading.gif"></div>').appendTo('body')
    , db = new Firebase("https://popping-heat-6810.firebaseio.com/events")
  db.on('value', function () {
    $load.hide()
  })

  var ref = new Firebase("https://popping-heat-6810.firebaseio.com/events");
  // download the data into a local object
  $scope.events = $firebaseArray(ref);
  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
  // syncObject.$bindTo($scope, "events");
});

NCMainControllers.controller('AddAmountCtrl', function($scope, $firebaseObject, $cookies) {
  console.log('AddAmountCtrl');
  $scope.userEmail = $cookies.get('sessionCookie');
  $scope.amount = function(){
    console.log('amount function');
var ref = new Firebase("https://popping-heat-6810.firebaseio.com/Variables/Balance");
  var obj = new $firebaseObject(ref);
 obj.$loaded().then(function() {
    var sum =0;
    sum = (parseInt(obj.$value));
    console.log("Current Balance: "+sum);
      sum = sum + 500;
      console.log("After adding 500: "+sum);
      obj.$value = sum;
      obj.$save();
  console.log('New current Balance:'+ obj.$value);
  });

}

});

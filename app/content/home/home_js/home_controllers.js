'use strict';

/* Controllers */
var jq = $.noConflict();

var NCMainControllers = angular.module('NCMainControllers', ['ngCookies']);

NCMainControllers.controller('LoginCheck', function($scope, $cookies, $location, $rootScope) {
  var absUrl = "";
  $rootScope.$on('$viewContentLoading',
  function(event, viewConfig){
    // Access to all the view config properties.
    // and one special property 'targetView'
    // viewConfig.targetView
    var absUrl = "";
    console.log("Cookie check controller initialised");

    //check for cookie, if exists keep log in, if not redirect the user to login page
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
  });

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
  var $load = jq('<div class="loading"><img class="loadingimg" src="../../img/loading.gif"></div>').appendTo('body')
  , db = new Firebase("https://nustcoin.firebaseio.com/events")
  db.on('value', function () {
    $load.hide()
  })

  var ref = new Firebase("https://nustcoin.firebaseio.com/events");
  // download the data into a local object
  $scope.events = $firebaseArray(ref);
  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
  // syncObject.$bindTo($scope, "events");
});


NCMainControllers.controller('TransactionDetailsCtrl', function($scope, $firebaseArray, $firebaseObject, $cookies, $location) {  //This control redirects to the Transaction Details page after clicking a button on homepage
  console.log("Transaction Details Controller Initialised");
  jq('.errormessage').hide();

  var email = $cookies.get('sessionCookie');
  email = email.substring(0, email.indexOf("@"));
  email = email.toLowerCase();
  email = email.toString();
  console.log(email);

  var myaccount = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+email);
  console.log("Loading Transaction Details...");
  myaccount.on("value", function(snapshot) {
    if (snapshot.val()) {
      for (var i = 0; i < snapshot.val().length; i++) {
        $scope.transactions = $firebaseObject(myaccount);

      }
    }
    else {
      jq('.errormessage').show();
      console.log('else condition');
      $scope.error = "You don't have any transactions.";
    }
  })

});













NCMainControllers.controller('AddAmountCtrl', function($scope, $firebaseObject, $cookies, $location, $firebaseArray) {
  var studentEmailAuth = new Firebase("https://nustcoin.firebaseio.com/users/studentEmail");
  var vendorEmailAuth = new Firebase("https://nustcoin.firebaseio.com/users/vendorEmail");
  var auth = false;
  var auth2 =false;
  console.log('AddAmountCtrl');
  var email = $cookies.get('sessionCookie');
  email = email.substring(0, email.indexOf("@"));
  email = email.toLowerCase();
  email = email.toString();
  console.log(email);
  $scope.userEmail = $cookies.get('sessionCookie');

  var myaccount = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+email);
  /*console.log("Loading Transaction Details...");
  $scope.transactions = $firebaseArray(myaccount);*/
  myaccount.on("value", function(snapshot) {
    //  for (var i = 0; i < snapshot.val().length; i++) {
    var length= snapshot.val().length;
    console.log(length);
  $scope.transactions = $firebaseArray(myaccount);
  $scope.in = length -1;
//  }
  })
  $scope.amount = function(e){
    console.log('amount function');
    console.log("Checking validity of email entered...");

    e.preventDefault();
    var eid = $scope.user.studentid;
    //  var auth = "false";
    //search for students
    studentEmailAuth.on("value", function(snapshot){
      for (var i = 0; i < snapshot.val().length; i++) {
        if (eid == snapshot.val()[i]) {
          console.log("Student found");
          auth = true;
          break;
        }
        else{
          //console.log("Not found");
          auth = false;
        }
      }
    })

    vendorEmailAuth.on("value", function(snapshot){
      for (var i = 0; i < snapshot.val().length; i++) {
        if (eid == snapshot.val()[i]) {
          console.log("Vendor found");
          auth2 = true;
          break;
        }
        else{
          //console.log("Not found");
          auth2 = false;
        }
      }
    })
    var id = $scope.user.studentid;   //will have user 2's email id
    var amount = $scope.user.amount;  //the amount to be transferred

    console.log(id);
    console.log(amount);
    id = id.substring(0, id.indexOf("@"));  //extracting user2's id from email
    console.log(id);
    id = id.toLowerCase();
    id = id.toString();
    console.log("User2's id:" +id);
    console.log("Processing Transfer Request..");
    console.log(auth);

    var ref = new Firebase("https://nustcoin.firebaseio.com/usersData/"+email+"/AccessLevel");
    var obj = new $firebaseObject(ref);

    var ref2 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+id+"/AccessLevel");
    var obj2 = new $firebaseObject(ref2);

    var ref3 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+email+"/Balance");   // accesing user 1's balance from the databse
    var obj3 = new $firebaseObject(ref3);

    var ref4 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+id+"/Balance");   // accesing user 2's balance from the databse
    var obj4 = new $firebaseObject(ref4);

    obj2.$loaded(),obj.$loaded(),obj3.$loaded(),obj4.$loaded().then(function(){
      var first = ""
      var second = ""
      var existingBal = 0 ;
      var studentBal =0;
      first = obj.$value;
      second= obj2.$value;
      existingBal = parseInt(obj3.$value);    //user 1's existing balance in the database
      studentBal = parseInt(obj4.$value);    //user 2's existing balance in the database

      console.log("user1's access level is:" +first);
      console.log("user2's access level is:" +second);
      console.log("User1's existingBal: " + existingBal);
      console.log("User2's existingBal: " + studentBal);

      if(((first == "admin" && second =="student") || (first == "student" && second =="student") || (first == "student" && second =="vendor")) && ((auth ==true) || (auth2 == true))){  // if user 1 is admin and user 2 is a student
        console.log("Processing Transfer Request.....")
        if(existingBal >= amount)  {//checking if the amount user wants to transfer is available in his account
          console.log("Valid Trasfer request");

          console.log("Senders Current Balance: "+ existingBal);
          existingBal = existingBal - amount;
          obj3.$value = existingBal;
          obj3.$save();
          console.log("After subtracting amount, new bal: "+ existingBal);

          console.log("Receivers' Current Balance: "+ studentBal);
          studentBal = studentBal + amount;
          obj4.$value = studentBal;
          obj4.$save();
          console.log("After adding amount, new bal: "+ studentBal);

          console.log(first+" to " +second+ " Transfer Completed");
        }
        else{
          console.log("Your account balance is insufficient");
        }
      }
      else{
        console.log("Invalid Transfer Request");
      }
    });
  }

  $scope.details = function(e){
    var absUrl ="";
    absUrl = $location.absUrl();
    console.log(absUrl);
    absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
    absUrl = absUrl + "/home/home.html#/transactions";
    console.log(absUrl);
    window.location.replace(absUrl);
  }
});

NCMainControllers.controller('EventDetailCtrl', ['$scope', '$stateParams', '$http',
function($scope, $stateParams, $http) {
  $http.get('events_data/' + $stateParams.eventId + '.json').success(function(data) {
    console.log('events json working');
    $scope.event = data;
  });
}]);

NCMainControllers.controller('FaqCtrl', ['$scope', '$http',
function($scope, $http) {
  $http.get('content/faq_data/faq.json').success(function(data) {
    console.log('faqs json working');
    $scope.faq = data;
  });
}]);

NCMainControllers.controller('Faq2Ctrl', ['$scope', '$http',
function($scope, $http) {
  $http.get('../faq_data/faq.json').success(function(data) {
    console.log('faqs json working');
    $scope.faq = data;
  });
}]);

NCMainControllers.controller('PurchaseCtrl', function(Authentication, PurchaseService, $scope, $firebaseArray,$firebaseObject, $cookies, $location) {
  $scope.receipt = function(e) {
    var userEmail = $cookies.get('sessionCookie');
    console.log(userEmail);
    var userPassword = $scope.userPassword;
    Authentication.login(userEmail, userPassword).then(function(){
          //use authData
          $scope.transactionCode = PurchaseService.GenerateCode();
          $scope.email = userEmail;
          var amount = parseInt($scope.user.amount);
          console.log(amount);
          userEmail = userEmail.substring(0, userEmail.indexOf("@"));
          console.log(userEmail);
          var ref = new Firebase("https://nustcoin.firebaseio.com/usersData/"+userEmail+"/Balance");   // accesing user 1's balance from the databse
          var obj = new $firebaseObject(ref);
          var existingBal = obj.$value;    //user 1's existing balance in the database
          console.log(existingBal);
          existingBal = existingBal - amount;
          console.log(existingBal);
          obj.$value = existingBal;
          obj.$save();
          console.log("successful authentication in controller");
          jq(".receipt").show();

        }, function(error){
          console.log(error);
        });
    } //login

});

NCMainControllers.controller('AboutCtrl', ['$scope',
function($scope) {
  console.log("About controller working");
  jq("#paraB").hide();
  jq(document).ready(function(){
    jq('#story').click(function(){
      jq("#paraB").show();
      jq("#paraA").hide();
    });
    jq('#product').click(function(){
      jq("#paraA").show();
      jq("#paraB").hide();
    });

  })
}]);

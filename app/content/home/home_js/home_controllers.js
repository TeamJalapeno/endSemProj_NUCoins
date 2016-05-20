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

NCMainControllers.controller('RecentTransactionControl', function($scope, $firebaseArray, $cookies) {
  console.log("Rcent transactions Controller Initialised");

  var email = $cookies.get('sessionCookie');
  email = email.substring(0, email.indexOf("@"));
  email = email.toLowerCase();
  email = email.toString();
  console.log(email);

  // var myaccount = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+email);
  var $load = jq('<div style = "width:100px;height:100px;"><img style = "width:150px;height:150px;"src="../../img/loading.gif"></div>').appendTo('.transactiondiv')
  , myaccount = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+email)
  myaccount.on('value', function () {
    $load.hide()
  })

  $scope.messages = $firebaseArray(myaccount);
  var query = myaccount.orderByChild("Age").limitToLast(5);
  $scope.transactions = $firebaseArray(query);
});

NCMainControllers.controller('RecentEventsControl', function($scope, $firebaseArray, $cookies) {
  console.log("Rcent events Controller Initialised");

  var myaccount = new Firebase("https://nustcoin.firebaseio.com/events");

  $scope.messages = $firebaseArray(myaccount);
  var query = myaccount.orderByChild("Age").limitToLast(5);
  $scope.events = $firebaseArray(query);
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
    //  for (var i = 0; i < snapshot.val().length; i++) {
        $scope.transactions = $firebaseObject(myaccount);

    //  }
    }
    else {
      jq('.errormessage').show();
      console.log('else condition');
      $scope.error = "You don't have any transactions.";
    }
  })

});

NCMainControllers.controller('AddAmountCtrl', function(TransactionService, $scope, $cookies, $location, $filter) {

  $scope.userEmail = $cookies.get('sessionCookie').substring(0, $cookies.get('sessionCookie').indexOf("@"));

  $scope.amount = function(e){
    var email = $cookies.get('sessionCookie');
    email = email.substring(0, email.indexOf("@"));
    email = email.toLowerCase();
    email = email.toString();
    console.log(email);
    $scope.userEmail = $cookies.get('sessionCookie');
    var reciever = $scope.user.receiver;
    var amount = $scope.user.amount;
    var title = $scope.user.titles;
    var description = $scope.user.descriptions;
    var date = new Date();
    $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');
    $scope.hhmmsstt = $filter('date')(new Date(), 'hh:mm:ss a');
    var tDate = $scope.ddMMyyyy;
    var tTime = $scope.hhmmsstt;

    TransactionService.TwoWayTransaction(email, reciever, amount, title, description, tDate, tTime);
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

NCMainControllers.controller('EventsBuyCtrl', ['TransactionService', 'PurchaseService', '$cookies', '$scope', '$stateParams', '$http', '$firebaseObject', 'Authentication',
function(TransactionService, PurchaseService, $cookies, $scope, $stateParams, $http, $firebaseObject, Authentication) {
  $http.get('events_data/' + $stateParams.eventId + '.json').success(function(data) {
    console.log('events buy json working');
    $scope.event = data;

    var userEmail = $cookies.get('sessionCookie');

    userEmail = userEmail.substring(0, userEmail.indexOf("@"));
    console.log(userEmail);
    var ref = new Firebase("https://nustcoin.firebaseio.com/usersData/"+userEmail+"/Balance");   // accesing user 1's balance from the databse
    var obj = new $firebaseObject(ref);
    obj.$loaded().then(function() {
      var balance = obj.$value;
      console.log(balance);
      $scope.balance = balance;
      $scope.balance2 = balance - parseInt($scope.event.cost);
    })

    $scope.eventBuy = function(e) {
      var userEmail = $cookies.get('sessionCookie');
      var userPassword = $scope.userPassword;
      Authentication.login(userEmail, userPassword).then(function(){
            //use authData
            $scope.transactionCode = PurchaseService.GenerateCode();

            console.log('events transaction working');
            userEmail = userEmail.substring(0, userEmail.indexOf("@"));
            userEmail = userEmail.toLowerCase();
            userEmail = userEmail.toString();
            console.log(userEmail);
            var reciever = $scope.event.recEmail;
            var amount = parseInt($scope.event.cost);
            TransactionService.TwoWayTransaction(userEmail, reciever, amount);
            $scope.username = userEmail;
            console.log("successful authentication in controller");
            jq(".receipt").show();

          }, function(error){
            console.log("Password authentication failed, enter again:");
          });

}
  });



  // $scope.details = function(e){
  //   var absUrl ="";
  //   absUrl = $location.absUrl();
  //   console.log(absUrl);
  //   absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
  //   absUrl = absUrl + "/home/home.html#/transactions";
  //   console.log(absUrl);
  //   window.location.replace(absUrl);
  // }
}]);

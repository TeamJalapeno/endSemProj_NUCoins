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

    //check for cookie, if exists keep log in, if not redirect the user to login page
    var cookie = $cookies.get('sessionCookie');

    if (cookie == undefined) {
      absUrl = $location.absUrl();
      absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));

      absUrl = absUrl + "/login/sessionExpired.html";
      window.location.replace(absUrl);
    }
  });

  $scope.logOut = function() {
    //delete cookie here
    $cookies.remove('sessionCookie', {path: '/app/content/home/home.html'});
    var cookie = $cookies.get('sessionCookie');
    absUrl = $location.absUrl();
    absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
    absUrl = absUrl + "/login/loggedOut.html";
    window.location.replace(absUrl);
  }
});

NCMainControllers.controller('RecentTransactionControl', function($scope, $firebaseArray, $cookies) {
  var email = $cookies.get('sessionCookie');
  email = email.substring(0, email.indexOf("@"));
  email = email.toLowerCase();
  email = email.toString();

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

NCMainControllers.controller('RechargeAccountCtrl', function(RechargeService, $scope, $firebaseArray, $cookies, $filter) {
  $scope.recharge = function(e) {
    var code = $scope.rechargeCode;
    var email = $cookies.get('sessionCookie');
    email = email.substring(0, email.indexOf("@"));
    email = email.toString();
    var date = new Date();
    $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');
    $scope.hhmmsstt = $filter('date')(new Date(), 'hh:mm:ss a');
    var tDate = $scope.ddMMyyyy;
    var tTime = $scope.hhmmsstt;
    RechargeService.Recharge(email, code, tDate, tTime);

  }
});

NCMainControllers.controller('RecentEventsControl', function($scope, $firebaseArray, $cookies) {
  var myaccount = new Firebase("https://nustcoin.firebaseio.com/events");
  $scope.messages = $firebaseArray(myaccount);
  var query = myaccount.orderByChild("Age").limitToLast(3);
  $scope.events = $firebaseArray(query);
});

NCMainControllers.controller('EventListCtrl', function($scope, $firebaseArray, $filter) {
  var $load = jq('<div class="loading"><img class="loadingimg" src="../../img/loading.gif"></div>').appendTo('.ev')
  , db = new Firebase("https://nustcoin.firebaseio.com/events")
  db.on('value', function () {
    $load.hide()
  })

  var ref = new Firebase("https://nustcoin.firebaseio.com/events");
  // download the data into a local object
  $scope.events = $firebaseArray(ref);

  $scope.updateEvents = function() {
    var date = new Date();
    console.log(date);
    var $load = jq('<div class="loading"><img class="loadingimg" src="../../img/loading.gif"></div>').appendTo('.ev')
    , db = new Firebase("https://nustcoin.firebaseio.com/events")
    db.on('value', function (snapshot) {
      for(var i=0; i< snapshot.val().length; i++) {
        //loop throught all events
        // console.log(todaysDate);
        console.log(snapshot.val()[i].date);
        var eventDate = new Date(snapshot.val()[i].date);
        console.log(eventDate);
        if (eventDate <= date) {
          console.log("event is past");
          //delete event
          var eventdb = new Firebase("https://nustcoin.firebaseio.com/events/" + i);
          eventdb.remove();
          break;
        }
      }
      $load.hide();
    })

  }

});

//This control redirects to the Transaction Details page after clicking a button on homepage
NCMainControllers.controller('TransactionDetailsCtrl', function($scope, $firebaseArray, $firebaseObject, $cookies, $location) {
  jq('.errormessage').hide();

  var email = $cookies.get('sessionCookie');
  email = email.substring(0, email.indexOf("@"));
  email = email.toLowerCase();
  email = email.toString();

  // var myaccount = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+email);
  var $load = jq('<div style = "width:100px;height:100px;"><img style = "width:150px;height:150px;"src="../../img/loading.gif"></div>').appendTo('.transactiondiv')
  , myaccount = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+email)
  myaccount.on('value', function () {
    $load.hide()
  })

  $scope.messages = $firebaseArray(myaccount);
  var query = myaccount.orderByChild("Age").limitToLast(50);
  $scope.transactions = $firebaseArray(query);

});

NCMainControllers.controller('AddAmountCtrl', function(TransactionService, $scope,$firebaseObject, $cookies, $location, $filter) {

  //$scope.userEmail = $cookies.get('sessionCookie').substring(0, $cookies.get('sessionCookie').indexOf("@"));
  updateCoins();
  function updateCoins() {
    var email = $cookies.get('sessionCookie');
    email = email.substring(0, email.indexOf("@"));
    email = email.toLowerCase();
    email = email.toString();
    var ref3 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+email+"/Balance");   // accesing user 1's balance from the databse
    var obj3 = new $firebaseObject(ref3);
    var ref4 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+email+"/FirstName");
    var obj4 = new $firebaseObject(ref4);
    obj3.$loaded(),obj4.$loaded().then(function() {
      $scope.coins = obj3.$value;
      $scope.name = obj4.$value;
    });
  }

  $scope.amount = function(e){
    var email = $cookies.get('sessionCookie');
    email = email.substring(0, email.indexOf("@"));
    email = email.toLowerCase();
    email = email.toString();
    //$scope.userEmail = $cookies.get('sessionCookie');
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

  $scope.userCoins = function() {
    updateCoins();
  }

  $scope.details = function(e){
    var absUrl ="";
    absUrl = $location.absUrl();
    absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
    absUrl = absUrl + "/home/home.html#/transactions";
    window.location.replace(absUrl);
  }
});

NCMainControllers.controller('EventDetailCtrl', ['$scope', '$stateParams', '$http', '$firebaseArray', '$firebaseObject',
function($scope, $stateParams, $http, $firebaseArray, $firebaseObject) {
  jq(".outerDiv").hide();
  jq("h1").hide();
  var $load = jq('<div class="loading"><img class="loadingimg" src="../../img/loading.gif"></div>').appendTo('.mainDiv')
  , db = new Firebase("https://nustcoin.firebaseio.com/eventDetails"+$stateParams.eventId)
  db.on('value', function () {
  })

  var ref = new Firebase("https://nustcoin.firebaseio.com/eventDetails/"+$stateParams.eventId);
  var obj = new $firebaseObject(ref);

  obj.$loaded().then(function() {

    ref.on("value", function(snapshot){
      console.log(snapshot.val());
      $scope.event = snapshot.val();
      jq(".outerDiv").show();
      jq("h1").show();
      $load.hide();
    })
  })
}]);

NCMainControllers.controller('FaqCtrl', ['$scope', '$http',
function($scope, $http) {
  $http.get('content/faq_data/faq.json').success(function(data) {
    $scope.faq = data;
  });
}]);

NCMainControllers.controller('Faq2Ctrl', ['$scope', '$http',
function($scope, $http) {
  $http.get('../faq_data/faq.json').success(function(data) {
    $scope.faq = data;
  });
}]);

NCMainControllers.controller('WithdrawCtrl', function(Authentication, TransactionService, PurchaseService, $scope, $firebaseArray,$firebaseObject, $cookies,$filter,  $location) {

  $scope.receipt = function(e) {
    var userEmail = $cookies.get('sessionCookie');
    var userPassword = $scope.userPassword;
    Authentication.login(userEmail, userPassword).then(function(){
      //use authData
      $scope.transactionCode = PurchaseService.GenerateCode();
      $scope.email = userEmail;
      var amount = parseInt($scope.user.amount);
      userEmail = userEmail.substring(0, userEmail.indexOf("@"));
      var date = new Date();
      $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');
      $scope.hhmmsstt = $filter('date')(new Date(), 'hh:mm:ss a');
      var tDate = $scope.ddMMyyyy;
      var tTime = $scope.hhmmsstt;

      TransactionService.withdrawal(userEmail, amount, tDate, tTime);
      jq(".receipt").show();

    }, function(error){
      console.log(error);
    });
  } //login

});

NCMainControllers.controller('AboutCtrl', ['$scope',
function($scope) {
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

NCMainControllers.controller('EventsBuyCtrl', ['TransactionService', 'PurchaseService', '$cookies', '$scope', '$stateParams', '$http', '$firebaseObject', 'Authentication', '$filter', '$firebaseArray',
function(TransactionService, PurchaseService, $cookies, $scope, $stateParams, $http, $firebaseObject, Authentication, $filter, $firebaseArray) {
  // $http.get('events_data/' + $stateParams.eventId + '.json').success(function(data) {
  //   $scope.event = data;
  var $load = jq('<div class="loading"><img class="loadingimg" src="../../img/loading.gif"></div>').appendTo('.mainDiv')
  , db = new Firebase("https://nustcoin.firebaseio.com/eventDetails"+$stateParams.eventId)
  db.on('value', function () {
    $load.hide()
  })

  jq(".balError").hide();
  jq(".recError").hide();
  jq(".pwError").hide();
  jq(".stuError").hide();
  jq(".stuError2").hide();

  var ref = new Firebase("https://nustcoin.firebaseio.com/eventDetails/"+$stateParams.eventId);
  var obj = new $firebaseObject(ref);

  obj.$loaded().then(function() {
    ref.on("value", function(snapshot){
      console.log(snapshot.val());
      $scope.event = snapshot.val();

      var stuCheck = true;
      var userEmail = $cookies.get('sessionCookie');

      userEmail = userEmail.substring(0, userEmail.indexOf("@"));
      var ref = new Firebase("https://nustcoin.firebaseio.com/usersData/"+userEmail+"/Balance");   // accesing user 1's balance from the databse
      var obj = new $firebaseObject(ref);
      obj.$loaded().then(function() {
        var balance = obj.$value;
        $scope.balance = balance;
        $scope.balance2 = balance - parseInt($scope.event.cost);
        var reciever = $scope.event.recEmail;
        if($scope.balance2 < 0) {
          jq(".balance2").hide();
          jq(".balError").show();
        }
        else if ($cookies.get('sessionCookie') == reciever) {
          jq(".stuError").show();
          jq(".balance2").hide();
          stuCheck = false;
        }

        if (stuCheck) {
          $scope.eventBuy = function(e) {
            var userEmail = $cookies.get('sessionCookie');
            var userPassword = $scope.userPassword;
            Authentication.login(userEmail, userPassword).then(function(){
              //use authData
              jq(".pwError").hide();
              $scope.transactionCode = PurchaseService.GenerateCode();

              userEmail = userEmail.substring(0, userEmail.indexOf("@"));
              userEmail = userEmail.toLowerCase();
              userEmail = userEmail.toString();
              var reciever = $scope.event.recEmail;
              var amount = parseInt($scope.event.cost);
              var title = "Bought ticket";
              var description = "Bought "+ $scope.event.name+"'s event  ticket for " + $scope.event.cost+ " NUCs.";
              var date = new Date();
              $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');
              $scope.hhmmsstt = $filter('date')(new Date(), 'hh:mm:ss a');
              var tDate = $scope.ddMMyyyy;
              var tTime = $scope.hhmmsstt;

              if (stuCheck)
              TransactionService.TwoWayTransaction(userEmail, reciever, amount, title, description, tDate, tTime);
              else {
                jq(".stuError2").show();
              }

              $scope.username = userEmail;

            }, function(error){
              console.log("Password authentication failed!");
              if (stuCheck)
              jq(".pwError").show();
            });
          }
        };
      })
    })
  })
}]);

NCMainControllers.controller('feedbackCtrl', ['$scope', '$cookies', '$location', '$rootScope', '$firebaseObject',
function($scope, $cookies, $location, $rootScope, $firebaseObject) {
  var absUrl = "";
  $scope.LogOut = function() {
    //delete cookie here
    console.log("logout working");
    $cookies.remove('sessionCookie', {path: '/app/content/home/home.html'});
    var cookie = $cookies.get('sessionCookie');
    absUrl = $location.absUrl();
    absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
    absUrl = absUrl + "/login/login.html";
    window.location.replace(absUrl);
  }

  $scope.SubmitFeedback = function() {
    //delete cookie here
    console.log('Feedback submit working');
    var Feedback = $scope.feedback;
    console.log(Feedback);
    var userEmail = $cookies.get('sessionCookie');
    userEmail = userEmail.substring(0, userEmail.indexOf("@"));
    var ref = new Firebase("https://nustcoin.firebaseio.com/usersData");   // accesing user 1's balance from the databse
    var obj = new $firebaseObject(ref);
    obj.$loaded().then(function() {
      ref.child(userEmail).update({
        "Feedback" : Feedback
      });
      $cookies.remove('sessionCookie', {path: '/app/content/home/home.html'});
      var cookie = $cookies.get('sessionCookie');
      absUrl = $location.absUrl();
      absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
      absUrl = absUrl + "/login/login.html";
      window.location.replace(absUrl);
    })

  }
}]);

NCMainControllers.controller('profileCtrl', ['$scope', '$cookies', '$location', '$rootScope', '$firebaseObject', '$firebaseArray',
function($scope, $cookies, $location, $rootScope, $firebaseObject, $firebaseArray) {
  //var absUrl = "";
  $scope.user = {};
  jq('.succMessage').hide();
  jq('.errMessage1').hide();
  jq('.errMessage2').hide();
  jq('.errMessage3').hide();
  jq('.succMessage2').hide();

  var email = $cookies.get('sessionCookie');
  email = email.substring(0, email.indexOf("@"));
  console.log(email);
  var ref = new Firebase("https://nustcoin.firebaseio.com/usersData");   // accesing user 1's balance from the databse
  var ref2 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+email)
  var obj = new $firebaseObject(ref);
  var obj2 = new $firebaseObject(ref2);

  obj.$loaded(),obj2.$loaded().then(function() {
    ref2.on("value", function(snapshot) {
      var user = snapshot.val();
      $scope.user = user;
      $scope.Update = function() {
        user = $scope.user;
        ref.child(email).update({
          "Feedback" : user.Feedback,
          "FirstName" : user.FirstName,
          "LastName" : user.LastName
        });
        jq('.succMessage').show();
      }

      $scope.Update2 = function() {
        jq('.errMessage1').hide();
        jq('.errMessage2').hide();
        jq('.errMessage3').hide();
        jq('.succMessage2').hide();
        var oPw = $scope.oPw;
        var nPw = $scope.nPw;
        ref.changePassword({
          email: $cookies.get('sessionCookie'),
          oldPassword: oPw,
          newPassword: nPw
        }, function(error) {
          if (error) {
            switch (error.code) {
              case "INVALID_PASSWORD":
              console.log("The specified user account password is incorrect.");
              jq('.errMessage1').show();
              break;
              case "INVALID_USER":
              console.log("The specified user account does not exist.");
              jq('.errMessage2').show();
              break;
              default:
              console.log("Error changing password:", error);
              jq('.errMessage3').show();
            }
          } else {
            console.log("User password changed successfully!");
            jq('.succMessage2').show();
          }
        });
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  })
}]);

NCMainControllers.controller('feedbackCtrl', ['$scope', '$cookies', '$location', '$rootScope', '$firebaseObject',
function($scope, $cookies, $location, $rootScope, $firebaseObject) {
  var absUrl = "";
  $scope.LogOut = function() {
    //delete cookie here
    console.log("logout working");
    $cookies.remove('sessionCookie', {path: '/app/content/home/home.html'});
    var cookie = $cookies.get('sessionCookie');
    absUrl = $location.absUrl();
    absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
    absUrl = absUrl + "/login/login.html";
    window.location.replace(absUrl);
  }

  $scope.SubmitFeedback = function() {
    var Feedback = $scope.feedback;
    console.log(Feedback);
    var userEmail = $cookies.get('sessionCookie');
    userEmail = userEmail.substring(0, userEmail.indexOf("@"));
    var ref = new Firebase("https://nustcoin.firebaseio.com/usersData");   // accesing user 1's balance from the databse
    var obj = new $firebaseObject(ref);
    obj.$loaded().then(function() {
      ref.child(userEmail).update({
        "Feedback" : Feedback
      });
      $cookies.remove('sessionCookie', {path: '/app/content/home/home.html'});
      var cookie = $cookies.get('sessionCookie');
      absUrl = $location.absUrl();
      absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
      absUrl = absUrl + "/login/login.html";
      window.location.replace(absUrl);
    })

  }
}]);

NCMainControllers.controller('ratingCtrl', ['$scope', '$cookies', '$location', '$rootScope', '$firebaseObject', '$firebaseArray',
function($scope, $cookies, $location, $rootScope, $firebaseObject, $firebaseArray) {
  var rating = 0;
  var numberOfRatings = 0;

  var ref = new Firebase("https://nustcoin.firebaseio.com/usersData");   // accesing user 1's balance from the databse
  var obj = new $firebaseObject(ref);

  obj.$loaded().then(function() {
    ref.on("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {

        if(childSnapshot.val().Feedback) {
          numberOfRatings++;
          rating = rating + childSnapshot.val().Feedback;
        }
      })
      if(rating) {
        rating = rating / numberOfRatings;
      }
      $scope.rating = rating;
      $scope.numberOfRatings = numberOfRatings;
    })
  })
}]);

NCMainControllers.controller('frequentUsersCtrl', ['$scope', '$cookies', '$location', '$rootScope', '$firebaseObject', '$firebaseArray',
function($scope, $cookies, $location, $rootScope, $firebaseObject, $firebaseArray) {
  var user1 = "";
  var user1Transactions = 0;
  var user2 = "";
  var user2Transactions = 0;

  var numberOfTransactions = 0;

  var ref = new Firebase("https://nustcoin.firebaseio.com/transactionDetails");   // accesing user 1's balance from the databse
  var obj = new $firebaseObject(ref);

  obj.$loaded().then(function() {
    ref.on("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if (childSnapshot.key() == "admin") {
          // ignoring admin transactions
        }
        else {
          childSnapshot.forEach(function(grandChildSnapshot) {
            numberOfTransactions++;
          })
          if(numberOfTransactions >= user1Transactions) {
            user2 = user1;
            user2Transactions = user1Transactions;
            user1 = childSnapshot.key();
            user1Transactions = numberOfTransactions;
          }
          numberOfTransactions = 0;
        }
      })

      $scope.user1 = user1;
      $scope.user1Transactions = user1Transactions;
      $scope.user2 = user2;
      $scope.user2Transactions = user2Transactions;
    })
  })
}]);

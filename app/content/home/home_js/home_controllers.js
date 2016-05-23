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

    // if (authData) {
    //   console.log("Authenticated user with uid:", authData.password.email);
    // }

    //check for cookie, if exists keep log in, if not redirect the user to login page
    // var cookie = $cookies.get('sessionCookie');
    // console.log(cookie);
    // $scope.user.savedemail = cookie;

    var ref = new Firebase("https://nustcoin.firebaseio.com");
    var authData = ref.getAuth();

    if (!authData) {
      absUrl = $location.absUrl();
      absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
      absUrl = absUrl + "/login/login.html";
      window.location.replace(absUrl);
    }
    else {
      console.log("authenticated");
    }
  });

  $scope.logOut = function() {
    //delete cookie here

    $cookies.remove('sessionCookie', {path: 'app/content/login'});
    // var cookie = $cookies.get('sessionCookie');
    // console.log(cookie);

    absUrl = $location.absUrl();
    absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
    absUrl = absUrl + "/login/loggedOut.html";
    //window.location.replace(absUrl);
  }
});

NCMainControllers.controller('RecentTransactionControl', function($scope, $firebaseArray, $cookies, $location) {

  jq(".noRecents").hide();
  var ref = new Firebase("https://nustcoin.firebaseio.com");
  var authData = ref.getAuth();

  var absoluteUrl = "";
  if (!authData) {
    absoluteUrl = $location.absUrl();
    absoluteUrl = absoluteUrl.substring(0, absoluteUrl.indexOf("/home/home.html"));
    absoluteUrl = absoluteUrl + "/login/login.html";
    window.location.replace(absoluteUrl);
  }

  var email = authData.password.email;
  email = email.substring(0, email.indexOf("@"));
  email = email.toLowerCase();
  email = email.toString();

  // var myaccount = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+email);
  var $load = jq('<div style = "width:100px;height:100px;"><img style = "width:150px;height:150px;"src="../../img/loading.gif"></div>').appendTo('.transactiondiv')
  , myaccount = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+email)
  myaccount.on('value', function () {
    $load.hide();
    jq("#myview").removeClass('noview');
    jq(".fullbodyloading").hide();
  })
  myaccount.on("value", function(snapshot) {
  var history = snapshot.exists();
  if(history == false){
    jq(".noRecents").show();
  }
});

  $scope.messages = $firebaseArray(myaccount);
  var query = myaccount.orderByChild("Age").limitToLast(5);
  $scope.transactions = $firebaseArray(query);
  console.log($scope.transactions.length);
  var length = parseInt($scope.transactions.length);
  console.log(length);

});

NCMainControllers.controller('RechargeAccountCtrl', function(RechargeService, $scope, $firebaseArray, $firebaseObject, $filter, $location) {
  var absoluteUrl = "";

  jq('.rechargeMessage1').hide();
  jq('.rechargeMessage2').hide();
  $scope.recharge = function(e) {
    jq('.rechargeMessage1').hide();
    jq('.rechargeMessage2').hide();
    var code = $scope.rechargeCode;
    var ref = new Firebase("https://nustcoin.firebaseio.com");
    var authData = ref.getAuth();

    if (!authData) {
      absoluteUrl = $location.absUrl();
      absoluteUrl = absoluteUrl.substring(0, absoluteUrl.indexOf("/home/home.html"));
      absoluteUrl = absoluteUrl + "/login/login.html";
      window.location.replace(absoluteUrl);
    }

    var email = authData.password.email;
    var adminEmailAuth = new Firebase("https://nustcoin.firebaseio.com/users/adminEmail");
    var admin;
    adminEmailAuth.on("value", function(snapshot){
      for (var i = 0; i < snapshot.val().length; i++) {
        if (email == snapshot.val()[i]) {
          admin = true;
          console.log('admin is recharging');
          break;
        }
        else{
          admin = false;  //could be a student or a vendor
        }
      }

      email = email.substring(0, email.indexOf("@"));
      email = email.toString();
      var date = new Date();
      $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');
      $scope.hhmmsstt = $filter('date')(new Date(), 'hh:mm:ss a');
      var tDate = $scope.ddMMyyyy;
      var tTime = $scope.hhmmsstt;
      RechargeService.Recharge(email, code, tDate, tTime, admin);
    });
  }
});

NCMainControllers.controller('RecentEventsControl', function($scope, $firebaseArray, $cookies) {
  var myaccount = new Firebase("https://nustcoin.firebaseio.com/events");
  $scope.messages = $firebaseArray(myaccount);
  var query = myaccount.orderByChild("Age").limitToLast(3);
  $scope.events = $firebaseArray(query);
});

NCMainControllers.controller('EventListCtrl', function($scope, $firebaseArray, $filter, $location) {

  var $load = jq('.fullbodyloading').show()
  , db = new Firebase("https://nustcoin.firebaseio.com/events")
  db.on('value', function () {
    $load.hide();
    jq("#myview").removeClass('noview');
  })

  var ref = new Firebase("https://nustcoin.firebaseio.com/events");
  // download the data into a local object
  $scope.events = $firebaseArray(ref);

  $scope.updateEvents = function() {
    var absoluteUrl = "";
    var ref = new Firebase("https://nustcoin.firebaseio.com");
    var authData = ref.getAuth();

    if (!authData) {
      absoluteUrl = $location.absUrl();
      absoluteUrl = absoluteUrl.substring(0, absoluteUrl.indexOf("/home/home.html"));
      absoluteUrl = absoluteUrl + "/login/login.html";
      window.location.replace(absoluteUrl);
    }
    var date = new Date();
    console.log(date);
    var $load = jq('<div class="loading"><img class="loadingimg" src="../../img/loading.gif"></div>').appendTo('.ev')
    , db = new Firebase("https://nustcoin.firebaseio.com/events")
    db.on('value', function (snapshot) {
      for(var i=0; i< snapshot.val().length; i++) {
        //loop throught all events
        // console.log(todaysDate);
        if (snapshot.val()[i]) {
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
      }
      $load.hide();
    })

  }

});

//This control redirects to the Transaction Details page after clicking a button on homepage
NCMainControllers.controller('TransactionDetailsCtrl', function($scope, $firebaseArray, $firebaseObject, $cookies, $location) {

  jq('.errormessage').hide();

  var ref = new Firebase("https://nustcoin.firebaseio.com");
  var authData = ref.getAuth();
  var absoluteUrl = "";
  if (!authData) {
    absoluteUrl = $location.absUrl();
    absoluteUrl = absoluteUrl.substring(0, absoluteUrl.indexOf("/home/home.html"));
    absoluteUrl = absoluteUrl + "/login/login.html";
    window.location.replace(absoluteUrl);
  }
  var email = authData.password.email;
  email = email.substring(0, email.indexOf("@"));
  email = email.toLowerCase();
  email = email.toString();

  // var myaccount = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+email);
  var $load = jq('<div style = "width:100px;height:100px;"><img style = "width:150px;height:150px;"src="../../img/loading.gif"></div>').appendTo('.transactiondiv')
  , myaccount = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+email)
  myaccount.on('value', function () {
    $load.hide()
  })
  myaccount.on("value", function(snapshot) {
  var a = snapshot.exists();
  console.log(a);
  if(a == false){
    jq(".errormessage").show(); //no transactions
  }
  else{
     jq(".errormessage").hide();
  }
});

  $scope.messages = $firebaseArray(myaccount);
  var query = myaccount.orderByChild("Age").limitToLast(50);
  $scope.transactions = $firebaseArray(query);


});

NCMainControllers.controller('AddAmountCtrl', function(TransactionService, $scope, $firebaseObject, $cookies, $location, $filter) {

  jq(".errorMsg").hide();
  jq('.errorMsg2').hide();
  jq(".invalidEmail").hide();
  jq('.succMessage3').hide();
  jq(".errorMsg3").hide();
  jq(".recError").hide();

  updateCoins();
  function updateCoins() {
    var ref = new Firebase("https://nustcoin.firebaseio.com");
    var authData = ref.getAuth();
    var absoluteUrl = "";
    if (!authData) {
      absoluteUrl = $location.absUrl();
      absoluteUrl = absoluteUrl.substring(0, absoluteUrl.indexOf("/home/home.html"));
      absoluteUrl = absoluteUrl + "/login/login.html";
      window.location.replace(absoluteUrl);
    }
    var email = authData.password.email;
    email = email.substring(0, email.indexOf("@"));
    email = email.toLowerCase();
    email = email.toString();
    ref.on("value", function(snapshot) {
      var ref3 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+email+"/Balance");   // accesing user 1's balance from the databse
      var obj3 = new $firebaseObject(ref3);
      var ref4 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+email+"/FirstName");
      var obj4 = new $firebaseObject(ref4);
      obj3.$loaded(),obj4.$loaded().then(function() {

        $scope.coins = obj3.$value;
        $scope.name = obj4.$value;

      });
    })
  }

  $scope.amount = function(e){
    jq(".errorMsg").hide();
    jq('.errorMsg2').hide();
    jq(".invalidEmail").hide();
    jq('.succMessage3').hide();
    jq(".errorMsg3").hide();
    jq(".recError").hide();
    var ref = new Firebase("https://nustcoin.firebaseio.com");
    var authData = ref.getAuth();
    var absoluteUrl = "";
    if (!authData) {
      absoluteUrl = $location.absUrl();
      absoluteUrl = absoluteUrl.substring(0, absoluteUrl.indexOf("/home/home.html"));
      absoluteUrl = absoluteUrl + "/login/login.html";
      window.location.replace(absoluteUrl);
    }
    var email = authData.password.email;
    var reciever = $scope.user.receiver;
    console.log(reciever);

    if (!reciever)
    jq('.errorMsg2').show();
    else {
      if(email != reciever){
        email = email.substring(0, email.indexOf("@"));
        email = email.toLowerCase();
        email = email.toString();
        var amount = $scope.user.amount;
        var title = $scope.user.titles;
        var description = $scope.user.descriptions;
        var date = new Date();
        $scope.ddMMyyyy = $filter('date')(new Date(), 'dd/MM/yyyy');
        $scope.hhmmsstt = $filter('date')(new Date(), 'hh:mm:ss a');
        var tDate = $scope.ddMMyyyy;
        var tTime = $scope.hhmmsstt;
        if(reciever && amount && title && description) {
          TransactionService.TwoWayTransaction(email, reciever, amount, title, description, tDate, tTime);
        }
        else
        jq('.errorMsg2').show();
      }
      else{
        jq(".errorMsg").show();
      }
    }
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
  jq("#myview").removeClass('noview');
  jq(".fullbodyloading").hide();
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
    jq("#myview").removeClass('noview');
    $scope.faq = data;
  });
}]);

NCMainControllers.controller('Faq2Ctrl', ['$scope', '$http',
function($scope, $http) {
  $http.get('../faq_data/faq.json').success(function(data) {
    jq("#myview").removeClass('noview');
    $scope.faq = data;
  });
}]);

NCMainControllers.controller('WithdrawCtrl', function(Authentication, TransactionService, PurchaseService, $scope, $firebaseArray,$firebaseObject, $cookies,$filter,  $location) {

  jq(".withdrawError").hide();
  jq(".withdrawError2").hide();
  jq(".receipt").hide();
  jq(".fullbodyloading").hide();
  jq("#myview").removeClass('noview');
  console.log('test');

  $scope.receipt = function(e) {
    jq(".withdrawError").hide();
    jq(".withdrawError2").hide();
    jq(".receipt").hide();
    var ref = new Firebase("https://nustcoin.firebaseio.com");
    var authData = ref.getAuth();
    var absoluteUrl = "";
    if (!authData) {
      absoluteUrl = $location.absUrl();
      absoluteUrl = absoluteUrl.substring(0, absoluteUrl.indexOf("/home/home.html"));
      absoluteUrl = absoluteUrl + "/login/login.html";
      window.location.replace(absoluteUrl);
    }
    var userEmail = authData.password.email;
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

      var receipt = TransactionService.withdrawal(userEmail, amount, tDate, tTime);


    }, function(error){
      console.log(error);
      jq(".withdrawError2").show();
    });
  } //login

});

NCMainControllers.controller('AboutCtrl', ['$scope',
function($scope) {
  jq("#myview").removeClass('noview');
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

NCMainControllers.controller('EventsBuyCtrl', ['TransactionService', 'PurchaseService', '$location', '$cookies', '$scope', '$stateParams', '$http', '$firebaseObject', 'Authentication', '$filter', '$firebaseArray',
function(TransactionService, PurchaseService, $location, $cookies, $scope, $stateParams, $http, $firebaseObject, Authentication, $filter, $firebaseArray) {

  // $http.get('events_data/' + $stateParams.eventId + '.json').success(function(data) {
  //   $scope.event = data;
  var $load = jq('<div class="loading"><img class="loadingimg" src="../../img/loading.gif"></div>').appendTo('.mainDiv')
  , db = new Firebase("https://nustcoin.firebaseio.com/eventDetails"+$stateParams.eventId)
  db.on('value', function () {
    $load.hide();
    jq(".fullbodyloading").hide();
  })

  jq(".balError").hide();
  jq(".recError").hide();
  jq(".pwError").hide();
  jq(".pwError2").hide();
  jq(".stuError").hide();
  jq(".stuError2").hide();
  jq("#myview").removeClass('noview');


  var ref = new Firebase("https://nustcoin.firebaseio.com/eventDetails/"+$stateParams.eventId);
  var obj = new $firebaseObject(ref);

  obj.$loaded().then(function() {
    ref.on("value", function(snapshot){
      console.log(snapshot.val());
      $scope.event = snapshot.val();

      var stuCheck = true;
      var ref = new Firebase("https://nustcoin.firebaseio.com");
      var authData = ref.getAuth();
      var absoluteUrl = "";
      if (!authData) {
        absoluteUrl = $location.absUrl();
        absoluteUrl = absoluteUrl.substring(0, absoluteUrl.indexOf("/home/home.html"));
        absoluteUrl = absoluteUrl + "/login/login.html";
        window.location.replace(absoluteUrl);
      }
      var userEmail = authData.password.email;

      userEmail = userEmail.substring(0, userEmail.indexOf("@"));
      var ref = new Firebase("https://nustcoin.firebaseio.com/usersData/"+userEmail+"/Balance");   // accesing user 1's balance from the databse
      var obj = new $firebaseObject(ref);
      obj.$loaded().then(function() {
        var balance = obj.$value;
        $scope.balance = balance;
        $scope.balance2 = balance - parseInt($scope.event.cost);
        var reciever = $scope.event.recEmail;

        if (!authData) {
          absoluteUrl = $location.absUrl();
          absoluteUrl = absoluteUrl.substring(0, absoluteUrl.indexOf("/home/home.html"));
          absoluteUrl = absoluteUrl + "/login/login.html";
          window.location.replace(absoluteUrl);
        }

        var email = authData.password.email;
        if($scope.balance2 < 0) {
          jq(".balance2").hide();
          jq(".balError").show();
        }
        else if (email == reciever) {
          jq(".stuError").show();
          jq(".balance2").hide();
          stuCheck = false;
        }

        if (stuCheck) {
          $scope.eventBuy = function(e) {
            jq(".pwError").hide();
            jq(".pwError2").hide();
            var ref = new Firebase("https://nustcoin.firebaseio.com");
            var authData = ref.getAuth();

            if (!authData) {
              absoluteUrl = $location.absUrl();
              absoluteUrl = absoluteUrl.substring(0, absoluteUrl.indexOf("/home/home.html"));
              absoluteUrl = absoluteUrl + "/login/login.html";
              window.location.replace(absoluteUrl);
            }

            var userEmail = authData.password.email;
            var userPassword = $scope.userPassword;
            if(!userPassword)
            jq('.pwError2').show();
            else {
              Authentication.login(userEmail, userPassword).then(function(){
                //use authData

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

                if (stuCheck) {
                  TransactionService.TwoWayTransaction(userEmail, reciever, amount, title, description, tDate, tTime);
                  userPassword = "";
                  $scope.userPassword = userPassword;
                }
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
          }
        };
      })
    })
  })
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
  jq(".fullbodyloading").hide();
  jq("#myview").removeClass('noview');


  var ref = new Firebase("https://nustcoin.firebaseio.com");
  var authData = ref.getAuth();
  var absoluteUrl = "";
  if (!authData) {
    absoluteUrl = $location.absUrl();
    absoluteUrl = absoluteUrl.substring(0, absoluteUrl.indexOf("/home/home.html"));
    absoluteUrl = absoluteUrl + "/login/login.html";
    window.location.replace(absoluteUrl);
  }

  var email = authData.password.email;
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
        jq(".succMessage").show().fadeOut(5000);
      }

      $scope.Update2 = function() {
        jq('.errMessage1').hide();
        jq('.errMessage2').hide();
        jq('.errMessage3').hide();
        jq('.succMessage2').hide();
        var oPw = $scope.oPw;
        var nPw = $scope.nPw;
        var ref = new Firebase("https://nustcoin.firebaseio.com");
        var authData = ref.getAuth();
        var absoluteUrl = "";
        if (!authData) {
          absoluteUrl = $location.absUrl();
          absoluteUrl = absoluteUrl.substring(0, absoluteUrl.indexOf("/home/home.html"));
          absoluteUrl = absoluteUrl + "/login/login.html";
          window.location.replace(absoluteUrl);
        }

        var userEmail = authData.password.email;
        ref.changePassword({
          email: userEmail,
          oldPassword: oPw,
          newPassword: nPw
        }, function(error) {
          if (error) {
            switch (error.code) {
              case "INVALID_PASSWORD":
              console.log("The specified user account password is incorrect.");
              jq('.errMessage1').show().fadeOut(5000);
              break;
              case "INVALID_USER":
              console.log("The specified user account does not exist.");
              jq('.errMessage2').show().fadeOut(5000);
              break;
              default:
              console.log("Error changing password:", error);
              jq('.errMessage3').show().fadeOut(5000);
            }
          } else {
            console.log("User password changed successfully!");
            jq('.succMessage2').show().fadeOut(5000);
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

  jq('.feedbackError').hide();
  jq("#myview").removeClass('noview');

  var absUrl = "";

  var ref3 = new Firebase("https://nustcoin.firebaseio.com");
  var authData = ref3.getAuth();
  if (!authData) {
    absUrl = $absUrl.absUrl();
    absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
    absUrl = absUrl + "/login/login.html";
    window.location.replace(absUrl);
  }

  var email = authData.password.email;
  email = email.substring(0, email.indexOf("@"));

  var ref1 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+email+"/Feedback");   // accesing user 1's balance from the databse
  var obj1 = new $firebaseObject(ref1);

  obj1.$loaded().then(function() {
    $scope.feedback = obj1.$value;
  })

  $scope.LogOut = function() {
    jq("#myview").removeClass('noview');

    var ref = new Firebase("https://nustcoin.firebaseio.com");
    ref.unauth();
    $cookies.remove('sessionCookie', {path: '/app/content/login'});
    absUrl = $location.absUrl();
    absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
    absUrl = absUrl + "/login/login.html";
    window.location.replace(absUrl);
  }

  $scope.SubmitFeedback = function() {
    var Feedback = $scope.feedback;
    if (!$scope.feedback) {
      jq('.feedbackError').show();
    }
    else {
      var ref = new Firebase("https://nustcoin.firebaseio.com");
      var authData = ref.getAuth();
      if (!authData) {
        absUrl = $location.absUrl();
        absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
        absUrl = absUrl + "/login/login.html";
        window.location.replace(absUrl);
      }
      var userEmail = authData.password.email;
      userEmail = userEmail.substring(0, userEmail.indexOf("@"));
      var ref = new Firebase("https://nustcoin.firebaseio.com/usersData");   // accesing user 1's balance from the databse
      var obj = new $firebaseObject(ref);
      obj.$loaded().then(function() {
        ref.child(userEmail).update({
          "Feedback" : Feedback
        });
        ref.unauth();
        $cookies.remove('sessionCookie', {path: '/app/content/login'});
        absUrl = $location.absUrl();
        absUrl = absUrl.substring(0, absUrl.indexOf("/home/home.html"));
        absUrl = absUrl + "/login/login.html";
        window.location.replace(absUrl);
      })
    }
  }
}]);

NCMainControllers.controller('ratingCtrl', ['$scope', '$cookies', '$location', '$firebaseObject', '$firebaseArray',
function($scope, $cookies, $location, $firebaseObject, $firebaseArray) {
  var rating = 0;
  var numberOfRatings = 0;

  var ref = new Firebase("https://nustcoin.firebaseio.com/usersData");   // accesing user 1's balance from the databse
  var obj = new $firebaseObject(ref);

  obj.$loaded().then(function() {
    ref.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {

        if(childSnapshot.val().Feedback) {
          numberOfRatings++;
          rating = rating + childSnapshot.val().Feedback;
        }
      })
      if(rating) {
        rating = rating / numberOfRatings;
        rating = Math.round(rating * 10) / 10;
      }
      $scope.rating = rating;
      $scope.numberOfRatings = numberOfRatings;
    })
  })
}]);

NCMainControllers.controller('frequentUsersCtrl', ['$scope', '$cookies', '$location', '$firebaseObject', '$firebaseArray',
function($scope, $cookies, $location, $firebaseObject, $firebaseArray) {
  var user1 = "";
  var user1Transactions = 0;
  var user2 = "";
  var user2Transactions = 0;

  var ref = new Firebase("https://nustcoin.firebaseio.com/usersData");   // accesing user 1's balance from the databse
  var obj = new $firebaseObject(ref);

  obj.$loaded().then(function() {
    ref.on("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.val().Transactions) {
          if(childSnapshot.val().Transactions > user2Transactions) {
            if (childSnapshot.key() != user1) {
              user2 = childSnapshot.key();
              user2Transactions = childSnapshot.val().Transactions;
            }
            else {
              user1 = childSnapshot.key();
              user1Transactions = childSnapshot.val().Transactions;
            }
            if(user2Transactions > user1Transactions ) {
              user2 = user1;
              user2Transactions = user1Transactions;
              user1 = childSnapshot.key();
              user1Transactions = childSnapshot.val().Transactions;
            }
          }
        }
      })

      $scope.user1 = user1;
      $scope.user1Transactions = user1Transactions;
      $scope.user2 = user2;
      $scope.user2Transactions = user2Transactions;
    })
  })
}]);

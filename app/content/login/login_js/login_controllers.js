'use strict';
var jq = $.noConflict();
/* Controllers */

var NCLoginController = angular.module('NCLoginControllers', ['firebase']);

NCLoginController.controller('LoginCtrl', ['$scope', '$location', '$firebaseAuth', function($scope, $location, $firebaseAuth) {
  var firebaseObj = new Firebase("https://nucoins.firebaseio.com/");
  var loginObj = $firebaseAuth(firebaseObj);

  var emailAuth = new Firebase("https://nucoins.firebaseio.com/users/email");
  var usersAccount = new Firebase("https://nucoins.firebaseio.com/usersData");

  var userAcc = false;
  jq('.loginerrormessage').hide();
  jq('.emailerrormessage').hide();


  var absUrl = "";
  $scope.user = {};

  function escapeEmailAddress(email) {
    if (!email) return false

    email = email.toLowerCase();
    email = email.substring(0, email.indexOf("@"));
    return email;
  }

  $scope.SignIn = function(e) {
    e.preventDefault();
    var username = $scope.user.email;
    var password = $scope.user.password;
    loginObj.$authWithPassword({
      email: username,
      password: password
    })
    .then(function(user) {
      //Success callback
      console.log('Authentication successful');
      absUrl = $location.absUrl();
      absUrl = absUrl.substring(0, absUrl.indexOf("/login/login.html"));

      absUrl = absUrl + "/home/home.html";
      window.location.replace(absUrl);
    }, function(error) {
      //Failure callback
      console.log('Authentication failure');
      jq('.loginerrormessage').show();

    });
  }

  $scope.AuthEmail = function(e) {
    console.log("Logging in");

    e.preventDefault();
    var email = $scope.user.email;
    var auth = false;

    emailAuth.on("value", function(snapshot) {
      for (var i = 0; i < snapshot.val().length; i++) {
        if (email == snapshot.val()[i]) {
          auth = true;
          console.log("user found");
          break;
        }
      }

      if (auth) {
        usersAccount.on("value", function(snapshot) {

          userAcc = snapshot.hasChild(escapeEmailAddress(email));
          console.log("Account Exists? " + userAcc);
            jq('.emailerrormessage').hide();
            jq('.emailauth').hide();
            jq('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow");

        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
      }

      else if (!auth) {
        console.log("invalid email");
        jq('.emailerrormessage').show();
      }

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }

  $scope.RegisterUser = function(e) {
    e.preventDefault();

    var firstName = $scope.user.firstName;
    var lastName = $scope.user.lastName;
    var gender = $scope.user.gender;
    var email = $scope.user.email;
    var password = $scope.user.password;

    if (email && password) {
      var usersRef = usersAccount.child(escapeEmailAddress(email))
      usersRef.set({
        'First Name': firstName,
        'Last Name': lastName,
        'Gender': gender,
        'Email': email
      });

      loginObj.$createUser(email, password)
      .then(function() {
        console.log('User creation success');
        console.log(firstName);
        console.log(lastName);

        var myStyle3 = {
          'display':'none'
        }

        $scope.myStyle3 = myStyle3;
        myStyle2 = {
          'display':'block'
        }
        $scope.myStyle2 = myStyle2;
      }, function(error) {

        console.log(error);
        $scope.regError = true;
        $scope.regErrorMessage = error.message;
      });
    }
  };
}]);

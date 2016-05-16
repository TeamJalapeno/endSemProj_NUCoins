'use strict';
var jq = $.noConflict();
/* Controllers */

var NCLoginController = angular.module('NCLoginControllers', ['firebase', 'ngCookies']);

NCLoginController.controller('LoginCtrl', ['$scope', '$location', '$firebaseAuth', '$cookies', function($scope, $location, $firebaseAuth, $cookies) {
  var firebaseObj = new Firebase("https://nucoins.firebaseio.com/");
  var loginObj = $firebaseAuth(firebaseObj);

  var studentEmailAuth = new Firebase("https://nucoins.firebaseio.com/users/studentEmail");
  var adminEmailAuth = new Firebase("https://nucoins.firebaseio.com/users/adminEmail");
  var vendorEmailAuth = new Firebase("https://nucoins.firebaseio.com/users/vendorEmail");

  var usersAccount = new Firebase("https://nucoins.firebaseio.com/usersData");

  var userAcc = false;
  var isAdmin = false;
  var isStudent = false;
  var isVendor = false;
  var escapeToggle = true;

  jq('.loginerrormessage').hide();
  jq('.emailerrormessage').hide();

  //enter check for login cookie here
  //if found redirect to login
  var cookie = $cookies.get('sessionCookie');
  console.log(cookie);
  if (cookie != undefined) {
    //to do if user is already logged in
  }

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
    console.log("Trying to authenticate");
    usersAccount.authWithPassword({
      email: username,
      password: password
    }, function(error, authData) {
      if (error) {
        //Failure callback
        console.log('Authentication failure');
        jq('.loginerrormessage').show();
      }
      else {
        //Success callback
        var loginemail = authData.password.email;
        console.log('Authentication successful');
        console.log(authData.password.email);
        //create new cookie
        var now = new Date(),
        // this will set the expiration to 100 seconds
        exp = new Date(now.getTime() + (10000 * 1000));

        $cookies.put('sessionCookie', loginemail, {
          expires: exp,
          path: '/app/content/home/home.html'
        });
        console.log("Inserted cookie");

        absUrl = $location.absUrl();
        absUrl = absUrl.substring(0, absUrl.indexOf("/login/login.html"));

        //get username
        console.log(loginemail);
        studentEmailAuth.on("value", function(snapshot) {
          for (var i = 0; i < snapshot.val().length; i++) {
            if (loginemail == snapshot.val()[i]) {
              absUrl = absUrl + "/home/home.html#/student";
              console.log("student found");
              break;
            }
          }
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
        vendorEmailAuth.on("value", function(snapshot) {
          for (var i = 0; i < snapshot.val().length; i++) {
            if (loginemail == snapshot.val()[i]) {
              absUrl = absUrl + "/home/home.html#/vendor";
              console.log("vendor found");
              break;
            }
          }
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
        adminEmailAuth.on("value", function(snapshot) {
          for (var i = 0; i < snapshot.val().length; i++) {
            if (loginemail == snapshot.val()[i]) {
              absUrl = absUrl + "/home/home.html#/admin";
              console.log("admin found");
              break;
            }
          }
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
        window.location.replace(absUrl);
      }
    });
  }

  $scope.AuthEmail = function(e) {
    console.log("Logging in");

    e.preventDefault();
    var email = $scope.user.email;
    var auth = false;
    //search for students
    studentEmailAuth.on("value", function(snapshot) {
      for (var i = 0; i < snapshot.val().length; i++) {
        if (email == snapshot.val()[i]) {
          auth = true;
          isStudent = true;
          console.log("user found");
          break;
        }
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    //search for admins
    adminEmailAuth.on("value", function(snapshot) {
      for (var i = 0; i < snapshot.val().length; i++) {
        if (email == snapshot.val()[i]) {
          auth = true;
          isAdmin = true;
          console.log("admin found");
          break;
        }
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    //search for admins
    vendorEmailAuth.on("value", function(snapshot) {
      for (var i = 0; i < snapshot.val().length; i++) {
        if (email == snapshot.val()[i]) {
          auth = true;
          isVendor = true;
          console.log("vendor found");
          break;
        }
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    if (auth) {
      usersAccount.on("value", function(snapshot) {
        userAcc = snapshot.hasChild(escapeEmailAddress(email));
        console.log("Account Exists? " + userAcc);

        if(userAcc && escapeToggle) {
          jq('.emailerrormessage').hide();
          jq('.emailauth').hide();
          jq('.email-auth-form').animate({height: "toggle", opacity: "toggle"}, "slow");
          jq('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow");
        }

        else if (!userAcc && escapeToggle) {
          jq('.emailerrormessage').hide();
          jq('.emailauth').hide();
          jq('.email-auth-form').animate({height: "toggle", opacity: "toggle"}, "slow");
          jq('.register-form').animate({height: "toggle", opacity: "toggle"}, "slow");
        }

      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
    }
    else if (!auth) {
      console.log("invalid email");
      jq('.emailerrormessage').show();
    }
  }

  $scope.RegisterUser = function(e) {
    e.preventDefault();

    escapeToggle = false;

    var firstName = $scope.user.firstName;
    var lastName = $scope.user.lastName;
    var gender = $scope.user.gender;
    var email = $scope.user.email;
    var password = $scope.user.password;

    if (email && password) {
      var usersRef = usersAccount.child(escapeEmailAddress(email))

      if (isStudent) {
        usersRef.set({
          'First Name': firstName,
          'Last Name': lastName,
          'Gender': gender,
          'Email': email,
          'Balance': '10',
          'AccessLevel':"student"
        });
      }
      else if (isAdmin){
        usersRef.set({
          'First Name': firstName,
          'Last Name': lastName,
          'Gender': gender,
          'Email': email,
          'Balance': '10',
          'AccessLevel':"admin"
        });
      }
      else if (isVendor){
        usersRef.set({
          'First Name': firstName,
          'Last Name': lastName,
          'Gender': gender,
          'Email': email,
          'Balance': '10',
          'AccessLevel':"admin"
        });
      }
      loginObj.$createUser({
        email: $scope.user.email,
        password: $scope.user.password
      })
      .then(function() {
        console.log('User creation success');
        console.log(firstName);
        console.log(lastName);

        jq('.register-form').animate({height: "toggle", opacity: "toggle"}, "slow");
        jq('.login-form').animate({height: "toggle", opacity: "toggle"}, "slow");
      }, function(error) {

        console.log(error);
        $scope.regError = true;
        $scope.regErrorMessage = error.message;
      });
    }
  };
}]);

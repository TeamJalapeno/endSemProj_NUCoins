'use strict';

/* Controllers */

var NCLoginController = angular.module('NCLoginControllers', ['firebase']);

NCLoginController.controller('LoginCtrl', ['$scope', '$location', '$firebaseAuth', function($scope, $location, $firebaseAuth) {
  var firebaseObj = new Firebase("https://nucoins.firebaseio.com/");
  var loginObj = $firebaseAuth(firebaseObj);
  var emailAuth = new Firebase("https://nucoins.firebaseio.com/users/email");

  $scope.loginBool = true;
  $scope.signupBool = false;

  $scope.SignUp = function(e) {
    e.preventDefault();

    console.log('hi');

    $scope.loginBool = false;
    $scope.signupBool = true;
  }

  $scope.Login = function(e) {
    e.preventDefault();

    console.log('bye');

    $scope.loginBool = true;
    $scope.signupBool = false;
  }


  $scope.user = {};
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
      //$location.path('../home/homepage');
    }, function(error) {
      //Failure callback
      console.log('Authentication failure');
    });
  }

  $scope.Register = function(e) {
    e.preventDefault();

    var email = $scope.user.email;
    var auth = false;

    emailAuth.on("value", function(snapshot) {
      for (var i = 0; i < snapshot.val().length; i++) {
        if (email == snapshot.val()[i]) {
          auth = true;
          break;
        }
      }
      console.log(snapshot.val());
      console.log(auth);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    var password = $scope.user.password;
    var firstName = $scope.user.firstName;
    var lastName = $scope.user.lastName;
    //console.log(auth);
    if (email && password && auth) {
      var usersRef = firebaseObj.child("userData");
      usersRef.push({'First Name': firstName, 'Last Name': lastName});

      loginObj.$createUser(email, password)
        .then(function() {
          // do things if success
          //$location.path('/loginpage');
          console.log('User creation success');
          console.log(firstName);
          console.log(lastName);
        }, function(error) {
          // do things if failure
          console.log(error);
          $scope.regError = true;
          $scope.regErrorMessage = error.message;
        });
    }
    else if (!auth) {
      $scope.regError = true;
      $scope.regErrorMessage = "Please use your NUST Email ID to create account on NUCoins.";
      console.log($scope.regErrorMessage);
    }
  };
}]);

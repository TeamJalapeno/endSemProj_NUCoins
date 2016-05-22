'use strict';

/* Controllers */
var NCLoginController = angular.module('NCLoginControllers', ['firebase', 'ngCookies']);

NCLoginController.controller('LoginCtrl', ['$scope', '$location', 'LoginService', '$cookies', function($scope, $location, LoginService, $cookies) {

  $scope.user = {};

  var cookie = $cookies.get('sessionCookie');
  $scope.user.savedemail = cookie;
  var ref = new Firebase("https://nustcoin.firebaseio.com");
  // ref.unauth();
  var authData = ref.getAuth();
  if (authData) {
    console.log("Authenticated user with uid:", authData.password.email);
    $scope.user.email = authData.password.email;
  }

  $scope.AuthEmail = function(e) {
    e.preventDefault();
    var email = $scope.user.email;
    LoginService.AuthEmail(email);
  }

  $scope.SignIn = function(e) {
    e.preventDefault();
    var username = $scope.user.email;
    var password = $scope.user.password;
    LoginService.SignIn(username, password);
  }
  // if ($scope.user.firstName && $scope.user.lastName && $scope.user.gender && $scope.user.email && $scope.user.password) {
  //   jq('#signupRegister').removeAttr('disabled');
  // }
  $scope.RegisterUser = function(e) {
        jq('.generalError').hide();
    e.preventDefault();
    var firstName = $scope.user.firstName;
    var lastName = $scope.user.lastName;
    var gender = $scope.user.gender;
    var email = $scope.user.email;
    var password = $scope.user.password;

    if ($scope.user.firstName && $scope.user.lastName && $scope.user.gender && $scope.user.email && $scope.user.password)
      LoginService.RegisterUser(firstName, lastName, email, password, gender);
    else
      jq('.generalError').show();
  }

}]);

jq('#userEmail').focus(function() {
    jq('.emailerrormessage').hide();
});
jq('#userPassword').focus(function() {
    jq('.loginerrormessage').hide();
    jq('.loginerrormessage2').hide();
    jq(".accountcreation").hide();
});

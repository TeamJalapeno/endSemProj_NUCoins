'use strict';

/* Controllers */
var NCLoginController = angular.module('NCLoginControllers', ['firebase', 'ngCookies']);

NCLoginController.controller('LoginCtrl', ['$scope', '$location', 'LoginService', function($scope, $location, LoginService) {

  $scope.user = {};

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
jq('#pw').focus(function() {
    jq('.generalError').hide();
});
jq('#fName').focus(function() {
    jq('.generalError').hide();
});
jq('#lName').focus(function() {
    jq('.generalError').hide();
});
jq('#gender').focus(function() {
    jq('.generalError').hide();
});

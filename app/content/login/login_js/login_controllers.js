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

  $scope.RegisterUser = function(e) {
    e.preventDefault();
    var firstName = $scope.user.firstName;
    var lastName = $scope.user.lastName;
    var gender = $scope.user.gender;
    var email = $scope.user.email;
    var password = $scope.user.password;
    LoginService.RegisterUser(firstName, lastName, email, password, gender);
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

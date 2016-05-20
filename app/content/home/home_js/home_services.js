'use strict';

/* Services */

// var NCHomeService = angular.module('NCHomeServices', ['firebase', 'ngCookies']);

MainApp.service('PurchaseService', function ($firebaseAuth) {
  this.authenticate = function(username, userPassword, $scope) {
    var usersAccount = new Firebase("https://nucoins.firebaseio.com/usersData");
    usersAccount.authWithPassword({
      email: username,
      password: userPassword
    }, function(error, authData) {
      if (error) {
        //Failure callback
        console.log('Authentication failure');
        window.alert("wrong password entered");
      }
      else {
        //success callback
        console.log('Authentication SUCCESS');
        var myID = CodeGenerator();
        console.log(myID);
      }
  });
  }
  function CodeGenerator() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
      function(c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }).toUpperCase();
  }
});

'use strict';

/* App Module */

var MainApp = angular.module("NCMainApp", ['ngRoute', 'NCAnimations', 'NCMainControllers','firebase']);

MainApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/homepage', {
        templateUrl: 'partials/page1.html'//,
        //controller: 'homePageControl'
      }).
      when('/otherpage', {
        templateUrl: 'partials/page2.html',
        controller: 'EventListCtrl'
      }).
      otherwise({
        redirectTo: '/homepage'
      });
  }]);

  $('.navbar-collapse a:not(.dropdown-toggle)').click(function(){
      $(".navbar-collapse").collapse('hide');
  });

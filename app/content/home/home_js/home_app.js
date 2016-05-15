'use strict';

/* App Module */

var MainApp = angular.module("NCMainApp", ['ui.router', 'NCAnimations', 'NCMainControllers','firebase']);

MainApp.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/homepage");
  //
  // Now set up the states
  $stateProvider
    .state('homepage', {
      url: "/homepage",
      templateUrl: "partials/page1.html",
      controller: 'LoginCheck'
    })
    .state('about', {
      url: "/about",
      templateUrl: "about.html",
      //controller: 'AddAmountCtrl'
    })
    .state('otherpage', {
      url: "/otherpage",
      templateUrl: "partials/page2.html",
      controller: 'EventListCtrl'
    })
    .state('/events/:eventId', {
      url: "/events/:eventId",
      templateUrl: "partials/page3.html",
      controller: 'EventDetailCtrl'
    });
});

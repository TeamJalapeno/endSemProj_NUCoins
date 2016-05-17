'use strict';

/* App Module */

var MainApp = angular.module("NCMainApp", ['ui.router', 'NCAnimations', 'NCMainControllers','firebase']);

MainApp.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /404
  $urlRouterProvider.otherwise("/notfound");
  //
  // Now set up the states
  $stateProvider
    .state('studenthomepage', {
      url: "/student",
      templateUrl: "partials/student.html",
      controller: 'LoginCheck'
    })
    .state('vendorhomepage', {
      url: "/vendor",
      templateUrl: "partials/vendor.html",
      controller: 'LoginCheck'
    })
    .state('adminhomepage', {
      url: "/admin",
      templateUrl: "partials/admin.html",
      controller: 'LoginCheck'
    })
    // .state('about', {
    //   url: "/about",
    //   templateUrl: "partials/about.html",
    //   controller: 'AboutCtrl'
    // })
    .state('notfound', {
      url: "/notfound",
      templateUrl: "../../404.html"//,
      //controller: 'EventListCtrl'
    })
    .state('eventspage', {
      url: "/events",
      templateUrl: "partials/events.html",
      controller: 'EventListCtrl'
    })
    .state('/events/:eventId', {
      url: "/events/:eventId",
      templateUrl: "partials/eventsdetail.html",
      controller: 'EventDetailCtrl'
    });
    // .state('faq', {
    //   url: "/faq",
    //   templateUrl: "faq.html",
    //   controller: 'FaqCtrl'
    // });
});

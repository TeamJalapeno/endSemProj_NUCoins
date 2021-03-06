'use strict';

/* App Module */

var MainApp = angular.module("NCMainApp", ['ui.router', 'NCAnimations', 'NCMainControllers','firebase']);

MainApp.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /404
  $urlRouterProvider.otherwise("/homepage");
  //
  // Now set up the states
  $stateProvider
    .state('homepage', {
      url: "/",
      controller: 'LoginCheck'
    })
    .state('profile', {
      url: "/profile",
      templateUrl: "partials/profile.html",
      controller: 'profileCtrl'
    })
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
    .state('loggedOut', {
      url: "/loggedOut",
      templateUrl: "partials/loggedOut.html",
      controller: 'feedbackCtrl'
    })
    .state('withdraw', {
      url: "/withdraw",
      templateUrl: "partials/withdraw.html",
      controller: 'WithdrawCtrl'
    })
    .state('receipt', {
      url: "/receipt",
      templateUrl: "partials/receiptTemplate.html",
      controller: 'PurchaseCtrl'
    })
    .state('eventspage', {
      url: "/events",
      templateUrl: "partials/events.html",
      controller: 'EventListCtrl'
    })
    .state('transcationdetailspage', {
      url: "/transactions",
      templateUrl: "partials/transactions.html",
      controller: 'TransactionDetailsCtrl'
    })
    .state('/events/:eventId', {
      url: "/events/:eventId",
      templateUrl: "partials/eventsdetail.html",
      controller: 'EventDetailCtrl'
    })
    .state('faq', {
      url: "/faq",
      templateUrl: "partials/faq.html",
      controller: 'Faq2Ctrl'
    })
    .state('about', {
      url: "/about",
      templateUrl: "partials/about.html",
      controller: 'AboutCtrl'
    })
    .state('eventsbuy/:eventId', {
      url: "/eventsbuy/:eventId",
      templateUrl: "partials/eventsbuy.html",
      controller: 'EventsBuyCtrl'
    });
});

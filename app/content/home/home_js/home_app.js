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
    .state('purchase', {
      url: "/purchase",
      templateUrl: "partials/purchase.html",
      controller: 'PurchaseCtrl'
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
    });
});

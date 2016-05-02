'use strict';

/* Controllers */

var NCMainControllers = angular.module('NCMainControllers', []);

NCMainControllers.controller('EventListCtrl', function ($scope, $http) {
  $http.get('events_data/events.json').success(function(data) {
    $scope.events = data;
  });

  $scope.orderProp = 'age';
});

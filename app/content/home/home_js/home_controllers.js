'use strict';

/* Controllers */

var NCMainControllers = angular.module('NCMainControllers', []);

NCMainControllers.controller('EventListCtrl', function($scope, $firebaseArray) {
    var $load = $('<div class="loading"><img class="loadingimg" src="../../img/loading.gif"></div>').appendTo('body')
    , db = new Firebase("https://popping-heat-6810.firebaseio.com/events")
  db.on('value', function () {
    $load.hide()
  })

  var ref = new Firebase("https://popping-heat-6810.firebaseio.com/events");
  // download the data into a local object
  $scope.events = $firebaseArray(ref);
  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
  // syncObject.$bindTo($scope, "events");
});

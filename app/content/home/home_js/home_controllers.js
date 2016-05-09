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


//});

NCMainControllers.controller('AddAmountCtrl', function($scope, $firebaseObject) {
  console.log('AddAmountCtrl');
  $scope.amount = function(){
    console.log('amount function');
var ref = new Firebase("https://popping-heat-6810.firebaseio.com/Variables/Balance");
  var obj = new $firebaseObject(ref);
 obj.$loaded().then(function() {
    var sum =0;
    sum = (parseInt(obj.$value));
    console.log("Current Balance: "+sum);
      sum = sum + 500;
      console.log("After adding 500: "+sum);
      obj.$value = sum;
      obj.$save();
  console.log('New current Balance:'+ obj.$value);
  });

}

});

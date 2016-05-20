


MainApp.factory('Authentication' , ['$firebase' , '$location' , '$rootScope', '$q', function( $firebaseSimpleLogin , $location, $rootScope, $q){
  var ref = new Firebase("https://nustcoin.firebaseio.com/usersData");

  var myObject = {
      login : function(username, password){
   var defered = $q.defer();
   ref.authWithPassword({
            email    : username,
            password : password
          }, function(error, authData) {
          if (error) {
             defered.reject(error);
          } else {
              console.log("successful authentication");
              defered.resolve(authData);
            }
          });
          return defered.promise;
      }, // login
  } // object
  return myObject;
}]);

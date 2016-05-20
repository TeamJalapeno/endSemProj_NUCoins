'use strict';

/* Services */

var NCLoginServices = angular.module('NCLoginServices', ['firebase', 'ngCookies']);

NCLoginServices.service('LoginService', function ($firebaseAuth, $cookies, $location) {
  var firebaseObj = new Firebase("https://nustcoin.firebaseio.com/");
  var loginObj = $firebaseAuth(firebaseObj);

  var studentEmailAuth = new Firebase("https://nustcoin.firebaseio.com/users/studentEmail");
  var adminEmailAuth = new Firebase("https://nustcoin.firebaseio.com/users/adminEmail");
  var vendorEmailAuth = new Firebase("https://nustcoin.firebaseio.com/users/vendorEmail");

  var usersAccount = new Firebase("https://nustcoin.firebaseio.com/usersData");

  var userAcc = false;
  var isAdmin = false;
  var isStudent = false;
  var isVendor = false;
  var escapeToggle = true;

  var absUrl = "";

  function escapeEmailAddress(email) {
    if (!email) return false

    email = email.toLowerCase();
    email = email.substring(0, email.indexOf("@"));
    return email;
  }


  this.AuthEmail = function(useremail) {
    jq('.loading').show();
    jq('.emailerrormessage').hide();


    var auth = false;
    var authCode = "";
    //search for students
    studentEmailAuth.on("value", function(snapshot) {
      for (var i = 0; i < snapshot.val().length; i++) {
        if (useremail == snapshot.val()[i]) {
          auth = true;
          isStudent = true;
          changeDOM(auth, userAcc, escapeToggle);
          break;
        }

      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    //search for admins
    adminEmailAuth.on("value", function(snapshot) {
      for (var i = 0; i < snapshot.val().length; i++) {
        if (useremail == snapshot.val()[i]) {
          auth = true;
          isAdmin = true;
          changeDOM(auth, userAcc, escapeToggle);
          break;

        }
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    //search for admins
    vendorEmailAuth.on("value", function(snapshot) {
      for (var i = 0; i < snapshot.val().length; i++) {
        if (useremail == snapshot.val()[i]) {
          auth = true;
          isVendor = true;
          changeDOM(auth, userAcc, escapeToggle);
          break;

        }
        changeDOM(auth, userAcc, escapeToggle);

      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    function changeDOM(auth, userAcc, escapeToggle) {
      if (auth) {
        usersAccount.on("value", function(snapshot) {
          userAcc = snapshot.hasChild(escapeEmailAddress(useremail));

          if(userAcc && escapeToggle) {
            jq('.emailerrormessage').hide();
            jq('.emailauth').hide();
            jq('.loading').hide();

            jq('.email-auth-form').hide();
            jq('.login-form').show();
          }
          else if (!userAcc && escapeToggle) {
            jq('.emailerrormessage').hide();
            jq('.emailauth').hide();
            jq('.loading').hide();

            jq('.email-auth-form').hide();
            jq('.register-form').show();
          }
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
      }
      else if (!auth) {
        jq('.emailerrormessage').show();
        jq('.loading').hide();
        console.log("Invalid email!");
      }
      return;
    }
  }

  this.SignIn = function(useremail, userpassword) {
    jq('.loading').show();
    jq('.loginerrormessage').hide();

    usersAccount.authWithPassword({
      email: useremail,
      password: userpassword
    }, function(error, authData) {
      if (error) {
        //Failure callback
        console.log('Authentication failure!');
        jq('.loginerrormessage').show();
        jq('.loading').hide();

      }
      else {
        //Success callback
        var loginemail = authData.password.email;
        //create new cookie
        var now = new Date(),
        // this will set the expiration to 100 seconds
        exp = new Date(now.getTime() + (10000 * 1000));

        $cookies.put('sessionCookie', loginemail, {
          expires: exp,
          path: '/app/content/home/home.html'
        });

        absUrl = $location.absUrl();
        absUrl = absUrl.substring(0, absUrl.indexOf("/login/login.html"));

        //get username
        studentEmailAuth.on("value", function(snapshot) {
          for (var i = 0; i < snapshot.val().length; i++) {
            if (loginemail == snapshot.val()[i]) {
              absUrl = absUrl + "/home/home.html#/student";
              break;
            }
          }
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
        vendorEmailAuth.on("value", function(snapshot) {
          for (var i = 0; i < snapshot.val().length; i++) {
            if (loginemail == snapshot.val()[i]) {
              absUrl = absUrl + "/home/home.html#/vendor";
              break;
            }
          }
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
        adminEmailAuth.on("value", function(snapshot) {
          for (var i = 0; i < snapshot.val().length; i++) {
            if (loginemail == snapshot.val()[i]) {
              absUrl = absUrl + "/home/home.html#/admin";
              break;
            }
          }
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
        jq('.loading').hide();
        window.location.replace(absUrl);
      }
    });
  }


  this.RegisterUser = function(firstName, lastName, email, password, gender) {

    escapeToggle = false;
    jq('.loading').show();

    if (email && password) {
      var usersRef = usersAccount.child(escapeEmailAddress(email))

      if (isStudent) {
        usersRef.set({
          'First Name': firstName,
          'Last Name': lastName,
          'Gender': gender,
          'Email': email,
          'Balance': '10',
          'AccessLevel':"student"
        });
      }
      else if (isAdmin){
        usersRef.set({
          'First Name': firstName,
          'Last Name': lastName,
          'Gender': gender,
          'Email': email,
          'Balance': '10',
          'AccessLevel':"admin"
        });
      }
      else if (isVendor){
        usersRef.set({
          'First Name': firstName,
          'Last Name': lastName,
          'Gender': gender,
          'Email': email,
          'Balance': '10',
          'AccessLevel':"admin"
        });
      }
      loginObj.$createUser({
        email: email,
        password: password
      })
      .then(function() {
        jq('.register-form').hide();
        jq('.loading').hide();
        jq('.login-form').show();

      }, function(error) {
        console.log(error);
      });
    }
  };
});

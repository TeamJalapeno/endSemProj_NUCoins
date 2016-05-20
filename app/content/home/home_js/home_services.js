'use strict';

/* Services */
MainApp.service('PurchaseService', function ($firebaseAuth) {
  this.GenerateCode = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
      function(c) {
        var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }).toUpperCase();
    }

  });

  MainApp.service('TransactionService', function ($firebaseAuth, $firebaseObject) {

    this.TwoWayTransaction = function (sender, reciever, amount, title, description, tDate, tTime){
      var studentEmailAuth = new Firebase("https://nustcoin.firebaseio.com/users/studentEmail");
      var vendorEmailAuth = new Firebase("https://nustcoin.firebaseio.com/users/vendorEmail");
      var myaccount = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+sender);

      var auth = false;
      var auth2 =false;
      console.log("SERVICE");
      console.log(sender);
      console.log(reciever);
      console.log(amount);

      studentEmailAuth.on("value", function(snapshot){
        for (var i = 0; i < snapshot.val().length; i++) {
          if (reciever == snapshot.val()[i]) {
            auth = true;
            break;
          }
          else{
            auth = false;
          }
        }
      })

      vendorEmailAuth.on("value", function(snapshot){
        for (var i = 0; i < snapshot.val().length; i++) {
          if (reciever == snapshot.val()[i]) {
            auth2 = true;
            break;
          }
          else{
            auth2 = false;
          }
        }
      })

      var rec = reciever.substring(0, reciever.indexOf("@"));  //extracting user2's id from email
      rec = rec.toLowerCase();
      rec = rec.toString();

      var ref = new Firebase("https://nustcoin.firebaseio.com/usersData/"+sender+"/AccessLevel");
      var obj = new $firebaseObject(ref);

      var ref2 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+rec+"/AccessLevel");
      var obj2 = new $firebaseObject(ref2);

      var ref3 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+sender+"/Balance");   // accesing user 1's balance from the databse
      var obj3 = new $firebaseObject(ref3);

      var ref4 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+rec+"/Balance");   // accesing user 2's balance from the databse
      var obj4 = new $firebaseObject(ref4);

      obj2.$loaded(),obj.$loaded(),obj3.$loaded(),obj4.$loaded().then(function(){
        var first = ""
        var second = ""
        var existingBal = 0;
        var studentBal =0;
        var transfer = false;
        first = obj.$value;
        second= obj2.$value;
        existingBal = parseInt(obj3.$value);    //user 1's existing balance in the database
        studentBal = parseInt(obj4.$value);    //user 2's existing balance in the database

        // if user 1 is admin and user 2 is a student
        if(((first == "admin" && second =="student") || (first == "student" && second =="student") || (first == "student" && second =="vendor")) && ((auth ==true) || (auth2 == true))){
          if(existingBal >= amount)  { //checking if the amount user wants to transfer is available in his account

            existingBal = existingBal - amount;
            obj3.$value = existingBal;
            obj3.$save();

            studentBal = studentBal + amount;
            obj4.$value = studentBal;
            obj4.$save();

            console.log("After adding amount, new bal: "+ studentBal);

            console.log(first+" to " +second+ " Transfer Completed");
            transfer = true;
            if(transfer){
              console.log("yayy");
              console.log(sender);
              var user1 = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+sender);
              var user2 = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+rec);

              var user1Ref = user1.push();
              var user2Ref = user2.push();

              user1Ref.set({
                'Title': title,
                'Description': description,
                'Amount': amount,
                'Date': tDate,
                'Time': tTime
              });

              var dTitle = "Received from "+sender;
              console.log(dTitle);
              user2Ref.set({
                'Title': dTitle,
                'Description': description,
                'Amount': amount,
                'Date': tDate,
                'Time': tTime
              });

            }
          }
          else{
          }
        }
        else{
        }


      });
    }
  });

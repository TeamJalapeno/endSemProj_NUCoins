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

  MainApp.service('RechargeService', function ($firebaseAuth, $firebaseObject) {
    this.Recharge = function(email, rechargeCode, tDate, tTime, admin) {
      console.log("admin?" +admin);
      var db = new Firebase("https://nustcoin.firebaseio.com/Recharge/rechargeCodes");
      var db2 = new Firebase("https://nustcoin.firebaseio.com/Recharge/codeValues");

      var ref = new Firebase("https://nustcoin.firebaseio.com/Recharge")
      var obj = new $firebaseObject(db);

      var ref3 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+email+"/Balance");   // accesing user 1's balance from the databse
      var obj3 = new $firebaseObject(ref3);

      var found = false;
      var amount = 0;

      console.log("Welcome to Recharge Service!");

      var i =0;

      db.on("value", function(snapshot){
        obj.$loaded().then(function(){
          for(i=0; i< snapshot.val().length; i++) {
            console.log("You entered:" + rechargeCode);
            if (rechargeCode == snapshot.val()[i]) {
              db2.on("value", function(snapshot){
                var ref2 = new Firebase("https://nustcoin.firebaseio.com/Recharge/codeValues/"+rechargeCode);
                var obj2 = new $firebaseObject(ref2);
                obj2.$loaded(),obj3.$loaded().then(function(){
                  amount = parseInt(obj2.$value);
                  if( amount != 0){
                    amount = parseInt(obj2.$value);
                    obj3.$value = parseInt(obj3.$value) + amount; //value is being added in the balance depending on card code
                    obj3.$save();
                    console.log(amount+" added");
                    console.log("Your new balance is: " +obj3.$value)
                    obj2.$value =0;
                    obj2.$save();
                    var userdetail = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+email);
                    var userRef = userdetail.push();
                    userRef.set({
                      'Title':  "Account Recharge",
                      'Description': "Recharge code has been used",
                      'Amount': amount,
                      'Date': tDate,
                      'Time': tTime
                      
                    })

                    if(admin == false){
                      var numofTransactions = new Firebase("https://nustcoin.firebaseio.com/usersData/"+email+"/Transactions");
                      var object = new $firebaseObject(numofTransactions);
                      object.$loaded().then(function(){
                        console.log(object.$value);
                        object.$value = object.$value + 1;
                        object.$save();
                        console.log(object.$value);
                      });
                    }
                    console.log("Recharge Completed");
                  }
                  else{
                    //console.log("This code has been already used. Please use a valid code");
                  }
                })
              })
              found = true;
              break;
            }
            else{
              found = false;
            }
          }

          if(found == false){
            console.log('The code you entered is Invalid. Please enter a valid Recharge Code');
          }
        })
      });//db.on ends here
    }//function ends here

  });

  MainApp.service('TransactionService', function ($firebaseAuth, $firebaseObject) {

    this.withdrawal = function(accountEmail, amount, tDate, tTime) {
      var receipt;
      var ref3 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+accountEmail+"/Balance");   // accesing user 1's balance from the databse
      var obj3 = new $firebaseObject(ref3);
      var numofTransactions = new Firebase("https://nustcoin.firebaseio.com/usersData/"+accountEmail+"/Transactions");
      var obj = new $firebaseObject(numofTransactions);

      obj3.$loaded(),obj.$loaded().then(function(){
        var existingBal = 0;
        existingBal = parseInt(obj3.$value);
        if(existingBal >= amount){
          existingBal = existingBal - amount;
          obj3.$value = existingBal;
          obj3.$save();
          obj.$value = obj.$value + 1;  //incrementing the "transactions" variable for the user
          obj.$save();
          var userdetail = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+accountEmail);
          var userRef = userdetail.push();
          userRef.set({
            'Title': "Withdrawal",
            'Description': "Withdrawal",
            'Amount': amount,
            'Date': tDate,
            'Time': tTime
          });
          jq(".receipt").show();
        }
        else{
          jq(".withdrawError").show();
          console.log("Insufficient balance. Please Recharge your account");
        }
      });

    }

    this.TwoWayTransaction = function (sender, reciever, amount, title, description, tDate, tTime){
      var studentEmailAuth = new Firebase("https://nustcoin.firebaseio.com/users/studentEmail");
      var vendorEmailAuth = new Firebase("https://nustcoin.firebaseio.com/users/vendorEmail");
      //var myaccount = new Firebase("https://nustcoin.firebaseio.com/transactionDetails/"+sender); //not used

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
            console.log('auth wrk');
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
        console.log(first);
        console.log(second);
        console.log(transfer);
        console.log(auth);
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
            console.log(transfer);

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
              if(first != "admin"){
                var numofTransactions = new Firebase("https://nustcoin.firebaseio.com/usersData/"+sender+"/Transactions");
                var object = new $firebaseObject(numofTransactions);
                object.$loaded().then(function(){
                  console.log(object.$value);
                  object.$value = object.$value + 1;
                  object.$save();
                  console.log(object.$value);
                });
              }

              var dTitle = "Received from "+sender;
              console.log(dTitle);
              var numofTransactions2 = new Firebase("https://nustcoin.firebaseio.com/usersData/"+rec+"/Transactions");
              var object2 = new $firebaseObject(numofTransactions2);
              object2.$loaded().then(function(){
                object2.$value = object2.$value + 1;
                object2.$save();
                user2Ref.set({
                  'Title': dTitle,
                  'Description': description,
                  'Amount': amount,
                  'Date': tDate,
                  'Time': tTime,
                });
              });
              jq(".receipt").show();
            }
          }
          else{
            jq(".recError").show();
          }
        }
        else{
        }
      });
    }
  });

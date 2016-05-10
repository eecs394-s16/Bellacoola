angular.module('SteroidsApplication', [
    'supersonic',
    'firebase'
])

.controller('IndexController', function($scope, supersonic) {
    $scope.navbarTitle = "Home";

    $scope.turn_off_silence_mode = function() {
       
        var piRef = new Firebase('https://bellacoola.firebaseio.com/pi/');

        expireTime = new Date();
        expireTime.setMinutes(expireTime.getMinutes() -1); //1 min less than now

        piRef.set({
            '1': {
                'expiration_time' : expireTime.toString(),
                'contacts': ['+13126191065']
            }
        });
    }

    $scope.get_status = function() {
       
        $scope.getMode();
    }    

    $scope.getMode = function(){
        supersonic.logger.log("getMode()");
        
        var uid = 1;
        var piRef = new Firebase('https://bellacoola.firebaseio.com/pi/');

        
        piRef.child(uid).once('value', function(snapshot) {
        piSetting = snapshot.val();
        
        $scope.mode = "!On!";
        supersonic.logger.log("callback");

        /*if (new Date(piSetting.expiration_time) > new Date()) {
            $scope.mode = "On";
            supersonic.logger.log("alarm on");    

        } else {
            $scope.mode = "Off";
            supersonic.logger.log("alarm off");    

        }*/
        }

        supersonic.logger.log("~getMode()");
    };

    //$scope.$watch('mode', $scope.getMode);

    
})

.controller('SilenceController', function($scope, supersonic) {
    $scope.navbarTitle = "Silence Settings";


    $scope.getContacts = function(){
        var contacts = [];
        supersonic.logger.log("getContacts called!");
        var contactsRef = new Firebase("https://bellacoola.firebaseio.com/mobile_client/contacts");
        // contactsRef.on("child_added", function(snapshot){
        //         $scope.contacts.push(snapshot.key());
        //         supersonic.logger.log($scope.contacts);
        // });
        contactsRef.on("value", function(snapshot){
            allContacts = snapshot.val();
            for (var contact in allContacts){
                if (allContacts.hasOwnProperty(contact)){
                    contacts.push(contact);
                }
            }
        });

        $scope.contacts = contacts;
        supersonic.logger.log($scope.contacts)
    }

    $scope.update = function() {
        var currentTime = new Date(); // Gets current time
        var expireTime = currentTime;
        var minutesToAdd = 0;
        switch ($scope.data.duration) { // Find out how many minutes to add
            case "30 Minutes":
                minutesToAdd = 30;
                break;
            case "1 Hour":
                minutesToAdd = 60;
                break;
            case "2 Hours":
                minutesToAdd = 120;
                break;
            case "3 Hours":
                minutesToAdd = 180;
                break;
        };
        expireTime.setMinutes(currentTime.getMinutes() + minutesToAdd); // Update expiry time
        var piRef = new Firebase('https://bellacoola.firebaseio.com/pi/');
        // TODO: This has hard-coded UID reference for the pi.
        // Eventually we'll have to do a lookup on the mobile part and figure out the UID of the Pi associated with this device
        // All that can probably be moved to the server as an API
        // Sorry I'll try to avoid these tech debts as much as possible from next time
        piRef.set({ // Update firebase
            '1': {
                'expiration_time': expireTime.toString(),
                'contacts': ['+13126191065']
                // TODO: Add contact numbers here
            }
        }, function() {
            var options = {
                message: "Your silence settings has been updated!",
                buttonLabel: "Ok"
            };
            supersonic.ui.dialog.alert("Update", options).then(function() {
                supersonic.logger.log("Alert closed.");
            });
        });
    }

})
.controller('ContactsController', function($scope, supersonic) {
    $scope.navbarTitle = "Add Contacts";

    var validateXSS = function(str){
            // some basic xss tags to prevent
            var xssCodes = ['&amp;', '&lt;', '&gt;', '&quot;', '&#x27;', '&#x2f;', '<script>', '\'', '\"'];

            for (var i = 0; i < xssCodes.length; i++) {
		            if (str.indexOf(xssCodes[i]) !== -1) {
                    return false;
		            }
            }
            return true;
    }
    var isNumber = function(n) {
        // var numbers = /^[0-9]+$/;
        // if (n.vlaue.match(numbers))
        //     return true;
        // else
        //     return false;
        return parseFloat(n.match(/^-?\d*(\.\d+)?$/))>0;
    }

    var validate = function(input,type){
      switch(type){
            case String:
		          return validateXSS(input);
            case Number:
		          return isNumber(input);
      }
    }

    $scope.validateInput = function() {
         if (!validate($scope.data.newname,String)){
   		      return false;
         } else if (!validate($scope.data.newnumber,Number)){
   		      return false;
           }
           else {
   		        return true;
           }
    };

    //TODO:Need to add the contact to pi-client and pi after each Pi is unique identified
    $scope.addContact = function(){

        var contactName = $scope.data.newname;
        var contactNumber = $scope.data.newnumber;
        if ($scope.validateInput()){
        var mobileClientContactRef = new Firebase("https://bellacoola.firebaseio.com/mobile_client/contacts/");
        //var mobileContactListRef = mobileClientContactRef.push();
        mobileClientContactRef.child(contactName).set({
            phone:contactNumber
        }, function(){
            var options = {
                message: "A new contact has been added!",
                buttonLabel: "Ok"
            };
            supersonic.ui.dialog.alert("Update", options).then(function() {
                supersonic.logger.log("Alert closed.");
            });
        });

        $scope.data.newname = "";
        $scope.data.newnumber = "";}
        else{
            var options = {
                     message: "One (or more) of your input is invalid!",
                     buttonLabel: "Ok",
            };
            supersonic.ui.dialog.alert("ERROR", options).then(function() {
                supersonic.logger.log("Alert closed.");
            });
            return;
        }
    }

});

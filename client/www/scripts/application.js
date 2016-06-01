angular.module('SteroidsApplication', [
    'supersonic',
    'firebase'
])

.factory('getPiSettingsFactory',["$firebaseObject", function($firebaseObject){
    var piSettingsObj = $firebaseObject.$extend({
	isOn: function(){
	    console.log("isOn called");
	    return new Date(this.expiration_time ) > new Date();
	}
    });
    return function(uid){
	console.log("factory function called");
	var url = 'https://bellacoola.firebaseio.com/pi/'+uid+'/';
	var piRef = new Firebase(url);
	return new piSettingsObj(piRef);
    };
}])

.directive('processdate',function(){
    return {
	restrict: 'A',
	require: 'ngModel',
	link: function(scope,element, attrs, ngModel) {
	    ngModel.$formatters.push(function(value){
		return new Date(value);
	    });
	    ngModel.$parsers.push(function(value){
		if (value < new Date())
		    value.setDate(value.getDate()+1);
		return value.toString();
	    });
	}
    };
})

.directive('booldate',function(){
    return {
	restrict: 'A',
	require: 'ngModel',
	link: function(scope,element,attrs,ngModel){
	    ngModel.$formatters.push(function(value){
		return new Date(value) > new Date();
	    });
	    ngModel.$parsers.push(function(value){
		var d = new Date();
		if (value){
		    d.setHours(d.getHours() + 1);
		} else {
		    d.setHours(d.getHours() - 1);
		}
		return d.toString();
	    });
	}
    };
})

.controller('IndexController', function($scope, supersonic) {
    $scope.navbarTitle = "Home";

    $scope.turn_off_silence_mode = function() {

        var piRef = new Firebase('https://bellacoola.firebaseio.com/pi/');

        expireTime = new Date();
        expireTime.setMinutes(expireTime.getMinutes() -1); //1 min less than now

        piRef.child(1).update({
                'expiration_time' : expireTime.toString(),
        });
    }

    $scope.get_status = function() {
        $scope.getMode();
    }

    $scope.getMode = function(){
        supersonic.logger.log("getMode()");

        var uid = 1;
        var piRef = new Firebase('https://bellacoola.firebaseio.com/pi/');


        piRef.child(uid).on('value', function(snapshot) {
        piSetting = snapshot.val();
        //$scope.mode = "!On!";
        supersonic.logger.log("callback");
        var expr_date = new Date(piSetting.expiration_time)

        if (expr_date > new Date()) {
            $scope.mode = "On";
            supersonic.logger.log("alarm on");
            $scope.expr_time = expr_date.toLocaleTimeString();

        } else {
            $scope.mode = "Off";
            supersonic.logger.log("alarm off");

        }
	    $scope.$apply();
        });

        supersonic.logger.log("~getMode()");
    };
})

.controller('DeviceController', function($scope, supersonic) {
    $scope.navbarTitle = 'Device Settings';
    var mobileRef = new Firebase('https://bellacoola.firebaseio.com/mobile');
    $scope.updateNum = function() {
        mobileRef.set({
            '1': {
                'number': '+1' + $scope.number
            }
        }, function() {
            var options = {
                message: "Updated your device settings",
                buttonLabel: "Ok",
            };
            supersonic.ui.dialog.alert("Update Successful", options).then(function() {
                supersonic.logger.log("Alert closed.");
            });
        });
    }
})

.controller('RingtoneController', function($scope, supersonic) {
    $scope.navbarTitle = "Ringtone Settings";
    $scope.updateRingtone = function() {
        supersonic.logger.log('update ringtone called!');
        var ringtoneRef = new Firebase('https://bellacoola.firebaseio.com/ringtone/');

        ringtoneRef.set({
            'ringtone': $scope.ringtone.replace(' ', '_'),
        }, function() {
            var options = {
                message: "Ringtone successfully updated!",
                buttonLabel: "Ok"
            };
            supersonic.ui.dialog.alert("Update", options).then(function() {
                supersonic.logger.log("Alert closed.");
            });
        });
    }
})

.controller('SilenceController', ["$scope", "supersonic", "getPiSettingsFactory", "$firebaseObject",
function($scope, supersonic, getPiSettingsFactory, $firebaseObject) {
    $scope.navbarTitle = "Silence Settings";

    $scope.getMode = function(){
        supersonic.logger.log("getMode called");
        var uid = 1; //TODO: Get rid of hard coded uid
	$scope.obj = getPiSettingsFactory(uid);
	$scope.obj.$bindTo($scope,'data');
        $scope.getContacts();
    };

    $scope.popView = function(){
        supersonic.ui.layers.pop();
    }

    var UID = 1; //hard-coded UID for the pi
    $scope.removeContact = function(person){
        var contactRef = new Firebase("https://bellacoola.firebaseio.com/mobile_client/contacts/" + person);
        var piContactRef = new Firebase("https://bellacoola.firebaseio.com/pi/" + UID + "/contacts/" + person);
        contactRef.set({
            phone:null //remove the contact
        }, function(){
            var options = {
                message: "Removed this contact!",
                buttonLabel: "Ok"
            };
            supersonic.ui.dialog.alert("Update", options).then(function() {
            supersonic.logger.log("Alert closed.");
            });
        });
        piContactRef.set({
            phone:null
        });

    //update the view
        $scope.getContacts();
    }

    $scope.getContacts = function() {
        supersonic.logger.log("getContacts called!");
        var contactsRef = new Firebase("https://bellacoola.firebaseio.com/mobile_client/contacts");
        var objContact = $firebaseObject(contactsRef);
        supersonic.logger.log("ABOUT TO CALL!")

        objContact.$loaded().then(function(){
            supersonic.logger.log("loaded record:", objContact)

            //three-way binding
            objContact.$bindTo($scope, "contacts").then(function(){
                supersonic.logger.log($scope.contacts)
            });
        });

        //three-way binding to pi contacts list
        var piRef = new Firebase("https://bellacoola.firebaseio.com/pi/1/contacts");
        var objPi = $firebaseObject(piRef);

        objPi.$loaded().then(function(){
            supersonic.logger.log("PI! record:", objPi)

            //three-way binding
            objPi.$bindTo($scope, "contacts").then(function(){
                supersonic.logger.log($scope.contacts)
            });
        });


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
        piRef.child(1).update({ // Update firebase
                'expiration_time': expireTime.toString(),
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

}])
.controller('ContactsController', function($scope, supersonic) {
    $scope.navbarTitle = "Add Contacts";
    var UID = 1; //hard-coded UID for the pi

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
        return parseFloat(n.match(/^-?\d*(\.\d+)?$/))>0 && n.length == 10;
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
        var settings = "false"
        var contactName = $scope.data.newname;
        var contactNumber = $scope.data.newnumber;
        if ($scope.validateInput()){
	   
       var piContactRef = new Firebase("https://bellacoola.firebaseio.com/pi/1/contacts/");
        var mobileClientContactRef = new Firebase("https://bellacoola.firebaseio.com/mobile_client/contacts/");
        mobileClientContactRef.child(contactName).set({
            name:contactName,
            phone:contactNumber,
            silence:settings
        }, function(){
            var options = {
                message: "A new contact has been added!",
                buttonLabel: "Ok"
            };
            supersonic.ui.dialog.alert("Update", options).then(supersonic.ui.layers.pop);
            });

            piContactRef.child(contactName).set({
                name:contactName,
                phone:contactNumber,
                silence:settings
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

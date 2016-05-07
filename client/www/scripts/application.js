angular.module('SteroidsApplication', [
    'supersonic',
    'firebase'
])
.factory('ContactData', function(){
    return { test:''};
})
.controller('IndexController', function($scope, supersonic) {
    $scope.navbarTitle = "Home";
})
.controller('SilenceController', function($scope, supersonic) {
    $scope.navbarTitle = "Silence Settings";
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
                'contacts': ['+3126191065']
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
.controller('ContactsController', function($scope, ContactData, supersonic) {
    supersonic.logger.log("factory!!!!");
    $scope.navbarTitle = "Add Contacts";
    $scope.ContactData = ContactData;

    $scope.addContact = function (){
        var contactName = $scope.data.newname;
        var contactNumber = $scope.data.newnumber;

        supersonic.logger.log("factory!!!!");
        supersonic.logger.log($scope.ContactData.test);
        
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
        $scope.data.newnumber = "";

    }
});

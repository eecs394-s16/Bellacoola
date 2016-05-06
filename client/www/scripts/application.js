angular.module('SteroidsApplication', [
    'supersonic',
    'firebase'
])

.controller('IndexController', function($scope, supersonic) {
    $scope.navbarTitle = "Home";

    $scope.turn_off_silence_mode = function() {
        supersonic.logger.log("turn_off_silence_mode() called");

        currentTime = new Date();
        expireTime = currentTime;
        expireTime.setMinutes(currentTime.getMinutes() -1);

        var piRef = new Firebase('https://bellacoola.firebaseio.com/pi/');

        piRef.set({
            '1': {
                'expiration_time' : expireTime.toString(),
                'contacts': ['+3126191065']
            }
        });
        supersonic.logger.log("turn_off_silence_mode() -- firebase updated");
    }
})

.controller('SilenceController', function($scope, supersonic) {
    $scope.navbarTitle = "Silence Settings";
    $scope.update = function() {
        supersonic.logger.log("update() called");
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
});

angular.module('SteroidsApplication', [
    'supersonic',
    'firebase'
])
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

angular.module('SteroidsApplication', [
    'supersonic',
    'firebase'
])
.controller('IndexController', function($scope, supersonic) {
    $scope.navbarTitle = "Home";
    $scope.test = function() {
        supersonic.logger.log('test');
    };
})
.controller('SilenceController', function($scope, supersonic) {
    $scope.navbarTitle = "Silence Settings";
    $scope.test = function() {
        supersonic.logger.log('test');
    };

    $scope.update = function() {
        supersonic.logger.log('test');
        supersonic.logger.log($scope.data.silence);
        supersonic.logger.log($scope.data.duration);
        supersonic.logger.log('test2');
        var currentTime = Date.now();
        var expireTime = Date.now();
        suppersonic.logger.log(currentTime);
        suppersonic.logger.log('testmore');
        switch ($scope.data.duration) {
            case "30 Minutes":
                expireTime = addMinutes(expireTime, 30);
                break;
            case "1 Hour":
                expireTime = addMinutes(expireTime, 60);
                break;
            case "2 Hours":
                expireTime = addMinutes(expireTime, 120);
                break;
            case "3 Hours":
                expireTime = addMinutes(expireTime, 180);
                break;
        };
        var piRef = new Firebase('https://bellacoola.firebaseio.com/pi/');
        piRef.set({
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

    var addMinutes = function(date, minutes) {
        return new Date(date.getTime() + minutes*60000);
    }
});

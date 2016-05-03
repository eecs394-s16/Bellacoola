angular.module('SteroidsApplication', [
  'supersonic',
  'firebase'
])
.controller('IndexController', function($scope, supersonic) {

  $scope.navbarTitle = "Bellacoola"

  $scope.update = function() {
      supersonic.logger.log('test');
      supersonic.logger.log($scope.data.silence);

      //if ($scope.data.silence) {
          var settingsRef = new Firebase('https://bellacoola.firebaseio.com/testsettings');
          settingsRef.set({
              'silence': $scope.data.silence
          });
      //}
  }



});

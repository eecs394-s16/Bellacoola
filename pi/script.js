$(document).ready(function() {
    $('.bell').on('click', function() {
        var settings = new Firebase('https://bellacoola.firebaseio.com/');
        settings.child('testsettings').on('value', function(snapshot) {
            userSetting = snapshot.val();
            if (userSetting.silence) {
                $.ajax({
                    method: 'GET',
                    url: 'http://localhost:5000/ring',
                }, function() {
                    console.log('done');
                });
            } else {
                var audio = new Audio('bell.mp3');
                audio.play();
            }
        });
    });
});

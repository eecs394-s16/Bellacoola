/* index.js
 *
 * Root for the our RESTful API server code, currently contains all the methods here but we can move things out as we add more stuff
 *
 * Currently contains API for:
 *   /ring [GET]: Pi will send request to this with its uid (unique id)
 */

// These are some npm modules that I'm going to use

var twilio_sid = 'AC67d02b69024d1220fa46aed55ca25223',
    auth_token = 'ac69fa692fccfb0f96fb7915c45213b4',
    express = require('express'),
    app = express(),
    bodyparser = require('body-parser'),
    firebase = require('firebase'),
    twilio = require('twilio')(twilio_sid, auth_token); 

// Firebase Ref
var userRef = new Firebase('https://bellacoola.firebaseio.com/settings');

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(bodyparser.json());

app.listen(process.env.PORT || 5000);

app.get('/ring', function(req, res) {
    var uid = req.param('uid');
    console.log('got a GET request with uid' + uid);
    twilio.messages.create({
        body: "Bellacoola: Someone is at your door!!",
        to: "+13126191065",
        from: "+13123131547",
    },
    function(err, message) {
        if (err) {
            console.log(err);
        } else {
            res.send('success!');
        }
    });
});

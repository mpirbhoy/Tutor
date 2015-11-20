var express = require('express');
var router = express.Router();
var User = require('../models/users_model');

// Function for generating ticket and this ticket will be used to identify a user is admin, superadmin or user
var generateTicket = function () {
    return (Math.pow(2, 52) * Math.random()) % Math.pow(2, 51);
};

// Send tracking info retrieved from moment user logs in to Mongo
updateTrackingInfo = function (user, givenInfo) {
    if (givenInfo.userAgent) {
        if (user.viewingDevices) {
            user.viewingDevices.push(givenInfo.userAgent);
            User.update({email: user.email}, {viewingDevices: user.viewingDevices}, function () {
            })
        } else {
            user.viewingDevices = [givenInfo.userAgent];
            User.update({email: user.email}, {viewingDevices: user.viewingDevices}, function () {
            })
        }
    }
    if (givenInfo["position[latitude]"] || givenInfo["position[longitude]"]){
        if(user.geoLocations) {
            user.geoLocations.push({
                location: {
                    latitude: givenInfo["position[latitude]"],
                    longitude: givenInfo["position[longitude]"]
                }
            });
            User.update({email: user.email}, {geoLocations: user.geoLocations}, function () {
            })
        } else {
            user.geoLocations = [{
                location: {
                    latitude: givenInfo["position[latitude]"],
                    longitude: givenInfo["position[longitude]"]
                }
            }];
            User.update({email: user.email}, {geoLocations: user.geoLocations}, function () {
            })
        }
    }
};

// Insert newly generate ticket into Mongo so we can reference later. It is also a containing function of updateTrackingInfo
var updateMongo = function (user, givenInfo) {
    var code = generateTicket();
    updateTrackingInfo(user, givenInfo);
    User.update({email: user.email}, {ticket: code}, function () {
    });
    return code;
};


router.route('/').
    get(function (req, res, next) {
        res.render('login', {title: 'LLAB Login'});
    }).
    post(function (req, res) {
        // Authenticate user's login information and render the user's dashboard once information is validated
        var userProvidedInfo = req.body;
        var thisUser = User.where({email: req.body.email});
        thisUser.findOne(function (err, user) {
            if (user) {
                if (userProvidedInfo.email == user.email && userProvidedInfo.password == user.password) {
                    var newCode = updateMongo(user, userProvidedInfo);
                    res.status(200).json({
                        status: 200,
                        msg: "Login successful",
                        ticket: newCode,
                        email: user.email
                    });
                } else {
                    res.send("System error when authenticating user");
                }
            } else {
                res.send("User not found.");
            }
        });
    });

module.exports = router;

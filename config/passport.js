//Facebook Configuration
var FACEBOOK_APP_ID = "391255507727428";
var FACEBOOK_APP_SECRET = "85843651886934b1c33efea936acb376";
var request = require('request');
module.exports = function (passport) {

    //Strategies for PassportJS
    var LocalStrategy = require('passport-local').Strategy;
    var User = require('../model/user');
    var FacebookStrategy = require('passport-facebook').Strategy;

    //Allows users to login using local account 
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (username, password, done) {
            User.findOne({'email': username}, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, {message: 'Incorrect username!'});
                }

                if (password != user.password) {
                    return done(null, false, {message: 'Incorrect password!'});
                }

                return done(null, user);
            });
        }
    ));

    //Allows users to sign up for a local account
    passport.use('local-signup', new LocalStrategy({

            usernameField: 'email',
            passwordField: 'password'
            , passReqToCallback: true

        },
        function (req, username, password, done) {

            process.nextTick(function () {

                // Find a user whose email is the same as the forms email
                // We are checking to see if the user trying to login already exists
                User.findOne({'email': username}, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, {message: 'That email is already taken!'});
                    } else {

                        User.findOne({}, function (error, adminUser) {

                            //if there are any errors, return the error
                            if (error)
                                return done(error);

                            // if there is no user with that email
                            // create the user
                            var newUser = new User();

                            // Set the user's local credentials
                            newUser.email = username;
                            newUser.password = password;
                            newUser.pId = hashEmail(username);
                            newUser.dispName = req.body.fname + " " + req.body.lname;

                            //If no user exists in database, then this user should be Admin
                            if (adminUser == null) {
                                newUser.auth = 'admin';
                            }

                            // save the user
                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        });


                    }

                });

            });

        }));
    
    //Serialzing User
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    //Deserializing USer
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    //Allows user to log in using Facebook 
    passport.use(new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: "https://tutors4you.herokuapp.com/auth/facebook/callback",
            profileFields: ['id', 'name', 'displayName', 'email']
        },
        function (token, refreshToken, profile, done) {
            process.nextTick(function () {

                // find the user in the database based on their facebook id
                User.findOne({email: profile.emails[0].value}, function (err, user) {

                    // if there is an error, return error 
                    if (err)
                        return done(err);

                    // if the user is found, then log him in
                    if (user) {
                        return done(null, user); 
                    } else {

                        // Get Facebook Profile picture
                        var facebookAPIEndPoint = "https://graph.facebook.com/";
                        var facebookAPIGetPicturePath = "/picture";

                        request(facebookAPIEndPoint + profile.id + facebookAPIGetPicturePath + "/?type=large&redirect=false", function (error, response, body) {

                            User.findOne({}, function (error2, adminUser) {

                                //if there are any errors, return the error
                                if (error2)
                                    return done(error2);

                                // if there is no user found with that facebook id, create them
                                var newUser = new User();

                                // Set all of the facebook information in our Database
                                newUser.facebookId = profile.id; // Set the users facebook id
                                newUser.email = profile.emails[0].value;
                                newUser.facebookToken = token; // We will save the token that facebook provides to the user
                                newUser.facebookName = profile.name.givenName + ' ' + profile.name.familyName; 

                                //If no user exists in database, then this User should be Admin
                                if (adminUser == null) {
                                    newUser.auth = 'admin';
                                }

                                if (!error) {
                                    body = JSON.parse(body);
                                    newUser.facebookProfilePicture = body.data.url;
                                }
                                // save our user to the database
                                newUser.save(function (err) {
                                    if (err)
                                        throw err;

                                    // if successful, return the new user
                                    return done(null, newUser);
                                });
                            });

                        });
                    }

                });
            });
        }
    ));

    var crypto = require('crypto');

//Helper function to hashEmail
    function hashEmail(email) {
        var hash = crypto.createHash('md5').update(email).digest('hex');
        return hash;
    }
}
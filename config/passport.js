var FACEBOOK_APP_ID = "104977756536702";
var FACEBOOK_APP_SECRET = "af3e54581686fcf0a7885252bf23339d";
var request = require('request');
module.exports = function (passport) {

    var LocalStrategy = require('passport-local').Strategy;
    var User = require('../model/user');
    var FacebookStrategy = require('passport-facebook').Strategy;

    //This is for logging in
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

    //Used for signing up
    passport.use('local-signup', new LocalStrategy({

            usernameField: 'email',
            passwordField: 'password'
            , passReqToCallback: true

        },
        function (req, username, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({'email': username}, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, {message: 'That email is already taken!'});
                    } else {

                        User.findOne({}, function (error, superAdminUser) {

                            //if there are any errors, return the error
                            if (error)
                                return done(error);

                            // if there is no user with that email
                            // create the user
                            var newUser = new User();

                            // set the user's local credentials
                            newUser.email = username;
                            newUser.password = password;
                            newUser.pId = hashEmail(username);
                            newUser.dispName = req.body.fname + " " + req.body.lname;//changess

                            //If no user exists in database, then this should be superAdmin
                            if (superAdminUser == null) {
                                newUser.auth = 'superAdmin';
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

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    passport.use(new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: "http://localhost:3000/auth/facebook/callback",
            profileFields: ['id', 'name', 'displayName', 'email']
        },
        function (token, refreshToken, profile, done) {
            process.nextTick(function () {

                // find the user in the database based on their facebook id
                User.findOne({email: profile.emails[0].value}, function (err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {

                        // Get Facebook Profile picture
                        var facebookAPIEndPoint = "https://graph.facebook.com/";
                        var facebookAPIGetPicturePath = "/picture";

                        request(facebookAPIEndPoint + profile.id + facebookAPIGetPicturePath + "/?type=large&redirect=false", function (error, response, body) {

                            // if there is no user found with that facebook id, create them
                            var newUser = new User();

                            // set all of the facebook information in our user model
                            newUser.facebookId = profile.id; // set the users facebook id
                            newUser.email = profile.emails[0].value;
                            newUser.facebookToken = token; // we will save the token that facebook provides to the user
                            newUser.facebookName = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned

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
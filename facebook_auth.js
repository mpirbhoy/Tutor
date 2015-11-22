var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose'),
    User = mongoose.model('User');

var FACEBOOK_APP_ID = "104977756536702";
var FACEBOOK_APP_SECRET = "af3e54581686fcf0a7885252bf23339d";


module.exports = function(passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use(new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: 'http://localhost:3000/auth/facebook/callback',
            profileFields: ['id', 'name', 'displayName', 'email']
        },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {

                User.findOne({ email: profile.id }, function(err, user) {
                    if (err) return done(err);

                    if (user) {
                        return done(null, user);
                    } else {
                        // Populate database with user's Facebook 's info
                        var user = new User();

                        user.set('email', profile.emails[0].value);
                        user.set('display_name', profile.displayName);
                        user.set('status', 'Member');
                        user.set('token', accessToken);


                        user.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, user);
                        });
                    }
                });
            });
        }));
};
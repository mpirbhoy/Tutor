module.exports = function(passport) {

var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user');

//This is for logging in 
passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
		User.findOne({'email': username}, function(err, user) {
			if (err) { return done(err);}
			
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
        
        usernameField : 'email',
        passwordField : 'password'
	    ,passReqToCallback : true

    },
    function(req, username, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
				return done(null, false, {message: 'That email is already taken!'});
            } else {
				
				User.findOne({}, function(error, superAdminUser) {
					
					//if there are any errors, return the error
					if (error) 
						return done(error);
					
					// if there is no user with that email
					// create the user
					var newUser   = new User();

					// set the user's local credentials
					newUser.email    = username;
					newUser.password = password;
					newUser.pId = hashEmail(username);
					
					//If no user exists in database, then this should be superAdmin
					if (superAdminUser == null) {
						newUser.auth = 'superAdmin';
					} 
					
					// save the user
					newUser.save(function(err) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				});
                
                
            }

        });    

        });

    }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
}

var crypto = require('crypto');

//Helper function to hashEmail
function hashEmail(email) {
	var hash = crypto.createHash('md5').update(email).digest('hex');
	return hash;
}
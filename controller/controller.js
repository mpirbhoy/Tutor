/**
 *
 * Created by franklai on 15-11-20.
 */
exports.postLogin = function(req, res, passport){
    	passport.authenticate('local-login', { successRedirect: '/main',
														failureRedirect: '/login', failureFlash : true});

};

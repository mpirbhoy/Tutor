/**
 *
 * Created by franklai on 15-11-20.
 */

module.exports = {
    postLogin: function(){
    	passport.authenticate('local-login', { successRedirect: '/main',
														failureRedirect: '/login', failureFlash : true});
    }

};

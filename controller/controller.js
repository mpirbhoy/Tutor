/**
 *
 * Created by franklai on 15-11-20.
 */
var User = require('../model/user');
//exports.postLogin = function(req, res, passport){
//    	passport.authenticate('local-login', { successRedirect: '/main',
//														failureRedirect: '/login', failureFlash : true});
//
//};
module.exports.getProfile = function (req, res) {
    var email = req.params.email;
    if (email) {
        User.where({email: email}).findOne(function (err, foundUser) {
            if (foundUser) {
                res.render('user', {
                    title: "View User",
                    email: foundUser.email,
                    dispName: foundUser.dispName,
                    descr: foundUser.descr,
                    imgPath: foundUser.imgPath
                })
            }
        })
    }

};

//This contains the routes that the server allows
var crypto = require('crypto');
var fs = require('fs');
var path = require("path");
var User = require('./model/user');
var flash = require('connect-flash');
var express = require('express');
var controller = require('./controller/controller');
var middleware = require('./controller/middleware');


module.exports = function(app, passport) {
	//GET REQUESTS
	//
	//Request to go to homepage
	app.get('/', middleware.isNotLoggedIn, function (req, res) {
		res.render('./pages/home');
	});

	app.get('/login', middleware.isNotLoggedIn, function (req, res) {
		res.render('./pages/login', {'errorMsg' : req.flash('error')});
	});

	app.get('/signup', middleware.isNotLoggedIn, function (req, res) {
		res.render('./pages/signup');
	});

	app.get('/main', middleware.isLoggedIn, function(req, res) {
		res.render('./pages/main');
	});

	// Redirect the user to Facebook for authentication.  When complete,
	// Facebook will redirect the user back to the application at
	//     /auth/facebook/callback
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

	// Facebook will redirect the user to this URL after approval.  Finish the
	// authentication process by attempting to obtain an access token.  If
	// access was granted, the user will be logged in.  Otherwise,
	// authentication has failed.
	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { successRedirect: '/',
	                                      failureRedirect: '/login' }));

	//POST REQUESTS

	//Request to perform login
	app.post('/login', passport.authenticate('local-login', { successRedirect: '/main',
														failureRedirect: '/login', failureFlash : true}));

	//Request to perform signup
	app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/main', // redirect to the secure profile section
			failureRedirect : '/signup'// redirect back to the signup page if there is an error
	, failureFlash : true}));

	//Request to perform logout
	app.post('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});


	app.get('/view_user/:email', middleware.isLoggedIn, function (req, res){
		//controller.getProfile(req, res)
		var email = req.params.email;
		if (email) {
			User.where({email: email}).findOne(function (err, foundUser) {
				if (foundUser) {
					res.render('pages/view_user', {
						title: "View User",
						email: foundUser.email,
						dispName: foundUser.dispName,
						descr: foundUser.descr,
						imgPath: foundUser.imgPath
					})
				}
			})
		}
	});

}




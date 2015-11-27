//This contains the routes that the server allows
var crypto = require('crypto');
var fs = require('fs');
var path = require("path");
var User = require('./model/user');
var flash = require('connect-flash');
var express = require('express');
var controller = require('./controller/controller');
var middleware = require('./controller/middleware');
var Thread = require('./model/thread');
var Course = require('./model/course');

module.exports = function(app, passport) {
	
	//Passport authentication routes
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

	
	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { successRedirect: '/',
	                                      failureRedirect: '/login' }));
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


	
	app.get('/', middleware.isNotLoggedIn, function (req, res) {
		res.render('./pages/home');
	});

	app.get('/login', middleware.isNotLoggedIn, function (req, res) {
		res.render('./pages/login', {'errorMsg' : req.flash('error')});
	});

	app.get('/signup', middleware.isNotLoggedIn, function (req, res) {
		res.render('./pages/signup');
	});

	//Routes going through controller.js
	app.get('/main', middleware.isLoggedIn, controller.getMain);
	app.get('/view_user/:email', middleware.isLoggedIn, controller.getProfile);
	app.get('/course', middleware.isLoggedIn, controller.getAllCourses);
	//app.post('/course/:selection', middleware.isLoggedIn, controller.getOneCourse);

	// Route for making thread for a particular course
	app.post('/thread/:course', controller.makeNewThread);
	app.get('/thread/:course', controller.getAllThreads);
	// Route for getting threads for a particular course


	// POST request when enrolling in a course from search bar. The users class variable is UPDATED so PUT will be used
	//app.post('/:email/:courses',function(req, res){
    //
	//	var email = req.params.email;
	//	var course = req.params.courses;
     //   if (email) {
     //       User.where({email: email}).findOne(function (err, foundUser) {
     //           if (foundUser) {
     //           	foundUser.classes.append()
    //
     //           }
     //       })
     //   }
	//});
}




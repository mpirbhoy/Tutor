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

	app.get('/', middleware.isNotLoggedIn, function (req, res) {
		res.render('./pages/home');
	});

	//Routes going through controller.js
	app.get('/main', middleware.isLoggedIn, controller.getMain);

	//Passport authentication routes
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));
	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { successRedirect: '/',
	                                      failureRedirect: '/login' }));
	//Request to perform login
	app.post('/login', passport.authenticate('local-login', { successRedirect: '/main',
														failureRedirect: '/login', failureFlash : true}));
	app.get('/login', middleware.isNotLoggedIn, function (req, res) {
		res.render('./pages/login', {'errorMsg' : req.flash('error')});
	});

	//Request to perform signup
	app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/main', // redirect to the secure profile section
			failureRedirect : '/signup'// redirect back to the signup page if there is an error
	, failureFlash : true}));
	app.get('/signup', middleware.isNotLoggedIn, function (req, res) {
		res.render('./pages/signup');
	});

	//Request to perform logout
	app.post('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/user/:email', middleware.isLoggedIn, controller.getProfile);
	// PUT request when enrolling in a course from search bar.
	app.put('/user/:email', controller.updateUserCourses);

	app.get('/injectcourses', middleware.isLoggedIn, controller.getAllCourses);
	//app.post('/course/:selection', middleware.isLoggedIn, controller.getOneCourse);


	// Route for making thread for a particular course
	app.post('/thread/:course', controller.makeNewThread);
	// Route for getting threads for a particular course
	app.get('/thread/:course', controller.getAllThreads);
	// Route for deleting a particular thread for a particular course
	//app.delete('thread/:course', controller.deleteAThread);
	//app.post('/user/:email', controller.injectAllCoursesToUser);
}




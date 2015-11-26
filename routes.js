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
var Class = require('./model/class');

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
	app.get('/main', middleware.isLoggedIn, function(req, res) {controller.getMain(req, res)});
	app.get('/view_user/:email', middleware.isLoggedIn, function(req, res) {controller.getProfile(req, res)});
	app.get('/course', middleware.isLoggedIn, function(req, res) {controller.getAllCourses(req, res)});
	app.post('/course/:selection', middleware.isLoggedIn, function(req, res) {controller.getOneCourse(req, res)});

	//app.get('/thread/:class', function(req, res ));
	app.post('/thread/:class', function(req, res){
		new Class({courseCode: 'csc309_frank'}).save();
		new Class({courseCode: 'csc309'}).save();
		var classToCreateIn = req.params.class;
		var newThreadData = req.body;

		Class.where({courseCode: classToCreateIn}).findOne(function(err, myClass){

			if (err){
				res.json({
					status: 409,
					msg: "Error occured with adding thread to class " + myClass.courseCode + "\n"
				});
			} else if (myClass){
				var newThread = new Thread({
					title: req.body.title,
					author: req.body.author_first_name + req.body.author_last_name,
					price: req.body.price,
					description: req.body.description,
					tutor: User,
					tutee: User,
					startTime: req.body.start_time,
					endTime: req.body.end_time

				});

				// For populating tutor or tutee field
				if (req.body.tutor) newThread.tutor = newThread.author;
				else newThread.tutee = newThread.author;


				newThread.save();
				myClass.threads.push(newThread)
				myClass.save();
			}
		})

	});
}




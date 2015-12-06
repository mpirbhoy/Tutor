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

	//Get request for Home page (Landing Page before logging in)
	app.get('/', middleware.isNotLoggedIn, function (req, res) {
		res.render('./pages/home');
	});

	//Get request for Main page (Landing Page after logging in)
	app.get('/main', middleware.isLoggedIn, controller.getMain);

	//Get request to authenticate user login using Facebook
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));
	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { successRedirect: '/',
	                                      failureRedirect: '/login' }));
	
	//Post request to authenticate user login using local account
	app.post('/login', passport.authenticate('local-login', { successRedirect: '/main',
														failureRedirect: '/login', failureFlash : true}));
	
	//Get request to serve Login Page
	app.get('/login', middleware.isNotLoggedIn, function (req, res) {
		res.render('./pages/login', {'errorMsg' : req.flash('error')});
	});

	//Post Request to perform signup for local account
	app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/main', // redirect to the secure profile section
			failureRedirect : '/signup'// redirect back to the signup page if there is an error
	, failureFlash : true}));
	
	//Get Request to serve Sign Up Page
	app.get('/signup', middleware.isNotLoggedIn, function (req, res) {
		res.render('./pages/signup');
	});

	//Post Request to perform logout
	app.post('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	//Post Request to send message to user with email :email
	app.post('/user/:email/message', middleware.isLoggedIn, controller.sendAMessage);

	//Post Request to give a review for user with email :email
	app.post('/user/:email/review', middleware.isLoggedIn, controller.leaveAReview);

	//Get Request to serve profile for user with email :email
	app.get('/user/:email', middleware.isLoggedIn, controller.getProfile);

	//Get Request to serve Edit Profile page for user with email :email
	app.get('/user/:email/edit', middleware.isLoggedIn, controller.getEditProfile);

	//Post Request to update profile details for user with email :email
	app.post('/user/:email/edit', middleware.isLoggedIn, controller.editProfile);

	//Post Request to enroll in a course for User who is currently logged in for courseCode :courseCode
	app.post('/course/:courseCode', middleware.isLoggedIn, controller.updateUserCourses);

	//Get Request to serve all courses for searchbar
	app.get('/injectcourses', middleware.isLoggedIn, controller.getAllCourses);

	//Get Request to Serve JSON Suggestions for ads for User
	 app.get('/thread/getSuggestions', middleware.isLoggedIn, controller.getSuggestions);

	//Post Request for creating a new thread for the course :course
	app.post('/thread/:course', middleware.isLoggedIn, controller.makeNewThread);

	//Get Request for getting all threads for a particular course :course
	app.get('/thread/:course', middleware.isLoggedIn, controller.getAllThreads);
	
	//Post Request for getting all courses for the user with email :email
	app.post('/user/:email', middleware.isLoggedIn, controller.injectAllCoursesToUser);

	//Post Request for posting a comment to a thread with ID :threadId
	app.post('/comment/:threadId', middleware.isLoggedIn, controller.postComment);

	//Get Request for getting Ratings for User with email :email
	app.get('/user/:email/rating', middleware.isLoggedIn, controller.getRating);

	//Post Request for posting Rating for User with email :email
	app.post('/user/:email/rating', middleware.isLoggedIn, controller.postRating);

	//Delete Request for deleting comment with ID :commentId
	app.delete('/comment/:commentId', middleware.isLoggedIn, controller.deleteComment);

	//Delete Request for deleting thread with ID :threadID
	app.delete('/thread/:threadId', middleware.isLoggedIn, controller.deleteThread);

	//Delete Request for deleting a course for User who is logged in for the course with courseCode :courseCode
	app.delete('/course/:courseCode', middleware.isLoggedIn, controller.deleteCourse);

	//Delete Request for deleting message with ID :messageID
	app.delete('/message/:messageId', middleware.isLoggedIn, controller.deleteAMessage);
}




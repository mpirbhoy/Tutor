//This contains the routes that the server allows
var crypto = require('crypto');
var fs = require('fs');
var path = require("path");
var User = require('../model/user');
var flash = require('connect-flash');
var express = require('express');


module.exports = function(app, passport) {
	//GET REQUESTS
	//
	//Request to go to homepage
	app.get('/', isNotLoggedIn, function (req, res) {
		res.render('./pages/home');
	});

	app.get('/login', isNotLoggedIn, function (req, res) {
		res.render('./pages/login');
	});

	app.get('/signup', isNotLoggedIn, function (req, res) {
		res.render('./pages/register');
	});

}

//Middleware for passing through if person is logged in already
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the login page
	res.redirect('/');
}

//Middleware for passing through if person is not logged in 
function isNotLoggedIn(req, res, next) {

	// if user is not authenticated in the session, carry on
	if (!req.isAuthenticated())
		return next();

	// if they are redirect them to the profile page
	res.redirect('/profileRed');
}

//Middleware to Log User's Activity
function logActivity(req, res, next) {
	var newActivity   = new UserActivity();

	// Set's the activity details
	if (req.isAuthenticated()) {
		newActivity.user_id = req.session.passport.user;
	}
	newActivity.request    = req.originalUrl; //consider adding more
	newActivity.ipAddress    = req.ip;
	newActivity.device    = req.headers['user-agent']; //need to test it

	//Save the Activity
	newActivity.save(function(err) {
		if (err)
			throw err;
		return next();
	});
}

//Generates randomname of length length while avoiding duplicates 
function generateName(length) {
	var rString = randomString(length);

	function imgExists(name) {
		fs.exists("./img/" + name, function(exists) {
			return exists;
		});
	}

	function randomString(length) {
		var result = '';
		var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
		return result;
	}

	while (imgExists(rString)) {
		rString = randomString(length);
	}

	return rString;
}

//Helper function to hashEmail
function hashEmail(email) {
	var hash = crypto.createHash('md5').update(email).digest('hex');
	return hash;
}
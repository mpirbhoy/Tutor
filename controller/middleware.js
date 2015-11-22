//Middleware for passing through if person is logged in already
module.exports.isLoggedIn = function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the login page
	res.redirect('/');
}

//debugging logs
module.exports.logger = function logger(req, res, next) {
	//console.log(req.body.username);
	//console.log(req.body.password);
	return next();
}

//Middleware for passing through if person is not logged in 
module.exports.isNotLoggedIn = function isNotLoggedIn(req, res, next) {

	// if user is not authenticated in the session, carry on
	if (!req.isAuthenticated())
		return next();

	// if they are redirect them to the profile page
	res.redirect('/main');
}
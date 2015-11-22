//Middleware for passing through if person is logged in already
module.exports.isLoggedIn = function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the login page
	res.redirect('/');
}

//debugging logs
function logger(req, res, next) {
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
var passport = require('passport');

module.exports = function(app) {
    var userController = require('./controllers/user_controller');

    app.get('/', function(req, res){
        //Prepare to serve index.html
        if (req.session.user) {
            res.render('index', {email: req.session.email,
            msg: req.session.msg});
        } else {
            req.session.msg = '';
            res.redirect('/login');
        }
    });
    app.get('/profile', function(req, res) {
        if (req.session.user) {
            res.render('profile', {msg: req.session.msg});
        } else {
            req.session.msg = 'Access denied!';
            res.redirect('/login');
        }
    });

    app.get('/signup', function(req, res) {
        if (req.session.user) {
            res.redirect('/');
        }
        res.render('signup', {msg:req.session.msg});
    });

    app.get('/login', function(req, res) {
        if (req.session.user) {
            res.redirect('/');
        }
        res.render('login', {msg:req.session.msg});
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login' }));

    app.get('/logout', function(req, res) {
        req.session.destroy(function() {
            res.redirect('/login');
        });
    });

    app.post('/signup', userController.signup);
    app.post('/user/update', userController.updateUser);
    app.post('/user/delete', userController.deleteUser);
    app.post('/login', userController.login);
    app.get('/user/profile', userController.getUserProfile);
    app.get('/user/list', userController.getAllUsers);
}
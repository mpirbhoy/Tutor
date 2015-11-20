/**
 * Created by franklai on 15-11-05.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/users_model');


router.route('/').
    get(function (req, res) {

        // Find out who are uper admin and admin, and inject different info for different classes of users.
        User.where({ticket: req.query.ticket}).findOne(function (err, user) {
            if (user) {
                var email = user.email;
                var ticket = user.ticket;
                var pic_path = user.pic_path;
                var admin, superAdmin
                if (user.access == "SUPERADMIN"){
                    admin = true;
                    superAdmin = true;
                } else if (user.access == "ADMIN"){
                    admin = true;
                    superAdmin = false;
                } else {
                    admin = false;
                    superAdmin = false;
                }

                // All users and populate the table in the view
                User.find({}, function (err, users) {
                    res.render('dashboard', {
                        title: "LLAB Dashboard",
                        email: email,
                        ticket: ticket,
                        allUsers: users,
                        pic_path: pic_path,
                        admin: admin,
                        superAdmin: superAdmin
                    });
                });
            } else {
                res.end("User not found");
            }
        });
    });
module.exports = router;
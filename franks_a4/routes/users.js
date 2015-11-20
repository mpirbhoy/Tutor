var express = require('express');
var User = require('../models/users_model');
var router = express.Router();

// Function for validating passwords
validatePassword = function (jsonData) {
    return jsonData['password'] != '' && jsonData['password'] === jsonData['confirm_password'];
};

router.route('/').
    get(function (req, res) {
        res.send("Send back resource");
    }).

    // Route for create new user. This gets executed when a new user signs up
    post(function (req, res) {
        var newUserInfo = req.body;
        var defaultPicPath = "/images/laughing_cat.png";

        //Find out if super admin exists and if it does, this user cannot be super admin
        User.where({access: "SUPERADMIN"}).findOne(function (err, firstUser) {

            // Ensure this new user being created is not already in database
            User.where({email: newUserInfo.email}).findOne(function (err, user) {
                if (validatePassword(newUserInfo) && !user && newUserInfo.email != undefined) {
                    if (!firstUser) {
                        new User({
                            display_name: "SUPERADMIN <->" + req.body.email,
                            email: req.body.email,
                            description: "N/A",
                            access: 'SUPERADMIN',
                            password: req.body.password,
                            pic_path: defaultPicPath,
                            ticket: -1
                        }).save();
                    } else {
                        new User({
                            display_name: req.body.email, email: req.body.email, description: "N/A", access: 'USER',
                            password: req.body.password, pic_path: defaultPicPath, ticket: -1
                        }).save();
                    }
                    res.json({added: true, status: 201, msg: "New user " + req.body.email + " added\n"});
                } else {
                    res.json({added: false, status: 409, msg: "Failed to add user" + req.body.email + "\n"});
                }
            });
        });
    });

router.route('/:email').

    get(function (req, res) {
        // This route is for retrieving info when the app needs to populate the edit_profile view

        var email = req.params.email;
        if (email) {
            User.where({email: email}).findOne(function (err, foundUser) {
                if (foundUser) {
                    res.render('user', {
                        title: "User Profile",
                        email: foundUser.email,
                        display_name: foundUser.display_name,
                        ticket: foundUser.ticket,
                        description: foundUser.description,
                        pic_path: foundUser.pic_path
                    })
                }
            })
        }
    }).put(function (req, res) {

        // This route is for updating user's info when a user finishes editing his/her profile in the edit_profile view
        var userProvidedInfo = req.body;

        User.where({email: req.params.email}).findOne(function (err, user) {
            if (user) {
                var sent = false;
                //Change user's info
                if (userProvidedInfo.description != null && userProvidedInfo.display_name != null) {
                    if (userProvidedInfo.description != "" && userProvidedInfo.display_name != "") {
                        user.description = userProvidedInfo.description;
                        user.display_name = userProvidedInfo.display_name;
                    } else {
                        sent = true;
                        res.json({
                            updated: false,
                            status: 409,
                            msg: "Fields cannot be empty" + req.body.email + "\n"
                        });
                    }
                }

                // Change access of this user. This will only occur when super admin assigns this user to be admin

                if (userProvidedInfo.access != null) {
                    if (userProvidedInfo.access != "") {
                        user.access = userProvidedInfo.access;
                    } else {
                        sent = true;
                        res.json({
                            updated: false,
                            status: 409,
                            msg: "Something went wrong\n"
                        });
                    }
                }
                // Change user's passwords
                if (userProvidedInfo.password != null && userProvidedInfo.confirm_password != null && !sent) {
                    if (validatePassword(userProvidedInfo)) {
                        user.password = userProvidedInfo.password;

                    } else {
                        sent = true;
                        res.json({
                            updated: false,
                            status: 409,
                            msg: "Failed to change password" + req.body.email + "\n"
                        });
                    }
                }
                // Change profile pic
                if (userProvidedInfo.newPicURL != null && !sent) {
                    if (userProvidedInfo.newPicURL != "") {
                        user.pic_path = userProvidedInfo.newPicURL;
                    } else {
                        sent = true;
                        res.json({
                            updated: false,
                            status: 409,
                            msg: "Failed to change picture url" + req.body.email + "\n"
                        });
                    }
                }

                // If there isn't any error in previous codes when updating info, save info and return a response of 200
                if (!sent) {
                    user.save(function (err) {
                        sent = true;
                        if (err) res.json({update: false, status: 409, msg: "Malformed update info"});
                        else {
                            res.status(200).json(
                                {
                                    status: 200,
                                    ticket: user.ticket,
                                    msg: "User's info updated"
                                }
                            );
                        }
                    });
                }
            } else {
                console.error("User not found when updating info");
            }
        });
    }).delete(function (req, res) {

        // This route is for deleting the user
        User.where({email: req.params.email}).findOne(function (err, user) {

            // Cannot delete yourself
            if (user.ticket == req.body.ticket) {
                res.json({updated: false, msg: "Cannot delete yourself"});
            } else {
                User.remove({ticket: user.ticket}, function (err) {
                    res.json({updated: true, msg: "User deleted"});
                })
            }
        });
    });


module.exports = router;

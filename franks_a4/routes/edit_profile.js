/**
 * Created by franklai on 15-11-07.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/users_model');


router.route('/').get(function (req, res) {

    var ticket = req.query.ticket;
    var email = req.query.email;

    // Get data of the user stated in query and populate these info in edit_profile view
    User.where({email: email}).findOne(function (err, user) {
        if (user) {

            // Get data of the user who requested data so we can restrict information depending on the user's class
            User.where({ticket: ticket}).findOne(function (err, userWithTicket){
                if (userWithTicket){

                    // Set admin status and inject into Jade template
                    var admin;
                    var superAdmin;
                    var superAdminEmail = null;
                    if (userWithTicket.access == "SUPERADMIN"){
                        admin = true;
                        superAdmin = true;
                        superAdminEmail = userWithTicket.email;
                    } else if (userWithTicket.access == "ADMIN"){
                        admin = true;
                        superAdmin = false;
                    } else {
                        admin = false;
                        superAdmin = false;
                    }

                    //Default values are null for userLastLoginAgent and userLastLoginGeoLocation
                    var userLastLoginAgent = null;
                    var userLastLoginGeoLocation = null;

                    // Get the tracking info about the user given in query
                    if (user.viewingDevices && user.geoLocations){
                         userLastLoginAgent = user.viewingDevices[user.viewingDevices.length - 1];
                         userLastLoginCoordsJSON = user.geoLocations[user.geoLocations.length - 1];
                         userLastLoginGeoLocation = "(" + userLastLoginCoordsJSON.location.latitude + ", " +
                            userLastLoginCoordsJSON.location.longitude + ")";
                    }

                    // If user is either the logged in user or admin
                    if (user.ticket == ticket || userWithTicket.access == 'SUPERADMIN' || userWithTicket.access == 'ADMIN') {
                        res.render(

                            // Inject additional access for admins & super admin into view template
                            'edit_profile', {
                                title: "Edit Profile",
                                email: user.email,
                                ticket: user.ticket,
                                pic_path: user.pic_path,
                                admin: admin,
                                superAdmin: superAdmin,
                                superAdminEmail: superAdminEmail,
                                userLastLoginAgent: userLastLoginAgent,
                                userLastLoginGeoLocation: userLastLoginGeoLocation
                            }
                        )
                    }
                } else {
                    res.json({msg: 'User not found for edit_profile'});
                }
            });

        } else {
            res.json({msg: 'User not found for edit_profile'});
        }
    });

});



module.exports = router;
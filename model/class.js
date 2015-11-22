/**
 * Created by franklai on 15-11-20.
 */
var mongoose = require('mongoose');
var Section = require('./section');


module.exports = mongoose.model('Class',{
    departmentCode: {type: String, required: true},
    courseCode:{type: String, required: true},
    listOfSections: [Section]
});
new Section

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


/**
 *
 * Created by franklai on 15-11-20.
 */
var User = require('../model/user');
var Class = require('../model/class');
//var sampleClasses = require("./classes.json");
//exports.postLogin = function(req, res, passport){
//    	passport.authenticate('local-login', { successRedirect: '/main',
//														failureRedirect: '/login', failureFlash : true});
//
//};
module.exports.getProfile = function (req, res) {
        var email = req.params.email;
        if (email) {
            User.where({email: email}).findOne(function (err, foundUser) {
                if (foundUser) {
                    res.render('./pages/view_user', {
                        title: "View User",
                        email: foundUser.email,
                        name: foundUser.dispName,
                        descr: foundUser.descr,
                        imgPath: foundUser.imgPath
                    })
                }
            })
        }

};

module.exports.getMain = function (req, res) {
        var _id = req.session.passport.user;
        console.log(_id);
        if (_id) {
            User.where({_id: _id}).findOne(function (err, foundUser) {
                if (foundUser) {
                    res.render('./pages/main', {
                        title: "Main Page",
                        email: foundUser.email,
                        name: foundUser.dispName,
                        descr: foundUser.descr,
                        imgPath: foundUser.imgPath
                    })
                }
            })
        }

};


module.exports.getAllCourses = function (req, res) {
    var allClasses = [];
    var i = 0;
    Class.find({}, function (err, classes) {
        if (classes) {
            classes.forEach(function(course) {
                  var tempClass = {}
                  tempClass.departmentCode = course.departmentCode;
                  tempClass.courseCode= course.courseCode;
                  tempClass.courseName = course.courseName;
                  tempClass.prereqs = course.prereqs;
                  tempClass.exclusions = course.exclusions;
                  tempClass.instructors = course.instructors;
                  allClasses[i] = tempClass;
                  i++;
            });
            res.send(JSON.stringify(allClasses));
        }
    })
};

//module.exports.loadClasses = function(req, res) {

//}
/**
 *
 * Created by franklai on 15-11-20.
 */
var User = require('../model/user');
var Course = require('../model/course');
//module.exports.postLogin = function postLogin(passport) {
//    console.log('In post login');
//    return function (req, res, next) {
//        passport.authenticate('local-login', {
//            successRedirect: '/main',
//            failureRedirect: '/login', failureFlash: true
//        });
//    }
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
                    imgPath: foundUser.imgPath,
                    dispName: foundUser.dispName,
                    classes: foundUser.classes
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
                var defaultImagePath;
                if (foundUser.facebookProfilePicture) {
                    defaultImagePath = foundUser.facebookProfilePicture;
                } else {
                    defaultImagePath = foundUser.imgPath;
                }

                res.render('./pages/main', {
                    title: "Main Page",
                    email: foundUser.email,
                    name: foundUser.dispName,
                    descr: foundUser.descr,
                    imgPath: defaultImagePath
                })
            }
        })
    }

};


module.exports.getAllCourses = function (req, res) {

    new Course({courseCode: 'CSC309H1',
        courseName: 'Programming on the Web',
        prereqs: 'CSC209H1',
        instructors: 'A. Mashiyat'
    }).save();
    new Course({courseCode: 'CSC343H1',
        courseName: 'Introduction to Databases',
        prereqs: 'CSC165H1/CSC240H1/(MAT135H1, MAT136H1)/MAT135Y1/MAT137Y1/MAT157Y1; CSC207H1',
        instructors: 'F. Nargesian, B. Simion, N. El-Sayed'
    }).save();
    new Course({courseCode: 'CSC108H1',
        courseName: 'Introduction to Computer Programming',
        exclusions: 'CSC120H1, CSC148H1',
        instructors: 'J. Smith, T. Fairgrieve, M. Papadopoulou'
    }).save();
    new Course({courseCode: 'CSC148H1',
        courseName: ' Introduction to Computer Science',
        prereqs: ' CSC108H1',
        exclusions: 'CSC150H1',
        instructors: 'D. Liu, D. Heap'
    }).save();
    new Course({courseCode: 'CSC207H1',
        courseName: 'Software Design',
        prereqs: 'CSC148H1',
        instructors: 'J. Campbell'
    }).save();


    var allCourses = [];
    var i = 0;
    Course.find({}, function (err, courses) {
        if (courses) {
            courses.forEach(function(course) {
                var tempCourse = {}
                tempCourse.courseCode= course.courseCode;
                tempCourse.courseName = course.courseName;
                tempCourse.prereqs = course.prereqs;
                tempCourse.exclusions = course.exclusions;
                tempCourse.instructors = course.instructors;
                allCourses.push(JSON.stringify(tempCourse));
                i++;
            });
            res.send(JSON.stringify(allCourses));
        }
    })
};


/**
 *
 * Created by franklai on 15-11-20.
 */
var User = require('../model/user');
var Course = require('../model/course');
var Thread = require('../model/thread');

//// For packaging array of js objs into
//var packMgooseObjToJSON = function(arrOfJSON){
//   var bigObj = {};
//   arrOfJSON.forEach(function(innerObj){
//       bigObj.push(sdf)
//   })
//}

module.exports.getProfile = function (req, res) {
    var email = req.params.email;
    if (email) {
        User.where({email: email}).findOne(function (err, foundUser) {
            if (foundUser) {
                var correctImagePath;
                var localImg = 1;
                if (foundUser.facebookProfilePicture) {
                    correctImagePath = foundUser.facebookProfilePicture;
                    localImg = 0;
                } else {
                    correctImagePath = foundUser.imgPath;
                }

                var dispName;
                if (foundUser.dispName == "") {
                    dispName = foundUser.facebookName;
                } else {
                    dispName = foundUser.dispName;
                }
                res.render('./pages/view_user', {
                    title: "View User",
                    email: foundUser.email,
                    name: dispName,
                    descr: foundUser.descr,
                    imgPath: correctImagePath,
                    dispName: foundUser.dispName,
                    courses: foundUser.courses,
                    localImg : localImg
                })
            }
        })
    }

}; // Git ghost ...

module.exports.getMain = function (req, res) {
    var _id = req.session.passport.user;
    console.log(_id);
    if (_id) {
        User.where({_id: _id}).findOne().populate('courses').exec(function (err, foundUser) {
            if (foundUser) {
                var correctImagePath;
                var localImg = 1;
                if (foundUser.facebookProfilePicture) {
                    correctImagePath = foundUser.facebookProfilePicture;
                    localImg = 0;
                } else {
                    correctImagePath = foundUser.imgPath;
                }

                var dispName;
                if (foundUser.dispName == "") {
                    dispName = foundUser.facebookName;
                } else {
                    dispName = foundUser.dispName;
                }

                res.render('./pages/main', {
                    title: "Main Page",
                    email: foundUser.email,
                    name: dispName,
                    descr: foundUser.descr,
                    imgPath: correctImagePath,
                    courses: JSON.stringify(foundUser.courses),
                    localImg : localImg

                })
            }
        })
    }

};


module.exports.getAllCourses = function (req, res) {

    new Course({
        courseCode: 'CSC309H1',
        courseName: 'Programming on the Web',
        prereqs: 'CSC209H1',
        instructors: 'A. Mashiyat'
    }).save();
    new Course({
        courseCode: 'CSC343H1',
        courseName: 'Introduction to Databases',
        prereqs: 'CSC165H1/CSC240H1/(MAT135H1, MAT136H1)/MAT135Y1/MAT137Y1/MAT157Y1; CSC207H1',
        instructors: 'F. Nargesian, B. Simion, N. El-Sayed'
    }).save();
    new Course({
        courseCode: 'CSC108H1',
        courseName: 'Introduction to Computer Programming',
        exclusions: 'CSC120H1, CSC148H1',
        instructors: 'J. Smith, T. Fairgrieve, M. Papadopoulou'
    }).save();
    new Course({
        courseCode: 'CSC148H1',
        courseName: ' Introduction to Computer Science',
        prereqs: ' CSC108H1',
        exclusions: 'CSC150H1',
        instructors: 'D. Liu, D. Heap'
    }).save();
    new Course({
        courseCode: 'CSC207H1',
        courseName: 'Software Design',
        prereqs: 'CSC148H1',
        instructors: 'J. Campbell'
    }).save();


    var allCourses = [];
    Course.find({courseCode: req.query.term}, function (err, courses) {
        if (courses) {
            courses.forEach(function (course) {
                var tempCourse = {};
                tempCourse.courseCode = course.courseCode;
                tempCourse.courseName = course.courseName;
                tempCourse.prereqs = course.prereqs;
                tempCourse.exclusions = course.exclusions;
                tempCourse.instructors = course.instructors;
                allCourses.push(tempCourse);
            });
            res.send(allCourses);
        }
    })
};

module.exports.makeNewThread = function (req, res) { //TODO: Untested
    new Course({courseCode: 'csc309_frank'}).save();
    new Course({courseCode: 'csc309'}).save();
    var courseToCreateIn = req.params.course;
    var newThreadData = req.body;
    if (courseToCreateIn) {

        Course.where({courseCode: courseToCreateIn}).findOne(function (err, myCourse) {

            if (err) {
                res.json({
                    status: 409,
                    msg: "Error occurred with adding thread to course " + myCourse.courseCode + "\n"
                });
            } else if (myCourse) {
                var newThread = new Thread({
                    title: req.body.title,
                    author: req.body.author_first_name + req.body.author_last_name,
                    price: req.body.price,
                    description: req.body.description,
                    tutor: User,
                    tutee: User,
                    startTime: req.body.start_time,
                    endTime: req.body.end_time

                });

                // For populating tutor or tutee field
                if (req.body.tutor) newThread.tutor = newThread.author;
                else newThread.tutee = newThread.author;


                newThread.save();
                myCourse.threads.push(newThread);
                myCourse.save();
                res.json({status: 301, msg : "New thread created", data: newThread});
                //res.send(newThread);
            }
        })
    }
};

module.exports.getAllThreads = function(req, res){

    // Get threads specific to a class
    var getThreadsFrom = req.params.course;
    if (getThreadsFrom) {
        Course.where({courseCode: getThreadsFrom}).findOne().populate('threads').exec(function(err, myCourse){
            if (myCourse){
                res.json({status: 301, allThreadsFromCourse: myCourse['threads']})
            }
            else {
                res.json({status: 409, msg: "Can't find anything"});
            }

        });
        //Course.where({courseCode: getThreadsFrom}).findOne(function (err, myCourse) {
        //    if (err) {
        //        res.json({
        //            status: 409,
        //            msg: "Error occurred with adding thread to course " + myCourse.courseCode + "\n"
        //        });
        //    } else if (myCourse) {
        //
        //        //var allCourses = [];
        //        //var i = 0;
        //        //Course.find({}, function (err, courses) {
        //        //    if (courses) {
        //        //        courses.forEach(function (course) {
        //        //            allCourses.push((course));
        //        //        });
        //        //        res.send((allCourses));
        //        //    }
        //        //})
        //        //res.json({
        //        //    status: 301,
        //        //    allThreadsInCourse: JSON.stringify(myCourse.threads)
        //        //});
        //        myCourse.populate('threads').exec(function(err, x){
        //           res.send(x);
        //        });
        //    }
        //})
    }
};
module.exports.updateUserCourses = function(req, res){

    var email = req.params.email;
    var courseCode = req.body.courseCode; //TODO: Need to get the correct identifier for course data
    if (email) {

        // Find the user to add course for
        User.where({email: email}).findOne(function (findUserErr, foundUser) {

            if (findUserErr){
                res.json({
                    status: 409,
                    msg: "Errors when trying to find the user for enrollment"
                })
            }

            else if (foundUser) {

                // Find the course for enrolment
                Course.where({courseCode: courseCode}).findOne(function(findCourseErr, myCourse){
                    if(findCourseErr){
                        res.json({
                            status: 409,
                            msg: "Errors when trying to find the course for enrollment"
                        })
                    } else if (myCourse){
                        foundUser.courses.push(myCourse);
                        foundUser.save();
                        res.json({
                            status: 301,
                            msg: "Course added"
                        });
                    }
                });
            }
        });
    }
};
//module.exports.deleteAThread = function(req, res){
//    var
//};

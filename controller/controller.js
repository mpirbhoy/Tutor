var User = require('../model/user');
var Course = require('../model/course');
var Thread = require('../model/thread');
var Comment = require('../model/comment');

Course.count({}, function (err, count) {
    if (count == 0) {
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
    }
});

// For getting profile for a particular user
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

};

// For getting all courses that are belong to a particular user and necessary info about user for navbar
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

// Hardcode all courses and send all courses as JSON
module.exports.getAllCourses = function (req, res) {


    var allCourses = [];
    var i = 1;

    Course.find({courseCode: new RegExp(req.query.term, "i")}, function (err, courses) {
        if (courses) {
            courses.forEach(function (course) {
                var tempCourse = {};

                tempCourse.id = i;
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

// For creating a new thread for a particular course. It also inserts into the course's thread collections
module.exports.makeNewThread = function (req, res) { //TODO: Untested
    var courseToCreateIn = req.params.course;
    if (courseToCreateIn) {
        console.log(req.params.course);
        Course.where({courseCode: courseToCreateIn}).findOne(function (err, myCourse) {

            if (err) {
                res.json({
                    status: 409,
                    msg: "Error occurred with adding thread to course " + myCourse.courseCode + "\n"
                });
            } else if (myCourse) {
                User.findById(req.session.passport.user, function(err, user) {
                    if (err) {
                      console.log(err);
                      return;
                    } else{
                        if (user) {
                                var newThread = new Thread({
                                    title: req.body.title,
                                    author: user,
                                    price: req.body.price,
                                    description: req.body.description,
                                    status: req.body.status,
                                    startTime: req.body.start_time,
                                    endTime: req.body.end_time
                                });

                                newThread.save();
                                myCourse.threads.push(newThread);
                                myCourse.save();

                                var returnThread = {
                                    title: req.body.title,
                                    author: user,
                                    price: req.body.price,
                                    description: req.body.description,
                                    status: req.body.status,
                                    startTime: req.body.start_time,
                                    endTime: req.body.end_time
                                }
                                res.json({status: 301, msg : "New thread created", data: returnThread});

                        } else {
                            res.json({status: 401, msg : "Login required", data: {}});
                        }
                    }
                });
            }
        });
    }
};

// For creating a new comment for a particular thread. It also inserts into the threads's comment collections
module.exports.postComment = function (req, res) { //TODO: Untested
    var threadToCreateIn = req.params.threadId;
    if (threadToCreateIn) {
        console.log(req.params.course);
        Thread.where({_id: threadToCreateIn}).findOne(function (err, myThread) {

            if (err) {
                res.json({
                    status: 409,
                    msg: "Error occurred with adding comment to thread " + myThread.threadId + "\n"
                });
            } else if (myThread) {
                User.findById(req.session.passport.user, function(err, user) {
                    if (err) {
                      console.log(err);
                      return;
                    } else{
                        if (user) {
                            var currDate = new Date().toString();
                                var newComment = new Comment({
                                    author: user,
                                    response: req.body.response,
                                    creationTime: currDate
                                });

                                newComment.save();
                                myThread.comments.push(newComment);
                                myThread.save();

                                var returnComment = {
                                    _id: newComment._id,
                                    author:user,
                                    response: req.body.response,
                                    creationTime: currDate
                                }
                                res.json({status: 301, msg : "New comment created", data: returnComment});

                        } else {
                            res.json({status: 401, msg : "Login required", data: {}});
                        }
                    }
                });
            }
        });
    }
};

// For deleting a comment with a particular commentId. 
module.exports.deleteComment = function (req, res) {
    User.findById(req.session.passport.user, function(err, user) {
        if (err) {
          res.status(400).send(err);
          return;
        } else{
            if (user.auth == 'superAdmin') {
                var commentToDel = req.params.commentId;
                Comment.remove({'_id' : commentToDel}, function(err) {
                        if (err) {
                          res.status(400).send(err);
                          return;
                        } else{
                            res.send('Comment Removed');
                        }

                });
            } else {
                var commentToDel = req.params.commentId;
                console.log(commentToDel);
                Comment.findOne({'_id' : commentToDel}, function(err, comment) {
                    if (err) {
                          res.status(400).send(err);
                          return;
                    } else{
                        if (comment) {

                            if (comment.author._id == req.session.passport.user._id) {
                                Comment.remove({'_id' : commentToDel}, function(err) {
                                    if (err) {
                                      res.status(400).send(err);
                                      return;
                                    } else{
                                        res.send('Comment Removed!');
                                    }
                                });
                            } else {
                                res.status(401).send('Not Authoried!');
                            }
                        } else {
                            res.status(404).send('Comment not found!');
                        } 
                    }
                });
            
            }
        }
    });
};

// For deleting a comment with a particular commentId. 
module.exports.deleteThread = function (req, res) {
    User.findById(req.session.passport.user, function(err, user) {
        if (err) {
          res.status(400).send(err);
          return;
        } else{
            if (user.auth == 'superAdmin') {
                var threadToDel = req.params.threadId;
                Comment.remove({'_id' : commentToDel}, function(err) {
                        if (err) {
                          res.status(400).send(err);
                          return;
                        } else{
                            res.send('Thread Removed');
                        }

                });
            } else {
                var threadToDel = req.params.threadId;
                console.log(threadToDel);
                Comment.findOne({'_id' : threadToDel}, function(err, thread) {
                    if (err) {
                          res.status(400).send(err);
                          return;
                    } else{
                        if (thread) {
                            if (thread.author._id == req.session.passport.user._id) {
                                Thread.remove({'_id' : threadToDel}, function(err) {
                                    if (err) {
                                      res.status(400).send(err);
                                      return;
                                    } else{
                                        res.send('Thread Removed!');
                                    }
                                });
                            } else {
                                res.status(401).send('Not Authoried!');
                            }
                        } else {
                            res.status(404).send('Thread not found!');
                        } 
                    }
                });
            
            }
        }
    });
};


// For deleting a comment with a particular courseCode
module.exports.deleteCourse = function (req, res) {
    User.findById(req.session.passport.user, function(err, user) {
        if (err) {
          res.status(400).send(err);
          return;
        } else{
            if (user) {
                var courseCode = req.params.courseCode;
                user.courses.pull({'courseCode': courseCode});
            } else {
                res.status(404).send('User not found');
            }
        }
    });
};


// Get all threads for a particular course
module.exports.getAllThreads = function(req, res) {

    // Get threads specific to a class
    var getThreadsFrom = req.params.course;
    if (getThreadsFrom) {
        Course.where({courseCode: getThreadsFrom}).findOne().populate('threads').populate('threads.comments').exec(function (err, myCourse) {
            if (myCourse) {
                res.json({status: 301, allThreadsFromCourse: myCourse['threads']})
            }
            else {
                res.json({status: 409, msg: "Can't find anything"});
            }

        });
    }
};

// Add a new course to a particular user's course collection
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
                        var isAlreadyEnrolled = false;
                        foundUser.courses.forEach(function (course) {
                            if (myCourse._id.equals(course)) {
                                isAlreadyEnrolled = true;
                            }
                        });

                        if (isAlreadyEnrolled) {
                            res.json({
                                status: 409,
                                msg: "You've already registered that course"
                            })
                        } else {
                            foundUser.courses.push(myCourse);

                            foundUser.save();
                            res.json({
                                status: 301,
                                msg: "Course added"
                            });
                        }
                    }
                });
            }
        });
    }
};
module.exports.injectAllCoursesToUser = function (req, res) {
    var email = req.params.email;
    User.where({email: email}).findOne(function (foundUserErr, user) {

        Course.where({}).find(function (findUserErr, courses) {
            if (findUserErr) {
                res.status(409).json({
                    msg: "Errors when trying to find the user for enrollment"
                })
            }

            else if (courses) {
                courses.forEach(function (course) {
                    user.courses.push(course);
                });
                user.save();
                res.status(301).json({
                    msg: "All course in DB added"
                });
            }
            else {
                res.status(409).json({
                    msg: "Cannot any course to add"
                })
            }

        });

    });

};

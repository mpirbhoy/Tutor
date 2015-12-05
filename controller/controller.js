var mongoose = require('mongoose'),
    User = mongoose.model('User');
var Course = require('../model/course');
var Thread = require('../model/thread');
var Comment = require('../model/comment');
var Message = require('../model/message');
var Review = require('../model/Review');
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
    var email = req.session.passport.user;
    var userBeingQueriedEmail = req.params.email;
    if (email) {
        User.where({email: userBeingQueriedEmail}).findOne().populate('courses').exec(function (err, foundOtherUser) {
            if (foundOtherUser) {


                User.where({_id: email}).findOne().populate('courses incomingMessages').exec(function (err, foundUser) {


                    if (foundUser) {
                        // Check if the user who made request is trying to see his/her own profile
                        var viewSelf;
                        (foundOtherUser._id == req.session.passport.user) ? viewSelf = true : viewSelf = false;
                        var correctImagePath, correctOtherImagePath;


                        var localImg = 1;
                        if (foundUser.facebookProfilePicture) {
                            correctImagePath = foundUser.facebookProfilePicture;
                            localImg = 0;
                        } else {
                            correctImagePath = foundUser.imgPath;
                        }

                        var otherLocalImg = 1;
                        if (foundOtherUser.facebookProfilePicture) {
                            correctOtherImagePath = foundOtherUser.facebookProfilePicture;
                            otherLocalImg = 0;
                        } else {
                            correctOtherImagePath = foundOtherUser.imgPath;
                        }

                        var dispName;
                        if (foundUser.dispName == "") {
                            dispName = foundUser.facebookName;
                        } else {
                            dispName = foundUser.dispName;
                        }


                        var courseColl = [];
                        for (i = 0; i < foundUser.courses.length; i++) {
                            courseColl.push(foundUser.courses[i].courseCode);
                            console.log(foundUser.courses[i].courseCode);
                        }
                        var otherCourseColl = [];
                        for (i = 0; i < foundOtherUser.courses.length; i++) {
                           otherCourseColl.push(foundOtherUser.courses[i].courseCode);
                            console.log(foundOtherUser.courses[i].courseCode);
                        }


                        Message.populate(foundUser.incomingMessages, {path: 'sender'}, function (err, userObject){
                            res.render(viewSelf ? './pages/view_user' : './pages/view_other', {
                            //res.send({
                                title: "View User",
                                email: foundUser.email,
                                name: dispName,
                                descr: foundUser.descr,
                                imgPath: correctImagePath,
                                dispName: foundUser.dispName,
                                courses: courseColl,
                                localImg: localImg,


                                otherImgPath: correctOtherImagePath,
                                otherEmail: foundOtherUser.email,
                                otherName: foundOtherUser.dispName,
                                otherLocalImg: otherLocalImg,
                                otherCourses: otherCourseColl,
                                otherTutorRatingAvg: (foundOtherUser.numTutorRating == 0) ? 0: foundOtherUser.tutorRating/foundOtherUser.numTutorRating,
                                otherTuteeRatingAvg: (foundOtherUser.numTuteeRating == 0) ? 0: foundOtherUser.tuteeRating/foundOtherUser.numTuteeRating,
                                otherTutorReviews: JSON.stringify(foundOtherUser.tutorReviews),
                                otherTuteeReviews: JSON.stringify(foundOtherUser.tuteeReviews),

                                messages: viewSelf && JSON.stringify(foundUser.incomingMessages)
                            })
                        });
                    }
                })
            } else {
                res.json({msg: "can't find logged in user", status: 404});
            }
        })
    }

};


// For getting Suggestions for a particular user
module.exports.getSuggestions = function (req, res) {
    
    // Get all suggestions 
    var userId = req.session.passport.user;
    if (userId) {
        User.where({_id: userId}).findOne().populate('courses').lean().exec(function (err, myUser) {
            if (myUser) {
                Course.populate(myUser['courses'], {path: 'threads'}, function (err, data) {
                    
	                    allCourses = data;
	                    var suggestedThreads = [];
	                    for (i = 0; i < allCourses.length; i++) {
	                    	var maxPrice = 0;
	                    	var maxThread = null;

	                    	for (j = 0; j < allCourses[i].threads.length; j++) {
	                    		if ((allCourses[i].threads[j].price > maxPrice) && (userId != allCourses[i].threads[j].author._id)) {
	                    			maxPrice = allCourses[i].threads[j].price;
	                    			maxThread = allCourses[i].threads[j];
	                    		}
	                    	}

	                    	if (maxThread != null) {
	                    		suggestedThreads.push(maxThread);
	                    	}
	                    }
	                    
                    res.json({status: 200, suggestedThreads: data});
                });
                
            }
            else {
                res.json({status: 409, msg: "Can't find anything"});
            }
        });
    }

};


// Leave a tutor OR tutee review to a user
module.exports.leaveAReview = function (req, res) { //TODO: Needs testing ~!!
    var receiverEmail = req.params.email;
    var reviewText = req.body.reviewText; // TODO Needs testing from frontend
    var senderId = req.session.passport.user;
    User.where({_id: senderId}).findOne(function (err, sender) {
        if (sender) {
            User.where({email: receiverEmail}).findOne(function (err, receiver) {
                if (receiver) {
                    var reviewModel = new Review({
                        sender: sender,
                        receiver: receiver,
                        reviewText: reviewText,
                        creationTime: new Date().toString()
                    });

                    (req.body.isTutor == "true")? receiver.tutorReviews.push(reviewModel): receiver.tuteeReviews.push(reviewModel);
                    receiver.save();
                    reviewModel.save();
                    res.json({msg: "Review added to receiver's reviews collection", status: 200});
                } else {
                    res.json({msg: "Can't find the receiver.", status: 404});
                }
            })
        }
        else {
            res.json({msg: "Can't find the sender", status: 404});
        }
    })
};
// Add a message to a user

module.exports.sendAMessage = function (req, res) {
    var receiverEmail = req.params.email;
    var messageText = req.body.message; // TODO Needs testing from frontend
    var senderId = req.session.passport.user;
    User.where({_id: senderId}).findOne(function (err, sender) {
        if (sender) {
            User.where({email: receiverEmail}).findOne(function (err, receiver) {
                if (receiver) {
                    var messageModel = new Message({
                        sender: sender,
                        receiver: receiver,
                        content: messageText,
                        creationTime: new Date().toString()
                    });
                    receiver.incomingMessages.push(messageModel);
                    receiver.save();
                    messageModel.save();
                    res.json({msg: "Messaged added to receiver's inbox", status: 200});
                } else {
                    res.json({msg: "Can't find the receiver.", status: 404});
                }
            })
        }
        else {
            res.json({msg: "Can't find the sender", status: 404});
        }
    })


};
// For getting profile for a particular user
module.exports.getEditProfile = function (req, res) {
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
                res.render('./pages/edit_user', {
                    title: "Edit User",
                    email: foundUser.email,
                    name: dispName,
                    descr: foundUser.descr,
                    imgPath: correctImagePath,
                    dispName: foundUser.dispName,
                    courses: foundUser.courses,
                    localImg: localImg
                })
            }
        })
    }

};
// For changing the user's information. It is invoked by the edit profile view
module.exports.editProfile = function (req, res) {
    var userInfo = req.body;

    User.where({email: req.params.email}).findOne(function (err, user) {
        if (err) {
            res.json({
                msg: "Error when finding user",
                status: 400
            })
        } else {
            if (user) { //TODO: Do we need a step to authenticate ?
                if (user.password != userInfo.oldPassword) {
                    res.json({
                        msg: "Cannot authenticate user with old password",
                        status: 401
                    });
                    return;
                }
                if (userInfo.password != userInfo.oldPassword) {
                    res.json({
                        msg: "Cannot change password because passwords don't confirm",
                        status: 401
                    });
                    return;
                }
                //for (var key in userInfo) { //TODO not done Muj needs to do the frontend
                //    if (user[key] && userInfo[key]) {
                //        if ()
                //        user[key] = userInfo[key];
                //    }
                //}
                user.save();
                res.json({
                    msg: "User's info changed",
                    status: 200
                })
            } else {
                res.json({
                    msg: "Cannot find user",
                    status: 404
                })
            }
        }
    })

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
                    localImg: localImg

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
                User.findById(req.session.passport.user, function (err, user) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
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
                                _id: newThread._id,
                                title: req.body.title,
                                author: user,
                                price: req.body.price,
                                description: req.body.description,
                                status: req.body.status,
                                startTime: req.body.start_time,
                                endTime: req.body.end_time
                            }
                            res.json({status: 200, msg: "New thread created", data: returnThread});

                        } else {
                            res.json({status: 401, msg: "Login required", data: {}});
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
                User.findById(req.session.passport.user, function (err, user) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
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
                                author: user,
                                response: req.body.response,
                                creationTime: currDate
                            }
                            res.json({status: 200, msg: "New comment created", data: returnComment});

                        } else {
                            res.json({status: 401, msg: "Login required", data: {}});
                        }
                    }
                });
            }
        });
    }
};


// For rating a tutor or tutee 
module.exports.postRating = function (req, res) { //TODO: Untested
    var userToRate = req.params.email;
    if (userToRate) {
        
        User.where({email: userToRate}).findOne(function (err, rateUser) {

            if (err) {
                res.json({
                    status: 409,
                    msg: "Error occurred with rating user email: " + userToRate + "\n"
                });
            } else if (rateUser) {
                User.findById(req.session.passport.user, function (err, user) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        if (!user.equals(rateUser)) {
                        	console.log(req.body.rateType);
                        	
                            if (req.body.rateType == "tutor") {
                                rateUser.tutorRating = parseFloat(rateUser.tutorRating) + parseFloat(req.body.rating);
                                rateUser.numTutorRating = parseInt(rateUser.numTutorRating) + 1;
                            } else if (req.body.rateType =="tutee") {
                                rateUser.tuteeRating = parseFloat(rateUser.tuteeRating) + parseFloat(req.body.rating);
                                rateUser.numTuteeRating = parseInt(rateUser.numTuteeRating) + 1;
                            }
                            
                            rateUser.save();
                            
                            res.json({status: 200, msg: "User Rated Successfully"});

                        } else {
                            res.json({status: 401, msg: "Can't rate yourself!", data: {}});
                        }
                    }
                });
            }
        });
    }
};

// For rating a tutor or tutee 
module.exports.getRating = function (req, res) { //TODO: Untested
    var userToRate = req.params.email;
    if (userToRate) {
        
        User.where({email: userToRate}).findOne(function (err, rateUser) {

            if (err) {
                res.json({
                    status: 409,
                    msg: "Error occurred with rating user email: " + userToRate + "\n"
                });
            } else if (rateUser) {
                var tutorRating = rateUser.tutorRating/rateUser.numTutorRating;
                var tuteeRating = rateUser.tuteeRating/rateUser.numTuteeRating;
                
                res.json({status: 200, msg: "User Rated Successfully", date: {tutorRating: tutorRating, tuteeRating: tuteeRating}});                   
            } else {
                res.json({status: 404, msg: "Resource not available.", data: {}});
            }
        });
    }
};

// For deleting a comment with a particular commentId. 
module.exports.deleteComment = function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) {
            res.status(400).send(err);
            return;
        } else {
            var commentToDel = req.params.commentId;
            if (user.auth == 'superAdmin') {
                Comment.remove({'_id': commentToDel}, function (err) {
                    if (err) {
                        res.status(400).send(err);
                        return;
                    } else {
                        res.send('Comment Removed');
                    }

                });
            } else {
                Comment.findOne({'_id': commentToDel}, function (err, comment) {
                    if (err) {
                        res.status(400).send(err);
                        return;
                    } else {
                        if (comment) {

                            if (comment.author._id == req.session.passport.user) {
                                Comment.remove({'_id': commentToDel}, function (err) {
                                    if (err) {
                                        res.status(400).send(err);
                                        return;
                                    } else {
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

// For deleting a message from a person
module.exports.deleteAMessage = function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) {
            res.status(400).send(err);
            return;
        } else {
            var messageToDel = req.params.messageId;
            if (user.auth == 'superAdmin') {
                Message.remove({'_id': messageToDel}, function (err) {
                    if (err) {
                        res.status(400).send(err);
                        return;
                    } else {
                        res.send('Message Removed');
                    }

                });
            } else {
                Message.where({'_id': messageToDel}).findOne().populate('receiver').exec( function (err, message) {
                    if (err) {
                        res.status(400).send(err);
                        return;
                    } else {
                        if (message) {
                            if (message.receiver._id.equals(req.session.passport.user)) { //TODO: Receiver not populated
                                Message.remove({'_id': messageToDel}, function (err) {
                                    if (err) {
                                        res.status(400).send('blah');
                                        return;
                                    } else {
                                        res.send('Message Removed!');
                                    }
                                });
                            } else {
                                res.status(401).send('Not Authorized!');
                            }
                        } else {
                            res.status(404).send('Message not found!');
                        }
                    }
                });

            }
        }
    });
};


// For deleting a comment with a particular commentId.
module.exports.deleteThread = function (req, res) {
    User.findById(req.session.passport.user, function (err, user) {
        if (err) {
            res.status(400).send(err);
            return;
        } else {
            if (user.auth == 'superAdmin') {
                var threadToDel = req.params.threadId;
                Thread.remove({'_id': threadToDel}, function (err) {
                    if (err) {
                        res.status(400).send(err);
                        return;
                    } else {
                        res.send('Thread Removed');
                    }

                });
            } else {
                var threadToDel = req.params.threadId;
                Thread.findOne({'_id': threadToDel}, function (err, thread) {
                    if (err) {
                        res.status(400).send(err);
                        return;
                    } else {
                        if (thread) {
                            if (thread.author._id.equals(req.session.passport.user)) {
                                Thread.remove({'_id': threadToDel}, function (err) {
                                    if (err) {
                                        res.status(400).send('blah');
                                        return;
                                    } else {
                                        res.send('Thread Removed!');
                                    }
                                });
                            } else {
                                res.status(401).send('Not Authorized!');
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
    User.findById(req.session.passport.user, function (err, user) {
        if (err) {
            res.status(400).send(err);
            return;
        } else {
            if (user) {
                var courseCode = req.params.courseCode;

                Course.where({courseCode: courseCode}).findOne(function (findCourseErr, myCourse) {
                    if (findCourseErr) {
                        res.send(findCourseErr);
                    } else {
                        if (myCourse) {
                            for (i = 0; i < user.courses.length; i++) {

                                if (myCourse._id.equals(user.courses[i])) {
                                    user.courses.splice(i, 1);
                                    i = user.courses.length;
                                    user.save();
                                    res.send('Course: ' + myCourse + " Removed from User");
                                }

                            }


                        } else {
                            res.status(404).send('Course Not Found!');
                        }
                    }
                });


            } else {
                res.status(404).send('User not found');
            }
        }
    });


};


// Get all threads for a particular course
module.exports.getAllThreads = function (req, res) {

    // Get threads specific to a class
    var getThreadsFrom = req.params.course;
    if (getThreadsFrom) {
        Course.where({courseCode: getThreadsFrom}).findOne().populate('threads').lean().exec(function (err, myCourse) {
            if (myCourse) {
                Thread.populate(myCourse['threads'], {path: 'comments'}, function (err, data) {
                    var curUserId = req.session.passport.user;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i]['author']['_id'].equals(curUserId)) {
                            data[i].byAuthor = true;
                        } else {
                            data[i].byAuthor = false;
                        }


                        for (var j = 0; j < data[i]['comments'].length; j++) {
                            data[i]['comments'][j] = data[i]['comments'][j].toObject();
                            if (data[i]['comments'][j]['author']['_id'] == curUserId) {
                                data[i]['comments'][j].byAuthor = true;
                            } else {
                                data[i]['comments'][j].byAuthor = false;
                            }
                        }

                    }
                    // var data2 = [1];
                    // console.log("data 2 " + data2); 
                    res.json({status: 200, allThreadsFromCourse: data});
                });
            }
            else {
                res.json({status: 409, msg: "Can't find anything"});
            }
        });
    }
};

// Add a new course to a particular user's course collection
module.exports.updateUserCourses = function (req, res) {

    var user = req.session.passport.user;
    var courseCode = req.params.courseCode; //TODO: Need to get the correct identifier for course data
    if (user) {

        // Find the user to add course for
        User.where({_id: user}).findOne(function (findUserErr, foundUser) {

            if (findUserErr) {
                res.json({
                    status: 409,
                    msg: "Errors when trying to find the user for enrollment"
                })
            }

            else if (foundUser) {

                // Find the course for enrolment
                Course.where({courseCode: courseCode}).findOne(function (findCourseErr, myCourse) {
                    if (findCourseErr) {
                        res.json({
                            status: 409,
                            msg: "Errors when trying to find the course for enrollment"
                        })
                    } else if (myCourse) {
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
                                status: 200,
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
                res.status(200).json({
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

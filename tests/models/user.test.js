var mongoose = require('mongoose');
var User = require('../../model/user');
var Course = require('../../model/course');
var Thread = require('../../model/thread');

describe('Model', function() {
    var user;
    var course;

    //Test the subset of models
    it('should have a mongoose schema for User', function(){
        expect(User.schema).to.be.defined;
    });
    it('should have a mongoose schema for Course', function(){
        expect(Course.schema).to.be.defined;
    });
    it('should have a mongoose schema for Thread', function(){
        expect(Thread.schema).to.be.defined;
    });


    beforeEach(function(){
        user = new User({
            email: 'user@user.com',
            password: 'user',
            pId: "b8735",
            courses:[]
        });
        course = new Course({
            courseCode: 'CSC108H1',
            courseName: 'Introduction to Computer Programming',
            exclusions: 'CSC120H1, CSC148H1',
            instructors: 'J. Smith, T. Fairgrieve, M. Papadopoulou'
        });
        thread = new Thread({
            title: "I'm a tutor",
            author: 'user@email.com',
            creationTime: '2015-12-06T02:54:48.000'
        })
    });

    describe('User Schema', function() {
        it('should have an email address', function(){
            expect(user.email).to.be.defined;
        });
        it('should have a password', function(){
            expect(user.password).to.be.defined;
        });

        it('should have a default display name', function(){
            expect(user.dispName).to.be.defined;
        });
        it('should have a default user status', function(){
            expect(user.auth).to.be.defined;
            expect(user.auth).to.equal('user');
        });
        it('should have a default img path', function(){
            expect(user.imgPath).to.be.defined;
            expect(user.imgPath).to.equal('def.jpg');
        });
        it('should have a default description', function(){
            expect(user.descr).to.be.defined;
        });
        it('should have a pid', function(){
            expect(user.pId).to.be.defined;
        });
    });

    describe('Course Schema', function() {
        it('should have a course code', function(){
            expect(course.courseCode).to.be.defined;
        });
        it('should have a course name', function(){
            expect(course.courseName).to.be.defined;
        });
        it('should have no prerequisites', function(){
            expect(course.prereqs).to.be.not.defined;
        });
        it('should have exclusions', function(){
            expect(course.exclusions).to.be.defined;
        });
        it('should have instructors', function(){
            expect(course.instructors).to.be.defined;
        });
    });

    describe('Thread Schema', function() {
        it('should have a title', function(){
            expect(thread.title).to.be.defined;
        });
        it('should have a author', function(){
            expect(thread.author).to.be.defined;
        });
        it('should have creation time', function(){
            expect(thread.creationTime).to.be.defined;
        });
    });
});
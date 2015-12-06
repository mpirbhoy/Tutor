var routes = require('../../routes');
var controller = require('../../controller/controller');
var passport = require('passport');
var middleware = require('../../controller/middleware');

describe('Routes', function(){
    var app = {
        get: sinon.spy(),
        post: sinon.spy(),
        put: sinon.spy(),
        delete: sinon.spy()
    };
    beforeEach(function(done){
        routes(app, passport);
        done();

    });

    //Test all get requests
    describe('GETs', function() {
        it('should handle /', function(){
            expect(app.get).to.be.calledWith('/main', middleware.isLoggedIn, controller.getMain);
        });
        it('should handle /injectcourses', function(){
            expect(app.get).to.be.calledWith('/injectcourses', middleware.isLoggedIn, controller.getAllCourses);
        });
        it('should handle /thread/:course', function(){
            expect(app.get).to.be.calledWith('/thread/:course', middleware.isLoggedIn, controller.getAllThreads);
        });
        it('should handle /user/:email', function(){
            expect(app.get).to.be.calledWith('/user/:email', middleware.isLoggedIn, controller.getProfile);
        });
        it('should handle /user/:email/edit', function(){
            expect(app.get).to.be.calledWith('/user/:email/edit', middleware.isLoggedIn, controller.getEditProfile);
        });
        it('should handle /thread/getSuggestions', function(){
            expect(app.get).to.be.calledWith('/thread/getSuggestions', middleware.isLoggedIn, controller.getSuggestions);
        });
        it('should handle /user/:email/rating', function(){
            expect(app.get).to.be.calledWith('/user/:email/rating', middleware.isLoggedIn, controller.getRating);
        });

    });

    //Test all post requests
    describe('POSTs', function() {
        it('should handle /thread/:course', function(){
            expect(app.post).to.be.calledWith('/thread/:course', middleware.isLoggedIn, controller.makeNewThread);
        });
        it('should handle /user/:email', function(){
            expect(app.post).to.be.calledWith('/user/:email', middleware.isLoggedIn, controller.injectAllCoursesToUser);
        });
        it('should handle /comment/:threadId', function(){
            expect(app.post).to.be.calledWith('/comment/:threadId', middleware.isLoggedIn, controller.postComment);
        });
        it('should handle /course/:courseCode', function () {
            expect(app.post).to.be.calledWith('/course/:courseCode', middleware.isLoggedIn, controller.updateUserCourses);
        });
        it('should handle /user/:email/message', function () {
            expect(app.post).to.be.calledWith('/user/:email/message', middleware.isLoggedIn, controller.sendAMessage);
        });
        it('should handle /user/:email/review', function () {
            expect(app.post).to.be.calledWith('/user/:email/review', middleware.isLoggedIn, controller.leaveAReview);
        });
        it('should handle /user/:email/edit', function () {
            expect(app.post).to.be.calledWith('/user/:email/edit', middleware.isLoggedIn, controller.editProfile);
        });
        it('should handle /user/:email/edit', function () {
            expect(app.post).to.be.calledWith('/user/:email/edit', middleware.isLoggedIn, controller.editProfile);
        });
        it('should handle /user/:email/rating', function () {
            expect(app.post).to.be.calledWith('/user/:email/rating', middleware.isLoggedIn, controller.postRating);
        });



    });

    //Test all delete requests
    describe('DELETEs', function() {
        it('should handle /comment/:commentId', function () {
            expect(app.delete).to.be.calledWith('/comment/:commentId', middleware.isLoggedIn, controller.deleteComment);
        });
        it('should handle /thread/:threadId', function () {
            expect(app.delete).to.be.calledWith('/thread/:threadId', middleware.isLoggedIn, controller.deleteThread);
        });
        it('should handle /course/:courseCode', function () {
            expect(app.delete).to.be.calledWith('/course/:courseCode', middleware.isLoggedIn, controller.deleteCourse);
        });
        it('should handle /message/:messageId', function () {
            expect(app.delete).to.be.calledWith('/message/:messageId', middleware.isLoggedIn, controller.deleteAMessage);
        });
    });


    afterEach(function(done) {
        done();
    });

});
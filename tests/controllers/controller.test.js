var proxyquire = require('proxyquire'),
    callback = sinon.spy(),
    sidebarStub = sinon.stub(),
    userStub = {},
    courseStub = {count: sinon.spy()},
    threadStub = {},
    commentStub = {},
    messageStub = {},
    controller,
    ModelsStub = {
        User: {
            findOne: sinon.spy()
        },
        Course: {
            find: sinon.spy()
        }
    },
    controller = proxyquire('../../controller/controller', {
        '../model/user': userStub,
        '../model/course': courseStub,
        '../model/thread': threadStub,
        '../model/comment': commentStub,
        '../model/message': messageStub
    }),
    res = {},
    req = {},
    testUser = {};

describe('Controller', function(){
    beforeEach(function() {
        res = {
            render: sinon.spy(),
            json: sinon.spy(),
            redirect: sinon.spy()
        };
        req.params = {
            user_id: 'testing'
        };
        testUser = {
            email: 'user@user.com',
            password: 'user',
            pId: "b8735",
            courses:[],
            save: sinon.spy()
        };
    });

    describe('getProfile', function() {
        it('should be defined', function () {
            expect(controller.getProfile).to.be.defined;
        });
    });

    describe('getSuggestions', function() {
        it('should be defined', function () {
            expect(controller.getSuggestions).to.be.defined;
        });
    });

    describe('leaveAReview', function() {
        it('should be defined', function () {
            expect(controller.leaveAReview).to.be.defined;
        });
    });

    describe('sendAMessage', function() {
        it('should be defined', function () {
            expect(controller.sendAMessage).to.be.defined;
        });
    });

    describe('getEditProfile', function() {
        it('should be defined', function () {
            expect(controller.getEditProfile).to.be.defined;
        });
    });

    describe('editProfile', function() {
        it('should be defined', function () {
            expect(controller.editProfile).to.be.defined;
        });
    });

    describe('getMain', function() {
        it('should be defined', function () {
            expect(controller.getMain).to.be.defined;
        });
    });

    describe('getAllCourses', function() {
        it('should be defined', function () {
            expect(controller.getAllCourses).to.be.defined;
        });
    });

    describe('makeNewThread', function() {
        it('should be defined', function () {
            expect(controller.makeNewThread).to.be.defined;
        });
    });

    describe('postComment', function() {
        it('should be defined', function () {
            expect(controller.postComment).to.be.defined;
        });
    });

    describe('postRating', function() {
        it('should be defined', function () {
            expect(controller.postRating).to.be.defined;
        });
    });

    describe('getRating', function() {
        it('should be defined', function () {
            expect(controller.getRating).to.be.defined;
        });
    });

    describe('deleteComment', function() {
        it('should be defined', function () {
            expect(controller.deleteComment).to.be.defined;
        });
    });

    describe('deleteAMessage', function() {
        it('should be defined', function () {
            expect(controller.deleteAMessage).to.be.defined;
        });
    });

    describe('deleteThread', function() {
        it('should be defined', function () {
            expect(controller.deleteThread).to.be.defined;
        });
    });

    describe('deleteCourse', function() {
        it('should be defined', function () {
            expect(controller.deleteCourse).to.be.defined;
        });
    });

    describe('getAllThreads', function() {
        it('should be defined', function () {
            expect(controller.getAllThreads).to.be.defined;
        });
    });

    describe('updateUserCourses', function() {
        it('should be defined', function () {
            expect(controller.updateUserCourses).to.be.defined;
        });
    });

    describe('injectAllCoursesToUser', function() {
        it('should be defined', function () {
            expect(controller.injectAllCoursesToUser).to.be.defined;
        });
    });


});
/**
 * Created on 15-12-03.
 */
var expect = require('chai').expect;
var request = require('superagent');
var server = require('../server');
var mongoose = require('mongoose');
var Course = require('../model/course');
var User = require('../model/user');
var assert = require('assert');
//var Db = require('mongodb').Db;
//var db =  new Db('tutor', new Server('localhost', 27017));

var db = mongoose.connection;

before(function (done) {
    server.start(3000, done);
});

after(function (done) {
    server.end(done);
});


describe('Tutor', function () {
    var baseUrl = 'http://localhost:3000';

    describe('Inject all courses on DB to a user at post /user/:email', function () {


        it('should have 5 courses or less', function (done) {

            request.post(baseUrl + '/user/frankc201106@gmail.com').end(function (err, res) {
                User.findOne({email: 'frankc201106@gmail.com'}, function (err, user) {
                    if (user) {
                        //assert.equal(user.courses.length < 5, true);
                        expect(user.courses.length).to.equal(5);
                        done();
                    }
                });
            });
        });
    });

    //describe('get all courses at /injectcourses', function() {
    //
    //    it('should get exactly 5 courses everytime', function(done) {
    //
    //        //request.get(baseUrl + '/injectcourses').end(function (err, response, body) {
    //        //    // There should be array of 5 courses
    //        //    assert.equal(response, 5);
    //        })
    //    })
    //})

    //describe('get ')
});


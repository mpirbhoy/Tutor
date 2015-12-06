var mongoose = require('mongoose');
var Thread = require('./thread');
var User = require('./user');

//Model for University Courses 
module.exports = mongoose.model('Course',{
    courseCode:{type: String, required: true, unique: true}, //courseCode for course
    courseName: String,	//title of the course
    prereqs: String,  //prerequisites for the course
    exclusions: String, //exclusions for the course
    instructors: String, //instructors for the course
    threads: [{type: mongoose.Schema.Types.ObjectId, ref: 'Thread'}] //All threads created for the course
});


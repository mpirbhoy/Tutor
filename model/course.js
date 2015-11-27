/**
 * Created by franklai on 15-11-20.
 */
var mongoose = require('mongoose');
var Thread = require('./thread');
var User = require('./user');


module.exports = mongoose.model('Course',{
    courseCode:{type: String, required: true, unique: true},
    courseName: String,
    prereqs: String,
    exclusions: String,
    instructors: String,
    threads: [{type: mongoose.Schema.Types.ObjectId, ref: 'Thread'}]
});


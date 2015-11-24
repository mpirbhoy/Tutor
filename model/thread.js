/**
 *
 * Created by franklai on 15-11-20.
 */
var mongoose = require('mongoose');
var User = require('./user');
var Comment = require('./comment');
module.exports = mongoose.model('Thread',{
    title: String,
    author: User,
    creationTime: Date,
    comments: [Comment],
    modificationTime: Date,
    price: Number,
    tutor: User,
    tutee: User,
    starTime: String,
    endTime: String,
    description: String
});


/**
 *
 * Created by franklai on 15-11-20.
 */
var mongoose = require('mongoose');
var User = require('./user');
var Thread  = require('./thread');
var Comment = require('./comment');
module.exports = mongoose.model('Section',{
    title: String,
    author: User,
    creationTime: Date,
    modificationTime: Date,
    threadHost: Thread,
    commentID: {type: Number, unique: true},
    comments: [Comment]
});


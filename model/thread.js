/**
 *
 * Created by franklai on 15-11-20.
 */
var mongoose = require('mongoose');
var User = require('./user');
var Comment = require('./comment');
module.exports = mongoose.model('Section',{
    title: String,
    author: User,
    creationTime: Date,
    threadID: {type: Number, unique: true},
    comments: [Comment],
    modificationTime: Date,
    price: Number,
    tutor: User,
    tutee: User,
    availability: String
});


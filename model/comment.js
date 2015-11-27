/**
 *
 * Created by franklai on 15-11-20.
 */
var mongoose = require('mongoose');
var User = require('./user');
var Thread  = require('./thread');
var Comment = require('./comment');
module.exports = mongoose.model('Section',{
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creationTime: Date,
    modificationTime: Date,
    threadHost: {type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
    commentID: {type: Number, unique: true},
    response: String
});


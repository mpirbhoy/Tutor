/**
 *
 * Created by franklai on 15-11-20.
 */
var mongoose = require('mongoose');
var User = require('./user');
var Thread  = require('./thread');
var Comment = require('./comment');
module.exports = mongoose.model('Comment',{
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creationTime: { type: Date, default: Date.now },
    response: String
//    threadHost: {type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }
//    commentID: {type: Number, unique: true},
//    modificationTime: Date
    
});


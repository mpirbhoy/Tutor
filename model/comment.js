var mongoose = require('mongoose');
var User = require('./user');
var Thread  = require('./thread');
var Comment = require('./comment');

//Model for Comments on Threads
module.exports = mongoose.model('Comment',{
    author: User, //author for comment
    creationTime: Date, //time comment was created
    response: String //content of the comment

});


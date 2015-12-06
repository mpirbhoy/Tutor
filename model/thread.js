var mongoose = require('mongoose');
var User = require('./user');
var Comment = require('./comment');

//Model for Threads (Ads for Tutoring/Tuteeing)
module.exports = mongoose.model('Thread',{
    title: String, //Title of Thread
    author: User, //Author of Thread
    creationTime: Date, //Time thread was created 
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}], //Comment on thread
    price: Number, //Price for Tutoring Services 
    startTime: String, //Start time for Tutoring
    endTime: String, //End time for Tutoring 
    description: String //Description of service
});


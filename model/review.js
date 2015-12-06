var mongoose = require('mongoose');
var User = require('./user');

//Model for Reviews (Public)
module.exports = mongoose.model('Review', {
        sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, //Writer of the review
        receiver:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}, //Person being reviewed
        reviewText: String, //Content of the review
        creationTime: Date //Time review was written
    }
);
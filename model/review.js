var mongoose = require('mongoose');
var User = require('./user');

module.exports = mongoose.model('Review', {
        sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        receiver:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        reviewText: String,
        creationTime: Date
    }
);
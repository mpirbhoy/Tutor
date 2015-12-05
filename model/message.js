var mongoose = require('mongoose');
var User = require('./user');

module.exports = mongoose.model('Message', {
        sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        receiver:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        content: String,
        creationTime: Date
    }
);
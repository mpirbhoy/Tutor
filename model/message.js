var mongoose = require('mongoose');
var User = require('./user');

//Model for Messages (Private between Users)
module.exports = mongoose.model('Message', {
        sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, //Sender of the message
        receiver:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}, //Receiver of the message
        content: String, //Content of the message
        creationTime: Date // Time Message was sent
    }
);
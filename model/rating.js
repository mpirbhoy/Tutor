/**
 *
 * Created by franklai on 15-11-20.
 */
var mongoose = require('mongoose');
var User = require('./user');

module.exports = mongoose.model('Section',{
    rater: User,
    ratee: User,
    review: String,
    score: Number
});


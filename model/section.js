/**
 *
 * Created by franklai on 15-11-20.
 */
var mongoose = require('mongoose');
var Class = require('./class');


module.exports = mongoose.model('Section',{
    classId : String,
    classTimes: [String],
    sectionCode: String,
    professors: [String],
    term: String
});


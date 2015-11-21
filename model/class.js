/**
 * Created by franklai on 15-11-20.
 */
var mongoose = require('mongoose');
var Section = require('./section');


module.exports = mongoose.model('Class',{
    departmentCode: {type: String, required: true},
    courseCode:{type: String, required: true},
    listOfSections: [Section]
});

/**
 * Created by franklai on 15-11-05.
 */

// Schema for users' info
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    display_name: {type: String},
    pic_path: {type: String},
    description: {type: String},
    access: {type: String},
    ticket: {type: Number},
    viewingDevices: Schema.Types.Mixed,
    geoLocations: Schema.Types.Mixed
});
module.exports = mongoose.model('User', UserSchema);
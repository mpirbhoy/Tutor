var mongoose = require('mongoose'); 
var Schema = mongoose.Schema;
var Class = require('./class');
module.exports = mongoose.model('User',{
    email: {type:String, unique: true},
	password: String,
    dispName : { type: String, default: '' },
	auth : { type: String, default: 'user' },
	imgPath : { type: String, default: 'def.jpg' },
	descr: { type: String, default: '' },
	pId: {type:String, unique: true},
	facebookId : String,
	classes:[{type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
	facebookName: String,
	facebookToken: String
});
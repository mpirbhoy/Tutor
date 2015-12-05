var mongoose = require('mongoose'); 
var Course = require('./course');
module.exports = mongoose.model('User',{
    email: {type:String, unique: true},
	password: String,
    dispName : { type: String, default: '' },
	auth : { type: String, default: 'user' },
	imgPath : { type: String, default: 'def.jpg' },
	descr: { type: String, default: '' },
	pId: {type:String, unique: true},
	facebookId : String,
	courses:[{type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
	facebookName: {type: String, defualt: ''},
	facebookToken: String,
	facebookProfilePicture: String,
	admin: Boolean,
	incomingMessages:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
	tutorRating: {type: Number, default: 0},
	tuteeRating: {type: Number, default: 0},
	numTutorRating: {type: Number, default: 0},
	numTuteeRating: {type: Number, default: 0},
	tutorReviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
	tuteeReviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
});
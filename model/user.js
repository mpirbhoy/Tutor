var mongoose = require('mongoose'); 
var Course = require('./course');

//Model for Users 
module.exports = mongoose.model('User',{
    email: {type:String, unique: true},  //Email of user
	password: String, //Password of User
    dispName : { type: String, default: '' }, //Display Name for User
	auth : { type: String, default: 'user' }, //Authorization (Admin/User)
	imgPath : { type: String, default: 'def.jpg' }, //Path to local image
	descr: { type: String, default: '' }, //Description of User
	pId: {type:String, unique: true}, //Hashed email of User
	facebookId : String, //Facebook ID of User
	courses:[{type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], //Courses of User
	facebookName: {type: String, defualt: ''}, //Facebook Name of User
	facebookToken: String, //Facebook Token of User
	facebookProfilePicture: String, //Facebook Profile Picture Path of User
	incomingMessages:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}], //Incoming Messages for User 
	tutorRating: {type: Number, default: 0}, //Running total of Tutor Ratings of User
	tuteeRating: {type: Number, default: 0}, //Running total of Tutee Rating of User
	numTutorRating: {type: Number, default: 0}, //Number of tutor ratings of User
	numTuteeRating: {type: Number, default: 0}, //Number of tutee ratings of User
	tutorReviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}], //Tutor reviews of User
	tuteeReviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}] //Tutee reviews of User
});
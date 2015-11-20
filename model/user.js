var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    email: String,
	password: String,
    dispName : { type: String, default: '' },
	auth : { type: String, default: 'user' },
	imgPath : { type: String, default: 'def.jpg' },
	descr: { type: String, default: '' },
	pId: String
	
});
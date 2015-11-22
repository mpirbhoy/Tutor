var mongoose = require('mongoose'); 

module.exports = mongoose.model('User',{
    email: {type:String, unique: true},
	password: String,
    dispName : { type: String, default: '' },
	auth : { type: String, default: 'user' },
	imgPath : { type: String, default: 'def.jpg' },
	descr: { type: String, default: '' },
	pId: {type:String, unique: true},
	facebook : mongoose.Schema.Types.Mixed
});
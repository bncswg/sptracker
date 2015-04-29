var mongoose = require( 'mongoose' );
var ObjectId = mongoose.Schema.Types.ObjectId;

var equipmentSchema = mongoose.Schema({
	_id: Number,
	name: String,
	category: String,
	description: String,
	img: { data: Buffer, contentType: String },
	user: { type: ObjectId, ref: 'User' }
});

var Equipment = mongoose.model( 'Equipment', equipmentSchema );

module.exports =  Equipment;
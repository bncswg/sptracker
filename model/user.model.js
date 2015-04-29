var mongoose = require( 'mongoose' );
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
	name: String,
	email: String,
	password: String,
	img: { data: Buffer, contentType: String },
	equipments: [{ type: Number, ref: 'Equipment' }]
});

/*
User.statics = {
	censor: function( ) {
		delete this.password;
		return this;
	},
	findByEmail: function( email, callback ) {
		this.findOne( { email: email }, function( err, existUser ) {
			if ( err ) { handleError( err ) }
			callback( existUser );
		});
	}
	
};
*/

var User = mongoose.model( 'User', userSchema );

module.exports = User;
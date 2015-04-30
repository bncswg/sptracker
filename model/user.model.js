var mongoose = require( 'mongoose' );
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
	name: String,
	email: String,
	password: String,
	img: { data: Buffer, contentType: String },
	equipments: [{ type: Number, ref: 'Equipment' }]
});

userSchema.statics = {
	/*
	censor: function( ) {
		delete this.password;
		return this;
	},
	*/
	
	create: function( info, callback ) {
		if ( info.name && info.email && info.password ) {
			var user = new User( info );
			user.save(function ( err, user ) {
				if ( err ) return console.error( err );
				callback( true );
			});
		} else {
			callback( false );
		}
	},
	
	findByEmail: function( email, callback ) {
		this.findOne( { email: email }, function( err, user ) {
			if ( err ) return console.error( err );
			callback( user );
		});
	},
	
	findAll: function( callback ) {
		this.find( function( err, users ) {
			if ( err ) return console.error( err );
			callback( users );
		});
	},
	
	removeAll: function( callback ) {
		this.remove( function( err ) {
			if ( err ) return console.error( err );
			callback();
		});
	}
};

var User = mongoose.model( 'User', userSchema );
module.exports = User;
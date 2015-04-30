var mongoose = require( 'mongoose' );

var userSchema = mongoose.Schema({
	name: String,
	email: String,
	password: String,
	img: { data: Buffer, contentType: String },
	equipments: [{ type: Number, ref: 'Equipment' }]
});

/*
censor: function( ) {
	delete this.password;
	return this;
},
*/

var User = mongoose.model( 'User', userSchema );

exports.create = function create( info, callback ) {
	if ( info.name && info.email && info.password ) {
		var user = new User( info );
		user.save(function ( err, user ) {
			if ( err ) return console.error( err );
			callback( true );
		});
	} else {
		callback( false );
	}
};
	
exports.findByEmail = function findByEmail( email, callback ) {
	User.findOne( { email: email }, function( err, user ) {
		if ( err ) return console.error( err );
		callback( user );
	});
};
	
exports.removeByEmail = function removeByEmail( email, callback ) {
	User.findOneAndRemove({ email: email }, function( err, user ) {
		if ( err ) return console.error( err );
		if ( user )
			callback( true );
		else
			callback( false );
	});
};
	
exports.findAll = function findAll( callback ) {
	User.find( function( err, users ) {
		if ( err ) return console.error( err );
		callback( users );
	});
};
	
exports.removeAll =  function removeAll( callback ) {
	User.remove( function( err ) {
		if ( err ) return console.error( err );
		callback();
	});
};
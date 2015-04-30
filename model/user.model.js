var mongoose = require( 'mongoose' );
var crypto = require( 'crypto' );

var userSchema = mongoose.Schema({
	name: String,
	email: String,
	password: String,
	img: { data: Buffer, contentType: String },
	items: [{ type: Number, ref: 'Item' }]
});

userSchema.methods.censor = function censor() {
	this.password = undefined;
	return this;
};

userSchema.methods.checkPassword = function checkPassword( pwToCheck ) {
	var pwElements = this.password.split( ':', 3 ),
	  algo = pwElements[ 0 ], salt = pwElements[ 1 ],
	  validHash = pwElements[ 2 ];

	var hash = crypto.createHash( 'sha256' ).update( salt + pwToCheck )
	  .digest( 'hex' );

	return ( hash == validHash );
};

var User = mongoose.model( 'User', userSchema );

function makeSalt() {
	return Math.round( new Date().valueOf() * Math.random() ) + '';
}

function encryptPassword( password ) {
	var salt = makeSalt();
	return 'SHA-256:' + salt + ':' +
		crypto.createHash( 'sha256' ).update( salt + password ).digest( 'hex' );
}

exports.authenticate = function authenticate( email, password, callback ) {
	User.findOne( { email: email }, function( err, user ) {
		if ( err ) return console.error( err );
		if ( user ) {
			var isCorrect = user.checkPassword( password );
			callback( isCorrect );
		} else {
			callback( false );
		}
	});
}

exports.create = function create( info, callback ) {
	if ( info.name && info.email && info.password ) {
		
		info.password = encryptPassword( info.password );
		
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
		user.censor();
		callback( user );
	});
};
	
exports.removeByEmail = function removeByEmail( email, callback ) {
	User.findOneAndRemove( { email: email }, function( err, user ) {
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
		
		users.forEach( function( user ) {
			user.censor();
		});
		
		callback( users );
	});
};
	
exports.removeAll =  function removeAll( callback ) {
	User.remove( function( err ) {
		if ( err ) return console.error( err );
		callback();
	});
};
var mongoose = require( 'mongoose' );
var crypto = require( 'crypto' );
var Item = require( './item.model.js' );
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
	name: String,
	email: String,
	password: String,
	img: { data: Buffer, contentType: String },
	items: [{ type: ObjectId, ref: 'Item' }]
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

userSchema.methods.checkOutItem = function checkOutItem( item, callback ) {
	
	var user = this;
	
	if ( item.user ) {
		
		if ( item.user.equals( user._id ) ) {
			callback( false, 'Already checked out by the same user' );
		} else {
			callback( false, 'Already checked out by a different user');
		}
		
	} else {
		
		user.update( { $addToSet: { items: item } }, function( err ) {
			if ( err ) return console.error( err );
			
			item.update( { user: user }, function( err ) {
				if ( err ) return console.error( err );
				callback( true );
				
			});
		});
	}
};

userSchema.methods.returnItem = function returnItem( item, callback ) {
	var user = this;
	if ( item.user ) {
		if ( item.user.equals( user._id ) ) {
			
			user.update( { $pull: { items: item } }, function( err ) {
				if ( err ) return console.error( err );
				item.update( { user: undefined }, function( err ) {
					if ( err ) return console.error( err );
					callback( true );
				});
			});
			
		} else {
			callback( false, 'Item checked out by a different user');
		}
	} else {
		callback( false, 'Item is not checked out' );
	}
};

var User = mongoose.model( 'User', userSchema );

/*
	interface User {
		function checkOutItem( email, id, callback );
		function returnItem( email, id, callback );
		function authenticate( email, password, callback );
	  function create( info, callback );
	  function findByEmail( email, callback );
		function removeByEmail( email, callback );
		function findAll( callback );
		function removeAll( callback );
	}
*/

exports.checkOutItem = function checkOutItem( email, id, callback ) {
	this.findByEmail( email, function( user ) {
		if ( !user ) {
			callback( false, 'User does not exist' );
		} else {
			Item.findById( id, function( item ) {
				if ( !item ) {
					callback( false, 'Item does not exist' );
				} else {
					user.checkOutItem( item, function( success, message ) {
							callback( success, message );
					});
				}
			});
		}
	});
};

exports.returnItem = function returnItem( email, id, callback ) {
	this.findByEmail( email, function( user ) {
		if ( !user ) {
			callback( false, 'User does not exist' );
		} else {
			Item.findById( id, function( item ) {
				if ( !item ) {
					callback( false, 'Item does not exist' );
				} else {
					user.returnItem( item, function( success, message ) {
							callback( success, message );
					});
				}
			});
		}
	});
};

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
		if ( user )
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

function encryptPassword( password ) {
	var salt = makeSalt();
	return 'SHA-256:' + salt + ':' +
		crypto.createHash( 'sha256' ).update( salt + password ).digest( 'hex' );
		
	function makeSalt() {
		return Math.round( new Date().valueOf() * Math.random() ) + '';
	}
}
var mongoose = require( 'mongoose' );
var crypto = require( 'crypto' );
var Item = require( './item.model.js' );
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
	name: String,
	email: String,
	password: String,
	authToken: String,
	items: [{ type: ObjectId, ref: 'Item' }]
});

userSchema.pre( 'save', function( next ) {
	var user = this;
	if ( !user.isModified( 'password' ) ) {
		return next();
	}
	user.password = this.constructor.encryptPassword( user.password );
	next();
});

userSchema.methods = {
	
	censor: function censor() {
		this.password = undefined;
		return this;
	},

	checkPassword: function checkPassword( pwToCheck ) {
		var pwElements = this.password.split( ':', 3 ),
		  algo = pwElements[ 0 ], salt = pwElements[ 1 ],
		  validHash = pwElements[ 2 ];
		var hash = crypto.createHash( 'sha256' ).update( salt + pwToCheck )
		  .digest( 'hex' );
		return ( hash == validHash );
	},

	checkOutItem: function checkOutItem( item, callback ) {
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
	},

	returnItem: function returnItem( item, callback ) {
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
	}
	
};

userSchema.statics = {
	
	encryptPassword: function encryptPassword( password ) {
		var salt = this.makeSalt();
		var encryptedPassword = 'SHA-256:' + salt + ':' +
			crypto.createHash( 'sha256' ).update( salt + password ).digest( 'hex' );
		return encryptedPassword;
	},

	makeSalt: function makeSalt() {
		return Math.round( new Date().valueOf() * Math.random() ) + '';
	},
	
	/*
	checkOutItem: function checkOutItem( email, id, callback ) {
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
	},
	
	returnItem: function returnItem( email, id, callback ) {
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
	},
	*/
	
	authenticate: function authenticate( email, password, callback ) {
		this.findOne( { email: email }, function( err, user ) {
			if ( err ) return console.error( err );
			if ( user ) {
				var isCorrect = user.checkPassword( password );
				callback( isCorrect );
			} else {
				callback( false );
			}
		});
	}
	
	/*
	findById: function findById( id, callback ) {
		mongoose.Types.ObjectId( id );
		this.findOne( { _id: id }, function( err, user ) {
			if ( err ) return console.error( err );
			if ( user )
				user.censor();
			callback( user );
		});
	},
	*/
	
	/*
	create: function create( info, callback ) {
		if ( info.name && info.email && info.password ) {
			info.password = this.encryptPassword( info.password );
			info.authToken = crypto.createHash( 'sha256' ).update( this.makeSalt()).digest( 'hex' );
			var user = new this( info );
			user.save(function ( err, user ) {
				if ( err ) return console.error( err );
				callback( user );
			});
		} else {
			callback();
		}
	},
	*/
	
	/*
	findByEmail: function findByEmail( email, callback ) {
		this.findOne( { email: email }, function( err, user ) {
			if ( err ) return console.error( err );
			if ( user )
				user.censor();
			callback( user );
		});
	},
	
	removeByEmail: function removeByEmail( email, callback ) {
		this.findOneAndRemove( { email: email }, function( err, user ) {
			if ( err ) return console.error( err );
			if ( user )
				callback( true );
			else
				callback( false );
		});
	},
	
	findAll: function findAll( callback ) {
		this.find( function( err, users ) {
			if ( err ) return console.error( err );
			users.forEach( function( user ) {
				user.censor();
			});
			callback( users );
		});
	},
	
	removeAll: function removeAll( callback ) {
		this.remove( function( err ) {
			if ( err ) return console.error( err );
			callback();
		});
	}
	*/
};

module.exports = mongoose.model( 'User', userSchema );
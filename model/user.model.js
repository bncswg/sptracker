var mongoose = require( 'mongoose' );
var crypto = require( 'crypto' );
var Item = require( './item.model.js' );
var ObjectId = mongoose.Schema.Types.ObjectId;
var validate = require('mongoose-validate');
var uniqueValidator = require('mongoose-unique-validator');

function lengthValidator (v) {
  return v.length > 5;
};

var userSchema = mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true, validate: [validate.email, 'invalid email address'] },
	password: { type: String, required: true, validate: [lengthValidator, 'password too short'] },
	authToken: String,
	items: [{ type: ObjectId, ref: 'Item' }],
	active: { type: Boolean, default: true }
});

userSchema.plugin(uniqueValidator);

userSchema.pre( 'save', function( next ) {
	var user = this;
	
	// Encrypt password if it is modified
	if ( !user.isModified( 'password' ) ) {
		return next();
	}
	user.password = this.constructor.encryptPassword( user.password );
	
	// Generate random authentication token
	var salt = this.constructor.makeSalt();
	user.authToken = crypto.createHash( 'sha256' ).update( salt ).digest( 'hex' );
	
	next();
});

userSchema.methods = {
	
	// Censor the user by setting password as undefined
	censor: function censor() {
		this.password = undefined;
		return this;
	},

	// Check password by comparing hashes
	checkPassword: function checkPassword( pwToCheck ) {
		var pwElements = this.password.split( ':', 3 ),
		  algo = pwElements[ 0 ], salt = pwElements[ 1 ],
		  validHash = pwElements[ 2 ];
		var hash = crypto.createHash( 'sha256' ).update( salt + pwToCheck )
		  .digest( 'hex' );
		return ( hash == validHash );
	},

	// Check out an item
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

	// Return an item
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
	
	// Encrypt password with SHA-256
	encryptPassword: function encryptPassword( password ) {
		var salt = this.makeSalt();
		var encryptedPassword = 'SHA-256:' + salt + ':' +
			crypto.createHash( 'sha256' ).update( salt + password ).digest( 'hex' );
		return encryptedPassword;
	},

	// Make salt for hash function
	makeSalt: function makeSalt() {
		return Math.round( new Date().valueOf() * Math.random() ) + '';
	},
	
	// Authenticate an email and password combination
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
};

module.exports = mongoose.model( 'User', userSchema );
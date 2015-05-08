var mongoose = require( 'mongoose' );
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require( './user.model.js' );

var itemSchema = mongoose.Schema({
	name: { type: String, required: true },
	category: { type: String, required: true },
	description: { type: String, required: true },
	img: { data: Buffer, contentType: String },
	user: { type: ObjectId, ref: 'User' },
	active: { type: Boolean, default: true }
});

itemSchema.pre( 'save', function( next ) {
	var User = require( './user.model.js' );
	var item = this;
	if ( item.active == false && item.user != undefined ) {
		User.findOne( { _id: item.user }, function( err, user ) {
			if ( err ) return console.error( err );
			
			user.returnItem( item, function( success, msg) {
				next();
			});
		});
	} else {
		next();
	}
});

itemSchema.methods = {
	
	deactivate: function deactivate( callback ) {
		var item = this;
		item.active = false;
		item.save( function( err, item ) {
			if ( err ) return console.error( err );
			callback();
		});
	}
	
};

module.exports = mongoose.model( 'Item', itemSchema );
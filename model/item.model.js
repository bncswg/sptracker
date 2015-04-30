var mongoose = require( 'mongoose' );
var ObjectId = mongoose.Schema.Types.ObjectId;

var itemSchema = mongoose.Schema({
	id: String,
	name: String,
	category: String,
	description: String,
	img: { data: Buffer, contentType: String },
	user: { type: ObjectId, ref: 'User' }
});

var Item = mongoose.model( 'Item', itemSchema );

/*
	interface Item {
	  function create( info, callback );
		function findAll( callback );
		function removeAll( callback );
	  function findById( id, callback );
		function removeById( id, callback );
	}
*/

exports.create = function create( info, callback ) {
	if ( info.id && info.name && info.category && info.description ) {
		var item = new Item( info );
		item.save(function ( err, item ) {
			if ( err ) return console.error( err );
			callback( true );
		});
	} else {
		callback( false );
	}
};

exports.findAll = function findAll( callback ) {
	Item.find( function( err, items ) {
		if ( err ) return console.error( err );
		callback( items );
	});
};

exports.removeAll =  function removeAll( callback ) {
	Item.remove( function( err ) {
		if ( err ) return console.error( err );
		callback();
	});
};

exports.findById = function findById( id, callback ) {
	Item.findOne( { id: id }, function( err, item ) {
		if ( err ) return console.error( err );
		callback( item );
	});
};
	
exports.removeById = function removeById( id, callback ) {
	Item.findOneAndRemove( { id: id }, function( err, user ) {
		if ( err ) return console.error( err );
		if ( item )
			callback( true );
		else
			callback( false );
	});
};
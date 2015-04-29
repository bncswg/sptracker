var mongoose = require( 'mongoose' );

exports.connect = function() {
	mongoose.connect( 'mongodb://localhost/test' );
	var db = mongoose.connection;
	db.on( 'error', console.error.bind( console, 'connection error:' ) );
}

exports.disconnect = function() {
	mongoose.disconnect();
}
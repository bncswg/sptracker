var mongoose = require( 'mongoose' );

var connection = mongoose.connect( 'mongodb://localhost/test' );
var db = mongoose.connection;
db.on( 'error', console.error.bind( console, 'connection error:' ) );
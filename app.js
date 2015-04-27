var express = require( 'express' );
var app = express();
var mongodb = require( 'mongodb' );
var mongoose = require( 'mongoose' );
var ObjectId = mongoose.Schema.Types.ObjectId;

var accounts = { "default": "1234" };

mongoose.connect( 'mongodb://localhost/test' );
var db = mongoose.connection;
db.on( 'error', console.error.bind( console, 'connection error:' ) );

db.once( 'open', function ( callback ){
	var userSchema = mongoose.Schema({
		email: String,
		password: String,
		equipments: [{ type: Number, ref: 'Equipment' }]
	});
	
	var equipmentSchema = mongoose.Schema({
		_id: Number,
		name: String,
	});
	
	var User = mongoose.model( 'User', userSchema );
	var Equipment = mongoose.model( 'Equipment', equipmentSchema );
});

app.get( '/process_signup', function( req, res ){
	
	var email = req.query.email;
	var pass = req.query.pass;
	
	accounts[ email ] = pass;
	
	console.log( 'Created account with email "' + email + '" and password "' + pass + '"' );
	console.log( "Current accounts: " + JSON.stringify( accounts ) + "\n" );
	
	res.redirect( '/login' );
});

app.get( '/signup', function( req, res ){

	res.sendFile( __dirname + '/signup.html' );
});

app.get( '/process_login', function( req, res ){
	
	var email = req.query.email;
	var pass = req.query.pass;
	
	/*
	if (accounts.hasOwnProperty(email))
		res.send('Account exists');
	else
		res.send('Account does not exist');
	*/
	
	if ( accounts[ email ] === pass )
		//res.send('Login successful');
		res.sendFile( __dirname + '/inventory.html' );
	else
		res.send( 'Login failed' );

});

app.get( '/login', function( req, res ) {
	res.sendFile( __dirname + '/login.html' );
});

app.get( '/', function( req, res ) {
	res.redirect( '/login' );
});

app.listen( 2000 );

console.log( 'Express server started on port 2000' );
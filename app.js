var express = require( 'express' );
var app = express();
var mongodb = require( 'mongodb' );
var mongoose = require( 'mongoose' );
var ObjectId = mongoose.Schema.Types.ObjectId;

var accounts = { "default": "1234" };

mongoose.connect( 'mongodb://localhost/test' );
var db = mongoose.connection;
db.on( 'error', console.error.bind( console, 'connection error:' ) );

var User;
var Equipment;

db.once( 'open', function ( callback ){
	var userSchema = mongoose.Schema({
		name: String,
		email: String,
		password: String,
		img: { data: Buffer, contentType: String },
		equipments: [{ type: Number, ref: 'Equipment' }]
	});
	var equipmentSchema = mongoose.Schema({
		_id: Number,
		name: String,
		category: String,
		description: String,
		img: { data: Buffer, contentType: String },
		user: { type: ObjectId, ref: 'User' }
	});
	User = mongoose.model( 'User', userSchema );
	Equipment = mongoose.model( 'Equipment', equipmentSchema );
	
	User.find(function (err, users) {
	  if (err) return console.error(err);
	  console.log('Users: ' + users);
	});
	Equipment.find(function (err, equipments) {
	  if (err) return console.error(err);
	  console.log('Equipments: ' + equipments);
	});
});

app.get( '/process_signup', function( req, res ){
	var email = req.query.email;
	var pass = req.query.pass;
	
	//accounts[ email ] = pass;
	var user = new User({ email: email, password: pass });
	user.save(function (err, user) {
		if (err) return console.error(err);
		
	  User.find(function (err, users) {
	  	if (err) return console.error(err);
	  	console.log('Users: ' + users);
		});
	});
	
	//console.log( "Current accounts: " + JSON.stringify( accounts ) + "\n" );
	
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
	
	User.findOne({ email: email }, function( err, user ){
		if (err) return handleError(err);
		
		if (user && user.password === pass)
			res.sendFile( __dirname + '/inventory.html' );
		else
			res.send( 'Login failed' );
	});
	
	/*
	if ( accounts[ email ] === pass )
		//res.send('Login successful');
		res.sendFile( __dirname + '/inventory.html' );
	else
		res.send( 'Login failed' );
	*/
});

app.get( '/login', function( req, res ) {
	res.sendFile( __dirname + '/login.html' );
});

app.get( '/', function( req, res ) {
	res.redirect( '/login' );
});

app.listen( 2000 );

console.log( 'Express server started on port 2000' );
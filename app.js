//Express: Setup
var express = require( 'express' );
var app = express();

//Mongo: Setup
var mongodb = require( 'mongodb' );

//Mongoose: Setup
var mongoose = require( 'mongoose' );
var ObjectId = mongoose.Schema.Types.ObjectId; //Importing ObjectId

//Mongoose Connection (localhost/test)
mongoose.connect( 'mongodb://localhost/test' );
var db = mongoose.connection;
db.on( 'error', console.error.bind( console, 'connection error:' ) );

db.once( 'open', function ( callback ){
	
	var Equipment = require( './model/equipment.js' );
	var User = require( './model/user.js' );
	
	User.find(function (err, users) {
	  if (err) return console.error(err);
	  console.log('Users: ' + users);
	});

	Equipment.find(function (err, equipments) {
	  if (err) return console.error(err);
	  console.log('Equipments: ' + equipments);
	});
	
});


app.get( '/process_signup', function userSignup( req, res ){
	
	var email = req.query.email;
	var pass = req.query.pass;
	
	var user = new User({ email: email, password: pass });
	
	user.save(function (err, user) {
		
		if (err) return console.error(err);
		
	  User.find(function (err, users) {
	  	if (err) return console.error(err);
	  	console.log('Users: ' + users);
		});
		
	});
	
	res.redirect( '/login' );
	
});

app.get( '/process_login', function( req, res ){
	
	var email = req.query.email;
	var pass = req.query.pass;
	
	User.findOne({ email: email }, function( err, user ){
		if (err) return handleError(err);
		
		if (user && user.password === pass)
			res.sendFile( __dirname + '/inventory.html' );
		else
			res.send( 'Login failed' );
	});
	
});

app.listen( 2000 );

console.log( 'Express server started on port 2000' );
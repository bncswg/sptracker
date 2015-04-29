var express = require( 'express' );
var app = express();
var User = require( '../model/user.model.js' );
var db = require( '../db.js' );
var bodyParser = require( 'body-parser' );

app.use(bodyParser.urlencoded({ extended: false }));

app.get( '/user/:email', function( req, res ){
	var email = req.params.email;
	db.connect();
//	User.findOne({ email: email }, function( err, user ){
// 		db.disconnect();
// 		if ( err ) return handleError( err );
// 		if ( user )
// 			res.send( user.password );
// 		else
// 			res.sendStatus( 404 );
// 	});
	/*
	User.findByEmail( email, function( user ) {
		if ( user ) {
			res.send( user );
		} else {
			res.sendStatus( 404 );
		}
	});
*/
});

app.post( '/user', function( req, res ){
	var email = req.body.email;
	var password = req.body.password;
	
	if (email && password) {
		var user = new User({ email: email, password: password });
		
		db.connect();
		user.save(function (err, user) {
			db.disconnect();
			if (err) return console.error(err);
			res.sendStatus( 201 );
		});
	}
	else {
		res.sendStatus( 400 );
	}
});

app.listen( 2000 );
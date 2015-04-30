var express = require( 'express' );
var User = require( '../model/user.model.js' );
var bodyParser = require( 'body-parser' );

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.route( '/users' )
.get( function( req, res ){
	User.findAll( function( users ) {
		res.send( users );
	});
})
.post( function( req, res ){
	var name = req.body.name
	var email = req.body.email;
	var password = req.body.password;
	
	User.create({ name: name, email: email, password: password }, function( success ) {
		if ( success )
			res.sendStatus( 201 );
		else
			res.sendStatus( 400 );
	});
})
.delete( function( req, res ){
	User.removeAll( function() {
		res.sendStatus( 200 );
	});
});

app.route( '/users/:email' )
.get( function( req, res ){
	var email = req.params.email;
	User.findByEmail( email, function( user ){
		if ( user ) {
			res.send( user );
		} else {
			res.sendStatus( 404 );
		}
	});
})
.delete( function( req, res ) {
	var email = req.params.email;
	User.removeByEmail( email, function( success ) {
		if ( success )
			res.sendStatus( 200 );
		else
			res.sendStatus( 404 );
	});
});

app.route( '/users/:email/login' )
.post( function( req, res ) {
	var email = req.params.email;
	var password = req.body.password;
	
	User.authenticate( email, password, function( success ) {
		if ( success )
			res.sendStatus( 200 );
		else
			res.sendStatus( 400 );
	});
})

app.listen( 2000 );
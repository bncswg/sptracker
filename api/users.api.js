var User = require( '../model/user.model.js' );
var app = require( '../app.js' );

function userRequired( req, res, next ) {
	currentUser( req, res, function() {
		if ( !req.user ) {
			res.sendStatus( 400 );
			return;
		}
		next();
	});
}

function currentUser( req, res, next ) {
	var userId = req.cookies.userId;
	var authToken = req.cookies.authToken;
	
	if ( !userId || !authToken ) {
		next();
		return;
	}
	
	User.findById( userId, function( error, user ) {
		if ( error ) {
			next();
			return;
		}
		if ( authToken == user.authToken ) {
			req.user = user;
			next();
			return;
		}
	});
}

app.post( '/users/id', function( req, res ) {
	var id = req.body.id;
	
	User.findById( id, function( user ) {
		res.send( user );
	});
});

app.route( '/users' )

//GET All Users
.get( function( req, res ){
	User.findAll( function( users ) {
		res.send( users );
	});
})

//POST New User
.post( function( req, res ){
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	
	User.create({ name: name, email: email, password: password }, function( user ) {
		if ( user )
			res.sendStatus( 201 );
		else
			res.sendStatus( 400 );
	});
})

//DELETE User
.delete( function( req, res ){
	User.removeAll( function() {
		res.sendStatus( 200 );
	});
});

app.route( '/users/:email' )

//GET User By Email
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

//DELETE User By Email
.delete( function( req, res ) {
	var email = req.params.email;
	User.removeByEmail( email, function( success ) {
		if ( success )
			res.sendStatus( 200 );
		else
			res.sendStatus( 404 );
	});
});

//POST Check Out Item
app.route( '/users/:email/checkout' )
.post( function( req, res ) {
	var email = req.params.email;
	var id = req.body.id;
	
	User.checkOutItem( email, id, function( success, message ) {
		if ( success )
			res.sendStatus( 200 );
		else 
			res.status( 400 ).send( message );
	});
});

//POST Return Item
app.route( '/users/:email/return' )
.post( function( req, res ) {
	var email = req.params.email;
	var id = req.body.id;
	
	User.returnItem( email, id, function( success, message ) {
		if ( success )
			res.sendStatus( 200 );
		else 
			res.status( 400 ).send( message );
	});
});

//POST User Login
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
});
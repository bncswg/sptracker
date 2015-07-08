var User = require( '../model/user.model.js' );
var Item = require( '../model/item.model.js' );
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

//(Requires login)
app.route( '/user' )
//View user profile + items
.get( userRequired, function( req, res ) {
	var id;
	User.findOne({ _id: id }, function( err, user ) {
		if ( err ) return console.error( err );
		res.send( user );
	});
})
//Update data
.patch( function( req, res ) {
	var id;
});

app.route( '/user/login' )
.post( function( req, res ) {
	var email = req.body.email;
	var password = req.body.password;
	var user = User.authenticate( email, password, function( success ) {
		
	});
});

app.route( '/user/register' )
.post( function( req, res ) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var user = new User({ name: name, email: email, password: password });
	user.save( function( err ) {
		if ( err ) {
			res.sendStatus( 400 );
		} else {
			res.sendStatus( 201 );
		}
	});
});

app.route( '/user/items' )
//Checked out items
.get( function( req, res ) {
	var id;
	User.findOne({ _id: id }, function( err, user ) {
		if ( err ) return console.error( err );
		res.send( user.items );
	});
});

app.route( '/user/item/:id' )
//Check out
.post( function( req, res ) {
	var itemId = req.params.id;
	var userId;
	User.findOne({ _id: id }, function( err, user ) {
		if ( err ) return console.error( err );
		Item.findOne({ _id: itemId }, function( err, item ) {
			if ( err ) return console.error( err );
			user.checkOutItem( item );
		});
	});
})
//Return
.delete( function( req, res ) {
	var itemId = req.params.id;
	var userId;
	User.findOne({ _id: id }, function( err, user ) {
		if ( err ) return console.error( err );
		Item.findOne({ _id: itemId }, function( err, item ) {
			if ( err ) return console.error( err );
			user.returnItem( item );
		});
	});
});

//(Requires admin)
app.route( '/users' )
//Get all user profiles + items
.get( function( req, res ) {
	User.find( {}, function( err, users ) {
		if ( err ) return console.error( err );
		res.send( users );
	});
});

app.route( '/users/:id' )
//Get user profile + items
.get( function( req, res ) {
	var id = req.params.id;
	User.findOne({ _id: id }, function( err, user ) {
		if ( err ) return console.error( err );
		res.send( user );
	});
})
//Deactivate user
.delete( function( req, res ) {
	var id = req.params.id;
	User.update({ _id: id }, { $set: { active: false }}, function( err ) {
		if ( err ) return console.error( err );
	});
})
//Update data
.patch( function( req, res ) {
	var id = req.params.id;
});

app.route( '/users/:id/items' )
//User's items
.get( function( req, res ) {
	var id = req.params.id;
	User.findOne({ _id: id }, function( err, user ) {
		if ( err ) return console.error( err );
		res.send( user.items );
	});
});

app.route( '/users/:userId/item/:itemId' )
//Check out
.post( function( req, res ) {
	var userId = req.params.userId;
	var itemId = req.params.itemId;
	User.findOne({ _id: userId }, function( err, user ) {
		if ( err ) return console.error( err );
		Item.findOne({ _id: itemId }, function( err, item ) {
			if ( err ) return console.error( err );
			user.checkOutItem( item );
		});
	});
})
//Return
.delete( function( req, res ) {
	var userId = req.params.userId;
	var itemId = req.params.itemId;
	User.findOne({ _id: userId }, function( err, user ) {
		if ( err ) return console.error( err );
		Item.findOne({ _id: itemId }, function( err, item ) {
			if ( err ) return console.error( err );
			user.returnItem( item );
		});
	});
});
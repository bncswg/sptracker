require( '../app.js' );
var assert = require( 'assert' );
var http = require( 'http' );
http.post = require( 'http-post' );

var User = require( '../model/user.model.js' );
		
describe( '/user/register', function() {
	
	before( function( done ) {
		User.remove( {}, function( err ) {
			if ( err ) return console.error( err );
			done();
		});
	});
	
	it( 'should return 201 for correct information', function( done ) {
		http.post( 'http://localhost:2000/user/register', { name: 'Ben', email: 'ben@simplepickup.com', password: '123456' }, function( res ) {
			assert.equal( 201, res.statusCode );
			done();
		});
	});
	
	it( 'should create a new user with the provided name, email and password', function( done ) {
		User.findOne( {}, function( err, user ) {
			if ( err ) return console.error( err );
			assert.equal( user.name, 'Ben' );
			assert.equal( user.email, 'ben@simplepickup.com' );
			assert.equal( true, user.checkPassword( '123456' ) );
			done();
		});
	});
	
	it( 'should return 400 for incomplete information', function( done ) {
		http.post( 'http://localhost:2000/user/register', { name: 'Ben', email: 'ben@simplepickup.com' }, function( res ) {
			assert.equal( 400, res.statusCode );
			done();
		});
	});
	
});

describe( '/user/login', function() {
	
	before( function( done ) {
		User.remove( {}, function( err ) {
			if ( err ) return console.error( err );
			var user = new User({ name: 'Ben', email: 'ben@simplepickup.com', password: '123456' });
			user.save( function( err ) {
				if ( err ) return console.error( err );
				done();
			});
		});
	});
});
var should = require( 'should' );
var assert = require( "assert" );
var mongoose = require( 'mongoose' );
var User = require( '../model/user.model.js' );
require( '../app.js' );

describe( 'User', function() {
	
	beforeEach( function( done ) {
		User.remove( {}, function( err ) {
			if ( err ) return console.error( err );
			done();
		});
	});
	
	describe( '#save()', function() {
		it ( 'should create a new user with the provided name, email and password', function( done ) {
			var user = new User({ name: 'Test', email: 'test@simplepickup.com', password: '1234' });
			user.save( function( err, returnedUser ) {
				if ( err ) return console.error( err );
				var id = returnedUser._id;
				User.findOne( { _id: id }, function( err, savedUser ) {
					if ( err ) return console.error( err );
					assert.equal( savedUser.name, 'Test' );
					assert.equal( savedUser.email, 'test@simplepickup.com' );
					assert.equal( true, savedUser.checkPassword( '1234' ) );
					done();
				});
			});
		});
	});
});

describe( 'User', function() {

	var testUser1;
	var testUser2;
	var id1;
	var id2;

	beforeEach( function( done ) {
		
		testUser1 = new User({ name: 'Test1', email: 'test1@simplepickup.com', password: '1234' });
		testUser2 = new User({ name: 'Test2', email: 'test2@simplepickup.com', password: '5678' });
		
		User.remove( {}, function( err ) {
			if ( err ) return console.error( err );
			testUser1.save( function( err, returnedUser1 ) {
				if ( err ) return console.error( err );
				id1 = returnedUser1._id;
				testUser2.save( function( err, returnedUser2 ) {
					if ( err ) return console.error( err );
					id2 = returnedUser2._id;
					done();
				});
			});
		});
	});
	
	describe( '#censor()', function() {
		it ( 'should set password as undefined', function( done ) {
			User.findOne( { _id: id1 }, function( err, user ) {
				if ( err ) return console.error( err );
				assert.notEqual( undefined, user.password );
				user.censor();
				assert.equal( undefined, user.password );
				done();
			});
		});
	});
	
	describe( '#authenticate()', function() {
		it( 'should return true only after a successful attempt', function( done ) {
			User.authenticate( 'test1@simplepickup.com', '1234', function( attempt1 ) {
				assert.equal( true, attempt1 );
				User.authenticate( 'test1@simplepickup.com', '5678', function( attempt2 ) {
					assert.equal( false, attempt2 );
					done();
				});
			});
		});
	});
	
	
		
});


var should = require( 'should' );
var assert = require( "assert" );
require( '../app.js' );
var User = require( '../model/user.model.js' );
var Item = require( '../model/item.model.js' );

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

describe( 'Item', function() {
	
	beforeEach( function( done ) {
		Item.remove( {}, function( err ) {
			if ( err ) return console.error( err );
			done();
		});
	});
	
	describe( '#save()', function() {
		it( 'should create a new item with the provided name, category and description', function( done ) {
			var item = new Item({ name: 'Name', category: 'Category', description: 'Description' });
			item.save( function( err, returnedItem ) {
				if ( err ) return console.error( err );
				var id = returnedItem._id;
				Item.findOne( { _id: id }, function( err, savedItem ) {
					if ( err ) return console.error( err );
					assert.equal( savedItem.name, 'Name' );
					assert.equal( savedItem.category, 'Category' );
					assert.equal( savedItem.description, 'Description' );
					done();
				});
			});
		});
	});
});

describe( 'User', function() {
	
	var user_id;
	var item_id;
	
	beforeEach( function( done ) {
		
		user = new User({ name: 'User Name', email: 'User Email', password: 'User Password' });
		item = new Item({ name: 'Item Name', category: 'Item Category', description: 'Item Description' });
		
		User.remove( {}, function( err ) {
			if ( err ) return console.error( err );
			
			Item.remove( {}, function( err ) {
				if ( err ) return console.error( err );
				
				user.save( function( err, user ) {
					if ( err ) return console.error( err );
					user_id = user._id;
					
					item.save( function( err, item ) {
						if ( err ) return console.error( err );
						item_id = item._id
						done();
					});
				});
			});
		});
	});
	
	describe( '#checkOutItem()', function() {
		it( 'should update user.items and item.user', function( done ) {
			
			//Find
			User.findOne( { _id: user_id }, function( err, user ) {
				if ( err ) return console.error( err );
				Item.findOne( { _id: item_id }, function( err, item ) {
					if ( err ) return console.error( err );
					
					//Check Out Item
					user.checkOutItem( item, function( success, msg ) {
						
						//Update
						User.findOne( { _id: user_id }, function( err, user ) {
							if ( err ) return console.error( err );
							Item.findOne( { _id: item_id }, function( err, item ) {
								if ( err ) return console.error( err );
								
								//Assert
								assert.equal(1, user.items.length);
								assert.equal(true, item_id.equals(user.items[0]));
								assert.equal(true, user_id.equals(item.user));
						
								done();
							});
						});
					});
				});
			});
		});
	});
	
	describe( '#returnItem()', function() {
		it( 'should update user.items and item.user', function( done ) {
			
			//Find
			User.findOne( { _id: user_id }, function( err, user ) {
				if ( err ) return console.error( err );
				Item.findOne( { _id: item_id }, function( err, item ) {
					if ( err ) return console.error( err );
					
					//Return Item
					user.returnItem( item, function( success, msg ) {
						
						//Update
						User.findOne( { _id: user_id }, function( err, user ) {
							if ( err ) return console.error( err );
							Item.findOne( { _id: item_id }, function( err, item ) {
								if ( err ) return console.error( err );
								
								//Assert
								assert.equal(0, user.items.length);
								assert.equal(null, item.user);
						
								done();
							});
						});
					});
				});
			});
		});
	});
	
});
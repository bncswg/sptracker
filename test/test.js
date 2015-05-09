var assert = require( "assert" );
require( '../app.js' );
var User = require( '../model/user.model.js' );
var Item = require( '../model/item.model.js' );

describe( 'User', function() {
	
	var testUserInfo1 = { name: 'Test1', email: 'test1@simplepickup.com', password: '123456' };
	var testUserInfo2 = { name: 'Test2', email: 'test2@simplepickup.com', password: '123456' };
	
	beforeEach( function( done ) {
		User.remove( {}, function( err ) {
			if ( err ) return console.error( err );
			done();
		});
	});
	
	describe( '#save()', function() {
		it ( 'should create a new user with the provided name, email and password', function( done ) {
			var user = new User({ name: 'Test', email: 'test@simplepickup.com', password: '123456' });
			user.save( function( err, returnedUser ) {
				if ( err ) return console.error( err );
				var id = returnedUser._id;
				User.findOne( { _id: id }, function( err, savedUser ) {
					if ( err ) return console.error( err );
					assert.equal( savedUser.name, 'Test' );
					assert.equal( savedUser.email, 'test@simplepickup.com' );
					assert.equal( true, savedUser.checkPassword( '123456' ) );
					done();
				});
			});
		});
		
		it ( 'should require name', function( done ) {
			var user = new User({ email: 'test@simplepickup.com', password: '123456' });
			user.save( function ( err, user ) {
				assert.equal( 'ValidationError', err.name );
				done();
			});
		});
		
		it ( 'should require email', function( done ) {
			var user = new User({ name: 'Test', password: '123456' });
			user.save( function ( err, user ) {
				assert.equal( 'ValidationError', err.name );
				done();
			});
		});
		
		it ( 'should require password', function( done ) {
			var user = new User({ name: 'Test', email: 'test@simplepickup.com' });
			user.save( function ( err, user ) {
				assert.equal( 'ValidationError', err.name );
				done();
			});
		});
		
		it ( 'should disallow multiple signups with same email', function( done ) {
			var user1 = new User({ name: 'Test1', email: 'test@simplepickup.com', password: '123456' });
			user1.save( function( err, user ) {
				assert.equal( null, err );
				var user2 = new User({ name: 'Test2', email: 'test@simplepickup.com', password: '123456' });
				user2.save( function( err , user ) {
					assert.equal( 'ValidationError', err.name );
					done();
				});
			});
		});
		
		it ( 'should only accept a valid email address', function( done ) {
			var user = new User({ name: 'Test', email: 'test@simplepickup', password: '123456' });
			user.save( function( err, user ) {
				assert.equal( 'ValidationError', err.name );
				done();
			})
		});
		
		it ( 'should disallow passwords with less than six characters', function( done ) {
			var user = new User({ name: 'Test', email: 'test@simplepickup.com', password: '12345' });
			user.save( function( err, user ) {
				assert.equal( 'ValidationError', err.name );
				done();
			});
		});
		
		it( 'should generate a different authToken each time', function( done ) {
			var user1 = new User( testUserInfo1 );
			var user2 = new User( testUserInfo2 );
			var token1;
			var token2;
			user1.save( function( err, user1 ) {
				if ( err ) return console.error( err );
				token1 = user1.authToken;
				user2.save( function( err, user2 ) {
					if ( err ) return console.error( err );
					token2 = user2.authToken;
					assert.notEqual( token1, token2 );
					done();
				});
			});
		});
		
		it ( 'should use password hashing', function( done ) {
			var user = new User( testUserInfo1 );
			user.save( function( err, user ) {
				if ( err ) return console.error( err );
				assert.notEqual( user.password, testUserInfo1.password );
				done();
			});
		});
		
		it( 'should generate a different password hash each time', function( done ) {
			var user1 = new User( testUserInfo1 );
			var user2 = new User( testUserInfo2 );
			var hash1;
			var hash2;
			user1.save( function( err, user1 ) {
				if ( err ) return console.error( err );
				hash1 = user1.password;
				user2.save( function( err, user2 ) {
					if ( err ) return console.error( err );
					hash2 = user2.password;
					assert.notEqual( hash1, hash2 );
					done();
				});
			});
		});
		
		it( 'should update hash when password is changed', function( done ) {
			var user = new User( testUserInfo1 );
			var hash1;
			var hash2;
			user.save( function( err, user ) {
				if ( err ) return console.error( err );
				hash1 = user.password;
				user.password = '1234567';
				user.save( function( err, user ) {
					hash2 = user.password;
					assert.notEqual( hash1, hash2 );
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
		
		testUser1 = new User({ name: 'Test1', email: 'test1@simplepickup.com', password: '123456' });
		testUser2 = new User({ name: 'Test2', email: 'test2@simplepickup.com', password: '567890' });
		
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
			User.authenticate( 'test1@simplepickup.com', '123456', function( attempt1 ) {
				assert.equal( true, attempt1 );
				User.authenticate( 'test1@simplepickup.com', '567890', function( attempt2 ) {
					assert.equal( false, attempt2 );
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
		
		user = new User({ name: 'User Name', email: 'user@email.com', password: 'User Password' });
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

describe( 'Item', function() {
	
	var user_id;
	var item_id;
	
	beforeEach( function( done ) {
		
		user = new User({ name: 'User Name', email: 'user@email.com', password: 'User Password' });
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
	
	describe( '#deactivate()', function() {
		it( 'should mark item as inactive', function( done ) {
			Item.findOne( { _id: item_id }, function( err, item ) {
				if ( err ) return console.error( err );
				assert.equal( true, item.active );
				item.deactivate( function() {
						assert.equal( false, item.active );
						done();
				});
			});
		});
	
		it( 'should call returnItem', function( done ) {
			
			Item.findOne( { _id: item_id }, function( err, item ) {
				if ( err ) return console.error( err );
				User.findOne( { _id: user_id }, function( err, user ) {
					if ( err ) return console.error( err );
				
					user.checkOutItem( item, function( success, msg ) {
						
						Item.findOne( { _id: item_id }, function( err, item ) {
							if ( err ) return console.error( err );
							User.findOne( { _id: user_id }, function( err, user ) {
								if ( err ) return console.error( err );
								
								assert.equal( 1, user.items.length );
								
								item.deactivate( function() {
								
									User.findOne( { _id: user_id }, function( err, user ) {
										if ( err ) return console.error( err );
										
										assert.equal( 0, user.items.length );
									
										done();
									});
								});
							});
						});			
					});
				});
			});
		});
	});
});
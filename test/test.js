var should = require( 'should' );
var assert = require( "assert" );
var User = require( '../model/user.model.js' );
require( '../app.js' );

describe( 'User', function(){

	before( function() {
		User.remove({}, function(err) { 
		   console.log('collection removed') 
		});
	});

	describe( '#findById', function(){
		it( 'should return with the correct user object', function( done ) {
			
			User.findById(  )
			
		});
	});

  describe( '#create()', function(){
		it( 'should be successful', function( done ) {
			userInfo = { name: 'Ben', email: 'ben@simplepickup.com', password: '1234' };
			//console.log(User.create);
			User.create( userInfo, function( success ) {
				assert.equal( true, success );
				done();
			});
		});
  });

});


var Item = require( '../model/item.model.js' );
var app = require( '../app.js' );

//(Requires login)
app.route( '/items' )
//List all items
.get( function( req, res ) {
	Item.find({}, function( err, items ) {
		if ( err ) return console.error( err );
		res.send( items );
	});
});

app.route( '/item' )
//Add item (Requires admin)
.post( function( req, res ) {
	var name = req.body.name;
	var category = req.body.category;
	var description = req.body.description;
	var item = new Item({ name: name, category: category, description: description });
	item.save( function( err, item ) {
		if ( err ) return console.error( err );
	});
});

app.route( '/item/:id' )
//View item (Requires login)
.get( function( req, res ) {
	var id = req.params.id;
	Item.findOne({ _id: id }, function( err, item ) {
		if ( err ) return console.error( err );
		res.send( item );
	});
})
//Update item (Requires admin)
.patch( function( req, res ) {
	
})
//Remove item (Requires admin)
.delete( function( req, res ) {
	var id = req.params.id;
	Item.update({ _id: id }, { $set: { active: false }}, function( err ) {
		if ( err ) return console.error( err );
	});
});
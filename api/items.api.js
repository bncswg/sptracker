var Item = require( '../model/item.model.js' );
var app = require( '../app.js' );

app.route( '/items' )

.get( function( req, res ){
	Item.findAll( function( items ) {
		res.send( items );
	});
})

.post( function( req, res ){
	var id = req.body.id;
	var name = req.body.name;
	var category = req.body.category;
	var description = req.body.description;
	
	Item.create({ id: id, name: name, category: category, description: description }, function( success ) {
		if ( success )
			res.sendStatus( 201 );
		else
			res.sendStatus( 400 );
	});
})

.delete( function( req, res ){
	Item.removeAll( function() {
		res.sendStatus( 200 );
	});
});

app.route( '/items/:id' )

.get( function( req, res ){
	var id = req.params.id;
	Item.findById( id, function( item ){
		if ( item ) {
			res.send( item );
		} else {
			res.sendStatus( 404 );
		}
	});
})

.delete( function( req, res ) {
	var id = req.params.id;
	Item.removeById( id, function( success ) {
		if ( success )
			res.sendStatus( 200 );
		else
			res.sendStatus( 404 );
	});
});
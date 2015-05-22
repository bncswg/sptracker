var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var cookieParser = require( 'cookie-parser' );

var app = express();
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( cookieParser() );
app.listen(2000);

module.exports = app;

require( './db.js' );
require( './api/users.api.js' );
require( './api/items.api.js' );
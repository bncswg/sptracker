var express = require('express'),
    app = express();

app.get('/signup', function(req, res) {
	
	var email = req.query.email;
	var pass = req.query.pass;
	
	res.send('Signed up with email ' + email + ' and password ' + pass + '\n');
		
});

app.listen(2000);

console.log('Express server started on port 2000');
var express = require('express'),
    app = express();

app.get('/signup', function(req, res) {
	var name = req.query.name;
	res.send('User ' + name + ' has signed up\n');
});

app.listen(2000);

console.log('Express server started on port 2000');
var express = require('express');
var app = express();
var mongoose = require('mongoose');

var accounts = {"default": "1234"};

app.get('/process_signup', function(req, res) {
	
	var email = req.query.email;
	var pass = req.query.pass;
	
	accounts[email] = pass;
	
	console.log('Created account with email "' + email + '" and password "' + pass + '"');
	console.log("Current accounts: " + JSON.stringify(accounts) + "\n");
	
	res.redirect('/login');
});

app.get('/signup', function(req, res) {

	res.sendFile(__dirname + '/signup.html');
});

app.get('/process_login', function(req, res) {
	
	var email = req.query.email;
	var pass = req.query.pass;
	
	/*
	if (accounts.hasOwnProperty(email))
		res.send('Account exists');
	else
		res.send('Account does not exist');
	*/
	
	if (accounts[email] === pass)
		//res.send('Login successful');
		res.sendFile(__dirname + '/inventory.html');
	else
		res.send('Login failed');

});

app.get('/login', function(req, res) {
	res.sendFile(__dirname + '/login.html');
});

app.get('/', function(req, res) {
	res.redirect('/login');
});

app.listen(2000);

console.log('Express server started on port 2000');
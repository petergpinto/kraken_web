const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const url = require('url');
const cookieParser = require('cookie-parser');

require('dotenv').config()

const connection = mysql.createConnection({
	host	 : process.env.MYSQL_DB_HOST,
	user	 : process.env.MYSQL_DB_USER,
	password : process.env.MYSQL_DB_PASS,
	database : process.env.MYSQL_DB_NAME
});


const app = express();

const oneDay = 1000 * 60 * 60 * 24;

app.use(session({
	secret	: process.env.SESSION_SECRET,
	resave	: true,
	saveUninitialized: true,
	cookie: { maxAge: oneDay, sameSite: 'strict' }
}));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cors({ }));
app.use('/static', express.static(path.join(__dirname, '/static')));

app.get('/', function(request, response) {
	response.end("TEST")
});


app.get('/login.html', function(request, response) {
    // Render login template
    response.sendFile(path.join(__dirname + '/login.html'));
});


app.post('/auth', function(request, response) {
    // Capture the input fields
    let username = request.body.username;
    let password = request.body.password;
    // Ensure the input fields exists and are not empty
    if (username && password) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
        connection.query('SELECT * FROM users WHERE username = ? AND password = SHA2(?, 512)', [username, password], function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.length > 0) {
                // Authenticate the user
                request.session.loggedin = true;
                request.session.username = username;
                // Redirect to home page
                response.redirect('/react/');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});


// http://localhost:3000/private/
app.use('/react', function(request, response) {
    // If the user is loggedin
    if (request.session.loggedin) {
        // Output username
        let url_parts = url.parse(request.url);
        let filepath = path.join(__dirname, 'react', url_parts.path)
        if(url_parts.path == '/main.js') {
            response.sendFile(path.join(__dirname, "react/dist/main.js"));
        } else {
            response.sendFile(path.join(__dirname, "react/dist/index.html"));
        }
    } else {
        // Not logged in
        response.send('Please login to view this page!');
        response.end();
    }
});



app.listen(3001);

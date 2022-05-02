const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const ws = require('ws');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const url = require('url');
const cookieParser = require('cookie-parser');

require('dotenv').config()

const pool = mysql.createPool({
	host	 : process.env.MYSQL_DB_HOST,
	user	 : process.env.MYSQL_DB_USER,
	password : process.env.MYSQL_DB_PASS,
	database : process.env.MYSQL_DB_NAME,
	connectionLimit : 10
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
app.use('/static', express.static(path.join(__dirname, '/../static')));


/* Endpoints

GET /api/TradablePairs [optional:pairs] Get all tradable pairs or optionally limit to specific pairs

*/

//Include other source files
let util = require(__dirname + '/Utility.js');
require("./AssetInfo.js")(app, pool, util);
require("./SetPairInfo.js")(app, pool, util);
require("./OHLC.js")(app, pool, util);
require("./MovingAverage.js")(app, pool, util);
require("./AccountInfo.js")(app, pool, util);
require("./Signals.js")(app, pool, util);

app.get('/', function(request, response) {
	response.redirect("/login.html");
});


app.get('/login.html', function(request, response) {
    // Render login template
    response.sendFile(path.join(__dirname + '/../static/login.html'));
});


app.post('/auth', async function(request, response) {
    // Capture the input fields
    let username = request.body.username;
    let password = request.body.password;
    // Ensure the input fields exists and are not empty
    if (username && password) {
        // Execute SQL query that'll select the account from the database based on the specified username and password
		checkLoginPromise = () => {
			return new Promise((resolve, reject) => {
				pool.query('SELECT * FROM users WHERE username = ? AND password = SHA2(?, 512)', [username, password],
					(error, elements) => {
						if(error) return reject(error);
						if(elements.length > 0)
							return resolve(true);
						else 
							return resolve(false);
					});
				});
		}
		let loginResult = await checkLoginPromise();

		if(loginResult) {
			request.session.loggedin = true;
            request.session.username = username;
			response.redirect('/react/');
		} else {
			response.send("Incorrect Username and/or Password!");
		}
	}
});


app.use('/react', function(request, response) {
    // If the user is loggedin
    if (request.session.loggedin) {
        // Output username
        let url_parts = url.parse(request.url);
        let filepath = path.join(__dirname, 'react', url_parts.path)
        if(url_parts.path == '/main.js') {
            response.sendFile(path.join(__dirname, "/../react/dist/main.js"));
        } else {
            response.sendFile(path.join(__dirname, "/../react/dist/index.html"));
        }
    } else {
        // Not logged in
        response.send('Please login to view this page!');
        response.end();
    }
});


const wsServer = new ws.Server({ 
	noServer:true,
	path: "/api/ws",
});
wsServer.on('connection', socket => {
	socket.on('message', message => console.log(message));
});

const server = app.listen(3001);
server.on('upgrade', (request, socket, head) => {
	wsServer.handleUpgrade(request, socket, head, socket => {
		wsServer.emit('connection', socket, request);
	});
})

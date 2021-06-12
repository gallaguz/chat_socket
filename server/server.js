const express = require('express');
require('dotenv').config();
// const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// const corsOptions = {
// 	origin: 'http://localhost:8080',
// };
//
// app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const debug = require('debug')('server:server');
const http = require('http');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Socket.io instance
 */

const io = require('socket.io')(server, {
	cors: {
		origin: process.env.ORIGIN_URL + ':' + process.env.ORIGIN_PORT,
		methods: ['GET', 'POST'],
		transports: ['websocket', 'polling'],
		credentials: true,
	},
});

/**
 * Socket.io connection
 */

io.on('connectionStatus', (socket) => {
	io.emit(socket);
});

io.on('connection', (socket) => {
	console.log(`New websocket connection: ${socket.id}`);

	socket.emit('messageChannel', 'Welcome to chat');

	socket.on('createMessage', (data) => {
		setTimeout(() => {
			socket.emit('newMessage', {
				text: data.text + ' SERVER',
			});
		}, 500);
	});

	socket.on('connectionStatus', (msg) => {
		console.log(msg);
		io.emit('connectionStatus', 'ok');
	});

	socket.on('hello!', () => {
		console.log(`hello from ${socket.id}`);
	});

	socket.on('pingServer', (msg) => {
		console.log(msg);
		io.emit('pingServer', 'pong');
	});

	socket.on('disconnect', () => {
		console.log(`disconnect: ${socket.id}`);
	});
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val; // named pipe
	}

	if (port >= 0) {
		return port; // port number
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	debug('Listening on ' + bind);
	console.log('Server start on: http://localhost:' + port);
}

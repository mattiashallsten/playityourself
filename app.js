/*
Play it yourself
Mattias Hållsten 2018-2019

To be presented at KMH December 5-7 2019
*/


// Require packages:

// OSC communication to Raspberry Pi
var osc = require ('osc');
// Express is used to create a http server
var express = require('express');
var app = express();
// For easier path managing
var path = require('path');

// Use http server package
var server = require('http').createServer(app);
// socket.io is used for communication between server and client
var io = require('socket.io')(server);

// Readline is a stdin/out wrapper
var readline = require('readline');

// Date, fs and util -- used to writing a log file
var startDate = new Date();
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(path.join(__dirname,'log/', startDate.toString()) + '.txt', {flags : 'w'});

// Function to log users to a file
function logToFile(d) {
    var date = new Date();
    log_file.write(util.format(date + " " + d) + '\n');
}

// IP address and port of the receiver, i.e Raspberry Pi running Pure Data.
//const remote = '10.10.2.202';
var remote = '127.0.0.1';
var remotePort = 8000;

// The port of which is used for RPi communication
var udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: 5500,
    metadata: true
});

// Interface for readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Array of connected clients.
var con = [null,null,null];

// A bit misleading. It's false only if clients aren't connected and
// the sequencer is playing by it self.
var clientsConnected = true;

// All the paramenters. Is sent to Pd when initialized.
var scaleState = 1;
var transposeState = 0;
var xyPadState = [0.5,0.5];
var freqRangeState = 0.5;
var timeChanceState = 0.5;
var isPlaying = false;
var suspedalState = false;
var chordOn = true;
var legatoState = 0.5;

udpPort.open();

// The directories to send to the client
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));

// Function for connecting the clients. Is evaluated when the client presses
// the "connect" button..
function connect(ip) {
    for(var i = 0; i < con.length; i++) {
	if(ip == con[i]) {
	    console.log(ip + " is already connected!");
	    connected = true;
	    break;
	} else if (con[i] === null) {
	    con[i] = ip;
	    console.log("Connected " + ip + "!");
	    connected = true;
	    break;
	}
    };
    clientsConnected = true;
    if(isPlaying) {
	sendOSC('/onOff', 1);
    } else {
	sendOSC('/onOff', 0);
	console.log('connected but not playing');
    };

    sendOSC('/velOn', 1);
    sendOSC('/freq', xyPadState[0]);
    sendOSC('/time', xyPadState[1]);
    sendOSC('/freqRange', freqRangeState);
    sendOSC('/timeChance', timeChanceState);
    // sendOSC('/scale', scaleState);
    // sendOSC('/transpose', transposeState);
    if(suspedalState) {
	sendOSC('/suspedal', 1);
    } else {
	sendOSC('/suspedal', 0);
    }

    if(chordOn) {
	sendOSC('/chord', 1);
    } else {
	sendOSC('/chord', 0);
    };

    console.log('scale: ' + scaleState);
    console.log('transpose: ' + transposeState);
}

// Function for sending OSC messages.
function sendOSC(address, value) {
    udpPort.send({
	address: address,
	args: {
	    type: 'f',
	    value: value
	}
    }, remote, remotePort);
}

// An initialize function for when no clients are connected.
function initialize() {
    var scaleInit;
    var transposeInit;

    scaleInit = Math.floor(Math.random() * 3);
    transposeInit = Math.floor(Math.random() * 5) * 2;

    sendOSC('/scale', scaleInit + 1);
    sendOSC('/transpose', transposeInit + 1);
    scaleState = scaleInit;
    transposeState = transposeInit;

    sendOSC('/onOff', 1);
    sendOSC('/freq', 0.5);
    sendOSC('/time', 0.5);
    sendOSC('/freqRange', 0.5);
    sendOSC('/timeChance', 0.5);
    sendOSC('/suspedal', 0);
    sendOSC('/chord', 1);
    sendOSC('/legato', 0.5);

    sendOSC('/velOn', 0);
}

// When the client connects to the server. Receiving IP.
io.on('connection', function(client) {
    var clientIP = client.client.conn.remoteAddress.slice(7);
    var connected = false;
    var id;

    // If no other clients are connected, send a new random scale and
    // transposition value.
    if(
	(con[0] == null) &&
	    (con[1] == null) &&
	    (con[2] == null)
    ) {
	scaleState = Math.floor(Math.random() * 3);
	transposeState = Math.floor(Math.random() * 6) * 2;
	freqRangeState = 0.5;
	timeChanceState = 0.5;
	suspedalState = 0;
	chordOn = true;
    }

    client.emit('playStatus', isPlaying);

    client.emit('xPos', xyPadState[0]);
    client.emit('yPos', xyPadState[1]);

    client.emit('transpose', transposeState);
    client.emit('scale', scaleState);

    client.on('connectButton', function() {
	var i;
	console.log('connect');
	connect(clientIP);
	for(i = 0; i < 4; i++) {
	    if(clientIP == con[i]) {
		id = i;
		break;
	    } else if (i == 3) {
		client.emit('sorry');
	    }
	};
	client.emit('page', id);
	logToFile('Connected clients: ' + con);
    });

    client.on('disconnectButton', function() {
	con[id] = null;
	logToFile('Connected clients: ' + con);
	logToFile('Disconnected via button');
    });

    client.on('xPos', function(data) {
	sendOSC('/freq', data);
	console.log('xpos: ' + data);
	xyPadState[0] = data;
    });

    client.on('yPos', function(data) {
	sendOSC('/time', data);
	console.log('ypos: ' + data);
	xyPadState[1] = data;
    });

    client.on('onOff', function(data) {
	sendOSC('/onOff', data);
	if(data == 1) {
	    console.log('Playing!');
	    isPlaying = true;
	} else {
	    console.log('Stopped!');
	    isPlaying = false;
	};


    });

    client.on('freqRange', function(data) {
	sendOSC('/freqRange', data * (-1) + 1);
	freqRangeState = data;
    });

    client.on('timeChance', function(data) {
	sendOSC('/timeChance', data * (-1) + 1);

	console.log('TimeChance: ' + data);
	timeChanceState = data;
    });

    client.on('sustain', function(data) {
	sendOSC('/suspedal', data);
	console.log('Sustain ' + data);
	if(data == 1) {
	    suspedalState = true;
	} else {
	    suspedalState = false;
	}
    });

    client.on('scale', function(data) {
	console.log('Scale: ' + data);
	sendOSC('/scale', data);
	scaleState = data;
    });

    client.on('transpose', function(data) {
	sendOSC('/transpose', data);
	console.log(data);
	transposeState = data;
    });

    client.on('legato', function(data) {
	sendOSC('/legato', data);
	legatoState = data;
    });

    client.on('chord', function(data) {
	sendOSC('/chord', data);
	if(data == 1) {
	    chordOn = true;
	} else {
	    chordOn = false;
	}
    });

    client.on('size', function(data) {
	console.log(data);
    });

    client.on('disconnect', function() {
	for(var i = 0; i < con.length; i++) {
	    if(con[i] == clientIP) {
		con[i] = null;
		logToFile('Automatic disconnect');
	    }
	};

	console.log(con);
	logToFile('Connected clients: ' + con);
    });


});

function nobodyPlaying() {
    setInterval(function() {
	if(
	    (con[0] == null) &&
		(con[1] == null) &&
		(con[2] == null) &&
		(clientsConnected)
	) {
	    initialize();
	    console.log('Initialized!');
	    clientsConnected = false;
	}
    }, 10000);
}
/* ---------- MASTER FUNCTION ---------- */
/*
1. Present a greeting
2. Ask for the target ip
3. Ask for the target port
4. Run the timeout and interval functions
5. Listen for port 4200
*/

// Asking for the IP address and Port number of the OSC receiver, and then starting the server
fs.readFile('greeting.txt', 'utf8', function(err, data) {
    console.log(data);

    rl.question('IP address of OSC receiver: (defaults to localhost)\n', (answer) => {
	if(answer.length == 0) {
	    remote = '127.0.0.1';
	} else {
	    remote = answer;
	};

	rl.question('Port of the OSC receiver: (defaults to 8000)\n', (answer) => {
	    if(answer.length == 0) {
		remotePort = 8000;
	    } else {
		remotePort = Number(answer);
	    };

	    var responseText = "--------------------\n" + "IP: \t" + remote + "\nPort: \t" + remotePort.toString() + "\n--------------------";

	    console.log(responseText);
	    
	    setTimeout(nobodyPlaying, 10000);

	    // Every 10 seconds, check if nobody is playing, and if that is the case,
	    // start playing with the initialized settings.
	    setInterval(function() {
		console.log(con);
		if(clientsConnected) {
		    console.log('Clients connected!');
		} else {
		    console.log('No clients connected!');
		}
	    }, 5000);

	    // Cleaning up the connected array
	    setInterval(function() {
		if(con.length>3) {
		    con = con.slice(3);
		}
	    },500);

	    server.listen(4200);
	});  
    });

});




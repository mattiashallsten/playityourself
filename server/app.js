var osc = require ('osc');
var express = require('express');
var app = express();
var path = require('path');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

// IP address and port of the receiver, i.e Raspberry Pi running Pure Data.
const remote = '10.10.2.202';
const remotePort = 8000;

var udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 5500,
  metadata: true
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
var chordOn = false;
var legatoState = 0.5;

udpPort.open();



app.use(express.static(__dirname + '/node_modules'));

app.get('/', function(req,res,next) {
  res.sendFile(path.join(__dirname, '../client/index.html'));
  //var clientIP = req.connection.remoteAddress.slice(7);
});





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
    console.log('connected but not playing')
  };

  sendOSC('/velOn', 1);
  sendOSC('/freq', xyPadState[0]);
  sendOSC('/time', xyPadState[1]);
  sendOSC('/freqRange', freqRangeState);
  sendOSC('/timeChance', timeChanceState);
  // sendOSC('/scale', scaleState);
  // sendOSC('/transpose', transposeState);
  if(suspedalState) {
      sendOSC('/suspedal', 1)
  } else {
      sendOSC('/suspedal', 0)
  }

  if(chordOn) {
    sendOSC('/chord', 1)
  } else {
    sendOSC('/chord', 0)
  };

  console.log('scale: ' + scaleState);
  console.log('transpose: ' + transposeState)
}

// Function for sending OSC messages.
function sendOSC(address, value) {
  udpPort.send({
    address: address,
    args: {
      type: 'f',
      value: value
    }
  }, remote, remotePort)
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
//
// function getId(ip,client) {
//   for(var i = 0; i < con.length; i++) {
//     if(ip == con[i]) {
//       id = i;
//       client.emit('id', id);
//       break;
//     }
//   }
// }

// initialize();

// Wheb the client connects to the server. Receiving IP.
io.on('connection', function(client) {
  var clientIP = client.client.conn.remoteAddress.slice(7);
  var connected = false;
  var id;




  // initialize();

  // console.log('Connection!');
  //console.log(users);
  // console.log(clientIP);

  // If no other clients are connected, send a new random scale and
  // transposition value.
  if(
    (con[0] == null) &&
    (con[1] == null) &&
    (con[2] == null)
  ) {
    scaleState = Math.floor(Math.random() * 3);
    transposeState = Math.floor(Math.random() * 6) * 2;
  }

  client.emit('playStatus', isPlaying)

  client.emit('xPos', xyPadState[0]);
  client.emit('yPos', xyPadState[1]);

  client.emit('transpose', transposeState);
  client.emit('scale', scaleState);

  client.on('connectButton', function() {
    var i;
    console.log('connect');
    connect(clientIP);
    for(i = 0; i < con.length + 1; i++) {
      if(clientIP == con[i]) {
        id = i;
        break;
      } else if (i > con.length) {
        client.emit('sorry')
      }
    };
    client.emit('page', id);
  });

  client.on('disconnectButton', function() {
    con[id] = null;
  })

  client.on('xPos', function(data) {
    // udpPort.send({
    //   address: '/freq',
    //   args: {
    //     type: 'f',
    //     value: data
    //   }
    // }, remote, remotePort);
    sendOSC('/freq', data);
    console.log('xpos: ' + data);
    xyPadState[0] = data;
  });

  client.on('yPos', function(data) {
    // udpPort.send({
    //   address: '/time',
    //   args: {
    //     type: 'f',
    //     value: data
    //   }
    // }, remote, remotePort);
    sendOSC('/time', data);
    console.log('ypos: ' + data);
    xyPadState[1] = data;
  });

  client.on('onOff', function(data) {
    // udpPort.send({
    //   address: '/onOff',
    //   args: {
    //     type: 'i',
    //     value: data
    //   }
    // }, remote, remotePort);
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
    // udpPort.send({
    //   address: '/freqRange',
    //   args: {
    //     type: 'f',
    //     value: data * (-1) + 1
    //   }
    // }, remote, remotePort);
    sendOSC('/freqRange', data * (-1) + 1);
    freqRangeState = data;
  });

  client.on('timeChance', function(data) {
    // udpPort.send({
    //   address: '/timeChance',
    //   args: {
    //     type: 'f',
    //     value: data * (-1) + 1
    //   }
    // }, remote, remotePort);

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
  })

  client.on('scale', function(data) {
    console.log('Scale: ' + data)
    // udpPort.send({
    //   address: '/scale',
    //   args: {
    //     type: 'i',
    //     value: data
    //   }
    // }, remote, remotePort);
    sendOSC('/scale', data);
    scaleState = data
  });

  client.on('transpose', function(data) {
    // udpPort.send({
    //   address: '/transpose',
    //   args: {
    //     type: 'i',
    //     value: data
    //   }
    // }, remote, remotePort)
    sendOSC('/transpose', data);
    console.log(data);
    transposeState = data;
  });

  client.on('legato', function(data) {
    sendOSC('/legato', data);
    legatoState = data;
  })

  client.on('chord', function(data) {
    sendOSC('/chord', data);
    if(data == 1) {
      chordOn = true;
    } else {
      chordOn = false;
    }
  })

  client.on('size', function(data) {
    console.log(data)
  });

  client.on('disconnect', function() {
    for(var i = 0; i < con.length; i++) {
      if(con[i] == clientIP) {
        con[i] = null
      }
    };

    console.log(con);
  })


});


// function allDisconnected() {
//   if(
//     (con[0] = null) &&
//     (con[1] = null) &&
//     (con[2] = null)
//   ) {
//     initialize()
//   }
// }


setTimeout(nobodyPlaying, 10000)

// Every 10 seconds, check if nobody is playing, and if that is the case,
// start playing with the initialized settings.
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
      clientsConnected = false
    }
  }, 10000);
}

setInterval(function() {
  console.log(con);
  if(clientsConnected) {
    console.log('Clients connected!')
  } else {
    console.log('No clients connected!')
  }
}, 5000)

setInterval(function() {
  if(con.length>3) {
    con = con.slice(3);
  }
})

server.listen(4200);

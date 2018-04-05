var osc = require ('osc');
var express = require('express');
var app = express();
var path = require('path');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

const remote = '127.0.0.1';
const remotePort = 8000;

var udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 5500,
  metadata: true
});


var con = [null,null,null];

var scaleState = 1;
var transposeState = 0;
var xyPadState = [0.5,0.5];
var freqRangeState = 0.5;
var timeChanceState = 0.5;
var isPlaying = false;
var suspedalState = false;
var chordOn = false;
var legatoState = 0.5;

udpPort.on('bundle', function(oscBundle, timeTage, info) {
  console.log('bundle received!')
})

udpPort.open();



app.use(express.static(__dirname + '/node_modulse'));

app.get('/', function(req,res,next) {

  res.sendFile(path.join(__dirname, '../client/index.html'));

  var clientIP = req.connection.remoteAddress.slice(7);
});




// funkar! måste bara se till så att disconnect funkar som det ska.
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
  }
}

function sendOSC(address, value) {
  udpPort.send({
    address: address,
    args: {
      type: 'f',
      value: value
    }
  }, remote, remotePort)
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

io.on('connection', function(client) {
  var clientIP = client.client.conn.remoteAddress.slice(7);
  var connected = false;
  var id;

  setInterval(function() {
    console.log(con)
  }, 5000)

  // console.log('Connection!');
  //console.log(users);
  // console.log(clientIP);

  client.on('size', function(data) {
    console.log(data)
  })

  sendOSC('/freq', xyPadState[0]);
  sendOSC('/time', xyPadState[1]);
  sendOSC('/freqRange', freqRangeState);
  sendOSC('/timeChance', timeChanceState);
  sendOSC('/scale', scaleState);
  sendOSC('/transpose', transposeState);

  if(isPlaying) {
    sendOSC('/onOff', 1);
  } else {
    sendOSC('/onOff', 0)
  }

  if(suspedalState) {
    sendOSC('/suspedal', 1)
  } else {
    sendOSC('/suspedal', 0)
  }

  if(chordOn) {
    sendOSC('/chord', 1)
  } else {
    sendOSC('/chord', 0)
  }

  client.emit('transpose', transposeState);
  client.emit('scale', scaleState);

  client.on('connectButton', function() {
    var id;
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

  })

  client.on('xPos', function(data) {
    udpPort.send({
      address: '/freq',
      args: {
        type: 'f',
        value: data
      }
    }, remote, remotePort);
    console.log('xpos: ' + data);
    xyPadState[0] = data;
  });

  client.on('yPos', function(data) {
    udpPort.send({
      address: '/time',
      args: {
        type: 'f',
        value: data
      }
    }, remote, remotePort);
    console.log('ypos: ' + data);
    xyPadState[1] = data;
  });

  client.on('onOff', function(data) {
    udpPort.send({
      address: '/onOff',
      args: {
        type: 'i',
        value: data
      }
    }, remote, remotePort);
    if(data == 1) {
      console.log('Playing!');
      isPlaying = true;
    } else {
      console.log('Stopped!');
      isPlaying = false;
    };


  });

  client.on('freqRange', function(data) {
    udpPort.send({
      address: '/freqRange',
      args: {
        type: 'f',
        value: data * (-1) + 1
      }
    }, remote, remotePort);
    freqRangeState = data;
  });

  client.on('timeChance', function(data) {
    udpPort.send({
      address: '/timeChance',
      args: {
        type: 'f',
        value: data * (-1) + 1
      }
    }, remote, remotePort);

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
    udpPort.send({
      address: '/scale',
      args: {
        type: 'i',
        value: data
      }
    }, remote, remotePort);
    scaleState = data
  });

  client.on('transpose', function(data) {
    udpPort.send({
      address: '/transpose',
      args: {
        type: 'i',
        value: data
      }
    }, remote, remotePort)
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
    setTimeout(disconnected, 1000)
  })

  function disconnected() {
    console.log('client disconnected')
  }
});







server.listen(4200);

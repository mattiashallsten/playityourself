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

var scaleState = 0;
var transposeState = 0;

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
    } else if (con[i] = ip) {
      con[i] = ip;
      console.log("Connected " + ip + "!");
      connected = true;
      break;
    }
  }
}

io.on('connection', function(client) {
  var clientIP = client.client.conn.remoteAddress.slice(7);
  var connected = false;

  connect(clientIP);

  // console.log('Connection!');
  //console.log(users);
  // console.log(clientIP);

  client.on('size', function(data) {
    console.log(data)
  })

  // NEEDS FIXING

  // for(var i = 0; i < 3; i++) {
  //   if(users[i] != clientIP) {
  //     users.unshift(clientIP);
  //     console.log(users);
  //     //console.log(clientIP)
  //   } else {
  //     console.log("Already connected");
  //     console.log(users);
  //   }
  // }

  client.emit('page', 1);

  client.emit('transpose', transposeState);
  client.emit('scale', scaleState);

  client.on('xPos', function(data) {
    udpPort.send({
      address: '/freq',
      args: {
        type: 'f',
        value: data
      }
    }, remote, remotePort);
    console.log('xpos: ' + data)
  });

  client.on('yPos', function(data) {
    udpPort.send({
      address: '/time',
      args: {
        type: 'f',
        value: data
      }
    }, remote, remotePort);
    console.log('ypos: ' + data)
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
    } else {
      console.log('Stopped!')
    }
  });

  client.on('freqRange', function(data) {
    udpPort.send({
      address: '/freqRange',
      args: {
        type: 'f',
        value: data * (-1) + 1
      }
    }, remote, remotePort)
  });

  client.on('timeChance', function(data) {
    udpPort.send({
      address: '/timeChance',
      args: {
        type: 'f',
        value: data * (-1) + 1
      }
    }, remote, remotePort);

    console.log('TimeChance: ' + data)
  });

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

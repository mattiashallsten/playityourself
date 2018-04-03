var osc = require ('osc');
var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

const remote = '127.0.0.1';
const remotePort = 8000;

var udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 5500,
  metadata: true
});

var users = [NaN,NaN,NaN];

udpPort.open();

app.use(express.static(__dirname + '/node_modulse'));

app.get('/', function(req,res,next) {

  res.sendFile(__dirname + '/index.html');

  var clientIP = req.connection.remoteAddress.slice(7);
  // for (var i = 0; i < users.length; i++) {
  //   if(users[i] != clientIP) {
  //     users.unshift(clientIP);
  //   }
  // }

  //users.unshift(clientIP);
});


io.on('connection', function(client) {
  var clientIP = client.client.conn.remoteAddress.slice(7);
  console.log('Connection!');
  //console.log(users);
  console.log(clientIP);

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
    }, remote, remotePort)
  });

  client.on('transpose', function(data) {
    udpPort.send({
      address: '/transpose',
      args: {
        type: 'i',
        value: data
      }
    }, remote, remotePort)
    console.log(data)
  });

  client.on('size', function(data) {
    console.log(data)
  })
})

server.listen(4200);

# Play it yourself

Node app for sending OSC messages to a [Pd-patch](https://github.com/mattiashallsten/playityourself-sequencer), in turn sending MIDI to a Yamaha Disklavier.

## Requirements

- Node.js version 9.11.1

## Instructions

In your terminal, go to the directory. Then, write:

```
$ cd server
$ node app.js
```

The node server then serves on port 4200. The port number can be changed on line 386 in the app.js file:

```
server.listen(4200)
```




### TODO

- Fix bug: sometimes the array containing the IP's of connected clients exceeds the size of three, and adds a fourth element containing "undefined: null". 

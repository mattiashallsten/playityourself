# Play it yourself

Node app for sending OSC messages to a [Pd-patch](https://github.com/mattiashallsten/playityourself-sequencer), in turn sending MIDI to a Yamaha Disklavier.

## Requirements

- Node.js version 9.11.1

## Installation

To install node.js using [Homebrew](https://brew.sh/), type:
```
$ brew install node
```

If you already have node.js installed, make sure you have the correct version of Node.js installed:
```
$ which node
```
If you're using [Homebrew](https://brew.sh/), you can easily update node:
```
$ brew upgrade node
```
If you get an error message stating something in the line of "compiled with the wrong version of node", an updating node.js won't fix it, you can re-inizialize the node server:
```
$ cd server
$ rm -rf node_modules
$ rm package-log.json
$ rm package.json
$ npm init
```
This will go through the npm setup process. Just hit enter on everything. When inizialized, install the necessary libraries:
```
$ npm install osc express socket.io --save
```
After that, you should be good to go.

## Instructions

In your terminal, go to the directory where this project is. Then, write:

```
$ node server/app.js
```

The node server then serves on port 4200. The port number can be changed on line 386 in the app.js file:

```
server.listen(4200)
```




### TODO

- Fix bug: sometimes the array containing the IP's of connected clients exceeds the size of three, and adds a fourth element containing `undefined: null`.

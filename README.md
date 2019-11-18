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

To install the dependencies, navigate to the downloaded repository and type:

```
npm install
```


## Instructions

In your terminal, go to the directory where this project is. Then, write:

```
$ node app.js
```

The node server then serves on port 4200. The port number can be changed on line 386 in the app.js file:

```
server.listen(4200)
```




### TODO

- Fix bug: sometimes the array containing the IP's of connected clients exceeds the size of three, and adds a fourth element containing `undefined: null`.

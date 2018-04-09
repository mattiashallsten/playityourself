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

- ~~Index the active clients, limit it to three users~~
- ~~Add start screen, with a button saying "Connect"~~
- ~~Fix the CSS styling so that JavaScript understands the size of a canvas using the .getBoundingClientRect() method~~
- ~~Add legato slider~~
- ~~Add label to legato slider~~
- ~~Fix legato slider size~~
- ~~Add chord box~~
- ~~Add "disconnect" button~~
- Add timer to look for inactivity, logging off inactive clients
  - It does it automatically!
- ~~Add randomization to scale and transpose values~~
- ~~Change color of sliders, buttons and xy-pad~~
- ~~Add function to listen for no clients connected~~
- ~~Add initialize function~~

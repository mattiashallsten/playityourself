# Play it yourself

...is an interactive audio installation making use of the Yamaha Disklavier, created by Mattias Hållsten and premiered in 2018 at the Royal College of Music.

## About

1709 is considered to be the year for the invention of the _piano forte_, the predecessor to the modern piano. It was a very expensive instrument, and throughout the industrial revolution it developed into what is generally referred to as a modern upright piano. Still expensive, the modern piano became a symbol of wealth and social status among the middle class in Europe during the 19th century.

In bourgois households, it was more common for the daughters than the sons of the family to learn the instrument, but women were generally discouraged from pursuing a professional career as a musician. Rather, the purpouse for families to have piano playing daughters was a source of entertaiment and leisure. Moreover, the ability to play the piano seemed to increase a woman's marriageability.

By the end of the 19th century, the _player piano_ was rising in popularity. Instead of a person playing the instrument, now one could load punch cards into the instrument, similar to the mechanics of a music box. Having a daughter in the household playing the piano was now not a requirement for music to be heard -- instead, composers could distribute their music as player piano punch cards.

In 1987, Yamaha introduced their new player piano, the _Disklavier_. The Disklavier was a major leap in the development of the player piano, with the introduction of floppy disks, rather than punch cards, holding the recordings. The distribution of popular music was now greatly simplified, and today an Ebay search for "Disklavier" leads to floppy disks containing classics by The Beatles, Elton John and the likes. 

Today, modern Disklaviers and equivalent instruments by Steinway & Sons are controlled via apps of mobile phones, and users can interact with the instruments' vast musical libraries much like one would interact with a music player like Spotify or iTunes. The user can make playlists, connect radio stations, and keep the instrument playing for long durations of time as a constant source of entertainment. The bourgois dream of a piano-containing household has now, in a sense, reached its peak with the increasing fidelity of piano recordings being played back by player pianos.

Growing up in a middle class suburban community, I saw a piano in almost every household. The piano served as both a source of leisurly musical inspriation for me and my friends, as well as being almost a requirement for a middle class family living in a villa. 

The playfullness that the piano yielded as a piece of furniture, combined with the instrument being one of the pinnacles in terms of music played by amateurs has been the central source of inspiration for this installation. The visitor can interact with the piano, much like a child in a middle class household would.

## Techicalities

Node app for sending OSC messages to a [Pd-patch](https://github.com/mattiashallsten/playityourself-sequencer), in turn sending MIDI to a Yamaha Disklavier.

### Requirements

- Node.js version 9.11.1

### Installation

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


### Instructions

In your terminal, go to the directory where this project is. Then, write:

```
$ node app.js
```

The node server then serves on port 4200. The port number can be changed on line 386 in the app.js file:

```
server.listen(4200)
```




## TODO

- Fix bug: sometimes the array containing the IP's of connected clients exceeds the size of three, and adds a fourth element containing `undefined: null`.

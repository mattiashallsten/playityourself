# Play it yourself

...is an interactive audio installation making use of the Yamaha Disklavier, created by Mattias Hållsten and premiered in 2018 at the Royal College of Music.

## About

With the industrial revolution came developments in what would become the modern upright piano. Being an expensive instrument, the modern piano became a symbol of wealth and social status among the middle class in Europe during the 19th century.

In bourgois households, it was more common for the daughters than the sons of a family to learn the instrument, but women were generally discouraged from pursuing a professional career as musicians. Rather, the purpouse for families to have a piano-playing daughter was for the family a source of entertaiment and for the daughter a source of leisure. One especially popular form of piano playing was the four-hand piano, where two people sat next to eachother and played the piano collaboratively.

By the beginning of the 20th century, the _player piano_ was rising in popularity. Instead of a person playing the instrument, now one could load punch cards into the instrument, similar to the mechanics of a music box. Someone _playing_ the piano was no longer a requirement for music to be heard -- instead, composers could distribute their music as player piano punch cards. The music no longer required a human interpreter and was now fixed, stripped of the explorative qualities of a human interpreter, and afforded the experience of a ghost striking the keys.

In 1987, Yamaha introduced their latest development in player piano technology, the _Disklavier_. With the introduction of floppy disks rather than punch cards as a storage device, the Disklavier was a major leap in the development of the player piano. The distribution of popular music was now greatly simplified, and today an Ebay search for "Disklavier" leads to floppy disks containing classics by The Beatles, Elton John and the likes. 

Today, modern [Disklaviers](https://www.youtube.com/watch?v=h8La94sbUC0) and equivalent instruments by [Steinway & Sons](https://www.youtube.com/watch?v=H_XPRAiy9Y4) are controlled via apps of mobile phones, and users can interact with the instruments' vast musical libraries much like one would interact with a music player like Spotify or iTunes. The bourgois dream of a piano-containing household has now, in a sense, reached its peak with the increasing fidelity of piano recordings being played back by player pianos. But still, as with the original player piano, the interpretation of the musical material is fixed.

The rather uncanny experience of believing that a ghost is playing the piano that the Disklavier gives rise to, combined with the upright piano being one of the pinnacles in terms of music played by amateurs (again, piano-playing daughters were not encouraged to persue a professional career) has been the central topics of exploration for this installation. 

The music is here played by an algorithm rather then written beforehand, and controlled by the visitor. The visitor then takes on the role of both performer and listener, both composer and interpreter. The visitor can, rather than only hearing their favourite piece of music, _interact_ with the piano. The installation also mimics and expands upon the four-hand piano form, where two players sit next to eachother performing a piece of music together -- in _Play it Yourself_, the details of the piano-playing algorithm are further discovered as more people collaborate on the performing-of and the listening-to the musical material. However, the music does not stop when the visitor stops interacting with it. Rather, it keeps on playing, serving as an echo or perhaps a ghost of what it was just instructed to do.

## Techicalities

Technically, _Play it Yourself_ is a `node.js` app for sending OSC messages to a [Pd-patch](https://github.com/mattiashallsten/playityourself-sequencer), in turn sending MIDI to a Yamaha Disklavier.

### Requirements

- Node.js version 9.11.1

### Installation

To install node.js using [Homebrew](https://brew.sh/), type:
```
$ brew install node
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

You will then be asked what ip address and what port number the OSC messages should be sent to. If running the node.js server and PD patch on the same machine, use the default values (IP: 127.0.0.1, port: 8000). If running the PD patch on a separate machine, make sure that the two machines are on the same network and type in the ip address of the machine running the PD patch.

The node server then serves on port 4200. The port number can be changed on line 386 in the app.js file:

```
server.listen(4200)
```




## TODO

- Fix bug: sometimes the array containing the IP's of connected clients exceeds the size of three, and adds a fourth element containing `undefined: null`.

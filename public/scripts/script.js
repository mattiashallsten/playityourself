var socket = io.connect();
// var patch = require('socketio-wildcard')(io.Manager);
// patch(socket);

var connect = document.getElementById('connect');

var title = document.getElementById('title');
var disconnect = document.getElementById('disconnect');
var logo = document.getElementById('logo');

var page1 = document.getElementById('page1');
var page2 = document.getElementById('page2');
var page3 = document.getElementById('page3');
var startUp = document.getElementById('startUp');
var sorry = document.getElementById('sorry');

// DISCONNECTED
var disconnected = document.getElementById('disconnected');

// PAGE ONE
var playStatus = document.getElementById('playStatus');
var xyPad = document.getElementById('xyPad');

// PAGE TWO
var freqRange = document.getElementById('freqRange');
var timeChance = document.getElementById('timeChance');
var post = document.getElementById('post');
var freqRangeLabel = document.getElementById('freqRangeLabel');
var timeChanceLabel = document.getElementById('timeChanceLabel');
var suspedal = document.getElementById('suspedal');

// PAGE THREE
var scale = document.getElementById('scale');
var transpose = document.getElementById('transpose');
var legatoSlider = document.getElementById('legatoSlider');
var chord = document.getElementById('chord');
var legatoLabel = document.getElementById('legatoLabel');


// HIDDEN BUTTONS
var showPage1 = document.getElementById('showPage1');
var showPage2 = document.getElementById('showPage2');
var showPage3 = document.getElementById('showPage3');
var showStartUp = document.getElementById('showStartUp');
var size = document.getElementById('size');

// DOCUMENT VARIABLES
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var xyPadSize;

var isPlaying = false;
var sustainpedal = false;
var chordOn = true;


// Setting all the element sizes through JavaScript rather than CSS,
// in order to get the actual sizes when for example drawing on a canvas.
if(screenWidth > screenHeight) {
    xyPadSize = screenHeight * 0.9;
} else {
    xyPadSize = screenWidth * 0.9;
};

disconnect.style.width = screenWidth * 0.9 + "px";
disconnect.style.height = screenHeight * 0.05 + "px";

// START UP
connect.style.width = screenWidth * 0.3 + "px";
connect.style.height = screenHeight * 0.1 + "px";

// PAGE ONE
xyPad.width = screenWidth * 0.9;
xyPad.height = screenHeight * 0.5;
playStatus.style.width = screenWidth * 0.9 + "px";
playStatus.style.height = screenHeight * 0.1 + "px";

// PAGE TWO
freqRange.width = screenWidth * 0.39;
freqRange.height = xyPadSize * 0.7;

timeChance.width = screenWidth * 0.39;
timeChance.height = xyPadSize * 0.7;

freqRangeLabel.style.width = screenWidth * 0.42 + "px";
timeChanceLabel.style.width = screenWidth * 0.42 + "px";

suspedal.style.width = screenWidth * 0.9 + "px";
suspedal.style.height = screenHeight * 0.1 + "px";

// PAGE THREE
scale.style.width = screenWidth * 0.42 + "px";
scale.style.height = screenHeight * 0.10 + "px";
transpose.style.width = screenWidth * 0.42 + "px";
transpose.style.height = screenHeight * 0.10 + "px";


legatoSlider.width = screenWidth * 0.42;
legatoSlider.height = xyPadSize * 0.7;

legatoLabel.style.width = screenWidth * 0.42 + "px";

chord.style.width = screenWidth * 0.9 + "px";
chord.style.height = screenHeight * 0.1 + "px";



// console.log(screenWidth);





// socket.on('id', function(data) {
//   console.log(data);
//   title.innerHTML = data
// })

socket.on('sorry', function() {
    sorry.style.display = 'block';
    page1.style.display = 'none';
    page2.style.display = 'none';
    page3.style.display = 'none';
    startUp.style.display = 'none';
    disconnectButton.style.display = 'none';
})

connect.addEventListener('click', function() {
    socket.emit('connectButton',1);
    console.log('clicked')
})






showPage1.addEventListener('click', function() {
    startUp.style.display = 'none';
    page1.style.display = 'block';
    page2.style.display = 'none';
    page3.style.display = 'none';
})

showPage2.addEventListener('click', function() {
    startUp.style.display = 'none';
    page1.style.display = 'none';
    page2.style.display = 'block';
    page3.style.display = 'none'
})

showPage3.addEventListener('click', function() {
    startUp.style.display = 'none';
    page1.style.display = 'none';
    page2.style.display = 'none';
    page3.style.display = 'block';
})

showStartUp.addEventListener('click', function() {
    startUp.style.display = 'none';
    startUp.style.display = 'block';
    page1.style.display = 'none';
    page2.style.display = 'none';
    page3.style.display = 'none';
})

// Function for checking what value is selected in a <select>-element.
function selectItemByValue(elmnt, value){

    for(var i=0; i < elmnt.options.length; i++)
    {
        if(elmnt.options[i].value === value) {
            elmnt.selectedIndex = i;
            break;
        }
    }
}

function drawLine(y,canvas) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    ctx.fillRect(0,y,canvas.width,canvas.height - y)
};

function drawBall(x,y,canvas) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    ctx.arc(x,y,7,0,2*Math.PI);
    ctx.fill();
}

function getTouchPos(canvas,evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.changedTouches[0].clientX - rect.left,
        y: evt.changedTouches[0].clientY - rect.top
    }
}

disconnect.addEventListener('click', function() {
    disconnected.style.display = 'block';
    startUp.style.display = 'none';
    page1.style.display = 'none';
    page2.style.display = 'none';
    page3.style.display = 'none';
    disconnect.style.display = 'none';
    logo.style.display = 'block';

    socket.emit('disconnectButton');

})

// PAGE ONE
xyPad.addEventListener('touchstart', function(evt) {
    var touchPos = getTouchPos(xyPad,evt);
    if(
        touchPos.x <= xyPad.width &&
            touchPos.x >= 0 &&
            touchPos.y <= xyPad.height &&
            touchPos.y >= 0) {
        drawBall(touchPos.x,touchPos.y,xyPad);
        socket.emit('xPos', touchPos.x / xyPad.width);
        socket.emit('yPos', touchPos.y / xyPad.height);
    };

    evt.preventDefault();
})

xyPad.addEventListener('touchmove', function(evt) {
    var touchPos = getTouchPos(xyPad,evt);
    if(touchPos.x <= xyPad.width && touchPos.y <= xyPad.height) {
        drawBall(touchPos.x,touchPos.y,xyPad);
        socket.emit('xPos', touchPos.x / xyPad.width);
        socket.emit('yPos', touchPos.y / xyPad.height);
    };
    evt.preventDefault();
})

playStatus.addEventListener('click', function() {
    if(isPlaying) {
        playStatus.innerHTML = 'Play';
        socket.emit('onOff', 0);
        isPlaying = false;
    } else {
        playStatus.innerHTML = 'Stop';
        socket.emit('onOff', 1);
        isPlaying = true;
    }
})

// PAGE TWO
freqRange.addEventListener('touchstart', function(evt) {
    var touchPos = getTouchPos(freqRange,evt);

    drawLine(touchPos.y,freqRange);
    if(touchPos.y > 0 && touchPos.y < freqRange.height) {
        socket.emit('freqRange', touchPos.y/freqRange.height);
    };
    evt.preventDefault();
});

freqRange.addEventListener('touchmove', function(evt) {
    var touchPos = getTouchPos(freqRange,evt);

    drawLine(touchPos.y,freqRange);
    if(touchPos.y > 0 && touchPos.y < freqRange.height) {
        socket.emit('freqRange', touchPos.y/freqRange.height);
    };
    evt.preventDefault();
})

timeChance.addEventListener('touchstart', function(evt) {
    var touchPos = getTouchPos(timeChance,evt);

    drawLine(touchPos.y,timeChance);
    console.log(touchPos.y);
    socket.emit('timeChance', touchPos.y/timeChance.height);
    evt.preventDefault();
});

timeChance.addEventListener('touchmove', function(evt) {
    var touchPos = getTouchPos(timeChance,evt);

    drawLine(touchPos.y,timeChance);
    socket.emit('timeChance', touchPos.y/timeChance.height);
    evt.preventDefault();
});

suspedal.addEventListener('click', function() {
    if(sustainpedal) {
        suspedal.innerHTML = 'Click here to turn on the sustain pedal!';
        socket.emit('sustain', 0);
        sustainpedal = false;
    } else {
        suspedal.innerHTML = 'Click here to turn off the sustain pedal!';
        socket.emit('sustain', 1);
        sustainpedal = true
    }
})



// PAGE THREE
scale.addEventListener('change', function() {
    socket.emit('scale', scale.value);
});

transpose.addEventListener('change', function() {
    socket.emit('transpose', transpose.value)
});

legatoSlider.addEventListener('touchstart', function(evt) {
    var touchPos = getTouchPos(legatoSlider,evt);

    drawLine(touchPos.y,legatoSlider);
    if(touchPos.y > 0 && touchPos.y < legatoSlider.height) {
        socket.emit('legato', touchPos.y/legatoSlider.height);
    };
    evt.preventDefault();
});

legatoSlider.addEventListener('touchmove', function(evt) {
    var touchPos = getTouchPos(legatoSlider,evt);

    drawLine(touchPos.y,legatoSlider);
    if(touchPos.y > 0 && touchPos.y < legatoSlider.height) {
        socket.emit('legato', touchPos.y/legatoSlider.height);
    };
    evt.preventDefault();
})

chord.addEventListener('click', function() {
    if(chordOn) {
        chordOn = false;
        chord.innerHTML = 'Click here to turn on chords!';
        socket.emit('chord', 0)
    } else {
        chordOn = true;
        chord.innerHTML = 'Click here to turn off chords!';
        socket.emit('chord', 1)
    }
})

socket.on('page', function(data) {

    switch(data) {
    case 0:
        // Show page one
        startUp.style.display = 'none';

        page1.style.display = 'block';
        page2.style.display = 'none';
        page3.style.display = 'none';

        connect.style.display = 'none';
        logo.style.display = 'none';
        break;
    case 1:
        // Show page 2
        startUp.style.display = 'none';

        page1.style.display = 'none';
        page2.style.display = 'block';
        page3.style.display = 'none';

        connect.style.display = 'none';
        logo.style.display = 'none';

        break;
    case 2:
        // Show page 3
        startUp.style.display = 'none';

        page1.style.display = 'none';
        page2.style.display = 'none';
        page3.style.display = 'block'

        connect.style.display = 'none';
        logo.style.display = 'none';

    };
    console.log("page " + data);
    disconnect.style.display = 'block';

})

socket.on('transpose', function(data) {
    transposeState = data;
    selectItemByValue(transpose, transposeState.toString())
})

socket.on('scale', function(data) {
    scaleState = data;
    selectItemByValue(scale, scaleState.toString())
})

socket.on('playStatus', function(data) {
    if(data) {
        playStatus.innerHTML = 'Stop';
        isPlaying = true;
    } else {
        playStatus.innerHTML = 'Play';
        isPlaying = false;
    }
})



drawBall(xyPad.width/2,xyPad.height/2,xyPad);
drawLine(freqRange.height/2,freqRange);
drawLine(timeChance.height/2, timeChance);
drawLine(legatoSlider.height/2, legatoSlider);

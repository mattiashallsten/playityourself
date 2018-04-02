var socket = io.connect();

var page1 = document.getElementById('page1');
var page2 = document.getElementById('page2');

var playStatus = document.getElementById('playStatus');
var xyPad = document.getElementById('xyPad');
var freqRange = document.getElementById('freqRange');
var timeChance = document.getElementById('timeChance');
var post = document.getElementById('post');
//var scale = document.getElementById('scale');
var scale = document.getElementById('scale');
var transpose = document.getElementById('transpose');
var hide = document.getElementById('showPage1');
var show = document.getElementById('showPage2');


var isPlaying = false;




showPage1.addEventListener('click', function() {
  page1.style.display = 'block';
  page2.style.display = 'none';
})

showPage2.addEventListener('click', function() {
  page1.style.display = 'none';
  page2.style.display = 'block'
})

// function pageSelect(i) {
//   switch(i) {
//     case: 1;
//       page1.style.display = 'block';
//       page2.style.display = 'none';
//       break;
//
//     case: 2;
//       page1.style.display = 'none';
//       page2.style.display = 'block';
//   }
// }

function text(canvas,text) {
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.font = "30px Arial";
  ctx.textAlign = 'center';
  ctx.fillText(text,canvas.width/2,canvas.height/1.4);
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
  //ctx.fillStyle = '#b26b00';
  ctx.fill();
}

function getTouchPos(canvas,evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.changedTouches[0].clientX - rect.left,
    y: evt.changedTouches[0].clientY - rect.top
  }
}



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



playStatus.addEventListener('touchstart', function(evt) {
  if(isPlaying) {
    text(playStatus, 'Play');
    socket.emit('onOff', 0);
    isPlaying = false
  } else {
    text(playStatus, 'Stop');
    socket.emit('onOff', 1);
    isPlaying = true
  };

  evt.preventDefault();
})

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

    socket.emit('timeChance', touchPos.y/timeChance.height);

  evt.preventDefault();
});

timeChance.addEventListener('touchmove', function(evt) {
  var touchPos = getTouchPos(timeChance,evt);
  drawLine(touchPos.y,timeChance);


    socket.emit('timeChance', touchPos.y/timeChance.height);


  evt.preventDefault();
});

// scale.addEventListener('touchstart', function() {
//   var major = document.getElementById('major');
//   var minor = document.getElementById('minor');
//   var minmaj = document.getElementById('minmaj');
//
//   if(major.checked) {
//     socket.emit('scale', 1)
//   };
//   if (minor.checked) {
//     socket.emit('scale',2)
//   };
//   if (minmaj.checked) {
//     socket.emit('scale',3)
//   }
// });

scale.addEventListener('change', function() {
  socket.emit('scale', scale.value)
});

transpose.addEventListener('change', function() {
  socket.emit('transpose', transpose.value)
});

// showPage1.addEventListener('click', function() {
//   pageSelect(1);
// });
//
// showPage1.addEventListener('click', function() {
//   pageSelect(2);
// });

text(playStatus, 'Play');
drawBall(xyPad.width/2,xyPad.height/2,xyPad);
drawLine(freqRange.height/2,freqRange);
drawLine(timeChance.height/2, timeChance);

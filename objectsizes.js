document.addEventListener('DOMContentLoaded', function() {
  var xyPad = document.getElementById('xyPad');

  var xyPadSize = screenWidth * 0.9;

  xyPad.width = xyPadSize;
  xyPad.height = xyPadSize;
})

document.getElementById('size').addEventListener('click', function() {
  console.log('Clicked!')
})

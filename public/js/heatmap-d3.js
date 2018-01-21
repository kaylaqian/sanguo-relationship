function heatmap_d3(heatmap) {
  var X = 0, Y = 1;
  var canvasDim = [1800, 1000];
  var canvasAspect = canvasDim[Y] / canvasDim[X];
  var heatmapDim = [heatmap[X].length, heatmap.length];
  var heatmapAspect = heatmapDim[Y] / heatmapDim[X];

  if (heatmapAspect < canvasAspect)
    canvasDim[Y] = canvasDim[X] * heatmapAspect;
  else
    canvasDim[X] = canvasDim[Y] / heatmapAspect;

  var color = d3.scale.linear()
    .domain([95, 105, 110, 130, 135, 145])
    .range(["#0a0", "#6c0", "#ee0", "#eb4", "#eb9", "#fff"]);

  var canvas = document.getElementById('canvas');
  canvas.width = 1000;
  canvas.height = 700;
  var context = canvas.getContext("2d");
  var imageDim;
  var imageScale;
  var image = context.createImageData(heatmapDim[X], heatmapDim[Y]);
  for (var y = 0, p = -1; y < heatmapDim[Y]; ++y) {
    for (var x = 0; x < heatmapDim[X]; ++x){
      console.log('heatmapDim[X]: ' +heatmapDim[X]);
      var c = d3.rgb(color(heatmap[y][x]));
      image.data[++p] = c.r;
      image.data[++p] = c.g;
      image.data[++p] = c.b;
      image.data[++p] = 255;
    }
  }

  createImageBitmap(image, 0, 0, heatmapDim[X], heatmapDim[Y]).then(function(bitmap) {
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  });
}

function drawBackGround() {
  context.drawImage(img, 0, 0);
}

function calOriginalRectangle(point) {
  originalRectangle.x = point.x - originalRadius;
  originalRectangle.y = point.y - originalRadius;
  originalRectangle.width = originalRadius * 2;
  originalRectangle.height = originalRadius * 2;
}

function drawMagnifyingGlass() {

  scaleGlassRectangle = {
      x: centerPoint.x - originalRectangle.width * scale / 2,
      y: centerPoint.y - originalRectangle.height * scale / 2,
      width: originalRectangle.width * scale,
      height: originalRectangle.height * scale

  }
  context.save();
  context.beginPath();
  context.arc(centerPoint.x, centerPoint.y, originalRadius, 0, Math.PI * 2, false);
  context.clip();

  context.drawImage(canvas,
          originalRectangle.x, originalRectangle.y,
          originalRectangle.width, originalRectangle.height,
          scaleGlassRectangle.x, scaleGlassRectangle.y,
          scaleGlassRectangle.width, scaleGlassRectangle.height
  )
  context.restore();

  context.beginPath();
  var gradient = context.createRadialGradient(
          centerPoint.x, centerPoint.y, originalRadius - 5,
          centerPoint.x, centerPoint.y, originalRadius);
  gradient.addColorStop(0, 'rgba(0,0,0,0.2)');
  gradient.addColorStop(0.80, 'silver');
  gradient.addColorStop(0.90, 'silver');
  gradient.addColorStop(1.0, 'rgba(150,150,150,0.9)');

  context.strokeStyle = gradient;
  context.lineWidth = 5;
  context.arc(centerPoint.x, centerPoint.y, originalRadius, 0, Math.PI * 2, false);
  context.stroke();
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBackGround();
  calOriginalRectangle(centerPoint);
  drawMagnifyingGlass();
}


function addListener() {
  canvas.onmousemove = function (e) {
      centerPoint = windowToCanvas(e.clientX, e.clientY);
      draw();
  }
}

function windowToCanvas(x, y) {
  var bbox = canvas.getBoundingClientRect();
  var bbox = canvas.getBoundingClientRect();
  return {x: x - bbox.left, y: y - bbox.top}
}




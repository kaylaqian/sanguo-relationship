function heatmap_d3(volcano) {
  var i0 = d3.interpolateHsvLong(d3.hsv(120, 1, 0.65), d3.hsv(60, 1, 0.90)),
      i1 = d3.interpolateHsvLong(d3.hsv(60, 1, 0.90), d3.hsv(0, 0, 0.95)),
      interpolateTerrain = function(t) { return t < 0.5 ? i0(t * 2) : i1((t - 0.5) * 2); },
      color = d3.scaleSequential(interpolateTerrain).domain([90, 190]);

  var n = volcano.width,
      m = volcano.height;

  var graph = d3.select('.graph');
  var canvas = graph.append("canvas")
      .attr("width", n)
      .attr("height", m)
      .style("width", "80%")
      .style("height", "80%");

  var context = canvas.node().getContext("2d"),
      image = context.createImageData(n, m);

  for (var j = 0, k = 0, l = 0; j < m; ++j) {
    for (var i = 0; i < n; ++i, ++k, l += 4) {
      var c = d3.rgb(color(volcano.values[k]));
      image.data[l + 0] = c.r;
      image.data[l + 1] = c.g;
      image.data[l + 2] = c.b;
      image.data[l + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
  var canvas = document.getElementsByTagName('canvas')[0];
  var context = canvas.getContext('2d');
  var canvasx = $(canvas).offset().left;
  var canvasy = $(canvas).offset().top;
  var last_mousex = last_mousey = 0;
  var mousex = mousey = 0;
  var mousedown = false;
  $(canvas).on('mousedown', function(e) {
    last_mousex = parseInt(e.clientX-canvasx);
    last_mousey = parseInt(e.clientY-canvasy);
    mousedown = true;
  });
  //Mouseup
  $(canvas).on('mouseup', function(e) {
    mousedown = false;
  });
  //Mousemove
  $(canvas).on('mousemove', function(e) {
    mousex = parseInt(e.clientX-canvasx);
    mousey = parseInt(e.clientY-canvasy);
    // console.log('--> Event mouseup x: ' + mousex + ', y: ' + mousey);
    if(mousedown) {
      // context.clearRect(0,0,canvas.width,canvas.height); //clear canvas
      context.beginPath();
      var width = mousex-last_mousex;
      var height = mousey-last_mousey;
      context.rect(last_mousex,last_mousey,width,height);
      console.log('--> Event mouseup x: ' + last_mousex + ', y: ' + last_mousey +
       'width: ' + width + 'height: ' +  height);
      context.fillStyle = 'black';
      context.fill();
      context.lineWidth = 10;
      context.strokeStyle = 'red';
      context.stroke();

    }
  });
}

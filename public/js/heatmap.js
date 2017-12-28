var xData = [];
var yData = [];
var x = [];
var y = [];
function heatmap(containingElement, data) {
  data.nodes.forEach(function(node) {
    x.push(node.x);
  });
  data.nodes.forEach(function(node) {
    y.push(node.y);
  });
  // var myChart = echarts.init(containingElement);
  var myChart = echarts.init(containingElement);
  // myChart.showLoading();
  var data = generateData(2, -5, 5);
  myChart.setOption(option = {
      xAxis: {
          type: 'category',
          data: xData
      },
      yAxis: {
          type: 'category',
          data: yData
      },
      visualMap: {
          min: 0,
          max: 3,
          calculable: true,
          realtime: false,
          inRange: {
              color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          }
      },
      series: [{
          type: 'heatmap',
          data: data,
          itemStyle: {
            emphasis: {
                borderColor: '#333',
                borderWidth: 1
            }
          },
          progressive: 1000,
          animation: false
      }]

  });
}
function generateData(theta, min, max) {
  var data = [];
  // var noise = getNoiseHelper();
  // noise.seed(Math.random());
  for(var i = 0; i <=80 ; i++) {
    for(var j = 45; j >= 0; j--) {
      data.push([i, j, getDensity(i, j)]);
    }
  }
  for(var i = 0; i <=80 ; i++) {
    xData.push(i);
  }
  for (var j = 45; j >= 0; j--) {
    yData.push(j);
  }
  return data;
}

function getDensity(width, height) {
  var density = 0;
  for(var i = 0, j = 0; i < x.length, j < y.length; i++, j++) {
    if(width >0 && height > 0) {
      if((x[i] + 2500)/80 <= width && (x[i] + 2500) /80 > width-1 && (y[j] + 1500) /45 <= height && (y[j] + 1500)/45 > height-1) {
        density++;
      }
    }
  }
  return density;
}

////////////////////////////////

setTimeout(show, 5000);
function show() {
  var canvas = document.getElementsByTagName('canvas')[1];
  var ctx = canvas.getContext('2d');
  //Variables
  var canvasx = $(canvas).offset().left;
  var canvasy = $(canvas).offset().top;
  var last_mousex = last_mousey = 0;
  var mousex = mousey = 0;
  var mousedown = false;

  //Mousedown
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
          ctx.clearRect(0,0,canvas.width,canvas.height); //clear canvas
          ctx.beginPath();
          var width = mousex-last_mousex;
          var height = mousey-last_mousey;
          ctx.rect(last_mousex,last_mousey,width,height);
          var imgData = ctx.getImageData(last_mousex,last_mousey,width,height),
          data = imgData.data;
          for( var i = 0; i < data.length; i += 4 ) {
            data[i] = 255 - data[i];
            data[i+1] = 255 - data[i+1];
            data[i+2] = 255 - data[i+2];
          }
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.putImageData(imgData, width, height);

      }
      //Output
      // console.log('color: ' + data);
      // $('canvas').html('current: '+mousex+', '+mousey+'<br/>last: '+last_mousex+', '+last_mousey+'<br/>mousedown: '+mousedown);
  });
}




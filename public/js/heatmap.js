var xData = [];
var yData = [];
var x = [];
var y = [];
function heatmap(containingElement, data) {
  data.x.forEach(element => {
    x.push(element);
  });
  data.y.forEach(element => {
    y.push(element);
  });
  // var myChart = echarts.init(containingElement);
  var myChart = echarts.init(containingElement);
  // myChart.showLoading();
  var data = generateData(2, -5, 5);
  myChart.setOption(option = {
      tooltip: {},
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
          max: 5,
          calculable: true,
          realtime: false,
          inRange: {
              color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
          }
      },
      series: [{
          name: 'Gaussian',
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
      if(x[i] /24 <= width && x[i] /24 > width-1 && y[j] /24 <= height && y[j] /24 > height-1) {
        density++;
      }
    }
  }
  return density;
}

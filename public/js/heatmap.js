var xData = [];
var yData = [];
var x = [];
var y = [];
function heatmap(containingElement, data) {
  // data.forEach(function(node) {
  //   x.push(node.x);
  // });
  // data.nodes.forEach(function(node) {
  //   y.push(node.y);
  // });

  var myChart = echarts.init(containingElement);
  // myChart.showLoading();
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
// function generateData(theta, min, max) {
//   var data = [];
//   // var noise = getNoiseHelper();
//   // noise.seed(Math.random());
//   for(var i = 0; i <=86 ; i++) {
//     for(var j = 0; j <=60; j++) {
//       // data.push([i, j, data[i][j]);
//     }
//   }
//   for(var i = 0; i <=86 ; i++) {
//     xData.push(i);
//   }
//   for (var j =0; j<=60;j++) {
//     yData.push(j);
//   }
//   return data;
// }

// function getDensity(width, height) {
//   var density = 0;
//   for(var i = 0, j = 0; i < x.length, j < y.length; i++, j++) {
//     if(width >0 && height > 0) {
//       if((x[i] + 2500)/80 <= width && (x[i] + 2500) /80 > width-1 && (y[j] + 1500) /45 <= height && (y[j] + 1500)/45 > height-1) {
//         density++;
//       }
//     }
//   }
//   return density;
// }

////////////////////////////////





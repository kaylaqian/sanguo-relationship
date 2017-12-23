function webkit(containingElement, data){
  var myChart = echarts.init(containingElement);
  myChart.showLoading();
  myChart.hideLoading();
  option = {
      legend: {
          data: ['HTMLElement', 'WebGL', 'SVG', 'CSS', 'Other']
      },
      series: [{
          type: 'graph',
          layout: 'force',
          animation: false,
          label: {
              normal: {
                  position: 'right',
                  formatter: '{b}'
              }
          },
          draggable: true,
          data: data.nodes.map(function (node, idx) {
              node.id = idx;
              return node;
          }),
          categories: data.categories,
          force: {
              // initLayout: 'circular'
              // repulsion: 20,
              edgeLength: 10,
              repulsion: 20,
              gravity: 0.2
          },
          edges: data.links
      }]
  };
  myChart.setOption(option);
}

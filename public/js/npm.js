function npmGraph(containingElement, data) {
  var myChart = echarts.init(containingElement);
  myChart.showLoading();
  myChart.hideLoading();
  myChart.setOption(option = {
      title: {
          text: 'NPM Dependencies'
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series : [
          {
              type: 'graph',
              layout: 'none',
              // progressiveThreshold: 700,
              data: data.nodes.map(function (node) {
                  return {
                      x: node.x,
                      y: node.y,
                      id: node.id,
                      name: node.label,
                      symbolSize: 15,
                      itemStyle: {
                          normal: {
                              color: '#04fbb6'
                          }
                      }
                  };
              }),
              edges: data.edges.map(function (edge) {
                  return {
                      source: edge.sourceID,
                      target: edge.targetID
                  };
              }),
              label: {
                  emphasis: {
                      position: 'right',
                      show: true
                  }
              },
              roam: true,
              focusNodeAdjacency: true,
              lineStyle: {
                  normal: {
                      width: 0.5,
                      curveness: 0.3,
                      opacity: 0.7
                  }
              }
          }
      ]
  }, true);
}

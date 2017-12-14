function subGraph(containingElement, data) {
    var myChart = echarts.init(containingElement);
    myChart.showLoading();
    var color = ['#04fbb6','#00fff6','#8095eb'];
    var map = new Map();

    data.vertices.forEach(function(vertex, index) {
      map.set(vertex.id, index);
    });

    myChart.hideLoading();
    myChart.setOption(option = {
      grid: {
        bottom: 10,
        top: 10
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      draggable: true,
      tooltip: {
      },
      series : [
        {
          type: 'graph',
          layout: 'none',
          force: {
            edgeLength: [50, 200],
            repulsion: 50,
            gravity: 0.1
          },

          data: data.vertices.map(function (vertex) {
            const result = {
              x : vertex.x,
              y : vertex.y,
              id: vertex.label,
              name: vertex.label,
              itemStyle: {
                normal: {
                  borderColor: 'white',
                  borderWidth: 0.2,
                  stroke: 'white'
                }
              },
            };
            return result;
          }),
          edges: data.edges.map(function (edge) {
            return {
              source: edge.source,
              target: edge.target,
              lineStyle: {
                normal: {
                  color: 'source',
                  curveness: 0.3
                }
              }
            };
          }),

          roam: true,
          focusNodeAdjacency: true,
        }
      ]
    }, true);
  };

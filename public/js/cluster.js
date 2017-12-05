$(function() {
  var myChart = echarts.init(document.querySelector('section'));
  myChart.showLoading();
  var color = ['#797B7F','#DE9325','#C23531','#6AB0B8','#D53A35'];
  $.when($.getJSON('data/sanguo.json'), $.getJSON('data/cluster.json')).done(function(result1, result2) {
    var map = new Map();
    var data = result1[0];
    var cluster = result2[0];
    var cluster_map = new Map();
    
    var clusterIds = new Set();
    cluster.vertices.forEach(function(vertex) {
      vertex.color.forEach(function(color) {
        clusterIds.add(color);
      });
    });

    var categories = new Array(clusterIds.size);
    for (let i = 0; i < categories.length; i++) {
      categories[i] = {
      };
    };

    cluster.vertices.forEach(function(vertex, index) {
      map.set(vertex.id, index);
    });

    data.edges.forEach(function(edge) {
      edge.source = map.get(edge.source);
      edge.target = map.get(edge.target);
    });

    myChart.hideLoading();
    myChart.setOption(option = {
      title: {
            text: 'AI 图分析引擎'
      },
      backgroundColor: '#F3F3F0',
      animationDurationUpdate: 1500,
      // animationEasingUpdate: 'quinticInOut',
      series : [
        {
          type: 'graph',
          layout: 'force',
          animation: false,
          force: {
            edgeLength: 5,
            gravity: 0.2,
            repulsion: 20
          },
         
          // progressiveThreshold: 700,
          data: cluster.vertices.map(function (vertex, index) {
            var symbolSize;
            const edgeWeight = parseInt(vertex.properties.find(property => {
              return property.property_name == 'weight';
            }).property_value)
            if( edgeWeight>= 600) {
              symbolSize = Math.sqrt(edgeWeight);
            }else {
              symbolSize = Math.sqrt(edgeWeight) / 2 + 2;
            }
            // const colorIndex = vertex.color[0];
            return {
              id: vertex.id,
              name: vertex.id,
              symbolSize: symbolSize,
              category: parseInt(vertex.color[0]) - 1
              // itemStyle: {
              //   normal: {
              //     borderWidth: 0.3,
              //     borderColor: '#333'
              //   }
              // }
            };
          }),
          categories: categories,
          edges: data.edges.map(function (edge) {
            return {
              source: edge.source,
              target: edge.target
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
              color: 'source',
              width: 1.5,
              curveness: 0.3,
              opacity: 0.7
            }
          }
        }
      ]
    }, true);
  });
})

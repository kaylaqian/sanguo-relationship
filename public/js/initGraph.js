function initGraph(containingElement, data) {
// $.getJSON('data/sanguo.json', function (data) {

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
          // var symbolSize;
          // const edgeWeight = parseInt(vertex.properties.find(property => {
          //   return property.property_name == 'weight';
          // }).property_value);
          // if( edgeWeight>= 600) {
          //   symbolSize = Math.sqrt(edgeWeight);
          // }else {
          //   symbolSize = Math.sqrt(edgeWeight) / 2 + 2;
          // }
          // const colorIndex = vertex.properties.find(property => {
          //   return property.property_name == 'identity';
          // }).property_value;
          // var gener = vertex.properties.find(property => {
          //   return property.property_name == 'gener';
          // }).property_value;
          // var identity = vertex.properties.find(property => {
          //   return property.property_name == 'identity';
          // }).property_value;
          // var leader;
          // if (parseInt(identity) == 0) {
          //   leader = '主公';
          // }else if (parseInt(identity) == 1) {
          //   leader = '武将';
          // }else {
          //   leader = '文臣';
          // }
          // var force = parseInt(vertex.properties.find(property => {
          //   return property.property_name == 'force';
          // }).property_value);
          // var intelligence = parseInt(vertex.properties.find(property => {
          //   return property.property_name == 'intelligence';
          // }).property_value);
          // var politics = parseInt(vertex.properties.find(property => {
          //   return property.property_name == 'politics';
          // }).property_value);
          // var charm = parseInt(vertex.properties.find(property => {
          //   return property.property_name == 'charm';
          // }).property_value);
          // var life = parseInt(vertex.properties.find(property => {
          //   return property.property_name == 'life';
          // }).property_value);
          // var leadership = parseInt(vertex.properties.find(property => {
          //   return property.property_name == 'leadership';
          // }).property_value);

          const result = {
            x : vertex.x,
            y : vertex.y,
            id: vertex.label,
            name: vertex.label,
            // gener: gener,
            // leadership: leadership,
            // force: force,
            // intelligence: intelligence,
            // politics: politics,
            // charm: charm,
            // life: life,
            // identity: leader,
            // symbolSize: symbolSize,
            itemStyle: {
              normal: {
                borderColor: 'white',
                borderWidth: 0.2,
                // color: color[colorIndex],
                stroke: 'white'
              }
            },
            // label: {}
          };
          // if (edgeWeight > 100) {
          //   result.label.normal = {
          //     position: 'left',
          //     show: true,
          //     textStyle: {
          //       color: 'white',
          //       fontSize: 12,
          //       fontStyle: 'italic'
          //     }
          //   }
          // } else {
          //   result.label.emphasis = {
          //     position: 'left',
          //     show: true,
          //     textStyle: {
          //       color: 'white',
          //       fontSize: 12,
          //       fontStyle: 'italic'
          //     }
          //   }
          // }
          return result;
        }),
        edges: data.edges.map(function (edge) {
          // var edgeWeight = edge.properties.find(property => {
          //   return property.property_name == 'weight';
          // }).property_value;
          // var weightIndex;
          // var edgeOpacity;
          // if (edgeWeight >= 50) {
          //   weightIndex = Math.log10(edgeWeight)/2 + 1;
          //   edgeOpacity = 0.1;
          // }else {
          //   weightIndex = Math.log10(edgeWeight)/2 + 0.5;
          //   edgeOpacity = 0.7;
          // }
          // var edgeLabel = edge.properties.find(property => {
          //   return property.property_name == 'relation';
          // }).property_value;
          return {
            source: edge.source,
            target: edge.target,
            // edgeLabel: edgeLabel,
            lineStyle: {
              normal: {
                color: 'source',
                // width: weightIndex,
                // opacity: edgeOpacity,
                curveness: 0.3
              }
            }
          };
        }),
        // edgeLabel: {
        //   normal: {
        //     show: true,
        //     position: 'middle',
        //     formatter: function(params) {
        //       param = params.data;
        //       return param.edgeLabel;
        //     }
        //  }
        // },
        // tooltip: {
        //   formatter: function(params) {
        //     param = params.data;
        //     if (param.name) {
        //       return [
        //         '姓名: ' + param.name + '<hr size=1 style="margin: 3px 0">',
        //         '性别: ' + param.gener + '<br/>',
        //         '统御: ' + param.leadership + '<br/>',
        //         '武力: ' + param.force + '<br/>',
        //         '智力: ' + param.intelligence + '<br/>',
        //         '政治: ' + param.politics + '<br/>',
        //         '魅力: ' + param.charm + '<br/>',
        //         '寿命: ' + param.life + '<br/>',
        //         '身份: ' + param.identity + '<br/>'
        //       ].join('');
        //     }
        //   }
        // },
        roam: true,
        focusNodeAdjacency: true,
      }
    ]
  }, true);
};

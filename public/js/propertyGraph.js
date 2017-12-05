function propertyGraph(containingElement,result1, result2) {
// $.when($.getJSON('data/sanguo.json'), $.getJSON('data/property.json')).done(function(result1, result2) {
  //result1 = sanguo
  // result2 = property
  var myChart = echarts.init(containingElement);
  myChart.showLoading();

  var colors = ['#04fbb6','#00fff6','#8095eb'];

  var vertexMap = new Map();
  var propertyMap = new Map();

  var data = result1;
  var property = result2;
  var edgecolor;
  var highlightedVertexIds = new Set(property.vertices.map(vertex => vertex.id));
  data.vertices.forEach(function(vertex, index) {
    vertexMap.set(vertex.id, index);
  });

  property.vertices.forEach(function(vertex, index) {
    propertyMap.set(vertex.id, index);
  });

  myChart.hideLoading();
  myChart.setOption(option = {
    // title: {
    //       text: 'AI 图分析引�?
    // },
    // backgroundColor: '#F3F3F0',
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    tooltip: {
    },
    series : [
      {
        type: 'graph',
        layout: 'force',
        gravity: 0.05,
        repulsion: 100,
        // progressiveThreshold: 700,
        data: data.vertices.map(function (vertex) {
          var symbolSize;
          const edgeWeight = parseInt(vertex.properties.find(property => {
            return property.property_name == 'weight';
          }).property_value)
          if( edgeWeight>= 600) {
            symbolSize = Math.sqrt(edgeWeight);
          }else {
            symbolSize = Math.sqrt(edgeWeight) / 2 + 2;
          }

           var gener = vertex.properties.find(property => {
            return property.property_name == 'gener';
          }).property_value;
          var country =  vertex.properties.find(property => {
            return property.property_name == 'country';
          }).property_value;

          var identity = vertex.properties.find(property => {
            return property.property_name == 'identity';
          }).property_value;
          var leader;
          if (parseInt(identity) == 0) {
            leader = '主公';
          }else if (parseInt(identity) == 1) {
            leader = '武将';
          }else {
            leader = '文臣';
          }
          var force = parseInt(vertex.properties.find(property => {
            return property.property_name == 'force';
          }).property_value);
          var intelligence = parseInt(vertex.properties.find(property => {
            return property.property_name == 'intelligence';
          }).property_value);
          var politics = parseInt(vertex.properties.find(property => {
            return property.property_name == 'politics';
          }).property_value);
          var charm = parseInt(vertex.properties.find(property => {
            return property.property_name == 'charm';
          }).property_value);
          var life = parseInt(vertex.properties.find(property => {
            return property.property_name == 'life';
          }).property_value);
          var leadership = parseInt(vertex.properties.find(property => {
            return property.property_name == 'leadership';
          }).property_value);
          return {
            id: vertex.id,
            name: vertex.id,
            gener: gener,
            leadership: leadership,
            force: force,
            intelligence: intelligence,
            politics: politics,
            charm: charm,
            life: life,
            identity: leader,
            symbolSize: symbolSize,
            itemStyle: {
              normal: {
                borderColor: '#192137',
                borderWidth: 0.2,
                color: highlightedVertexIds.has(vertex.id) ? '#00fff6' : '#8095eb',
                stroke: 'white'
              }
            }
          };
        }),
       edges: data.edges.map(function (edge) {
          return {
            source: vertexMap.get(edge.source),
            target: vertexMap.get(edge.target),
            lineStyle: {
              normal: {
                color: 'source'
              }
            }
          };
        }),
        tooltip: {
          formatter: function(params) {
            param = params.data;
            if (param.name) {
              return [
                '姓名: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                '性别: ' + param.gener + '<br/>',
                '统御: ' + param.leadership + '<br/>',
                '武力: ' + param.force + '<br/>',
                '智力: ' + param.intelligence + '<br/>',
                '政治: ' + param.politics + '<br/>',
                '魅力: ' + param.charm + '<br/>',
                '寿命: ' + param.life + '<br/>',
                '身份: ' + param.identity + '<br/>'
              ].join('');
            }
          }
        },
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
        },

      }
    ]
  }, true);
};


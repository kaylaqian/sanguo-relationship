function pathGraph(containingElement,data) {
  var chart;
  var colors = ['#04fbb6','#8095eb','#167fd6','#7F4CFF','#04fbb6','#5462ec'];
  var nodeOpacityPath = ['itemStyle', 'normal', 'opacity'];
  var lineOpacityPath = ['lineStyle', 'normal', 'opacity'];

  let startIndex;
  let endIndex;


  function getItemOpacity(item, opacityPath) {
    return item.getVisual('opacity') || item.getModel().get(opacityPath);
  }

  function onMouseOver(params) {
    if (params.dataType != 'node') {
      return;
    }

    const graph = this._chartsViews[0]._model.getData().graph;
    const startNode = graph.getNodeByIndex(startIndex);
    const stopNode = graph.getNodeByIndex(params.dataIndex);
    const endNode = graph.getNodeByIndex(endIndex);

    const edges = this.getOption().series[0].edges;

    let pathsToHighlight = new Set();
    stopNode.edges.forEach(edge => {
      pathsToHighlight = getUnion(pathsToHighlight, edges[edge.dataIndex].pathIds);
    })

    edges.forEach((_, index) => {
      const intersection = getIntersection(_.pathIds, pathsToHighlight);
      const edge = graph.getEdgeByIndex(index);
      if (intersection.size > 0) {
        edge.getGraphicEl().traverse(child => {
          child.trigger('normal');
          if (child.type !== 'group' && child.style.stroke === 'lightgrey') {
            child.setStyle('stroke', '#7f4cff');
          }
        });
      }
    });

    // const startToStopPaths = [];
    // findAllPaths(startNode, stopNode, startToStopPaths, [], new Set());

    // const stopToEndPaths = [];
    // findAllPaths(stopNode, endNode, stopToEndPaths, [], new Set());

    // const startToEndPaths = [];
    // startToStopPaths.forEach(path1 => {
    //   stopToEndPaths.forEach(path2 => {
    //     const set = new Set(path2);
    //     if (path1.filter(edge => set.has(edge)).length == 0) {
    //       startToEndPaths.push(path1.concat(path2));
    //     }
    //   })
    // });

    // startToEndPaths.forEach(path => {
    //   const color = colors[Math.floor(Math.random() * colors.length)];
    //   path.forEach(edge => {
    //     edge.getGraphicEl().traverse(child => {
    //       child.trigger('normal');
    //       if (child.type !== 'group' && child.style.stroke === 'lightgrey') {
    //         child.setStyle('stroke', 'red');
    //       }
    //     });
    //   })
    // });
  }


  function onMouseOut(params) {
    if (params.dataType != 'node') {
      return;
    }
    const graph = this._chartsViews[0]._model.getData().graph;
    graph.eachEdge(edge => {
      edge.getGraphicEl().traverse(child => {
        child.trigger('normal');
        if (child.type !== 'group') {
          child.setStyle('stroke', 'lightgrey');
        }
      });
    });
  }


  function getIntersection(set1, set2) {
    const intersection = new Set();
    set1.forEach(item => {
      if (set2.has(item)) {
        intersection.add(item);
      }
    });
    return intersection;
  }

  function getUnion(set1, set2) {
    return new Set([...set1, ...set2]);
  }

  // function findAllPaths(startNode, endNode, allPaths, currentPath, visitedNodes) {
  //   if (startNode === endNode) {
  //     allPaths.push(currentPath.slice());
  //     return;
  //   }

  //   visitedNodes.add(startNode);
  //   for (const edge of startNode.outEdges) {
  //     if (!visitedNodes.has(edge.node2)) {
  //       currentPath.push(edge);
  //       findAllPaths(edge.node2, endNode, allPaths, currentPath, visitedNodes);
  //       currentPath.pop();
  //     }
  //   }
  //   for (const edge of startNode.inEdges) {
  //     if (!visitedNodes.has(edge.node1)) {
  //       currentPath.push(edge);
  //       findAllPaths(edge.node1, endNode, allPaths, currentPath, visitedNodes);
  //       currentPath.pop();
  //     }
  //   }
  // }

  chart = echarts.init(containingElement);

  chart.on('mouseover', onMouseOver);
  chart.on('mouseout', onMouseOut);

  chart.showLoading();


  var map = new Map();

  data.vertices.forEach(function(vertex, index) {
    map.set(vertex.id, index);
  });

  startIndex = map.get($('#path-search input[name=sourceId]').val());
  endIndex = map.get($('#path-search input[name=targetId]').val());

  chart.hideLoading();
  chart.setOption(option = {
    // title: {
    //       text: 'AI 图分析引�?
    // },
    // backgroundColor: '#F3F3F0',
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    animation: false,
    hoverAnimation: false,
    tooltip: {

    },
    series : [
      {
        type: 'graph',
        initLayout: 'force',
        gravity: 0.005,
        repulsion: 300,
        edgeLength: 40,
        // progressiveThreshold: 700,
        data: data.vertices.map(function (vertex) {
          var symbolSize;
          var x;
          var y;
          const edgeWeight = parseInt(vertex.properties.find(property => {
            return property.property_name == 'weight';
          }).property_value)
          if (vertex.id == $('#path-search input[name=targetId]').val()) {
            symbolSize = 60;
            x = 450;
            y = 100;
          }else if (vertex.id == $('#path-search input[name=sourceId]').val()) {
            symbolSize = 60;
            x = 200;
            y = 200;
          } else if( edgeWeight>= 600) {
            symbolSize = Math.sqrt(edgeWeight) + 14;
            x = Math.random() * (450 - 100) + 100;
            y = Math.random() * (200 - 100) + 100;
          }else {
            symbolSize = Math.sqrt(edgeWeight) / 2 + 10;
            x = Math.random() * (450 - 100) + 100;
            y = Math.random() * (200 - 100) + 100;
          }
          var colorIndex;
          if (vertex.id == $('#path-search input[name=sourceId]').val()) {
            colorIndex = 1;
          } else if (vertex.id == $('#path-search input[name=targetId]').val()) {
            colorIndex = 2;
          } else {
            colorIndex = 0;
          }

           var gener = vertex.properties.find(property => {
            return property.property_name == 'gener';
          }).property_value;
          var country =  vertex.properties.find(property => {
            return property.property_name == 'country';
          }).property_value;
          var countryId;
          if (parseInt(country) == 0) {
            countryId = '魏国';
          }else if (parseInt(country) == 1) {
            countryId = '蜀国';
          }else {
            countryId = '吴国';
          }
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
            x: x,
            y: y,
            gener: gener,
            leadership: leadership,
            force: force,
            intelligence: intelligence,
            politics: politics,
            country: countryId,
            charm: charm,
            life: life,
            identity: leader,
            symbolSize: 15,
            itemStyle: {
              normal: {
                  color: colors[colorIndex]
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
        edges: data.edges.map(function(edge, index) {
          return {
            source: edge.source,
            target: edge.target,
            pathIds: edge.color,
            lineStyle: {
              normal: {
                color: 'lightgrey',
                width: 1.5,
                curveness: 0.2,
                opacity: 0.7
              }
            },
          };
        }),
        // label: {
        //   normal: {
        //     position: 'right',
        //     show: true
        //   }
        // },
        roam: true,
        // focusNodeAdjacency: true,
        legendHoverLink: true,
      }
    ]
  }, true);
};


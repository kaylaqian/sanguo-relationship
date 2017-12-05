function draw(data) {
  var NODE_RADIUS = 5;
  var graph = d3.select('.graph');
  var width = parseInt(graph.style('width'));
  var height = parseInt(graph.style('height'));

  var colorIdentity = ['#797B7F','#DE9325','#C23531'];
  var zoom = d3.zoom()
      .scaleExtent([1, 10])
      .on("zoom", zoomed);

  var mouseOverNode = function(vertex, index) {
    // var circle = d3.select(this);

    this.nextSibling.classList.toggle('visible');

    nodes
      .transition(500)
        .style("opacity", function(other) {
          return isConnected(other, vertex) ? 1.0 : 0.2 ;
        })
        .style("fill", function(other) {
          if (isConnectedAsTarget(other, vertex) && isConnectedAsSource(other, vertex) ) {
            fillcolor = 'white';
          } else if (isConnectedAsSource(other, vertex)) {
            fillcolor = 'white';
          } else if (isConnectedAsTarget(other, vertex)) {
            fillcolor = '#1f77b4';
          } else if (isEqual(other, vertex)) {
            fillcolor = "#07436d";
          } else {
            fillcolor = '#1f77b4';
          }
          return fillcolor;
        });

    links
      .transition(500)
        .style("stroke-opacity", function(other) {
          return other.source === vertex || other.target === vertex ? 1 : 0.2;
        })
        .transition(500);
  }

  var mouseOutNode = function(vertex, index) {
    nodes
      .transition(500)
        .style('opacity', 1)
        .style('fill', 'black');

    links
      .transition(500)
        .style("stroke-opacity", 1)
        .transition(500);

    this.nextSibling.classList.toggle('visible');
  }

  function isConnected(a, b) {
      return isConnectedAsTarget(a, b) || isConnectedAsSource(a, b) || a.id == b.id;
  }

  function isConnectedAsSource(a, b) {
      return linkedByIds[a.id + "," + b.id];
  }

  function isConnectedAsTarget(a, b) {
      return linkedByIds[b.id + "," + a.id];
  }

  function isEqual(a, b) {
      return a.id == b.id;
  }

  // function registerEventListeners() {
  //     //
  //     // close.on('click', function () {
  //     //   body.classed({'with-menu': false});
  //     //   nav.style('padding-left', '0');
  //     //   sidebar.style('left', '-320px');
  //     //   open.style('left', '40px');
  //     // });
  //     //
  //     // open.on('click', function () {
  //     //   body.classed({'with-menu': true});
  //     //   nav.style('padding-left', '320px');
  //     //   sidebar.style('left', '0');
  //     //   open.style('left', '-100px');
  //     // });
  //
  //     d3.selectAll('div[data-zoom]').on('click', function () {
  //
  //       setTranslationCenter(this.dataset.zoom);
  //       zoomed();
  //     });

  function tick() {
    d3.selectAll('line')
      .attr("x1", function(link) { return link.source.x; })
      .attr("y1", function(link) { return link.source.y; })
      .attr("x2", function(link) { return link.target.x; })
      .attr("y2", function(link) { return link.target.y; });

    d3.selectAll('text.link-label')
      .attr('x', function(link) {
        return (link.source.x + link.target.x) / 2;
      })
      .attr('y', function(link) {
        return (link.source.y + link.target.y) / 2;
      });

    nodes
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  }

  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.index; }).distance(200).strength(0.01))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

  simulation
      .nodes(data.vertices)
      .on("tick", tick);

  simulation.force("link")
      .links(data.edges);

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // var force = d3.layout.force()
  //   .nodes(data.vertices)
  //   .links(data.edges)
  //   .linkDistance(20)
  //   .charge(-3000)
  //   .friction(0.6)
  //   .gravity(0.6)
  //   .size([width, height])
  //   .start();

  // var linkedByIndex = {};
  var linkedByIds = {};
  data.edges.forEach(function(edge) {
    // linkedByIndex[edge.source + "," + edge.target] = true;
    linkedByIds[edge.source + "," + edge.target] = true;
  });

  var svg = d3.select("section").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(zoom);

  function zoomed() {
    svg.attr('transform',
          'translate(' + zoom.translate() + ')' +
          ' scale(' + zoom.scale() + ')');
  }
  function setTranslationCenter(factor) {
    var direction = 1,
      targetZoom = 1,
      center = [width / 2, height / 2],
      extent = zoom.scaleExtent(),
      translate = zoom.translate(),
      translate0 = [],
      l = [],
      view = { x: translate[0], y: translate[1], k: zoom.scale() };

    d3.event.preventDefault();
    targetZoom = zoom.scale() * (1 + factor * direction);

    if (targetZoom < extent[0] || targetZoom > extent[1]) {
      return false;
    }

    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
    view.k = targetZoom;
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];
    view.x += center[0] - l[0];
    view.y += center[1] - l[1];

    zoom.scale(view.k).translate([view.x, view.y]);
  }


  var container = svg.append("g");
  svg.append("g").attr("id", "links");
  svg.append("g").attr("id", "nodes");
  svg.append("g").attr("id", "hullg");

  var nodes = svg.select("#nodes").selectAll(".node")
      .data(data.vertices)
      .enter().append("g")
      .attr("class", "node")
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
      // .call(force.drag);

  // var color = d3.scale.category20b();
  var color = d3.scaleOrdinal(d3.schemeCategory20);
  nodes
    .append("svg:circle")
    .attr("r", function(vertex) {
      var weightProperty = vertex.properties.find(function(property) {
        return property.property_name == "weight";
      });
      const vertexWeight = parseInt(weightProperty.property_value[0]);
      if (vertexWeight >= 600) {
        return Math.sqrt(vertexWeight);
      }else {
        return Math.sqrt(vertexWeight) /2 + 2;
      }
    })
    .style("fill",function(vertex) {
      if(vertex.color) {
        var group = parseInt(vertex.color[0]);
        return color(group);
      }else {
        var identityProperty = vertex.properties.find(function(property) {
          return property.property_name == "identity";
        });
        var colorIdentityIndex = parseInt(identityProperty.property_value);
        return colorIdentity[colorIdentityIndex];
      }
      return '#f7ed2c';
    })
    .on("mouseover", mouseOverNode)
    .on("mouseout", mouseOutNode)
    .on('click', clickNode);

  var nodeLabels = nodes.append('svg:text')
    .attr('x', 14)
    .attr('y', '.4em')
    .text(function(node) {
        return node.id;
    });

  var enter = svg.select("#links").selectAll('.link')
      .data(data.edges).enter();

  // var path = svg.append("svg:g").selectAll("path")
  //   .data(force.links())
  // .enter().append("svg:path")
  //   .attr("class", function(edge) {
  //     var edgeColor = edge.color;
  //
  //      return "link " + edgeColor;
  //    })
  //   .attr("marker-end", function(edge) {
  //     return "url(#" + edge.color + ")";
  //   });

  var links = enter.append('svg:line')
      .attr('class', 'link')
      .style("stroke-width", function(edge) {
        var weightProperty = edge.properties.find(function(property) {
          return property.property_name == 'weight';
        });
        const edgeWeight = parseInt(weightProperty.property_value[0]);
        if (edgeWeight >= 50) {
          return Math.log(edgeWeight)/2 + 1 + 'px';
        } else {
          return Math.log(edgeWeight)/2 + 0.5 + 'px';
        }
      })
      .attr('id', function(edge, index) {
        return 'line-' + index;
      })
      .attr("marker-end", "url()")
      .on('mouseover', mouseOverLink)
      .on('mouseout', mouseOutLink);

  enter.append('svg:text')
      .attr('class', 'link-label')
      .attr('for', function(edge, index) {
        return 'line-' + index;
      })
      .attr('text-anchor', 'middle')
      .text(function(edge) {
        var relation = edge.properties && edge.properties.find(function(property) {
          return property.property_name == 'relation';
        });
        if (relation) {
          return relation.property_value;
        }
        // return edge.label;
      });

  svg
    .append("marker")
    .attr("id", "arrowhead")
    .attr("refX", 3 + 4) // Controls the shift of the arrow head along the path
    .attr("refY", 1)
    .attr("markerWidth", 6)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("path")
      .attr("d", "M 0,0 V 4 L6,2 Z");

  // force
  //   .on("tick", tick);

    // group
  var hullg = svg.selectAll()
  function mouseOverLink(edge, index, edges) {
    document.querySelector('text[for=' + this.id + ']').classList.toggle('visible');
  }

  function mouseOutLink(lineElement, index) {
    document.querySelector('text[for=' + this.id + ']').classList.toggle('visible');
  }

  function clickNode(vertex, index) {
    tbody = '';
    if(vertex.properties != null) {
      vertex.properties.forEach(function(property) {
        var name = property.property_name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var value = property.property_value.join(', ').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        tbody += `<tr><td>${name}</td><td>${value}</td></tr>`
      });
      $('#info-popup tbody').html(tbody);
      $('#info-popup').popup('toggle');
    }
  }
}


function preprocess(data) {
  var map = new Map();

  data.vertices.forEach(function(vertex, index) {
    map.set(vertex.id, index);
  });

  data.edges.forEach(function(edge) {
    edge.source = map.get(edge.source);
    edge.target = map.get(edge.target);
  });

  return data;
}


$(function() {
  $('#info-popup').popup();
  d3.json('data/k-hop.json', function(data) {
    draw(preprocess(data));
  });
});

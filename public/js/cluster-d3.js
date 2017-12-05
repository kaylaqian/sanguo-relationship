function noop() {
  return false;
}

////////////////////////////////////////////////////////////////////////////////

function getVertexId(vertex) {
  return vertex.size ? "_g_" + vertex.group : vertex.name;
}

////////////////////////////////////////////////////////////////////////////////

function getEdgeId(edge) {
  const u = getVertexId(edge.source);
  const v = getVertexId(edge.target);
  return u < v ? u + "|" + v : v + "|" + u;
}

////////////////////////////////////////////////////////////////////////////////

function getGroup(vertex) {
  return vertex.group;
}

function isGroupCentroid(vertex) {
  return vertex.hasOwnProperty('vertices');
}

////////////////////////////////////////////////////////////////////////////////

// constructs the network to visualize
function network(sanguo, cluster,  prevNet, index, expandedClusters) {
  var groupMap = {},            // group map
      nodeMap = {},             // node map
      linkMap = {},             // link map
      prevGroupNodes = {},      // previous group nodes
      prevGroupCentroids = {},  // previous group centroids
      vertices = [],            // output nodes
      edges = [];               // output links

  // process previous nodes for reuse or centroid calculation
  if (prevNet) {
    prevNet.vertices.forEach(function(node) {
      var i = index(node), o;
      if (node.size > 0) {
        prevGroupNodes[i] = node;
        node.size = 0;
      } else {
        o = prevGroupCentroids[i] || (prevGroupCentroids[i] = {x:0,y:0,count:0});
        o.x += node.x;
        o.y += node.y;
        o.count += 1;
      }
    });
  }

  // Determine nodes
  for (var k = 0; k < cluster.vertices.length; ++k) {
    var n = cluster.vertices[k],
        i = index(n),
        l = groupMap[i] || (groupMap[i] = prevGroupNodes[i]) || (groupMap[i] = { group: i, size: 0, vertices: [] });

    if (expandedClusters[i]) {
      // the node should be directly visible
      nodeMap[n.id] = vertices.length;
      vertices.push(n);
      if (prevGroupNodes[i]) {
        // place new nodes at cluster location (plus jitter)
        n.x = prevGroupNodes[i].x + Math.random();
        n.y = prevGroupNodes[i].y + Math.random();
      }
    } else {
      // the node is part of a collapsed cluster
      if (l.size == 0) {
        // if new cluster, add to set and position at centroid of leaf nodes
        nodeMap[i] = vertices.length;
        vertices.push(l);
        if (prevGroupCentroids[i]) {
          l.x = prevGroupCentroids[i].x / prevGroupCentroids[i].count;
          l.y = prevGroupCentroids[i].y / prevGroupCentroids[i].count;
        }
      }
      l.vertices.push(n);
    }

    // Always count group size as we also use it to tweak the force graph strengths/distances
    l.size += 1;
    n.group_data = l;
  }

  for (i in groupMap) {
    groupMap[i].edgeCount = 0;
  }

  var map = new Map(cluster.vertices.map(vertex => [vertex.id, vertex]));

  // Determine edges
  for (k = 0; k < sanguo.edges.length; ++k) {
    const e = sanguo.edges[k];
    const source = map.get(e.source);
    const target = map.get(e.target);
    let u = index(source);
    let v = index(target);
    if (u != v) {
      groupMap[u].edgeCount++;
      groupMap[v].edgeCount++;
    }
    u = expandedClusters[u] ? nodeMap[source.id] : nodeMap[u];
    v = expandedClusters[v] ? nodeMap[target.id] : nodeMap[v];
    if (u === undefined || v === undefined) {
      debugger;
    }
    var i = (u<v ? u+"|"+v : v+"|"+u),
        l = linkMap[i] || (linkMap[i] = {source:u, target:v, size:0});
    l.size += 1;
  }
  for (i in linkMap) { edges.push(linkMap[i]); }

  return { vertices: vertices, edges: edges };
}

////////////////////////////////////////////////////////////////////////////////

function convexHulls(vertices, index, offset) {
  var hulls = {};

  // create point sets
  for (var k=0; k<vertices.length; ++k) {
    var n = vertices[k];
    if (n.size) continue;
    var i = index(n),
        l = hulls[i] || (hulls[i] = []);
    l.push([n.x-offset, n.y-offset]);
    l.push([n.x-offset, n.y+offset]);
    l.push([n.x+offset, n.y-offset]);
    l.push([n.x+offset, n.y+offset]);
  }

  // create convex hulls
  var hullset = [];
  for (i in hulls) {
    hullset.push({
      group: i,
      path: d3.geom.hull(hulls[i])
    });
  }

  return hullset;
}

////////////////////////////////////////////////////////////////////////////////

function drawCluster(d) {
  return curve(d.path); // 0.8
}

////////////////////////////////////////////////////////////////////////////////



var offset = 15;    // cluster hull offset
var expandedClusters = {}; // expanded clusters
var data, net, force, hullGroup, hulls, linkGroup, links, nodeGroup, node;
var curve;

////////////////////////////////////////////////////////////////////////////////

function myData(sanguo, cluster) {

  var graph = d3.select('.graph');
  var width = parseInt(graph.style('width'));
  var height = parseInt(graph.style('height'));
  var svg = graph.append("svg")
    .attr("width", width)
    .attr("height", height);

  curve = d3.svg.line()
    .interpolate("cardinal-closed")
    .tension(.85);

  // var fill = d3.scale.category20();
  var fill = ['#8095eb','#167fd6','#7F4CFF','#04fbb6','#5462ec','#3da6f9','#01c9f2','#58c079','#5462EC','#04FBB6','#2D6259','#454A7A','#4DD2FF','#423579','#58c075'];

  cluster.vertices.forEach(vertex => {
    vertex.group = parseInt(vertex.color[0]);
  });


  hullGroup = svg.append("g");
  linkGroup = svg.append("g");
  nodeGroup = svg.append("g");

  init(width, height, sanguo, cluster, fill, expandedClusters);

  // svg.attr("opacity", 1e-6)
  //   .transition()
  //     .duration(1000)
  //     .attr("opacity", 1);
}

////////////////////////////////////////////////////////////////////////////////

function init(width, height, sanguo, cluster, fill, expandedClusters) {
  if (force) {
    force.stop();
  }

  net = network(sanguo, cluster, net, getGroup, expandedClusters);

  force = d3.layout.force()
      .nodes(net.vertices)
      .links(net.edges)
      .size([width, height])
      .linkDistance(function(link, i) {
        var n1 = link.source;
        var n2 = link.target;
        const result = 30 +
          Math.min(
            60 * Math.min((n1.size || (n1.group != n2.group ? n1.group_data.size : 0)),
                          (n2.size || (n1.group != n2.group ? n2.group_data.size : 0))),
            -30 +
            40 * Math.min((n1.edgeCount || (n1.group != n2.group ? n1.group_data.edgeCount : 0)),
                          (n2.edgeCount || (n1.group != n2.group ? n2.group_data.edgeCount : 0))),
            200);
        return result;
      })
      .linkStrength(function(l, i) {
        return 1;
      })
      .gravity(0.05)   // gravity+charge tweaked to ensure good 'grouped' view (e.g. green group not smack between blue&orange, ...
      .charge(-600)    // ... charge is important to turn single-linked groups to the outside
      .friction(0.5)   // friction adjusted to get dampened display: less bouncy bouncy ball [Swedish Chef, anyone?]
      .start();

  hullGroup.selectAll('path.hull').remove();
  hulls = hullGroup.selectAll('path.hull')
      .data(convexHulls(net.vertices, getGroup, offset))
    .enter().append('path')
      .attr('class', 'hull')
      .attr('d', drawCluster)
      .style('fill', function(d) {
        return fill[d.group];
      })
      .on('click', function(d) {
        expandedClusters[d.group] = false;
        init(width, height, sanguo, cluster, fill, expandedClusters);
      });

  links = linkGroup.selectAll('line.link').data(net.edges, getEdgeId);
  links.exit().remove();
  links.enter().append('svg:line')
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
      .style("stroke-width", function(d) { return 1.5 * Math.log10(d.size) + 1; });

  nodes = nodeGroup.selectAll('g').data(net.vertices, getVertexId);
  nodes.exit().remove();
  nodes.enter()
    .append('svg:g')
      .attr('class', vertex => isGroupCentroid(vertex) ? 'centroid' : 'vertex')
    .append('svg:circle')
      .attr("class", function(vertex) { return "node" + (vertex.size ? "" : " leaf"); })
      .attr("r", function(vertex) { return vertex.size ? 10 * Math.log10(vertex.size) + 5 : 5; })
      .style("fill", function(vertex) { return fill[vertex.group]; })
      .on("click", function(vertex) {
        expandedClusters[vertex.group] = !expandedClusters[vertex.group];
        init(width, height, sanguo, cluster, fill, expandedClusters);
      });

  var groupLabel = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五"];
  var nodeLabels = nodes.append('svg:text')
      .attr('class', 'label')
      .attr('x', vertex => isGroupCentroid(vertex) ? 10 * Math.log10(vertex.size) + 14 : 14)
      .attr('y', '.4em')
      .text((vertex, index) => isGroupCentroid(vertex) ? groupLabel[index] : vertex.id)

  nodes.call(force.drag);

  force.on("tick", function() {
    if (!hulls.empty()) {
      hulls.data(convexHulls(net.vertices, getGroup, offset))
          .attr("d", drawCluster);
    }

    links
        .attr("x1", function(edge) { return edge.source.x; })
        .attr("y1", function(edge) { return edge.source.y; })
        .attr("x2", function(edge) { return edge.target.x; })
        .attr("y2", function(edge) { return edge.target.y; });

    // Set the offsets for the nodes
    nodes.attr('transform', vertex => `translate(${vertex.x}, ${vertex.y})`);
  });
}


////////////////////////////////////////////////////////////////////////////////
function mouseOverNode(vertex, index) {
  var map = new Map([
    ['name', '姓名'],
    ['gener', '性别'],
    ['leadership', '统御'],
    ['force', '武力'],
    ['intelligence', '智力'],
    ['politics', '政治'],
    ['charm', '魅力'],
    ['life', '寿命'],
    ['identity', '身份']
  ]);

  var blocklist = new Set(['weight', 'country']);
  var identities = ['主公', '武将', '文臣'];
  tbody = '';
  if(vertex.properties != null) {
    vertex.properties.forEach(function(property) {
      var name = property.property_name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      if (blocklist.has(name)) {
        return;
      }
      if (map.has(name)) {
        name = map.get(name);
      }
      var value = property.property_value.join(', ').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      if (name == '身份') {
        value = identities[value];
      }else {
        value = value;
      }
      tbody += `<tr><td>${name}</td><td>${value}</td></tr>`
    });
    $('#info-popup tbody').html(tbody);
    $('#info-popup').popup('toggle');
  }
}

////////////////////////////////////////////////////////////////////////////////

function preprocess(sanguo, cluster) {
  return sanguo;
}

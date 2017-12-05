d3.json('data/cluster.json', function(data) {
 
  var graph = d3.select('.graph');
  var width = parseInt(graph.style('width'));
  var height = parseInt(graph.style('height'));
  var padding = 1.5, // separation between same-color nodes
      clusterPadding = 6, // separation between different-color nodes
      maxRadius = 8;

  var n = data.vertices.length, // total number of nodes
      m = 0; // number of distinct clusters

  var color = d3.scaleSequential(d3.interpolateRainbow)
      .domain(d3.range(m));

  // The largest node for each cluster.
  var clusters = new Array(m);

  var nodes = d3.range(n).map(function () {
    var i = Math.floor(Math.random() * m),
        r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
        d = {
          cluster: i,
          radius: r,
          x: Math.cos(i / m * 2 * Math.PI) * 150 + width / 2 + Math.random(),
          y: Math.sin(i / m * 2 * Math.PI) * 150 + height / 2 + Math.random()
        };
    if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
    return d;
  });

  var simulation = d3.forceSimulation()
    // keep entire simulation balanced around screen center
    .force('center', d3.forceCenter(width/2, height/2))

    // cluster by section
    .force('cluster', d3.forceCluster()
      .centers(function (d) { return clusters[d.cluster]; })
      .strength(0.5))

    // apply collision with padding
    .force('collide', d3.forceCollide(function (d) { return d.radius + padding; }))

    .on('tick', layoutTick)
    .nodes(nodes);
    
  var svg = d3.select('.graph').append('svg')
      .attr('width', width)
      .attr('height', height);

  var node = svg.selectAll('circle')
    .data(nodes)
    .enter().append('circle')
      .style('fill', function (d) { return color(d.cluster/10); });
    
  function layoutTick (e) {
    d3.selectAll('circle')
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
      .attr('r', function (d) { return d.radius; });
  }
});
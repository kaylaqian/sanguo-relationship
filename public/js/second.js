/**
 * Created by mengqing on 2017/7/10.
 */
(function app() {
    'use strict';

    function noop() { return false; }

    function nodeid(n) {
        return n.size ? "_g_"+n.group : n.name;
    }

    function linkid(l) {
        var u = nodeid(l.source),
            v = nodeid(l.target);
        return u<v ? u+"|"+v : v+"|"+u;
    }

    function getGroup(n) { return n.group; }

// constructs the network to visualize
    function network(data, prev, index, expand) {
        expand = expand || {};
        var gm = {},    // group map
            nm = {},    // node map
            lm = {},    // link map
            gn = {},    // previous group nodes
            gc = {},    // previous group centroids
            nodes = [], // output nodes
            links = []; // output links

        // process previous nodes for reuse or centroid calculation
        if (prev) {
            prev.nodes.forEach(function(n) {
                var i = index(n), groupCentroid;
                if (n.size > 0) {
                    gn[i] = n;
                    n.size = 0;
                } else {
                    groupCentroid = gc[i] || (gc[i] = {x:0,y:0,count:0});
                    groupCentroid.x += n.x;
                    groupCentroid.y += n.y;
                    groupCentroid.count += 1;
                }
            });
        }

        // determine nodes
        for (var k=0; k<data.nodes.length; ++k) {
            var n = data.nodes[k],
                i = index(n),
                l = gm[i] || (gm[i]=gn[i]) || (gm[i]={group:i, size:0, nodes:[]});

            if (expand[i]) {
                // the node should be directly visible
                nm[n.name] = nodes.length;
                nodes.push(n);
                if (gn[i]) {
                    // place new nodes at cluster location (plus jitter)
                    n.x = gn[i].x + Math.random();
                    n.y = gn[i].y + Math.random();
                }
            } else {
                // the node is part of a collapsed cluster
                if (l.size == 0) {
                    // if new cluster, add to set and position at centroid of leaf nodes
                    nm[i] = nodes.length;
                    nodes.push(l);
                    if (gc[i]) {
                        l.x = gc[i].x / gc[i].count;
                        l.y = gc[i].y / gc[i].count;
                    }
                }
                l.nodes.push(n);
            }
            // always count group size as we also use it to tweak the force graph strengths/distances
            l.size += 1;
            n.group_data = l;
        }

        for (i in gm) { gm[i].link_count = 0; }

        // determine links
        for (k=0; k<data.links.length; ++k) {
            var e = data.links[k],
                u = index(e.source),
                v = index(e.target);
            if (u != v) {
                gm[u].link_count++;
                gm[v].link_count++;
            }
            u = expand[u] ? nm[e.source.name] : nm[u];
            v = expand[v] ? nm[e.target.name] : nm[v];
            var i = (u<v ? u+"|"+v : v+"|"+u),
                l = lm[i] || (lm[i] = {source:u, target:v, size:0});
            l.size += 1;
        }
        for (i in lm) { links.push(lm[i]); }

        return {nodes: nodes, links: links};
    }

    // function convexHulls(nodes, index, offset) {
    //     var hulls = {};
    //
    //     // create point sets
    //     for (var k=0; k<nodes.length; ++k) {
    //         var n = nodes[k];
    //         if (n.size) continue;
    //         var i = index(n),
    //             l = hulls[i] || (hulls[i] = []);
    //         l.push([n.x-offset, n.y-offset]);
    //         l.push([n.x-offset, n.y+offset]);
    //         l.push([n.x+offset, n.y-offset]);
    //         l.push([n.x+offset, n.y+offset]);
    //     }
    //
    //     // create convex hulls
    //     var hullset = [];
    //     for (i in hulls) {
    //         hullset.push({group: i, path: d3.geom.hull(hulls[i])});
    //     }
    //
    //     return hullset;
    // }

    function drawCluster(d) {
        return curve(d.path); // 0.8
    }

    //--------------------------------------------------------

    var graph = d3.select(".graph");

    var width = parseInt(graph.style('width')),
        height = parseInt(graph.style('height')),
        dr = 4,      // default point radius
        off = 15,    // cluster hull offset
        expand = {}, // expanded clusters
        data, net, force, hullg, hull, linkg, link, nodeg, node;

    var curve = d3.svg.line()
        .interpolate("cardinal-closed")
        .tension(.85);

    var fill = d3.scale.category20();
    // var fill = '#1f77b4';


    var vis = graph.append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("data/node.json", function(json) {
        data = json;
        for (var i=0; i < data.links.length; ++i) {
            const link = data.links[i];
            link.source = data.nodes[link.source];
            link.target = data.nodes[link.target];
        }

        hullg = vis.append("g");
        linkg = vis.append("g");
        nodeg = vis.append("g");

        init();

        vis.attr("opacity", 1e-6)
            .transition()
            .duration(1000)
            .attr("opacity", 1);
    });

    function init() {
        if (force) force.stop();

        net = network(data, net, getGroup, expand);

        force = d3.layout.force()
            .nodes(net.nodes)
            .links(net.links)
            .size([width, height])
            .linkDistance(function(l, i) {
                var n1 = l.source, n2 = l.target;
                return 30 +
                    Math.min(20 * Math.min((n1.size || (n1.group != n2.group ? n1.group_data.size : 0)),
                            (n2.size || (n1.group != n2.group ? n2.group_data.size : 0))),
                        -30 +
                        30 * Math.min((n1.link_count || (n1.group != n2.group ? n1.group_data.link_count : 0)),
                            (n2.link_count || (n1.group != n2.group ? n2.group_data.link_count : 0))),
                        100);
                //return 150;
            })
            .linkStrength(function(l, i) {
                return 1;
            })
            .gravity(0.05)   // gravity+charge tweaked to ensure good 'grouped' view (e.g. green group not smack between blue&orange, ...
            .charge(-600)    // ... charge is important to turn single-linked groups to the outside
            .friction(0.5)   // friction adjusted to get dampened display: less bouncy bouncy ball [Swedish Chef, anyone?]
            .start();

        // hullg.selectAll("path.hull").remove();
        // hull = hullg.selectAll("path.hull")
        //     .data(convexHulls(net.nodes, getGroup, off))
        //     .enter().append("path")
        //     .attr("class", "hull")
        //     .attr("d", drawCluster)
        //     .style("fill", function(d) { return fill(d.group); })
        //     .on("click", function(d) {
        //         console.log("hull click", d, arguments, this, expand[d.group]);
        //         expand[d.group] = false; init();
        //     });

        link = linkg.selectAll("line.link").data(net.links, linkid);
        link.exit().remove();
        link.enter().append("line")
            .attr("class", "link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .style("stroke-width", function(d) { return d.size || 1; });

        node = nodeg.selectAll("circle.node").data(net.nodes, nodeid);
        node.exit().remove();
        node.enter().append("circle")
        // if (d.size) -- d.size > 0 when d is a group node.
            .attr("class", function(d) { return "node" + (d.size?"":" leaf"); })
            .attr("r", function(d) { return d.size ? d.size + dr : dr+1; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .style("fill", function(d) { return fill(d.group); })
            .on("click", function(d) {
                console.log("node click", d, arguments, this, expand[d.group]);
                expand[d.group] = !expand[d.group];
                init();
            })
            .on('mouseover', function(d) {
                connectedNodes(d);
            });

        node.call(force.drag);

        force.on("tick", function() {
            // if (!hull.empty()) {
            //     hull.data(convexHulls(net.nodes, getGroup, off))
            //         .attr("d", drawCluster);
            // }

            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });
    }
    function connectedNodes(d) {
        if (d !== null) {
                node.style('opacity', function (o) {
                    // Highlight connected nodes
                    return d.name === o.name | neighboring(d, o)  ? 1 : 0.1;
                });
                link.style('opacity', function (o) {
                    // Highlight outgoing relations
                    return d.name === o.source.name ? 1 : 0.05;
                });
            } else {
                node.style('opacity', 1);
                link.style('opacity', 0.25);
            }
        }
})();
var initGraph;

$(function() {
  $('form').submit(function(event) {
    event.preventDefault();
    if (this.parentNode.getAttribute('id') == 'show_graph') {
      const algorithm = $('ul li.active').attr('value');
      const data = {
        // command: $('select[name=algorithm]').val()
      };
      if (algorithm == 'show_graph' || algorithm == 'list_graphs') {
        data.command = algorithm;
        if (algorithm == 'show_graph') {
          data.graph_name = "sanguo";
        }
      }

      $.ajax('/', {
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: data => {
          console.log(data);
          initGraph = data;
          // wholeGraph = $.getJson('data/sanguo.json');
          initGraph(initGraph);
        },
        error: (error) => {
          console.log(error.message);
        }
      });
    } else if (this.parentNode.getAttribute('id') == 'k-hop') {
      const algorithm = $('ul li.active').attr('value');
      const data = {
        // command: $('select[name=algorithm]').val()
      };
      if (algorithm == 'k-hop') {
        data.command = 'algorithm';
        data['algorith_command'] = {
          'graph_name': 'sanguo',
          'algorithm_name': 'k_hop',
          parameters: [
            {
              key: 'k',
              value: $('#k-hop input[name=kValue]').val()
            },
            {
              key: 'source',
              value: $('#k-hop input[name=sourceId]').val()
            }
          ]
        }
      }   
      $.ajax('/', {
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: data => {
          console.log(data);
          khopGraph(initGraph, data);
        },
        error: (error) => {
          console.log(error.message);
        }
      });
    } else if(this.parentNode.getAttribute('id') == 'path-search') {
      const algorithm = $('ul li.active').attr('value');
      const data = {};
      if (algorithm == 'path-search') {
        data.command = 'algorithm';
        data['algorith_command'] = {
          'graph_name': 'sanguo',
          'algorithm_name': 'top_k_path',
          parameters: [
            {
              key: 'source',
              value: $('#path-search input[name=sourceId]').val()
            },
            {
              key: 'target',
              value: $('#path-search input[name=targetId]').val()
            }
          ]
        }
      }

      $.ajax('/', {
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: data => {
          console.log(data);
          pathGraph(data);
        },
        error: (error) => {
          console.log(error.message);
        }
      });
    } else if (this.parentNode.getAttribute('id') == 'cluster') {
      const data = {};
      var property_filter={};
      data.command = 'algorithm';
      data['algorithm_command'] = {
        'graph_name': 'sanguo',
        'algorithm_name': 'lpa',
        parameters: []
      } 
      $.ajax('/', {
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: data => {
          console.log(data);
        },
        error: (error) => {
          console.log(error.message);
        }
      });
    }else if (this.parentNode.getAttribute('id') == 'property') {
      const data = {};
      var filter = [];
      if($('#tongyu input[name="on"]').is(':checked')) {
        var fields = $('#tongyu input[name="expression"]').val().trim().split(/\s+/);
        var property = {
          "predicate": fields[0],
          "leftvalue": {
            "property_name" : "tongyu"
          },
          "rightvalue": {
            "value" : fields[1]
          }
        }
        filter.push(property);
      }
      if ($('#wuli input[name="on"]').is(':checked')) {
        var fields = $('#wuli input[name="expression"]').val().trim().split(/\s+/);
        var property = {
          "predicate": fields[0],
          "leftvalue": {
            "property_name" : "wuli"
          },
          "rightvalue": {
            "value" : fields[1]
          }
        }
        filter.push(property);
      }
      if ($('#zhili input[name="on"]').is(':checked')){
        var fields = $('#zhili input[name="expression"]').val().trim().split(/\s+/);
        var property = {
          "predicate": fields[0],
          "leftvalue": {
            "property_name" : "zhili"
          },
          "rightvalue": {
            "value" : fields[1]
          }
        }
        filter.push(property);
      }
      if ($('#zhengzhi input[name="on"]').is(':checked')){
        var fields = $('#zhengzhi input[name="expression"]').val().trim().split(/\s+/);
        var property = {
          "predicate": fields[0],
          "leftvalue": {
            "property_name" : "zhengzhi"
          },
          "rightvalue": {
            "value" : fields[1]
          }
        }
        filter.push(property);
      }
      if ($('#meili input[name="on"]').is(':checked')){
        var fields = $('#meili input[name="expression"]').val().trim().split(/\s+/);
        var property = {
          "predicate": fields[0],
          "leftvalue": {
            "property_name" : "meili"
          },
          "rightvalue": {
            "value" : fields[1]
          }
        }
        filter.push(property);
      }else if ($('#shouming input[name="on"]').is(':checked')){
        var fields = $('#shouming input[name="expression"]').val().trim().split(/\s+/);
        var property = {
          "predicate": fields[0],
          "leftvalue": {
            "property_name" : "shouming"
          },
          "rightvalue": {
            "value" : fields[1]
          }
        }
        filter.push(property);
      }
      if($('#guojia input[name="on"]').is(':checked')){
        var property = {
          "predicate": "=",
          "leftvalue": {
            "property_name" : "guojia"
          },
          "rightvalue": {
            "value" : $('input[name="guojia"]:checked').val()
          }
        }
        filter.push(property);
      }
      if($('#xingbie input[name="on"]').is(':checked')){
        var property = {
          "predicate": "=",
          "leftvalue": {
            "property_name" : "xingbie"
          },
          "rightvalue": {
            "value" : $('input[name="guojia"]:checked').val()
          }
        }
        filter.push(property);
      }
      if($('#shenfen input[name="on"]').is(':checked')){
        var property = {
          "predicate": "=",
          "leftvalue": {
            "property_name" : "shenfen"
          },
          "rightvalue": {
            "value" : $('input[name="guojia"]:checked').val()
          }
        }
        filter.push(property);
      }

      data.command = 'query_graph';
      data['query_graph_command'] = {
        'graph_name': 'sanguo',
        'vertex_filter': {
          property_filter:filter
        }
      }
      $.ajax('/', {
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: data => {
          console.log(data);
          // draw(preprocess(data));
        },
        error: (error) => {
          console.log(error.message);
        }
      });
    }
  });
});

$(function() {
  $('select').on('change', event => {
    // const query = document.querySelector('#query');
    // const path = document.querySelector('#path-search');
    // const k_hop = document.querySelector('#k-hop');
    const target = $(event.target.getAttribute('data-target'));
    target.hide();
    $(event.target.selectedOptions[0].getAttribute('data-target')).show();
  });

  $(".image-preview-input input:file").change(function() {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      $(".image-preview-filename").val(file.name);
    }
    reader.readAsText(file);
  });
});

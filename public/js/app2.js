$(function() {
  $('.checkbox').click(function(event) {
    $('.checkbox').not(this).removeProp('checked');
    if ($(this).prop('checked')) {
      $('.' + $(this).attr('data-target')).show();
    }
  });
});

/* range slider bar function */
var rangeSlider = function(){
  var slider = $('.rangeSlider'),
      range = $('.rangeSlider__range'),
      value = $('.rangeSlider__value');

  slider.each(function(){

    value.each(function(){
      var value = $(this).prev().attr('value');
      $(this).html(value);
    });

    range.on('input', function(){
      $(this).next(value).html(this.value);
    });
  });
};

rangeSlider();

function isChinese(temp)  {
  var re=/[\u4e00-\u9fa5]/;
  if (re.test(temp)) {
    return true;
  }
  return true;
}

function isJSON(str) {
  if (typeof str == 'string') {
      try {
          JSON.parse(str);
          return true;
      } catch(e) {
          console.log(e);
          return false;
      }
  }
  console.log('It is not a string!')
}
var initData;

$(function() {
  const data = {};
  data.command = 'algorithm';
  data['algorithm_command'] = {
    'graph_name': 'sanguo',
    'algorithm_name': 'show_graph',
    parameters: []
  }

  $.ajax('/sanguo', {
    method: 'POST',
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json',
    success: data => {
      console.log(data);
      initData = data;
      $('section').remove();
      $('body').append('<section class="graph"></section>');
      console.log("huatu");
      // drawGraph();
      heatmap($('section').get(0), initData);
      // initGraph($('section').get(0), initData);
    },
    error: (error) => {
      console.log(error.message);
    }
  });

  $('form').submit(function(event) {
    event.preventDefault();
    if ($(this.parentNode.parentNode).prop('id') == 'k-hop') {
      const data = {
        // command: $('select[name=algorithm]').val()
      };
      data.command = 'algorithm';
      data['algorithm_command'] = {
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
      $.ajax('/khop', {
        method: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: data => {
          console.log(data);
          $('section').remove();
          $('body').append('<section class="graph"></section>');
          khopGraph($('section').get(0),data);
        },
        error: (error) => {
          console.log(error.message);
        }
      });
      //subgraph
    } else if ($(this.parentNode.parentNode).prop('id') == 'input-search') {
      const data = {};
      data.command = 'algorithm';
      data['algorithm_command'] = {
        'graph_name': 'sanguo',
        'algorithm_name': 'top_k_path',
        parameters: [
          {
            key: 'x1',
            value: $('#input-search input[name=x1]').val()
          },
          {
            key: 'x2',
            value: $('#input-search input[name=x2]').val()
          },
          {
            key: 'y1',
            value: $('#input-search input[name=y1]').val()
          },
             {
            key: 'y2',
            value: $('#input-search input[name=y2]').val()
          },
        ]
      }
      $.ajax('/subgraph', {
        method: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: data => {
          console.log(data);
          $('section').remove();
          $('body').append('<section class="graph"></section>');
          pathGraph($('section').get(0),data);
        },
        error: (error) => {
          alert("输入正确字符");
          console.log(error.message);
        }
      });
      //path-search
    } else if ($(this.parentNode.parentNode).prop('id') == 'path-search') {
      const data = {};
      data.command = 'algorithm';
      data['algorithm_command'] = {
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
      $.ajax('/pathsearch', {
        method: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: data => {
          console.log(data);
          $('section').remove();
          $('body').append('<section class="graph"></section>');
          pathGraph($('section').get(0),data);
        },
        error: (error) => {
          alert("输入正确字符");
          console.log(error.message);
        }
      });

    } else if ($(this.parentNode.parentNode).prop('id') == 'cluster') {
      const data = {};
      var property_filter={};
      data.command = 'algorithm';
      data['algorithm_command'] = {
        'graph_name': 'sanguo',
        'algorithm_name': 'lpa',
        parameters: []
      }
      $.ajax('/cluster', {
        method: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: data => {
          console.log(data);
          $('section').remove();
          $('body').append('<section class="graph"></section>');
          myData(initData, data)
          // cluster($('section').get(0), initData, data);
        },
        error: (error) => {
          console.log(error.message);
        }
      });
    }else if ($(this.parentNode.parentNode).prop('id') == 'property') {
      const data = {};
      var filter = {};
      var allProperty = [];
      var leadership, force,  intelligence, politics, charm, life, identity;
      if($('#leadership input[name="on"]').is(':checked')) {
        leadership = {
          'property_filter': {
            "predicate": ">=",
            "leftvalue": {
              "property_name" : "leadership"
            },
            "rightvalue": {
              "value" : $('#leadership input[name=leadershipRange]').val()
            }
          }
        }
        allProperty.push(leadership);
      }

      if ($('#force input[name="on"]').is(':checked')) {
        force = {
          'property_filter': {
            "predicate": ">=",
            "leftvalue": {
              "property_name" : "force"
            },
            "rightvalue": {
              "value" : $('#force input[name=forceRange]').val()
            }
          }
        }
        allProperty.push(force);
      }
      if ($('#intelligence input[name="on"]').is(':checked')) {
        intelligence = {
          'property_filter': {
            "predicate": ">=",
            "leftvalue": {
              "property_name" : "intelligence"
            },
            "rightvalue": {
              "value" : $('#intelligence input[name=intelligenceRange]').val()
            }
          }
        }
        allProperty.push(intelligence);
      }
      if ($('#politics input[name="on"]').is(':checked')){
        politics = {
          'property_filter': {
            "predicate": ">=",
            "leftvalue": {
              "property_name" : "politics"
            },
            "rightvalue": {
              "value" : $('#politics input[name=politicsRange]').val()
            }
          }
        }
        allProperty.push(politics);
      }
      if ($('#charm input[name="on"]').is(':checked')){
        charm = {
          'property_filter': {
            "predicate": ">=",
            "leftvalue": {
              "property_name" : "charm"
            },
            "rightvalue": {
              "value" : $('#charm input[name=charmRange]').val()
            }
          }
        }
        allProperty.push(charm);
      }

      if($('#identity input[name="on"]').is(':checked')){
        var identityID;
        if($('input[name="identity"]:checked').val() == '主公') {
          identityID = 0;
        }else if($('input[name="identity"]:checked').val() == '武将') {
          identityID = 1;
        }else {
          identityID = 2;
        }
        identity = {
          'property_filter': {
            "predicate": "=",
            "leftvalue": {
              "property_name" : "identity"
            },
            "rightvalue": {
              "value" : identityID
            }
          }
        }
        allProperty.push(identity);
      }

      if(allProperty.length == 1) {
        data.command = 'query_graph';
        data['query_graph_command'] = {
          'graph_name': 'sanguo',
          'vertex_filter':allProperty[0]
        }
      }else if(allProperty.length == 2) {
        data.command = 'query_graph';
        data['query_graph_command'] = {
          'graph_name': 'sanguo',
          'vertex_filter': {
            'property_filter':{
              predicate: "&",
              leftvalue: allProperty[0],
              rightvalue: allProperty[1]
            }
          }
        }
      }else if(allProperty.length == 3) {
        data.command = 'query_graph';
        data['query_graph_command'] = {
          'graph_name': 'sanguo',
          'vertex_filter': {
            'property_filter':{
              predicate: "&",
              'leftvalue': {
                 'property_filter':{
                  predicate: "&",
                  leftvalue: allProperty[0],
                  rightvalue: allProperty[1]
                }
              },
              rightvalue: allProperty[2]
            }
          }
        }
      }else if(allProperty.length == 4) {
        data.command = 'query_graph';
        data['query_graph_command'] = {
          'graph_name': 'sanguo',
          'vertex_filter': {
            'property_filter':{
              predicate: "&",
              'leftvalue': {
                'property_filter':{
                  predicate: "&",
                  'leftvalue':  {
                    'property_filter':{
                      predicate: "&",
                      leftvalue: allProperty[0],
                      rightvalue: allProperty[1]
                      }
                    },
                    rightvalue: allProperty[2]
                  }
                },
              rightvalue: allProperty[3]
            }
          }
        }
      }else if(allProperty.length == 5) {
        data.command = 'query_graph';
        data['query_graph_command'] = {
          'graph_name': 'sanguo',
          'vertex_filter': {
             'property_filter':{
              predicate: "&",
              'leftvalue': {
                'property_filter':{
                  predicate: "&",
                  'leftvalue': {
                    'property_filter':{
                      predicate: "&",
                      'leftvalue': {
                        'property_filter':{
                          predicate: "&",
                          leftvalue: allProperty[0],
                          rightvalue: allProperty[1]
                          }
                        },
                        rightvalue: allProperty[2]
                      }
                    },
                    rightvalue: allProperty[3]
                  }
                },
              rightvalue: allProperty[4]
            }
          }
        }
      }else if (allProperty.length == 6) {
        data.command = 'query_graph';
        data['query_graph_command'] = {
          'graph_name': 'sanguo',
          'vertex_filter': {
             'property_filter':{
              predicate: "&",
              'leftvalue': {
                'property_filter':{
                  predicate: "&",
                  'leftvalue': {
                    'property_filter':{
                      predicate: "&",
                      'leftvalue': {
                        'property_filter':{
                          predicate: "&",
                          'leftvalue': {
                            'property_filter':{
                            predicate: "&",
                            leftvalue: allProperty[0],
                            rightvalue: allProperty[1]
                            }
                          },
                          rightvalue: allProperty[2]
                          }
                        },
                        rightvalue: allProperty[3]
                      }
                    },
                    rightvalue: allProperty[4]
                  }
                },
              rightvalue: allProperty[5]
            }
          }
        }
      }
      $.ajax('/property', {
        method: 'POST',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: data => {
          console.log(data);
          $('section').remove();
          $('body').append('<section class="graph"></section>');
          propertyGraph($('section').get(0), initData, data);
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

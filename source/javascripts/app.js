//= require _data_adapter
//= require foundation
//= require foundation/foundation.accordion
//= require foundation/foundation.alert
//= require_tree ./_templates

$(document).foundation();

/* globals DataAdapter */

(function() {
  window.commonErrorHandler = function(error) {
    console.log(error);
  };

  window.commonNotificationHandler = function(text, level) {
    var template = window.JST['_templates/alert'];
    var html = template({
      text: text,
      level: level
    });
    var currAlert = $(html);
    $('.alertHolder').append(currAlert);
    (function(obj) {
      window.setTimeout(function() {
        $(obj).fadeOut(300, function() {
          $(this).remove();
        });
      }, 3000);
    })(currAlert);

  };


  $(document).ready(function() {
    var tabs = $('nav li');
    if (window.location.pathname.match('providers')) {
      console.log('providers');
      $(tabs[1]).addClass('active');
    } else if (window.location.pathname.match('subscribers')){
      console.log('subscriber');
      $(tabs[2]).addClass('active');
    } else if (window.location.pathname.match('newrecord')) {
      $('.active').removeClass('active');
    } else {
      console.log('map');
      $(tabs[0]).addClass('active');
    }
    // Initialize lazy load
    $('.lazy').lazyload({
      threshold: 0,
      failure_limit: 999,
      effect: 'fadeIn',
      data_attribute_queries: [{
          media: "(max-width: 1600px)",
          data_name: "x-large"
        },
        {
          media: "(max-width: 1200px)",
          data_name: "large"
        },
        {
          media: "(max-width: 900px)",
          data_name: "medium"
        },
        {
          media: "(max-width: 640px)",
          data_name: "small"
        },
        {
          media: "(max-width: 400px)",
          data_name: "x-small"
        }
      ]
    });

    // setting a global data adapter instance
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();
  });
})();

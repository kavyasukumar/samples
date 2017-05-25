//= require _data_adapter
//= require foundation
//= require foundation/foundation.accordion
//= require foundation/foundation.alert
//= require_tree ./_templates

$(document).foundation();

/* globals DataAdapter */


/* If you would like to use Javascript templates, you can enable them by adding
 * the following line to the top of this file
 *   //=require_tree ./_templates
 * you can then use the templates like this:
 *   var template = window.JST['_templates/example'];
 *   var html = template(***REMOVED***my_var: 'Hello!', list: [1, 2, 3, 4]***REMOVED***);
 *   $('#example').html(html);
 * Template files should have the extension `.jst.ejs` to be properly loaded.
 */

(function() ***REMOVED***
  window.commonErrorHandler = function(error) ***REMOVED***
    console.log(error);
  ***REMOVED***;

  window.commonNotificationHandler = function(text, level) ***REMOVED***
    var template = window.JST['_templates/alert'];
    var html = template(***REMOVED***
      text: text,
      level: level
    ***REMOVED***);
    var currAlert = $(html);
    $('.alertHolder').append(currAlert);
    (function(obj) ***REMOVED***
      window.setTimeout(function() ***REMOVED***
        $(obj).fadeOut(300, function() ***REMOVED***
          $(this).remove();
        ***REMOVED***);
      ***REMOVED***, 3000);
    ***REMOVED***)(currAlert);

  ***REMOVED***;


  $(document).ready(function() ***REMOVED***
    var tabs = $('nav li');
    if (window.location.pathname.match('providers')) ***REMOVED***
      console.log('yes providers');
      $(tabs[1]).addClass('active');
    ***REMOVED*** else ***REMOVED***
      console.log('map');
      $(tabs[0]).addClass('active');
    ***REMOVED***
    // Initialize lazy load
    $('.lazy').lazyload(***REMOVED***
      threshold: 0,
      failure_limit: 999,
      effect: 'fadeIn',
      data_attribute_queries: [***REMOVED***
          media: "(max-width: 1600px)",
          data_name: "x-large"
        ***REMOVED***,
        ***REMOVED***
          media: "(max-width: 1200px)",
          data_name: "large"
        ***REMOVED***,
        ***REMOVED***
          media: "(max-width: 900px)",
          data_name: "medium"
        ***REMOVED***,
        ***REMOVED***
          media: "(max-width: 640px)",
          data_name: "small"
        ***REMOVED***,
        ***REMOVED***
          media: "(max-width: 400px)",
          data_name: "x-small"
        ***REMOVED***
      ]
    ***REMOVED***);

    // setting a global data adapter instance
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();
  ***REMOVED***);
***REMOVED***)();

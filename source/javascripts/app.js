//= require _data_adapter
//= require foundation
//= require foundation/foundation.accordion

$(document).foundation();
console.log('test');

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
  $(document).ready(function() ***REMOVED***
    // Initialize lazy load
    $('.lazy').lazyload(***REMOVED***
      threshold : 0,
      failure_limit: 999,
      effect: 'fadeIn',
      data_attribute_queries: [
        ***REMOVED***media: "(max-width: 1600px)", data_name: "x-large"***REMOVED***,
        ***REMOVED***media: "(max-width: 1200px)", data_name: "large"***REMOVED***,
        ***REMOVED***media: "(max-width: 900px)", data_name: "medium"***REMOVED***,
        ***REMOVED***media: "(max-width: 640px)", data_name: "small"***REMOVED***,
        ***REMOVED***media: "(max-width: 400px)", data_name: "x-small"***REMOVED***
      ]
    ***REMOVED***);

    // setting a global data adapter instance
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();
  ***REMOVED***);
***REMOVED***)();

//= require _data_adapter
//=require_tree ./_templates
/* globals DataAdapter, console */

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
  var handleDataFetch = function (response) ***REMOVED***
    console.log(response.length);
    var template = window.JST['_templates/example'];
    var html = template(***REMOVED***my_var: 'Hello!', list: [1, 2, 3, 4]***REMOVED***);
    $('.body').html(html);
  ***REMOVED***;

  $(document).ready(function() ***REMOVED***
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();
    window.dataAdapter.getCoverage17(false, handleDataFetch);
  ***REMOVED***);
***REMOVED***)();

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
  var test = function (response) ***REMOVED***
    console.log(response.length);
  ***REMOVED***;

  $(document).ready(function() ***REMOVED***
    var adapter = window.dataAdapter || DataAdapter.getInstance();
    adapter.getCoverage17(false, test);
  ***REMOVED***);
***REMOVED***)();

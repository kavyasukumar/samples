//= require _data_adapter
//=require_tree ./_templates
/* globals DataAdapter, console */

(function() ***REMOVED***
  var handleDataFetch = function (response) ***REMOVED***
    console.log(response);
    debugger;
    var byState = _.chain(response)
	                  .groupBy(function(resp)***REMOVED*** return resp.state ***REMOVED***)
                    .each(function(val, key, list)***REMOVED***
		                    list[key] = _.groupBy(val, function(v)***REMOVED***
                          return v.county_name;
                        ***REMOVED***)
                      ***REMOVED***)
                    .sortBy(function(val, key)***REMOVED*** return key;***REMOVED***)
                    .value();
    var template = window.JST['_templates/provider_by_state'];
    var html = template(***REMOVED***data: byState***REMOVED***);
    $('.body').html(html);
    $(document).foundation('accordion', 'reflow');
  ***REMOVED***;

  $(document).ready(function() ***REMOVED***
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();
    window.dataAdapter.getCoverage17(false, handleDataFetch);

    window.dataAdapter.getProviderCount17(function(providerCount17)***REMOVED***
      console.log('Here is the provider count for 2017 by fips code');
      console.log(providerCount17);
    ***REMOVED***);
  ***REMOVED***);
***REMOVED***)();

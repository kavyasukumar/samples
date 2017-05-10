//= require _data_adapter
//= require_tree ./_templates
//= require _underscore_mixins
/* globals DataAdapter, console */

(function() ***REMOVED***
  var handleDataFetch = function (response) ***REMOVED***
    var byState = _.chain(response)
	                  .groupBy(function(resp)***REMOVED*** return resp.state ***REMOVED***)
                    .each(function(val, key, list)***REMOVED***
		                    list[key] = _.chain(val)
                                     .groupBy(function(v)***REMOVED***
                                        return v.provider_name;
                                      ***REMOVED***)
                                      .each(function(cnty, pro, arr)***REMOVED***
                                        arr[pro] = _.sortBy(cnty,function(v)***REMOVED*** return v.county_name;***REMOVED***);
                                      ***REMOVED***).value();
                      ***REMOVED***)
                    .sortKeysBy()
                    .value();
    var template = window.JST['_templates/provider_by_state'];
    console.log(byState);
    var html = template(***REMOVED***data: byState***REMOVED***);
    $('.body').html(html);
    $(document).foundation('accordion', 'reflow');
  ***REMOVED***;

  $(document).ready(function() ***REMOVED***
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();
    window.dataAdapter.getCoverage(2017, false, handleDataFetch);

    // window.dataAdapter.getProviderCount(2016, function(providerCount17)***REMOVED***
    //   console.log('Here is the provider count for 2017 by fips code');
    //   console.log(providerCount17);
    // ***REMOVED***);
  ***REMOVED***);
***REMOVED***)();

//= require_tree ./_vendor
//= require _kinto_helper
//= require _vendor_extra/kinto-http

/* globals KINTO_TOKEN, console */


var DataAdapter = (function()***REMOVED***

  // Private properties and methods
  var _kintoBucket, _coverage17Collection;

  var _data = ***REMOVED***
    coverage_2017: ***REMOVED******REMOVED***,
    provider_groups: ***REMOVED******REMOVED***
  ***REMOVED***;
  var init = function()***REMOVED***
    window.localStorage.setItem('kintoToken', KINTO_TOKEN);
     _kintoBucket  = _kintoBucket || window.getKintoBucket('https://voxmedia-kinto.herokuapp.com/v1','vox-aca-dashboard', true);
     _coverage17Collection = _kintoBucket.collection('coverage-2017');
     // myCollection.createRecord(***REMOVED***test:'value'***REMOVED***);
     // myCollection.listRecords().then(function(data) ***REMOVED***console.log(data);***REMOVED***);
  ***REMOVED***;

  var _getCoverageData = function(refresh)***REMOVED***
    if(!refresh && !_.isEmpty(_data.coverage_2017))***REMOVED***
      console.log('data exists');
      console.log(_data.coverage_2017);
      return _data.coverage_2017;
    ***REMOVED***

    _coverage17Collection.listRecords(***REMOVED***
      limit: 1000, pages: Infinity
      ***REMOVED***).then(function(response)***REMOVED***
          _data.coverage_2017 = response.data;
      ***REMOVED***).catch(function(error)***REMOVED***
        console.log(error);
      ***REMOVED***);
  ***REMOVED***;

  //Public properties and methods
  var adapter = ***REMOVED******REMOVED***;

  adapter.getCoverage17 = function(refresh)***REMOVED***
    _getCoverageData(refresh);
  ***REMOVED***;

  adapter.updateCoverage17 = function(records)***REMOVED***
    records.slice(100).each(function(subset)***REMOVED***
      _coverage17Collection.batch(function(batch)***REMOVED***
        for (var i = 0; i <= subset.length; i++)***REMOVED***
          batch.updateRecord(subset[i]);
        ***REMOVED***
      ***REMOVED***).then(function(response)***REMOVED***
        console.log(response);
      ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***;


  // self init
  init();

  return adapter;

***REMOVED***)();

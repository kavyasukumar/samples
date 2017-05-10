//= require _kinto_helper
//= require _vendor_extra/kinto-http

/* globals KINTO_TOKEN, console */


var DataAdapter = (function() ***REMOVED***
  var instance;

  window.localStorage.setItem('kintoToken', KINTO_TOKEN);
  var _kintoBucket = _kintoBucket || window.getKintoBucket('https://voxmedia-kinto.herokuapp.com/v1', 'vox-aca-dashboard', true);

  var init = function() ***REMOVED***

    // Private properties and methods
    var _data = ***REMOVED******REMOVED***,
      _staleBit = ***REMOVED******REMOVED***;
    var _instance = ***REMOVED******REMOVED***;

    //Public properties and methods
    _instance.getCoverage = function(year, refresh, callBackFunction) ***REMOVED***
      var dataKey = 'coverage-' + year;
      if (!refresh && _data[dataKey]) ***REMOVED***
        console.log('data exists');
        callBackFunction.call(this, _data[dataKey]);
      ***REMOVED***

      var collection = _kintoBucket.collection(dataKey);
      _staleBit[dataKey] = false;

      collection.listRecords(***REMOVED***
        limit: 1000,
        pages: Infinity
      ***REMOVED***).then(function(response) ***REMOVED***
        _data[dataKey] = response.data;
        callBackFunction.call(this, response.data);
      ***REMOVED***).catch(function(error) ***REMOVED***
        _staleBit[dataKey] = false;
        console.log(error);
      ***REMOVED***);
    ***REMOVED***;

    _instance.updateCoverage = function(year, records, callBackFunction) ***REMOVED***
      var dataKey = 'coverage-' + year,
        collection = _kintoBucket.collection(dataKey),
        recordCount = records.count,
        processedCount = 0;

      _staleBit[dataKey] = true;

      records.slice(100).each(function(subset) ***REMOVED***
        collection.batch(function(batch) ***REMOVED***
          for (var i = 0; i <= subset.length; i++) ***REMOVED***
            batch.updateRecord(subset[i]);
          ***REMOVED***
        ***REMOVED***).then(function(response) ***REMOVED***
          processedCount += 100;
          if (processedCount >= recordCount) ***REMOVED***
            callBackFunction.call(this);
          ***REMOVED***
        ***REMOVED***).catch(function(error) ***REMOVED***
          console.log(error);
        ***REMOVED***);
      ***REMOVED***);
    ***REMOVED***;

    _instance.getProviderCount = function(year, callBackFunction) ***REMOVED***
      this.getCoverage(year, false, function(coverage) ***REMOVED***
        var response;
        if (year === 2017) ***REMOVED***
          response = _.chain(coverage)
            .where(function(item) ***REMOVED***
              return item.is_active;
            ***REMOVED***)
            .countBy(function(item) ***REMOVED***
              return item.fips_code;
            ***REMOVED***)
            .value();
        ***REMOVED*** else ***REMOVED***
          response = _.chain(coverage)
            .countBy(function(item) ***REMOVED***
              return item.fips_code;
            ***REMOVED***)
            .value();
        ***REMOVED***
        callBackFunction.call(this, response);
      ***REMOVED***);
    ***REMOVED***

    return _instance;
  ***REMOVED***;

  return ***REMOVED***

    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function() ***REMOVED***

      if (!instance) ***REMOVED***
        instance = init();
      ***REMOVED***

      return instance;
    ***REMOVED***

  ***REMOVED***;
***REMOVED***)();

//= require _kinto_helper

/* globals KINTO_TOKEN, console, setTimeout, setInterval, clearInterval, STATE_LOOKUP*/

var DataAdapter = (function() ***REMOVED***
  var instance;
  var db,
    DB_NAME = 'aca-indexedDB',
    DB_VERSION = 1,
    STORES = ['coverage-2017', 'coverage-2017-preview', 'coverage-2016', 'coverage-2015', 'coverage-2014'];

  window.localStorage.setItem('kintoToken', KINTO_TOKEN);
  window.setupKinto(***REMOVED***
    bucket: 'vox-aca-dashboard'
  ***REMOVED***);
  var _kintoBucket = _kintoBucket || window.getKintoBucket();


  // indexedDB helpers
  var openDb = function(callBackFunction) ***REMOVED***
    console.log("opening indexed DB...");
    var req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function(evt) ***REMOVED***
      db = this.result;
      console.log('opened DB');
      callBackFunction.call(this);
    ***REMOVED***;
    req.onerror = function(evt) ***REMOVED***
      console.error("openDb:", evt.target.errorCode);
    ***REMOVED***;

    req.onupgradeneeded = function(evt) ***REMOVED***
      console.log("Upgrading db...");
      for (var i in STORES) ***REMOVED***
        evt.currentTarget.result.createObjectStore(
          STORES[i], ***REMOVED***
            keyPath: 'id'
          ***REMOVED***);
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***;

  var getObjectStore = function(storeName, mode) ***REMOVED***
    var tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  ***REMOVED***;

  var storeObjects = function(storeName, objects, callBackFunction) ***REMOVED***
    var objectStore = getObjectStore(storeName, 'readwrite'),
      count = 0,
      total = objects.length;

    var succesHandler = function() ***REMOVED***
      count++;
      if (count >= total && callBackFunction) ***REMOVED***
        callBackFunction.call(this);
      ***REMOVED***
    ***REMOVED***;

    for (var i in objects) ***REMOVED***
      var request = objectStore.put(objects[i]);
      request.onsuccess = succesHandler;
    ***REMOVED***
  ***REMOVED***;

  var getObjects = function(storeName, success_callback) ***REMOVED***
    var objectStore = getObjectStore(storeName, 'readonly');
    var req = objectStore.getAll();
    req.onsuccess = function(evt) ***REMOVED***
      success_callback(evt.target.result);
    ***REMOVED***;
  ***REMOVED***;

  var clearObjects = function(storeName, callBackFunction) ***REMOVED***
    // open a read/write db transaction, ready for clearing the data
    var transaction = db.transaction([storeName], "readwrite");

    transaction.onerror = function(event) ***REMOVED***
      console.log(event);
    ***REMOVED***;

    // create an object store on the transaction
    var objectStore = transaction.objectStore(storeName);

    // clear all the data out of the object store
    var objectStoreRequest = objectStore.clear();
    objectStoreRequest.onsuccess = function() ***REMOVED***
      callBackFunction();
    ***REMOVED***;
  ***REMOVED***;

  var replaceObjects = function(storeName, objects, callBackFunction) ***REMOVED***
    clearObjects(storeName, function() ***REMOVED***
      storeObjects(storeName, objects, callBackFunction);
    ***REMOVED***);
  ***REMOVED***;

  var countObjects = function(storeName, callBackFunction) ***REMOVED***
    var objectStore = getObjectStore(storeName, 'readonly');
    var req = objectStore.count();
    req.onsuccess = function(evt) ***REMOVED***
      callBackFunction.call(this, evt.target.result);
    ***REMOVED***;
  ***REMOVED***;

  // localStorage helpers
  var setLocalData = function(key, obj) ***REMOVED***
    window.localStorage.setItem('vox-' + key, JSON.stringify(obj));
  ***REMOVED***;

  var getLocalData = function(key) ***REMOVED***
    var val = window.localStorage.getItem('vox-' + key);
    if (val === 'undefined') ***REMOVED***
      return 0;
    ***REMOVED***
    return JSON.parse(val);
  ***REMOVED***;

  // Data helpers
  var hasUpdates = function(dataKey, callBackFunction) ***REMOVED***
    // var lastChecked = getLocalData(dataKey + '-lastCheck');
    // var currTime = Date.now();
    // if(currTime - lastChecked < 60000)***REMOVED***
    //     callBackFunction.call(this, false);
    //     return;
    // ***REMOVED***
    var localLastMod = getLocalData(dataKey + '-last_modified');

    if (!localLastMod) ***REMOVED***
      callBackFunction.call(this, true);
      return;
    ***REMOVED***

    var serverLastMod = null,
      serverTotal = 0;

    _kintoBucket.collection(dataKey).listRecords(***REMOVED***
      since: localLastMod.toString(),
      limit: 1
    ***REMOVED***).then(function(resp) ***REMOVED***
      serverLastMod = resp.last_modified;
      if (serverLastMod > localLastMod) ***REMOVED***
        callBackFunction.call(this, true);
      ***REMOVED*** else ***REMOVED***
        _kintoBucket.collection(dataKey).getTotalRecords()
          .then(function(serverCount) ***REMOVED***
            serverTotal = serverCount;
            countObjects(dataKey, function(count) ***REMOVED***
              var clientTotal = count;
              if (serverTotal !== clientTotal) ***REMOVED***
                callBackFunction.call(this, true);
              ***REMOVED*** else ***REMOVED***
                callBackFunction.call(this, false);
              ***REMOVED***
            ***REMOVED***);
          ***REMOVED***);
      ***REMOVED***
    ***REMOVED***);
  ***REMOVED***;

  var mergeData = function(superset, changeSet) ***REMOVED***
    _.each(changeSet, function(rec) ***REMOVED***
      var idx = _.findIndex(superset, function(d) ***REMOVED***
        return d.id === rec.id;
      ***REMOVED***);
      superset[idx].is_active = rec.is_active;
    ***REMOVED***);
    return superset;
  ***REMOVED***;

  var init = function() ***REMOVED***

    // Private properties and methods
    var _instance = ***REMOVED******REMOVED***,
      _databaseReady = false;

    var updatePreviewIfnull = function functionName() ***REMOVED***

    ***REMOVED***;

    // Public properties and methods
    _instance.getCoverage = function(year, callBackFunction) ***REMOVED***
      var dataKey = 'coverage-' + year;
      hasUpdates(dataKey, function(update) ***REMOVED***
        if (!update) ***REMOVED***
          console.log('data exists');
          getObjects(dataKey, function(resp) ***REMOVED***
            if (year !== 2017) ***REMOVED***
              callBackFunction.call(this, resp);
              return;
            ***REMOVED***
            countObjects(dataKey + '-preview', function(count) ***REMOVED***
              console.log(count);
              if (count === 0) ***REMOVED***
                replaceObjects(dataKey + '-preview', resp);
              ***REMOVED***
              callBackFunction.call(this, resp);
            ***REMOVED***);
          ***REMOVED***);
          return;
        ***REMOVED***
        console.log('Refreshing data...');
        var collection = _kintoBucket.collection(dataKey);

        var states = _.keys(STATE_LOOKUP);
        var handleKintoResp = function(response, index) ***REMOVED***

          storeObjects(dataKey, response.data);

          var currLastMod = getLocalData(dataKey + '-last_modified');
          if (response.last_modified > currLastMod) ***REMOVED***
            setLocalData(dataKey + '-last_modified', response.last_modified);
          ***REMOVED***

          if (index === states.length) ***REMOVED***
            if (year === 2017) ***REMOVED***
              countObjects(dataKey + '-preview', function(count) ***REMOVED***
                if (count === 0) ***REMOVED***
                  storeObjects(dataKey + '-preview', response.data);
                ***REMOVED***
              ***REMOVED***);
            ***REMOVED***
            callBackFunction.call(this, response.data);
          ***REMOVED***
        ***REMOVED***;
        var handleErr = function(error) ***REMOVED***
          console.log(error);
        ***REMOVED***;
        var getRecords = function(ind) ***REMOVED***
          collection.listRecords(***REMOVED***
            filters: ***REMOVED***
              state: states[ind]
            ***REMOVED***,
            limit: 1000,
            pages: Infinity,
            retry: 4
          ***REMOVED***).then(function(resp) ***REMOVED***
            handleKintoResp(resp, ind);
          ***REMOVED***).catch(handleErr);
        ***REMOVED***;
        for (var i in states) ***REMOVED***
          (function(ind) ***REMOVED***
            setTimeout(function() ***REMOVED***
              getRecords(ind);
            ***REMOVED***, ind * 500);
          ***REMOVED***)(i);
        ***REMOVED***
      ***REMOVED***);
    ***REMOVED***;

    _instance.updateCoverage = function(records, callBackFunction) ***REMOVED***
      var dataKey = 'coverage-2017',
        collection = _kintoBucket.collection(dataKey),
        recordCount = records.length,
        processedCount = 0,
        i, j,
        chunk = 100,
        subset = [],
        currData = getLocalData(dataKey);

      currData = mergeData(currData, records);

      var batchUpdateFx = function(batch) ***REMOVED***
        for (var i = 0; i < subset.length; i++) ***REMOVED***
          batch.updateRecord(subset[i], ***REMOVED***
            patch: true
          ***REMOVED***);
        ***REMOVED***
      ***REMOVED***;

      var batchHandleFx = function(response) ***REMOVED***
        var dataKey = 'coverage-2017';
        processedCount += chunk;
        if (processedCount >= recordCount) ***REMOVED***
          replaceObjects(dataKey, response.data);
          replaceObjects(dataKey + '-preview', response.data);
          setLocalData(dataKey + '-last_modified', response.last_modified);
          callBackFunction.call(this);
        ***REMOVED***
      ***REMOVED***;

      var errorHandler = function(error) ***REMOVED***
        console.log(error);
      ***REMOVED***;

      for (i = 0, j = records.length; i < j; i += chunk) ***REMOVED***
        subset = records.slice(i, i + chunk);
        collection.batch(batchUpdateFx)
          .then(batchHandleFx)
          .catch(errorHandler);
      ***REMOVED***
    ***REMOVED***;

    _instance.getProviderCount = function(year, callBackFunction) ***REMOVED***
      this.getCoverage(year, function(coverage) ***REMOVED***
        var response;
        if (year === 2017) ***REMOVED***
          response = _.chain(coverage)
            .where(***REMOVED***
              is_active: true
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
    ***REMOVED***;

    _instance.getPreviewProviderCount = function(callBackFunction) ***REMOVED***
      var rollupFx = function(coverage) ***REMOVED***
        var response = _.chain(coverage)
          .where(***REMOVED***
            is_active: true
          ***REMOVED***)
          .countBy(function(item) ***REMOVED***
            return item.fips_code;
          ***REMOVED***)
          .value();
        callBackFunction.call(this, response);
      ***REMOVED***;
      this.getPreviewCoverage(rollupFx);
    ***REMOVED***;

    _instance.updatePreviewCoverage = function(records) ***REMOVED***
      var dataKey = 'coverage-2017-preview';
      getObjects(dataKey, function(response) ***REMOVED***
        storeObjects(dataKey, mergeData(response, records));
      ***REMOVED***);
    ***REMOVED***;

    _instance.getPreviewCoverage = function(callBackFunction) ***REMOVED***
      getObjects('coverage-2017-preview', function(response) ***REMOVED***
        if (!response.length) ***REMOVED***
          this.dataAdapter.getCoverage(2017, callBackFunction);
          return;
        ***REMOVED***
        callBackFunction.call(this, response);
      ***REMOVED***);
    ***REMOVED***;

    _instance.discardPreviewChanges = function(callBackFunction) ***REMOVED***
      getObjects('coverage-2017', function(response) ***REMOVED***
        replaceObjects('coverage-2017-preview', response, callBackFunction);
      ***REMOVED***);
    ***REMOVED***;

    _instance.ready = function(callBackFunction) ***REMOVED***
      var intervalFx;
      intervalFx = setInterval(function() ***REMOVED***
        console.log('waiting for database...');
        if (_databaseReady) ***REMOVED***
          console.log('database is ready.');
          callBackFunction.call(this);
          clearInterval(intervalFx);
        ***REMOVED***
      ***REMOVED***, 3000);
    ***REMOVED***;


    openDb(function() ***REMOVED***
      _databaseReady = true;
    ***REMOVED***);

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

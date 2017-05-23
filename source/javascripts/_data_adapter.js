//= require _kinto_helper

/* globals KINTO_TOKEN, STATE_LOOKUP*/

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
  var openDb = function() ***REMOVED***
    return new Promise(function(resolve, reject) ***REMOVED***
      console.log("opening indexed DB...");
      var req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onsuccess = function(evt) ***REMOVED***
        db = this.result;
        console.log('opened DB');
        resolve();
      ***REMOVED***;
      req.onerror = function(evt) ***REMOVED***
        console.error("openDb:", evt.target.errorCode);
        reject();
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
    ***REMOVED***);
  ***REMOVED***;

  var getObjectStore = function(storeName, mode) ***REMOVED***
    var tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  ***REMOVED***;

  var storeObject = function(store, obj)***REMOVED***
    return new Promise(function(resolve, reject)***REMOVED***
      var req = store.put(obj);

      req.onsuccess = function()***REMOVED***
        resolve();
      ***REMOVED***;

      req.onerror = function(error)***REMOVED***
        reject(error);
      ***REMOVED***;
    ***REMOVED***);
  ***REMOVED***;

  var storeObjects = function(storeName, objects) ***REMOVED***
    return new Promise(function(resolve,reject)***REMOVED***
      var objectStore = getObjectStore(storeName, 'readwrite'),
          promises = [];

      for (var i in objects) ***REMOVED***
        promises.push(storeObject(objectStore, objects[i]));
      ***REMOVED***

      Promise.all(promises).then(function()***REMOVED***
        resolve();
      ***REMOVED***).catch(function(error)***REMOVED***
        reject(error);
      ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***;

  var getObjects = function(storeName) ***REMOVED***
    return new Promise(function(resolve,reject)***REMOVED***
      var objectStore = getObjectStore(storeName, 'readonly');
      var req = objectStore.getAll();
      req.onsuccess = function(evt) ***REMOVED***
        resolve(evt.target.result);
      ***REMOVED***;
      req.onerror = function(err)***REMOVED***
        resolve(err);
      ***REMOVED***;
    ***REMOVED***);
  ***REMOVED***;

  var countObjects = function(storeName, callBackFunction) ***REMOVED***
    return new Promise(function(resolve,reject)***REMOVED***
      var objectStore = getObjectStore(storeName, 'readonly');
      var req = objectStore.count();
      req.onsuccess = function(evt) ***REMOVED***
        resolve(evt.target.result);
      ***REMOVED***;
      req.onerror = function(err)***REMOVED***
        resolve(err);
      ***REMOVED***;
    ***REMOVED***);
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

  var handleErr = function(error) ***REMOVED***
    window.commonErrorHandler(error);
    window.commonNotificationHandler(error);
  ***REMOVED***;

  var init = function() ***REMOVED***

    // Private properties and methods
    var _instance = ***REMOVED******REMOVED***,
      _databaseReady = false;

    // Public properties and methods
    _instance.getCoverage = function(year) ***REMOVED***
      return new Promise(function(resolve, reject) ***REMOVED***
        try ***REMOVED***
          var dataKey = 'coverage-' + year;
          hasUpdates(dataKey, function(update) ***REMOVED***
            if (!update) ***REMOVED***
              console.log('data exists');
              getObjects(dataKey, function(resp) ***REMOVED***
                if (year !== 2017) ***REMOVED***
                  Promise.resolve(resp);
                ***REMOVED***
                countObjects(dataKey + '-preview', function(count) ***REMOVED***
                  console.log(count);
                  if (count === 0) ***REMOVED***
                    storeObjects(dataKey + '-preview', resp);
                  ***REMOVED***
                  resolve(resp);
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
              if (year === 2017) ***REMOVED***
                storeObjects(dataKey + '-preview', response.data);
              ***REMOVED***
              if (parseInt(index) === states.length - 1) ***REMOVED***
                console.log('going to resolve');
                resolve(response.data);
              ***REMOVED***
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
              ***REMOVED***).catch(function(err) ***REMOVED***
                handleErr(err);
                reject(err);
              ***REMOVED***);
            ***REMOVED***;

            var fetchState = function(ind) ***REMOVED***
              setTimeout(function() ***REMOVED***
                getRecords(ind);
              ***REMOVED***, ind * 500);
            ***REMOVED***;
            for (var i in states) ***REMOVED***
              fetchState(i);
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED*** catch (ex) ***REMOVED***
          console.log('error');
          reject(ex);
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
        storeObjects(dataKey, response.data);
        storeObjects(dataKey + '-preview', response.data);
        setLocalData(dataKey + '-last_modified', response.last_modified);
        callBackFunction.call(this);
      ***REMOVED***
    ***REMOVED***;

    for (i = 0, j = records.length; i < j; i += chunk) ***REMOVED***
      subset = records.slice(i, i + chunk);
      collection.batch(batchUpdateFx)
        .then(batchHandleFx)
        .catch(handleErr);
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

  _instance.getPreviewCoverage = function() ***REMOVED***
    return new Promise(function(resolve, reject)***REMOVED***
      getObjects('coverage-2017-preview', function(response) ***REMOVED***
        if (!response.length) ***REMOVED***
          this.dataAdapter.getCoverage(2017).then(function(resp)***REMOVED***
            resolve(resp);
          ***REMOVED***);
          return;
        ***REMOVED***
        resolve(response);
      ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***;

  _instance.discardPreviewChanges = function(callBackFunction) ***REMOVED***
    getObjects('coverage-2017', function(response) ***REMOVED***
      storeObjects('coverage-2017-preview', response, callBackFunction);
    ***REMOVED***);
  ***REMOVED***;

  _instance.ready = function() ***REMOVED***
    return openDb();
  ***REMOVED***;

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

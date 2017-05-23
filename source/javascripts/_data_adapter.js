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

  var countObjects = function(storeName) ***REMOVED***
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
  var hasUpdates = function(dataKey) ***REMOVED***
    return new Promise(function(resolve, reject) ***REMOVED***
      var localLastMod = getLocalData(dataKey + '-last_modified');

      if (!localLastMod) ***REMOVED***
        resolve(true);
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
          resolve(true);
        ***REMOVED*** else ***REMOVED***
          _kintoBucket.collection(dataKey).getTotalRecords()
            .then(function(serverCount) ***REMOVED***
              serverTotal = serverCount;
              countObjects(dataKey).then(function(count) ***REMOVED***
                var clientTotal = count;
                if (serverTotal !== clientTotal) ***REMOVED***
                  resolve(true);
                ***REMOVED*** else ***REMOVED***
                  resolve(false);
                ***REMOVED***
              ***REMOVED***);
            ***REMOVED***).catch(function(err)***REMOVED***
              reject(err);
            ***REMOVED***);
        ***REMOVED***
      ***REMOVED***).catch(function(err)***REMOVED***
        reject(err);
      ***REMOVED***);
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
          debugger;
          var dataKey = 'coverage-' + year;

          hasUpdates(dataKey).then(function(update) ***REMOVED***
            if (!update) ***REMOVED***
              console.log('data exists');
              getObjects(dataKey).then(function(resp) ***REMOVED***
                if (year === 2017) ***REMOVED***
                countObjects(dataKey + '-preview')
                  .then(function(count) ***REMOVED***
                    if (count === 0) ***REMOVED***
                      console.log('Storing data in preview');
                      storeObjects(dataKey + '-preview', resp);
                    ***REMOVED***
                  ***REMOVED***);
                ***REMOVED***
                resolve(resp);
              ***REMOVED***);
              return;
            ***REMOVED***
            console.log('Refreshing data...');
            var collection = _kintoBucket.collection(dataKey);

            var states = _.keys(STATE_LOOKUP),
                promises = [];

            var handleKintoResp = function(responses) ***REMOVED***
              var currLastMod = getLocalData(dataKey + '-last_modified'),
                  unifiedResp = [];
              for (var i in responses)***REMOVED***
                var response = responses[i];
                unifiedResp = _.union(unifiedResp, response.data);
                storeObjects(dataKey, response.data);

                if (year === 2017) ***REMOVED***
                  storeObjects(dataKey + '-preview', response.data);
                ***REMOVED***

                if (response.last_modified > currLastMod) ***REMOVED***
                  currLastMod = response.last_modified
                  setLocalData(dataKey + '-last_modified', currLastMod);
                ***REMOVED***
              ***REMOVED***
              resolve(unifiedResp);
            ***REMOVED***

            var fetchState = function(ind) ***REMOVED***
              setTimeout(function() ***REMOVED***
                promises.push(collection.listRecords(***REMOVED***
                  filters: ***REMOVED***
                    state: states[ind]
                  ***REMOVED***,
                  limit: 1000,
                  pages: Infinity,
                  retry: 4
                ***REMOVED***));
                if(parseInt(ind) === states.length - 1)***REMOVED***
                  Promise.all(promises)
                    .then(handleKintoResp)
                    .catch(function(err) ***REMOVED***
                      handleErr(err);
                      reject(err);
                    ***REMOVED***);
                ***REMOVED***
              ***REMOVED***, ind * 300);
            ***REMOVED***;

            for (var i in states) ***REMOVED***
              fetchState(i);
            ***REMOVED***
          ***REMOVED***);
        ***REMOVED*** catch (err) ***REMOVED***
          handleErr(err);
          reject(err);
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

  _instance.getProviderCount = function(year) ***REMOVED***
      // promise binding needs some rethinking
      var thisObj = this;
      return new Promise(function(resolve, reject) ***REMOVED***
        thisObj.getCoverage(year).then(function(coverage) ***REMOVED***
          console.log('getting provider count...');
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
          resolve(response);
        ***REMOVED***).catch(function(err)***REMOVED***
          handleErr(err);
          reject(err);
        ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***;

  _instance.getPreviewProviderCount = function() ***REMOVED***
    var thisObj = this;
    return new Promise(function(resolve, reject)***REMOVED***
      var rollupFx = function(coverage) ***REMOVED***
        try***REMOVED***
          var response = _.chain(coverage)
            .where(***REMOVED***
              is_active: true
            ***REMOVED***)
            .countBy(function(item) ***REMOVED***
              return item.fips_code;
            ***REMOVED***)
            .value();
          resolve(response);
        ***REMOVED*** catch (err)***REMOVED***
          handleErr(err);
          reject(err);
        ***REMOVED***
      ***REMOVED***;
      thisObj.getPreviewCoverage()
        .then(rollupFx)
        .catch(function(err)***REMOVED***
          handleErr(err);
          reject(err);
        ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***;

  _instance.updatePreviewCoverage = function(records) ***REMOVED***
    return new Promise(function(resolve, reject)***REMOVED***
      var dataKey = 'coverage-2017-preview';
      getObjects(dataKey).then(function(response) ***REMOVED***
        storeObjects(dataKey, mergeData(response, records)).then(function()***REMOVED***
          resolve();
        ***REMOVED***);
      ***REMOVED***).catch(function(err)***REMOVED***
        handleErr(err);
        reject(err);
      ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***;

  _instance.getPreviewCoverage = function() ***REMOVED***
    return new Promise(function(resolve, reject)***REMOVED***
      getObjects('coverage-2017-preview').then(function(response) ***REMOVED***
        if (!response.length) ***REMOVED***
          this.dataAdapter.getCoverage(2017).then(function(resp)***REMOVED***
            resolve(resp);
          ***REMOVED***).catch(function(err)***REMOVED***
            handleErr(err);
            reject(err);
          ***REMOVED***);
          return;
        ***REMOVED***
        resolve(response);
      ***REMOVED***).catch(function(err)***REMOVED***
        handleErr(err);
        reject(err);
      ***REMOVED***);
    ***REMOVED***);
  ***REMOVED***;

  _instance.discardPreviewChanges = function() ***REMOVED***
    return new Promise(function(resolve, reject)***REMOVED***
    getObjects('coverage-2017').then(function(response) ***REMOVED***
      storeObjects('coverage-2017-preview', response)
        .then(function()***REMOVED***
          resolve();
        ***REMOVED***)
        .catch(function(err)***REMOVED***
          handleErr(err);
          reject(err);
        ***REMOVED***);
    ***REMOVED***).catch(function(err)***REMOVED***
      handleErr(err);
      reject(err);
    ***REMOVED***);
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

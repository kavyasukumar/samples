//= require _kinto_helper
//= require _vendor_extra/kinto-http

/* globals KINTO_TOKEN, console */

 var dummy = [***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48317","is_active":true,"county_name":"Martin County","provider_id":33602,"provider_name":"Blue Cross and Blue Shield of Texas","id":"63402604-33c2-4758-8455-5d0a3872c373","last_modified":1494403630494***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48317","is_active":true,"county_name":"Martin County","provider_id":63509,"provider_name":"Allegian Health Plans","id":"6bc6ee01-a11e-4c2b-bc66-9d17cdfb6fdb","last_modified":1494403630447***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48317","is_active":true,"county_name":"Martin County","provider_id":91716,"provider_name":"Aetna","id":"2c8b5acb-778b-4193-b19d-bce080ea24ce","last_modified":1494403630419***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48315","is_active":true,"county_name":"Marion County","provider_id":37392,"provider_name":"Prominence Health Plan","id":"114915ba-ddc0-4fba-92e6-5145acee152f","last_modified":1494403630391***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48315","is_active":true,"county_name":"Marion County","provider_id":33602,"provider_name":"Blue Cross and Blue Shield of Texas","id":"72a80e5c-f4eb-4b92-bdfa-f0a7ddc2854d","last_modified":1494403630371***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48315","is_active":true,"county_name":"Marion County","provider_id":63509,"provider_name":"Allegian Health Plans","id":"2a228fc0-6195-4364-b89c-974382ab6d2b","last_modified":1494403630353***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48313","is_active":true,"county_name":"Madison County","provider_id":40788,"provider_name":"Scott and White Health Plan","id":"3dbce557-9d92-4cc1-9dd6-89497efd48b5","last_modified":1494403630318***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48313","is_active":true,"county_name":"Madison County","provider_id":37392,"provider_name":"Prominence Health Plan","id":"2dcb96dc-0379-49dd-9bb4-b25e27d943e2","last_modified":1494403630286***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48313","is_active":true,"county_name":"Madison County","provider_id":37755,"provider_name":"Insurance Company of Scott & White","id":"266a8ae2-61f2-4e23-8cab-1abba13f8ed5","last_modified":1494403630257***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48313","is_active":true,"county_name":"Madison County","provider_id":33602,"provider_name":"Blue Cross and Blue Shield of Texas","id":"e00b9131-3470-451e-9ece-a9de2584840f","last_modified":1494403630233***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48313","is_active":true,"county_name":"Madison County","provider_id":63509,"provider_name":"Allegian Health Plans","id":"27f05bcb-3591-452e-8593-be1a45f9bb23","last_modified":1494403630214***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48313","is_active":true,"county_name":"Madison County","provider_id":91716,"provider_name":"Aetna","id":"32d55cfb-0cca-425a-9f4b-99833cd87765","last_modified":1494403630190***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48305","is_active":true,"county_name":"Lynn County","provider_id":37392,"provider_name":"Prominence Health Plan","id":"cd087267-3c58-49bc-8c84-9d0f30758233","last_modified":1494403630169***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48305","is_active":true,"county_name":"Lynn County","provider_id":26539,"provider_name":"FirstCare Health Plans","id":"9e301a69-c533-4ded-acd0-99da26330bda","last_modified":1494403630149***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48305","is_active":true,"county_name":"Lynn County","provider_id":33602,"provider_name":"Blue Cross and Blue Shield of Texas","id":"f19d32d9-e46b-48a6-ae5b-74f18fb41f7e","last_modified":1494403630127***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48305","is_active":true,"county_name":"Lynn County","provider_id":63509,"provider_name":"Allegian Health Plans","id":"3b87e870-5783-41d5-8782-acf24df48648","last_modified":1494403630108***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48303","is_active":true,"county_name":"Lubbock County","provider_id":26539,"provider_name":"FirstCare Health Plans","id":"36aff90c-ba70-4a5d-b447-08a772435b1b","last_modified":1494403630083***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48303","is_active":true,"county_name":"Lubbock County","provider_id":33602,"provider_name":"Blue Cross and Blue Shield of Texas","id":"913b09c9-aa3d-4f62-bebe-194ae9d05811","last_modified":1494403630049***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48301","is_active":true,"county_name":"Loving County","provider_id":37392,"provider_name":"Prominence Health Plan","id":"ceb3498a-3a96-4ee3-8893-6d740f498e99","last_modified":1494403630016***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48301","is_active":true,"county_name":"Loving County","provider_id":26539,"provider_name":"FirstCare Health Plans","id":"bd6a2175-b27c-4312-af3a-6adb39b69d75","last_modified":1494403629983***REMOVED***,***REMOVED***"state":"TX","schema":1494402713398,"fips_code":"48211","is_active":true,"county_name":"Hemphill County","provider_id":63509,"provider_name":"Allegian Health Plans","id":"3fae099c-70ba-4594-8a19-fad545c81f3e","last_modified":1494403622122***REMOVED***];


var DataAdapter = (function() ***REMOVED***
  var instance;
  var db,
      DB_NAME = 'aca-indexedDB',
      DB_VERSION = 1,
      STORES = ['coverage-2017', 'coverage-2017-preview', 'coverage-2016','coverage-2015','coverage-2014'];

  window.localStorage.setItem('kintoToken', KINTO_TOKEN);
  var _kintoBucket = _kintoBucket || window.getKintoBucket('https://voxmedia-kinto.herokuapp.com/v1', 'vox-aca-dashboard', true);

  var openDb = function() ***REMOVED***
    console.log("openDb ...");
    var req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function (evt) ***REMOVED***
      db = this.result;
      console.log("openDb DONE");
    ***REMOVED***;
    req.onerror = function (evt) ***REMOVED***
      console.error("openDb:", evt.target.errorCode);
    ***REMOVED***;

    req.onupgradeneeded = function (evt) ***REMOVED***
      console.log("openDb.onupgradeneeded");
      for (var i in STORES)***REMOVED***
        evt.currentTarget.result.createObjectStore(
         STORES[i], ***REMOVED*** keyPath: 'id' ***REMOVED***);
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***;

  var getObjectStore = function(storeName, mode) ***REMOVED***
    var tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  ***REMOVED***;

  var storeObjects = function(storeName, objects)***REMOVED***
    var transaction = db.transaction([storeName], "readwrite");
    var objectStore = transaction.objectStore(storeName);
      for (var i in objects) ***REMOVED***
        var request = objectStore.add(objects[i]);
        request.onsuccess = function(event) ***REMOVED***
          // event.target.result == customerData[i].ssn;
        ***REMOVED***;
      ***REMOVED***
  ***REMOVED***;


  var getObjects = function(storeName, success_callback) ***REMOVED***
   var transaction = db.transaction([storeName], "readwrite");
   var objectStore = transaction.objectStore(storeName);
   var req = objectStore.getAll();
   req.onsuccess = function(evt) ***REMOVED***
     debugger;
     success_callback(evt.target.result);
   ***REMOVED***;
  ***REMOVED***;

  var clearObjects = function(storeName, callBackFunction) ***REMOVED***
    // open a read/write db transaction, ready for clearing the data
    var transaction = db.transaction([storeName], "readwrite");

    // report on the success of opening the transaction
    transaction.oncomplete = function(event) ***REMOVED***
      callBackFunction.call(this,event);
    ***REMOVED***;

    transaction.onerror = function(event) ***REMOVED***
      console.log(event);
    ***REMOVED***;

    // create an object store on the transaction
    var objectStore = transaction.objectStore(storeName);

    // clear all the data out of the object store
    var objectStoreRequest = objectStore.clear();
  ***REMOVED***;

  var setLocalData = function(key, obj)***REMOVED***
    window.localStorage.setItem('vox-' + key, JSON.stringify(obj));
  ***REMOVED***;

  var getLocalData = function(key)***REMOVED***
    return JSON.parse(window.localStorage.getItem('vox-' + key));
  ***REMOVED***;

  var hasUpdates = function(dataKey, callBackFunction)***REMOVED***
    var localLastMod = getLocalData(dataKey + '-last_modified');

    if(!localLastMod)***REMOVED***
      callBackFunction.call(this,true);
      return;
    ***REMOVED***

    var serverLastMod = null;
    _kintoBucket.collection(dataKey).listRecords(***REMOVED***
              since: localLastMod.toString(),
              limit: 1
            ***REMOVED***).then(function(resp)***REMOVED***
                serverLastMod = resp.last_modified;
                if(serverLastMod > localLastMod)***REMOVED***
                  callBackFunction.call(this,true);
                ***REMOVED*** else***REMOVED***
                    callBackFunction.call(this,false);
                ***REMOVED***
              ***REMOVED***);
  ***REMOVED***;

  var mergeData = function(superset, changeSet)***REMOVED***
    _.each(changeSet, function(rec)***REMOVED***
      var idx = _.findIndex(superset, function(d)***REMOVED***
        return d.id === rec.id;***REMOVED***);
      superset[idx].is_active = rec.is_active;
    ***REMOVED***);
    return superset;
  ***REMOVED***;

  var init = function() ***REMOVED***

    // Private properties and methods
    var _data = ***REMOVED******REMOVED***,
      _staleBit = ***REMOVED******REMOVED***;
    var _instance = ***REMOVED******REMOVED***;

    openDb();


    // Public properties and methods
    _instance.getCoverage = function(year, callBackFunction) ***REMOVED***
      // callBackFunction.call(this, dummy);
      // return;
      var dataKey = 'coverage-' + year;
      hasUpdates(dataKey, function(update)***REMOVED***
        if (!update) ***REMOVED***
          console.log('data exists');
          getObjects(dataKey, callBackFunction);
          return;
        ***REMOVED***

        var collection = _kintoBucket.collection(dataKey);

        collection.listRecords(***REMOVED***
          limit: 1000,
          pages: Infinity
        ***REMOVED***).then(function(response) ***REMOVED***
          storeObjects(dataKey, response.data);
          storeObjects(dataKey + '-preview', response.data);
          setLocalData(dataKey + '-last_modified', response.last_modified);
          callBackFunction.call(this, response.data);
        ***REMOVED***).catch(function(error) ***REMOVED***
          console.log(error);
        ***REMOVED***);
      ***REMOVED***);
    ***REMOVED***;

    _instance.updateCoverage = function(records, callBackFunction) ***REMOVED***
      var dataKey = 'coverage-2017',
        collection = _kintoBucket.collection(dataKey),
        recordCount = records.length,
        processedCount = 0,
        i,j,
        chunk = 100,
        subset = [],
        currData = getLocalData(dataKey);

      currData = mergeData(currData, records);

      var batchUpdateFx = function(batch) ***REMOVED***
        console.log('in batchUpdateFx');
        for (var i = 0; i < subset.length; i++) ***REMOVED***
          batch.updateRecord(subset[i], ***REMOVED*** patch: true ***REMOVED***);
        ***REMOVED***
      ***REMOVED***;

      var batchHandleFx = function(response) ***REMOVED***
        console.log('in batchHandleFx');
        processedCount += chunk;
        if (processedCount >= recordCount) ***REMOVED***
          setLocalData('coverage-2017', currData);
          setLocalData('coverage-2017-preview', currData);
          setLocalData('coverage-2017-last_modified',
                        response[0].body.data.last_modified);
          callBackFunction.call(this);
        ***REMOVED***
      ***REMOVED***;

      var errorHandler = function(error) ***REMOVED***
        console.log(error);
      ***REMOVED***;

      for (i=0,j=records.length; i<j; i+=chunk) ***REMOVED***
        subset = records.slice(i,i+chunk);
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
            .where(***REMOVED***is_active: true***REMOVED***)
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
      var data = getLocalData('coverage-2017-preview');

      var rollupFx = function(coverage) ***REMOVED***
        var response = _.chain(coverage)
          .where(***REMOVED***is_active: true***REMOVED***)
          .countBy(function(item) ***REMOVED***
            return item.fips_code;
          ***REMOVED***)
          .value();
        callBackFunction.call(this, response);
      ***REMOVED***;

      if(!data)***REMOVED***
        this.getCoverage(2017, rollupFx);
      ***REMOVED*** else***REMOVED***
        rollupFx(data);
      ***REMOVED***
    ***REMOVED***;

    _instance.updateCoveragePreview = function(records)***REMOVED***
      var dataKey = 'coverage-2017-preview',
        currData = getLocalData(dataKey);
      currData = mergeData(currData, records);
      setLocalData('coverage-2017-preview', currData);
    ***REMOVED***;

    _instance.getPreviewCoverageSync = function()***REMOVED***
      return getLocalData('coverage-2017-preview');
    ***REMOVED***;

    _instance.getPreviewCoverage = function(callBackFunction)***REMOVED***
      var data = getLocalData('coverage-2017-preview');

      if(data)***REMOVED***
        callBackFunction.call(data);
        return;
      ***REMOVED***

      this.getCoverage(2017, function(response)***REMOVED***
        setLocalData('coverage-2017-preview', response);
        callBackFunction.call(response);
      ***REMOVED***);
    ***REMOVED***;

    _instance.discardPreviewChanges = function(callBackFunction)***REMOVED***
      clearObjects('coverage-2017-preview', callBackFunction);
      getObjects('coverage-2017', function(response)***REMOVED***
        storeObjects('coverage-2017-preview', response);
      ***REMOVED***)
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

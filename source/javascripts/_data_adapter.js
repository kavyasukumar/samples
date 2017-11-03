//= require _kinto_helper

/* globals KINTO_TOKEN, STATE_LOOKUP*/

var DataAdapter = (function() {
  var instance;
  var db,
    isDataStale = false,
    DB_NAME = 'aca-indexedDB',
    DB_VERSION = 1,
    STORES = ['coverage-2017', 'coverage-2017-preview', 'coverage-2016', 'coverage-2015', 'coverage-2014'];

  window.localStorage.setItem('kintoToken', KINTO_TOKEN);
  window.setupKinto({
    bucket: 'vox-aca-dashboard'
  });
  var _kintoBucket = _kintoBucket || window.getKintoBucket();


  // indexedDB helpers
  var openDb = function() {
    return new Promise(function(resolve, reject) {
      console.log("opening indexed DB...");
      var req = window.indexedDB.open(DB_NAME, DB_VERSION);
      req.onsuccess = function(evt) {
        db = this.result;
        console.log('opened DB');
        resolve();
      };
      req.onerror = function(evt) {
        console.error("openDb:", evt.target.errorCode);
        reject();
      };
      req.onupgradeneeded = function(evt) {
        console.log("Upgrading db...");
        for (var i in STORES) {
          evt.currentTarget.result.createObjectStore(
            STORES[i], {
              keyPath: 'id'
            });
        }
      };
    });
  };

  var getObjectStore = function(storeName, mode) {
    var tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  };

  var storeObject = function(store, obj) {
    return new Promise(function(resolve, reject) {
      var req = store.put(obj);

      req.onsuccess = function() {
        resolve();
      };

      req.onerror = function(error) {
        reject(error);
      };
    });
  };

  var storeObjects = function(storeName, objects) {
    return new Promise(function(resolve, reject) {
      var objectStore = getObjectStore(storeName, 'readwrite'),
        promises = [];

      for (var i in objects) {
        promises.push(storeObject(objectStore, objects[i]));
      }

      Promise.all(promises).then(function() {
        resolve();
      }).catch(function(error) {
        reject(error);
      });
    });
  };

  var clearObjects = function(storeName) {
    return new Promise(function(resolve, reject) {
      var objectStore = getObjectStore(storeName, 'readwrite');
      var req = objectStore.clear();
      req.onsuccess = function(evt) {
        resolve();
      };
      req.onerror = function(err) {
        reject(err);
      };
    });
  };

  var replaceObjects = function(storeName, objects) {
    return new Promise(function(resolve, reject) {
      clearObjects(storeName).then(function() {
        storeObjects(storeName, objects)
          .then(resolve)
          .catch(function(err) {
            window.commonErrorHandler(err);
            reject(err);
          });
      });
    });
  };

  var getObjects = function(storeName) {
    return new Promise(function(resolve, reject) {
      var objectStore = getObjectStore(storeName, 'readonly');
      var req = objectStore.getAll();
      req.onsuccess = function(evt) {
        resolve(evt.target.result);
      };
      req.onerror = function(err) {
        reject(err);
      };
    });
  };

  var countObjects = function(storeName) {
    return new Promise(function(resolve, reject) {
      var objectStore = getObjectStore(storeName, 'readonly');
      var req = objectStore.count();
      req.onsuccess = function(evt) {
        resolve(evt.target.result);
      };
      req.onerror = function(err) {
        resolve(err);
      };
    });
  };

  // localStorage helpers
  var setLocalData = function(key, obj) {
    window.localStorage.setItem('vox-' + key, JSON.stringify(obj));
  };

  var getLocalData = function(key) {
    var val = window.localStorage.getItem('vox-' + key);
    if (val === 'undefined') {
      return 0;
    }
    return JSON.parse(val);
  };

  // Data helpers
  var hasUpdates = function(dataKey) {
    return new Promise(function(resolve, reject) {
      if (isDataStale) {
        resolve(true);
        return;
      }
      var localLastMod = getLocalData(dataKey + '-last_modified');

      if (!localLastMod) {
        resolve(true);
        return;
      }

      var serverLastMod = null,
        serverTotal = 0;

      _kintoBucket.collection(dataKey).listRecords({
        since: localLastMod.toString(),
        limit: 1
      }).then(function(resp) {
        serverLastMod = resp.last_modified;
        if (serverLastMod > localLastMod) {
          resolve(true);
        } else {
          _kintoBucket.collection(dataKey).getTotalRecords()
            .then(function(serverCount) {
              serverTotal = serverCount;
              countObjects(dataKey).then(function(count) {
                var clientTotal = count;
                if (serverTotal !== clientTotal) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              });
            }).catch(function(err) {
              reject(err);
            });
        }
      }).catch(function(err) {
        reject(err);
      });
    });
  };

  var mergeData = function(superset, changeSet) {
    _.each(changeSet, function(rec) {
      var idx = _.findIndex(superset, function(d) {
        return d.id === rec.id;
      });
      superset[idx].is_active = rec.is_active;
    });
    return superset;
  };

  var init = function() {

    // Private properties and methods
    var _instance = {},
      _databaseReady = false;

    // Public properties and methods
    _instance.getCoverage = function(year) {
      return new Promise(function(resolve, reject) {
        try {
          var dataKey = 'coverage-' + year;

          hasUpdates(dataKey).then(function(update) {
            if (!update) {
              console.log('data exists');
              getObjects(dataKey).then(function(resp) {
                if (parseInt(year) === 2017) {
                  countObjects(dataKey + '-preview')
                    .then(function(count) {
                      if (count === 0) {
                        console.log('Storing data in preview');
                        storeObjects(dataKey + '-preview', resp);
                      }
                    });
                }
                resolve(resp);
              });
              return;
            }
            console.log('Refreshing data...');
            var collection = _kintoBucket.collection(dataKey);

            var states = _.keys(STATE_LOOKUP),
              promises = [];

            var handleKintoResp = function(responses) {
              var currLastMod = getLocalData(dataKey + '-last_modified'),
                unifiedResp = [];
              clearObjects(dataKey).then(function() {
                for (var i in responses) {
                  var response = responses[i];
                  unifiedResp = _.union(unifiedResp, response.data);
                  storeObjects(dataKey, response.data);

                  if (response.last_modified > currLastMod) {
                    currLastMod = response.last_modified;
                    setLocalData(dataKey + '-last_modified', currLastMod);
                  }
                }
                if (parseInt(year) === 2017) {
                  countObjects(dataKey + '-preview')
                    .then(function(count) {
                      if (count !== 0) {
                        var msg = 'Newer version of data found. Discarded old data to avoid conflicts';
                        window.commonNotificationHandler(msg, 'warning');
                      }
                    });
                  replaceObjects(dataKey + '-preview', unifiedResp).then(function() {
                    isDataStale = false;
                    resolve(unifiedResp);
                  }).catch(function(err) {
                    window.commonErrorHandler(err);
                    reject(err);
                  });
                } else {
                  isDataStale = false;
                  resolve(unifiedResp);
                }
              });
            };

            var fetchState = function(ind) {
              setTimeout(function() {
                promises.push(collection.listRecords({
                  filters: {
                    state: states[ind]
                  },
                  limit: 1000,
                  pages: Infinity,
                  retry: 4
                }));
                if (parseInt(ind) === states.length - 1) {
                  Promise.all(promises)
                    .then(handleKintoResp)
                    .catch(function(err) {
                      window.commonErrorHandler(err);
                      reject(err);
                    });
                }
              }, ind * 300);
            };

            for (var i in states) {
              fetchState(i);
            }
          }).catch(function(err) {
            window.commonErrorHandler(err);
            reject(err);
          });
        } catch (err) {
          window.commonErrorHandler(err);
          reject(err);
        }
      });
    };

    _instance.addCoverage = function(records){
      return new Promise(function(resolve, reject) {
        var dataKey = 'coverage-2017',
          collection = _kintoBucket.collection(dataKey),
          recordCount = records.length,
          chunk = 100,
          subset = [],
          promises = [];

        var batchCreateFx = function(batch) {
          for (var i = 0; i < subset.length; i++) {
            batch.createRecord(subset[i]);
          }
        };

        var batchErrHandle = function(err) {
          window.commonErrorHandler(err);
          reject(err);
        };

        var batchHandleFx = function(responses) {
          try {
            var dataKey = 'coverage-2017',
              currLastMod = getLocalData(dataKey + '-last_modified'),
              unifiedResp = [];
            for (var i in responses[0]) {
              var response = responses[0][i];
              unifiedResp.push(response.body.data);
              var myLastMod = response.headers.ETag.replace(/"/g, "");
              if (myLastMod > currLastMod) {
                currLastMod = myLastMod;
                setLocalData(dataKey + '-last_modified', currLastMod);
              }
            }
            storeObjects(dataKey, unifiedResp)
              .catch(batchErrHandle);
            storeObjects(dataKey + '-preview', unifiedResp)
              .catch(batchErrHandle);
            resolve();
          } catch (err) {
            batchErrHandle(err);
          }
        };

        for (var i = 0; i < records.length; i += chunk) {
          subset = records.slice(i, i + chunk);
          promises.push(collection.batch(batchCreateFx));
          if (i >= records.length - chunk) {
            Promise.all(promises)
              .then(batchHandleFx)
              .catch(batchErrHandle);
          }
        }
      });
    };

    _instance.updateCoverage = function(records) {
      return new Promise(function(resolve, reject) {
        var dataKey = 'coverage-2017',
          collection = _kintoBucket.collection(dataKey),
          recordCount = records.length,
          chunk = 100,
          subset = [],
          promises = [];

        var batchUpdateFx = function(batch) {
          for (var i = 0; i < subset.length; i++) {
            batch.updateRecord(subset[i], {
              patch: true
            });
          }
        };

        var batchErrHandle = function(err) {
          window.commonErrorHandler(err);
          reject(err);
        };

        var batchHandleFx = function(responses) {
          try {
            var dataKey = 'coverage-2017',
              currLastMod = getLocalData(dataKey + '-last_modified'),
              unifiedResp = [];
            for (var i in responses[0]) {
              var response = responses[0][i];
              unifiedResp.push(response.body.data);
              var myLastMod = response.headers.ETag.replace(/"/g, "");
              if (myLastMod > currLastMod) {
                currLastMod = myLastMod;
                setLocalData(dataKey + '-last_modified', currLastMod);
              }
            }
            storeObjects(dataKey, unifiedResp)
              .catch(batchErrHandle);
            storeObjects(dataKey + '-preview', unifiedResp)
              .catch(batchErrHandle);
            resolve();
          } catch (err) {
            batchErrHandle(err);
          }
        };

        for (var i = 0; i < records.length; i += chunk) {
          subset = records.slice(i, i + chunk);
          promises.push(collection.batch(batchUpdateFx));
          if (i >= records.length - chunk) {
            Promise.all(promises)
              .then(batchHandleFx)
              .catch(batchErrHandle);
          }
        }
      });
    };

    _instance.getProviderCount = function(year) {
      // promise binding needs some rethinking
      var thisObj = this;
      return new Promise(function(resolve, reject) {
        thisObj.getCoverage(year).then(function(coverage) {
          console.log('getting provider count...');
          var response;
          if (parseInt(year) === 2017) {
            response = _.chain(coverage)
              .where({
                is_active: true
              })
              .countBy(function(item) {
                return item.fips_code;
              })
              .value();
          } else {
            response = _.chain(coverage)
              .countBy(function(item) {
                return item.fips_code;
              })
              .value();
          }
          resolve(response);
        }).catch(function(err) {
          window.commonErrorHandler(err);
          reject(err);
        });
      });
    };

    _instance.getPreviewProviderCount = function() {
      var thisObj = this;
      return new Promise(function(resolve, reject) {
        var rollupFx = function(coverage) {
          try {
            var response = _.chain(coverage)
              .where({
                is_active: true
              })
              .countBy(function(item) {
                return item.fips_code;
              })
              .value();
            resolve(response);
          } catch (err) {
            window.commonErrorHandler(err);
            reject(err);
          }
        };
        thisObj.getPreviewCoverage()
          .then(rollupFx)
          .catch(function(err) {
            window.commonErrorHandler(err);
            reject(err);
          });
      });
    };

    _instance.updatePreviewCoverage = function(records) {
      return new Promise(function(resolve, reject) {
        var dataKey = 'coverage-2017-preview';
        getObjects(dataKey).then(function(response) {
          storeObjects(dataKey, mergeData(response, records)).then(function() {
            resolve();
          });
        }).catch(function(err) {
          window.commonErrorHandler(err);
          reject(err);
        });
      });
    };

    _instance.getPreviewCoverage = function() {
      return new Promise(function(resolve, reject) {
        if (isDataStale) {
          this.dataAdapter.getCoverage(2017).then(resolve);
          return;
        }
        getObjects('coverage-2017-preview').then(function(response) {
          if (!response.length) {
            this.dataAdapter.getCoverage(2017).then(resolve);
            return;
          }
          resolve(response);
        }).catch(function(err) {
          window.commonErrorHandler(err);
          reject(err);
        });
      });
    };

    _instance.discardPreviewChanges = function() {
      return new Promise(function(resolve, reject) {
        clearObjects('coverage-2017-preview')
          .then(resolve)
          .catch(function(err) {
            window.commonErrorHandler(err);
            reject(err);
          });
      });
    };

    _instance.ready = function() {
      return new Promise(function(resolve, reject) {
        openDb().then(function() {
          hasUpdates('coverage-2017').then(function(update) {
            isDataStale = update;
            resolve();
          });
        }).catch(function(err) {
          window.commonErrorHandler(err);
          reject(err);
        });
      });
    };

    return _instance;
  };

  return {

    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function() {

      if (!instance) {
        instance = init();
      }

      return instance;
    }

  };
})();

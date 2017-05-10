_.mixin(***REMOVED***
    'sortKeysBy': function (obj, comparator) ***REMOVED***
        var keys = _.sortBy(_.keys(obj), function (key) ***REMOVED***
            return comparator ? comparator(obj[key], key) : key;
        ***REMOVED***);

        return _.object(keys, _.map(keys, function (key) ***REMOVED***
            return obj[key];
        ***REMOVED***));
    ***REMOVED***
***REMOVED***);

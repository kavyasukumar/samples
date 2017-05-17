//= require _data_adapter
//= require_tree ./_templates
//= require _underscore_mixins

/* globals DataAdapter, console */

(function() ***REMOVED***
  var parameterize = function(input)***REMOVED***
    return input.toLowerCase()
                .replace(/\[|\]|\(|\)|\***REMOVED***|\***REMOVED***|\\|\/|\.|\&/g, '')
                .replace(/\s/g, '-');
  ***REMOVED***;

  var beforeSave = function()***REMOVED***
    $('a.submit').text('saving...');
    saveChanges();
  ***REMOVED***;

  var handleDataFetch = function (response) ***REMOVED***
      var byProvider = _.chain(response)
	                  .groupBy(function(resp)***REMOVED*** return resp.provider_name ***REMOVED***)
                    .each(function(val, key, list)***REMOVED***
		                    list[key] = _.chain(val)
                                     .groupBy(function(v)***REMOVED***
                                        return v.state;
                                      ***REMOVED***)
                                      .each(function(cnty, pro, arr)***REMOVED***
                                        arr[pro] = _.sortBy(cnty,function(v)***REMOVED*** return v.county_name;***REMOVED***);
                                      ***REMOVED***).value();
                      ***REMOVED***)
                    .sortKeysBy()
                    .value();

    var template = window.JST['_templates/provider_by_state'];
    var html = template(***REMOVED***data: byProvider, parameterize: parameterize***REMOVED***);
    $('.body').html(html);
    $(document).foundation('accordion', 'reflow');
    $('.state-toggle').on('change', handleStateToggle);
    $('.county-toggle').on('change', handleCountyToggle);
    $('a.submit').on('click', beforeSave);
  ***REMOVED***;

  var handleStateToggle = function()***REMOVED***
    var id = $(this).attr('id'),
        targetClass = '.' + id + '-input',
        val = $(this).prop('checked');
    $(targetClass).prop('checked', val);
  ***REMOVED***;

  var handleCountyToggle = function() ***REMOVED***
    var siblingTogglesClass = '.' + $(this).attr('class').replace(' ','.'),
        checkedState = _.some($(siblingTogglesClass),
                                function(el)***REMOVED***
                                  return $(el).prop('checked');
                                ***REMOVED***),
        stateToggle = '#' + $(this).data('stateToggleId');

    $(stateToggle).prop('checked', checkedState);
  ***REMOVED***;

  var afterSave = function()***REMOVED***
    $('a.submit').text('saved');
    console.log('aftersave');
  ***REMOVED***;

  var saveChanges = function()***REMOVED***
    var changedRecords = [];
    window.dataAdapter.getCoverage(2017, false, function(response)***REMOVED***
      _.each(response, function(record)***REMOVED***
        var id = '#' + record.id,
            is_active = record.is_active,
            is_checked =  $(id).prop('checked');

        if (is_active !== is_checked)***REMOVED***
          var newRecord = ***REMOVED***id : record.id, is_active : is_checked***REMOVED***;
          changedRecords.push(newRecord);
        ***REMOVED***
      ***REMOVED***);
      window.dataAdapter.updateCoverage(2017, changedRecords, afterSave);
    ***REMOVED***);
  ***REMOVED***;

  $(document).ready(function() ***REMOVED***
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();
    window.dataAdapter.getCoverage(2017, false, handleDataFetch);
  ***REMOVED***);
***REMOVED***)();

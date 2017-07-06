//= require _data_adapter
//= require _underscore_mixins
//= require_tree ./_templates

(function() ***REMOVED***
  var handleCreateStateSelector = function() ***REMOVED***
    var selectedState = $(this).find(":selected").attr('value').toUpperCase();
    var template = window.JST['_templates/county_selector'];
    var html = template(***REMOVED***
      counties: _.sortBy(COUNTIES_BY_STATE[selectedState],
                         function(d)***REMOVED*** return d.county_name;***REMOVED***)
    ***REMOVED***);
    $(this).siblings('.countySelector').html(html).show();
  ***REMOVED***;

  var showLoadingSplash = function(msg) ***REMOVED***
    $('#createForm').stop().fadeOut(500, function() ***REMOVED***
      $('#load-msg').html('Publishing...');
      $('#loading-animation')
        .stop()
        .css('opacity', '1')
        .show();

      console.log('done showing');
    ***REMOVED***);
  ***REMOVED***;

  var hideLoadingSplash = function(msg) ***REMOVED***
    $('#loading-animation').stop().fadeOut(500, function() ***REMOVED***
      $('#provider-dash')
        .stop()
        .css('opacity', '1')
        .show();
      console.log('done hiding');
    ***REMOVED***);
  ***REMOVED***;

  var saveChanges = function() ***REMOVED***
    var newRecords = [];
    var postSave = function() ***REMOVED***
      var msg = 'Added new data.';
      window.commonNotificationHandler(msg, 'success');
      window.location.href = window.location.href
        .replace('/newrecord',
          '/providers');
    ***REMOVED***;
    var rows = $('.datarow');
    for (var i = 0; i < rows.length; i++) ***REMOVED***
      var rec = ***REMOVED***
        "state": $(rows[i]).children('.newStateSelector')
          .find(':selected').attr('value').toUpperCase(),
        "market": "on_market",
        "fips_code": $(rows[i]).children('.countySelector')
          .find(':selected').attr('value'),
        "is_active": true,
        "county_name": $(rows[i]).children('.countySelector')
          .find(':selected').text(),
        "provider_id": 0, // we are not using this field yet
        "provider_name": $(rows[i]).find('input')[0].value
      ***REMOVED***;
      if (rec['state'] === 'allstates' || !rec.fips_code || rec.provider_name.length === 0) ***REMOVED***
        $(rows[i]).addClass('errored');
        window.commonNotificationHandler('invalid data', 'alert');
        return;
      ***REMOVED***
      newRecords.push(rec);
    ***REMOVED***

    if (newRecords.length === 0) ***REMOVED***
      window.commonNotificationHandler('There are no changes to publish', 'warning');
      return;
    ***REMOVED***
    showLoadingSplash();
    window.dataAdapter.addCoverage(newRecords)
      .then(postSave)
      .catch(window.commonErrorHandler);
  ***REMOVED***;

  var removeRow = function() ***REMOVED***
    $(this).parent().remove();
  ***REMOVED***;

  var addRow = function() ***REMOVED***
    var template = window.JST['_templates/provider_row'];
    var html = template();
    $('#createForm').append(html);
    $('.newStateSelector')
      .off('change')
      .on('change', handleCreateStateSelector);
    $('.remove').off('click').on('click', removeRow);
  ***REMOVED***;

  var wireEvents = function() ***REMOVED***
    addRow();
    hideLoadingSplash();
    $('.saveRecord').on('click', saveChanges);
    $('.add').on('click', addRow);
  ***REMOVED***;

  $(document).ready(function() ***REMOVED***
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();
    window.dataAdapter.ready()
      .then(wireEvents)
      .catch(window.commonErrorHandler);

  ***REMOVED***);
***REMOVED***)();

//= require _data_adapter
//= require _underscore_mixins
//= require_tree ./_templates

(function() {
  var handleCreateStateSelector = function() {
    var selectedState = $(this).find(":selected").attr('value').toUpperCase();
    var template = window.JST['_templates/county_selector'];
    var html = template({
      counties: _.sortBy(COUNTIES_BY_STATE[selectedState],
                         function(d){ return d.county_name;})
    });
    $(this).siblings('.countySelector').html(html).show();
  };

  var showLoadingSplash = function(msg) {
    $('#createForm').stop().fadeOut(500, function() {
      $('#load-msg').html('Publishing...');
      $('#loading-animation')
        .stop()
        .css('opacity', '1')
        .show();

      console.log('done showing');
    });
  };

  var hideLoadingSplash = function(msg) {
    $('#loading-animation').stop().fadeOut(500, function() {
      $('#provider-dash')
        .stop()
        .css('opacity', '1')
        .show();
      console.log('done hiding');
    });
  };

  var saveChanges = function() {
    var newRecords = [];
    var postSave = function() {
      var msg = 'Added new data.';
      window.commonNotificationHandler(msg, 'success');
      window.location.href = window.location.href
        .replace('/newrecord',
          '/providers');
    };
    var rows = $('.datarow');
    for (var i = 0; i < rows.length; i++) {
      var rec = {
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
      };
      if (rec['state'] === 'allstates' || !rec.fips_code || rec.provider_name.length === 0) {
        $(rows[i]).addClass('errored');
        window.commonNotificationHandler('invalid data', 'alert');
        return;
      }
      newRecords.push(rec);
    }

    if (newRecords.length === 0) {
      window.commonNotificationHandler('There are no changes to publish', 'warning');
      return;
    }
    showLoadingSplash();
    window.dataAdapter.addCoverage(newRecords)
      .then(postSave)
      .catch(window.commonErrorHandler);
  };

  var removeRow = function() {
    $(this).parent().remove();
  };

  var addRow = function() {
    var template = window.JST['_templates/provider_row'];
    var html = template();
    $('#createForm').append(html);
    $('.newStateSelector')
      .off('change')
      .on('change', handleCreateStateSelector);
    $('.remove').off('click').on('click', removeRow);
  };

  var wireEvents = function() {
    addRow();
    hideLoadingSplash();
    $('.saveRecord').on('click', saveChanges);
    $('.add').on('click', addRow);
  };

  $(document).ready(function() {
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();
    window.dataAdapter.ready()
      .then(wireEvents)
      .catch(window.commonErrorHandler);

  });
})();

//= require _data_adapter
//= require_tree ./_templates
//= require _underscore_mixins

/* globals DataAdapter, console */

(function() ***REMOVED***
  var wireEvents;
  
  var parameterize = function(input)***REMOVED***
    return input.toLowerCase()
                .replace(/\[|\]|\(|\)|\***REMOVED***|\***REMOVED***|\\|\/|\.|\,|\&/g, '')
                .replace(/\s/g, '-');
  ***REMOVED***;

  var disableSaveButton = function(state)***REMOVED***
    if(state)***REMOVED***
      $('a.submit').addClass('disabled', state);
    ***REMOVED*** else ***REMOVED***
      $('a.submit').removeClass('disabled', state);
    ***REMOVED***
  ***REMOVED***;

  var disablePreviewButton = function(state)***REMOVED***
    if(state)***REMOVED***
      $('a.preview').addClass('disabled', state);
    ***REMOVED*** else ***REMOVED***
      $('a.preview').removeClass('disabled', state);
    ***REMOVED***
  ***REMOVED***;

  var disableButtons = function(state)***REMOVED***
    disablePreviewButton(state);
    disableSaveButton(state);
  ***REMOVED***;

  var afterSave = function()***REMOVED***
    $('a.submit').text('Publish');
  ***REMOVED***;

  var saveChanges = function(isPreview)***REMOVED***
    var changedRecords = [];
    window.dataAdapter.getCoverage(2017, function(response)***REMOVED***
      if(isPreview)***REMOVED***
        response = window.dataAdapter.getPreviewCoverage();
      ***REMOVED***
      _.each(response, function(record)***REMOVED***
        var id = '#' + record.id,
            is_active = record.is_active,
            is_checked =  $(id).prop('checked');

        if (is_active !== is_checked)***REMOVED***
          var newRecord = ***REMOVED***id : record.id, is_active : is_checked***REMOVED***;
          changedRecords.push(newRecord);
        ***REMOVED***
      ***REMOVED***);

      if(changedRecords.length === 0)***REMOVED***
        afterSave();
        return;
      ***REMOVED***

      if(isPreview)***REMOVED***
        disablePreviewButton(true);
        window.dataAdapter.updateCoveragePreview(changedRecords);
        return;
      ***REMOVED***

      window.dataAdapter.updateCoverage(changedRecords, afterSave);
    ***REMOVED***);
  ***REMOVED***;

  var beforeSave = function()***REMOVED***
    if($(this).hasClass('disabled'))***REMOVED***
      return;
    ***REMOVED***
    var preview = $(this).hasClass('preview');
    if(!preview)***REMOVED***
      $('a.submit').text('publising...');
      disableButtons(true);
    ***REMOVED*** else ***REMOVED***
      disablePreviewButton(true);
    ***REMOVED***
    saveChanges(preview);
  ***REMOVED***;

  var handleDataFetch = function (response) ***REMOVED***
      var byProvider = _.chain(response)
	                  .groupBy(function(resp)***REMOVED*** return resp.provider_name; ***REMOVED***)
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
    wireEvents();
  ***REMOVED***;

  var handleStateToggle = function()***REMOVED***
    var id = $(this).attr('id'),
        targetClass = '.' + id + '-input',
        val = $(this).prop('checked');
    $(targetClass).prop('checked', val);
    disableButtons(false);
  ***REMOVED***;

  var handleCountyToggle = function() ***REMOVED***
    var siblingTogglesClass = '.' + $(this).attr('class').replace(' ','.'),
        checkedState = _.some($(siblingTogglesClass),
                                function(el)***REMOVED***
                                  return $(el).prop('checked');
                                ***REMOVED***),
        stateToggle = '#' + $(this).data('stateToggleId');

    $(stateToggle).prop('checked', checkedState);
    disableButtons(false);
  ***REMOVED***;

  wireEvents = function()***REMOVED***
    $('.state-toggle').on('change', handleStateToggle);
    $('.county-toggle').on('change', handleCountyToggle);
    $('a.submit').on('click', beforeSave);
    $('a.preview').on('click', beforeSave);
  ***REMOVED***;

  $(document).ready(function() ***REMOVED***
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();
    window.dataAdapter.getCoverage(2017, handleDataFetch);
  ***REMOVED***);
***REMOVED***)();

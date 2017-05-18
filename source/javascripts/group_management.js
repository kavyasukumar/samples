//= require _data_adapter
//= require_tree ./_templates
//= require _underscore_mixins

/* globals DataAdapter, console, setTimeout */

(function() ***REMOVED***
  var wireEvents; // declaring upfront for linting happiness

  var alertFx = function(text, level)***REMOVED***
    $('.alert-box').removeClass('success')
                   .removeClass('info')
                   .removeClass('warning')
                   .removeClass('error')
                   .addClass(level)
                   .html(text)
                   .fadeOut()
                   .removeClass('hidden')
                   .fadeIn();
     setTimeout(function()***REMOVED***
       $('.alert-box').fadeOut(300, function()***REMOVED***
          $('.alert-box').addClass('hidden');
       ***REMOVED***);
     ***REMOVED***, 2000);
  ***REMOVED***

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
    $('a.submit').text('Save & Publish');
  ***REMOVED***;

  var saveChanges = function(isPreview)***REMOVED***
    var changedRecords = [];
    window.dataAdapter.getCoverage(2017, function(response)***REMOVED***
      if(isPreview)***REMOVED***
        response = window.dataAdapter.getPreviewCoverageSync();
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
        var word = isPreview ? 'save' : 'publish';
        alertFx('There are no changes to' + word, 'warning');
        return;
      ***REMOVED***

      if(isPreview)***REMOVED***
        disablePreviewButton(true);
        alertFx('Saved data. You may have unpublished changes', 'success');
        window.dataAdapter.updateCoveragePreview(changedRecords);
        return;
      ***REMOVED***

      window.dataAdapter.updateCoverage(changedRecords, afterSave);
      alertFx('Published data.', 'success');
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

  var discardChanges = function()***REMOVED***
    window.dataAdapter.discardPreviewChanges(function()***REMOVED***
      alertFx('Unpublished changes have been deleted', 'info');
    ***REMOVED***);
  ***REMOVED***;

  var filterResults = function()***REMOVED***
    var q = $(this)[0].value;
    _.each($('ul.accordion'), function(el)***REMOVED***
   var substrRegex = new RegExp(q, 'i');
     var provider  = $(el).find('a').text();
     if (substrRegex.test(provider))***REMOVED***
          $(el).children('li').removeClass('active');
			    $(el).removeClass('hide');
       ***REMOVED*** else ***REMOVED***
           $(el).addClass('hide');
       ***REMOVED***
  ***REMOVED***);
  ***REMOVED***;

  wireEvents = function()***REMOVED***
    $('.state-toggle').on('change', handleStateToggle);
    $('.county-toggle').on('change', handleCountyToggle);
    $('a.submit').on('click', beforeSave);
    $('a.preview').on('click', beforeSave);
    $('a.discard').on('click', discardChanges);
    $('.search').on('keyup', filterResults);
  ***REMOVED***;

  $(document).ready(function() ***REMOVED***
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();
    window.dataAdapter.getCoverage(2017, handleDataFetch);
  ***REMOVED***);
***REMOVED***)();

//= require _data_adapter
//= require _underscore_mixins

/* globals DataAdapter, console, setTimeout */

(function() ***REMOVED***
  var wireEvents; // declaring upfront for linting happiness

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
    var handleChanges = function(response)***REMOVED***
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
        window.commonNotificationHandler('There are no changes to' + word, 'warning');
        return;
      ***REMOVED***

      if(isPreview)***REMOVED***
        disablePreviewButton(true);
        window.dataAdapter.updatePreviewCoverage(changedRecords)
          .then(function()***REMOVED***
            window.commonNotificationHandler('Saved data. You may have unpublished changes', 'success');
          ***REMOVED***);
        return;
      ***REMOVED***
      window.dataAdapter.updateCoverage(changedRecords)
        .then(function()***REMOVED***
          afterSave();
          window.commonNotificationHandler('Published data.', 'success');
        ***REMOVED***);
    ***REMOVED***;

    if(isPreview)***REMOVED***
      window.dataAdapter.getPreviewCoverage().then(handleChanges);
    ***REMOVED*** else ***REMOVED***
      window.dataAdapter.getCoverage(2017).then(handleChanges);
    ***REMOVED***
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
    console.log('refreshing display...');
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
    $('#provider-dash').html(html).show();
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
    $('#provider-dash').hide();
    window.dataAdapter.discardPreviewChanges()
      .then(function()***REMOVED***
        window.commonNotificationHandler('Unpublished changes have been deleted', 'info');
        window.dataAdapter.getPreviewCoverage().then(handleDataFetch);
      ***REMOVED***);
  ***REMOVED***;

  var filterResults = function()***REMOVED***
    var q = $(this)[0].value;
    console.log(q);
    _.each($('ul.accordion'), function(el)***REMOVED***
   var substrRegex = new RegExp(q, 'i');
     var provider  = $(el).find('a').text();
     if (substrRegex.test(provider))***REMOVED***
          $(el).children('li').removeClass('active');
			    $(el).removeClass('provider-hide');
       ***REMOVED*** else ***REMOVED***
           $(el).addClass('provider-hide');
       ***REMOVED***
  ***REMOVED***);
  ***REMOVED***;

  var filterState = function()***REMOVED***
    var selectedState = $(this).find(":selected").attr('value');
    $('.accordion-allstates').addClass('state-hide');
    $('.table-allstates').addClass('hide');
    $('.accordion-' + selectedState).removeClass('state-hide');
    $('.table-' + selectedState).removeClass('hide');
  ***REMOVED***;

  var wireOneTimeEvents = function()***REMOVED***
    $('a.submit').on('click', beforeSave);
    $('a.preview').on('click', beforeSave);
    $('a.discard').on('click', discardChanges);
    $('#stateSelector').on('change', filterState);
  ***REMOVED***;

  wireEvents = function()***REMOVED***
    $('.state-toggle').on('change', handleStateToggle);
    $('.county-toggle').on('change', handleCountyToggle);

    $('.search').on('keyup', _.debounce(filterResults, 500));
  ***REMOVED***;

  $(document).ready(function() ***REMOVED***
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();
    window.dataAdapter.ready()
      .then(function()***REMOVED***
        console.log('database is ready');
        window.dataAdapter.getPreviewCoverage().then(handleDataFetch);
      ***REMOVED***);
    wireOneTimeEvents();
  ***REMOVED***);
***REMOVED***)();

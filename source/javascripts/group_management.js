//= require _data_adapter
//= require _underscore_mixins

(function() {
  var wireEvents; // declaring upfront for linting happiness

  var parameterize = function(input) {
    return input.toLowerCase()
      .replace(/\[|\]|\(|\)|\{|\}|\\|\/|\.|\,|\'|\"|\&/g, '')
      .replace(/\s/g, '-');
  };

  var handleErrors = function(err) {
    window.commonNotificationHandler(err, 'alert');
    $('article').html("<p class='error row'><span>An error occurred. Try again later.</span></p>");
  };

  var disableSaveButton = function(state) {
    if (state) {
      $('a.submit').addClass('disabled', state);
    } else {
      $('a.submit').removeClass('disabled', state);
    }
  };

  var disablePreviewButton = function(state) {
    if (state) {
      $('a.preview').addClass('disabled', state);
    } else {
      $('a.preview').removeClass('disabled', state);
    }
  };

  var disableButtons = function(state) {
    disablePreviewButton(state);
    disableSaveButton(state);
  };

  var showLoadingSplash = function(msg) {
    $('#provider-dash').stop().fadeOut(500, function() {
      $('#load-msg').html(msg);
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

  var afterSave = function() {
    $('a.submit').text('Save & Publish');
    hideLoadingSplash();
    disableButtons(false);
  };

  var saveChanges = function(isPreview) {
    var changedRecords = [];
    var postSave = function() {
      afterSave();
      var previewMsg = 'Saved data temporarily. Publish the changes to update permanently.',
        pubMsg = 'Published data.',
        msg = isPreview ? previewMsg : pubMsg;
      window.commonNotificationHandler(msg, 'success');
    };
    var handleChanges = function(response) {
      _.each(response, function(record) {
        var id = '#' + record.id,
          is_active = record.is_active,
          is_checked = $(id).prop('checked');

        if (is_active !== is_checked) {
          var newRecord = {
            id: record.id,
            is_active: is_checked
          };
          changedRecords.push(newRecord);
        }
      });

      if (changedRecords.length === 0) {
        afterSave();
        var word = isPreview ? 'save' : 'publish';
        window.commonNotificationHandler('There are no changes to ' + word, 'warning');
        return;
      }

      if (isPreview) {
        window.dataAdapter.updatePreviewCoverage(changedRecords)
          .then(postSave)
          .catch(handleErrors);
      } else {
        window.dataAdapter.updateCoverage(changedRecords)
          .then(postSave)
          .catch(handleErrors);
      }
    };

    if (isPreview) {
      window.dataAdapter.getPreviewCoverage()
        .then(handleChanges)
        .catch(handleErrors);
    } else {
      window.dataAdapter.getCoverage(2017)
        .then(handleChanges)
        .catch(handleErrors);
    }
  };

  var beforeSave = function() {
    var preview = $(this).hasClass('preview');
    disableButtons(true);
    if (!preview) {
      showLoadingSplash('Publishing changes...');
      $('a.submit').text('publishing...');
    } else {
      showLoadingSplash('Saving changes locally...');
    }
    saveChanges(preview);
  };

  var handleDataFetch = function(response) {
    console.log('refreshing display...');
    hideLoadingSplash();
    var byProvider = _.chain(response)
      .groupBy(function(resp) {
        return resp.provider_name;
      })
      .each(function(val, key, list) {
        list[key] = _.chain(val)
          .groupBy(function(v) {
            return v.state;
          })
          .each(function(cnty, pro, arr) {
            arr[pro] = _.sortBy(cnty, function(v) {
              return v.county_name;
            });
          }).value();
      })
      .sortKeysBy()
      .value();

    var template = window.JST['_templates/provider_by_state'];
    var html = template({
      data: byProvider,
      parameterize: parameterize
    });
    $('#provider-dash').html(html).show();
    $(document).foundation('accordion', 'reflow');
    wireEvents();
  };

  var handleStateToggle = function() {
    var id = $(this).attr('id'),
      targetClass = '.' + id + '-input',
      val = $(this).prop('checked');
    $(targetClass).prop('checked', val);
  };

  var handleCountyToggle = function() {
    var siblingTogglesClass = '.' + $(this).attr('class').replace(' ', '.'),
      checkedState = _.some($(siblingTogglesClass),
        function(el) {
          return $(el).prop('checked');
        }),
      stateToggle = '#' + $(this).data('stateToggleId');

    $(stateToggle).prop('checked', checkedState);
  };

  var discardChanges = function() {
    showLoadingSplash('Discarding local changes...');
    window.dataAdapter.discardPreviewChanges()
      .then(function() {
        window.commonNotificationHandler('Unpublished changes have been deleted', 'success');
        window.dataAdapter.getPreviewCoverage()
          .then(handleDataFetch)
          .catch(handleErrors);
      }).catch(handleErrors);
  };

  var filterResults = function() {
    $('#search-err-msg').hide();
    var q = $(this)[0].value,
        matched = false;
    _.each($('ul.accordion'), function(el) {
      var substrRegex = new RegExp(q, 'i');
      var provider = $(el).find('a').text();
      if (substrRegex.test(provider)) {
        matched = true;
        $(el).children('li').removeClass('active');
        $(el).removeClass('provider-hide');
      } else {
        $(el).addClass('provider-hide');
      }
    });
    if(!matched){
      $('#search-err-msg').show();
    }
  };

  var filterState = function() {
    var selectedState = $(this).find(":selected").attr('value');
    $('.accordion-allstates').addClass('state-hide');
    $('.table-allstates').addClass('hide');
    $('.accordion-' + selectedState).removeClass('state-hide');
    $('.table-' + selectedState).removeClass('hide');
  };

  var scrollHandler = function() {
    if ($(window).scrollTop() > $('#provider-dash').offset().top) {
      var left = $('#intro h2').offset().left + 'px';
      $('#buttonBar').addClass('sticky').css('left', left);
    } else {
      $('#buttonBar').removeClass('sticky');
    }
  };

  var wireOneTimeEvents = function() {
    $('a.submit').on('click', beforeSave);
    $('a.preview').on('click', beforeSave);
    $('a.discard').on('click', discardChanges);
    $('#stateSelector').on('change', filterState);
    $(window).scroll(_.throttle(scrollHandler, 200));
  };

  wireEvents = function() {
    $('.state-toggle').on('change', handleStateToggle);
    $('.county-toggle').on('change', handleCountyToggle);

    $('.search').on('keyup', _.debounce(filterResults, 500));
  };

  $(document).ready(function() {
    window.dataAdapter = window.dataAdapter || DataAdapter.getInstance();
    window.dataAdapter.ready()
      .then(function() {
        console.log('database is ready');
        window.dataAdapter.getPreviewCoverage()
          .then(handleDataFetch)
          .catch(handleErrors);
        $('#controls').show();
      }).catch(handleErrors);
    wireOneTimeEvents();
    scrollHandler();
  });
})();

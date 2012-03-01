// $Id: friendconnect.admin.js,v 1.2 2010/01/20 02:10:42 davereid Exp $

(function ($) {

Drupal.behaviors.friendConnectFieldsetSummaries = {
  attach: function (context) {
    $('fieldset#edit-friendconnect-comments', context).setSummary(function (context) {
      if ($('#edit-friendconnect-comments-enabled').attr('checked')) {
        return Drupal.t('Enabled');
      }
      else {
        return Drupal.t('Disabled');
      }
    });
    $('fieldset#edit-friendconnect-socialbar', context).setSummary(function (context) {
      if ($('#edit-friendconnect-socialbar-enabled').attr('checked')) {
        return Drupal.t('Enabled');
      }
      else {
        return Drupal.t('Disabled');
      }
    });
  }
};

Drupal.behaviors.friendconnectColor = function (context) {
  if (!$('#gfc_color_picker').size()) {
    return;
  }

  var f = $.farbtastic('#gfc_color_picker');
  var p = $('#gfc_color_picker').css('opacity', 0.25);
  var selected;
  $('.color')
    .each(function () { f.linkTo(this); $(this).css('opacity', 0.75); $(this).parent().find('label').addClass('color-label'); })
    .focus(function() {
      f.linkTo(this);
      p.css('opacity', 1);
    });
};

})(jQuery);

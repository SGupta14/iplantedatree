
/**
 * Fetches the new page and puts it inline.
 *
 * @param form_id   - The id of the form whose action should be updated.
 * @param id   - The element id whose contents will get replaced.
 * @param url - The URL for the new page.
 * @param page  - The page number to request.
 */
function fetchPage(form_id, id, url, page) {
  $("body").css({'opacity': 0.5});
  $("#avatar-selection-loading").show();
  $.get(url, {page: page}, function(data, status) {
    var selects = $(data).find(id);
    $(id).html(selects);
    var pager = $(data).find(".avatar-selection-pager-nav");
    $(".avatar-selection-pager-nav").html(pager);
    Drupal.attachBehaviors(data);
    var action = url + "?page="+page;
    $(form_id).attr("action", action);
    $("#avatar-selection-loading").hide();
    $("body").css({'opacity': 1});
  });
  return false;
}

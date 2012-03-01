// $Id: friendconnect.js,v 1.9 2010/01/20 02:10:42 davereid Exp $

(function ($) {

/**
 * User not authenticated with Google Friend Connect.
 */
FC_RenderNoLogin = function () {
  var img_url = Drupal.settings.friendconnect['parent_url'] + 'unknown.png';
  var image = '<img align="left" src="' + img_url + '" />';
  var name = '&nbsp;&nbsp;' + Drupal.t('Hi Visitor!');

  var code = 'Drupal.settings.friendconnect[\'user_login_click\'] = 1;';
  code += 'google.friendconnect.requestSignIn();';
  var login = '&nbsp;&nbsp;' + '<a href="javascript:' + code + '">' + Drupal.t('Login') + '</a>';

  $('#friendconnect_display').html(image + name + '<br />' + login);
};

/**
 * User not authenticated with Google Friend Connect.
 */
FC_RenderNoLogin_Fancy = function () {
  var code = 'Drupal.settings.friendconnect[\'user_login_click\'] = 1;';
  code += 'google.friendconnect.requestSignIn();';
  google.friendconnect.renderSignInButton({
    id: 'friendconnect_display',
    text: Drupal.t('Join this site'),
    style: 'long'
  });

  var div = '<div onclick="javascript:' + code + '"' + $('#friendconnect_display').html() + '</div>';
  $('#friendconnect_display').html(div);
};

/**
 * User successfully tried authenticating with Google Friend Connect.
 */
FC_RenderFirstLogin = function (id, name, image) {
  // This induces a page refresh, to update other user-customized sections of
  // the web page including those from other Drupal modules.
  var joiner = Drupal.settings.friendconnect['clean_url'] ? '&' : '?';
  window.location = Drupal.settings.friendconnect['join_url'] + joiner
      + 'fcname=' + name + '&fcid=' + id + '&fcimage=' + image
      + '&fcto=' + Drupal.settings.friendconnect['current_url'];
};

/**
 * User authenticated by Friend Connect, but no local user login detected.
 */
FC_RenderConnectLogin = function (id, name, image) {
  var image_link = '<img align="left" src="' + image + '"></img>';
  var greeting = '&nbsp;&nbsp;' + Drupal.t('Hi @name!', {'@name': name});

  var code = 'FC_RenderFirstLogin(\'' + id + '\', \'' + name + '\', \'' + image + '\');';
  var connect = '&nbsp;&nbsp;' + '<a href="javascript:' + code + '">Quick Connect</a>';

  var code = 'google.friendconnect.requestSettings();';
  var settings = '&nbsp;&nbsp;' + '<a href="javascript:' + code + '">Settings</a>';

  var code = 'google.friendconnect.requestSignOut();';
  var logout = '&nbsp;' + '<a href="javascript:' + code + '">' + Drupal.t('Logout') + '</a>';

  $('#friendconnect_display').html(image_link + greeting + '<br>' + connect + '<br>' + settings + ',' + logout);
};

/**
 * User authenticated by Friend Connect, but no local user login detected.
 */
FC_RenderConnectLogin_Fancy = function (id, name, image) {
  var code = 'FC_RenderFirstLogin(\'' + id + '\', \'' + name + '\', \'' + image + '\');';
  google.friendconnect.renderSignInButton({
    id: 'friendconnect_display',
    text: Drupal.t('Join this site'),
    style: 'long'
  });

  var div = '<div onclick="javascript:' + code + '"' + $('#friendconnect_display').html() + '</div>';
  $('#friendconnect_display').html(div);
};


/**
 * User authenticated by Friend Connect, but invalid local user login detected.
 */
FC_RenderBadLogin = function (id, name, image) {
  $('#friendconnect_display').parent().hide();
};


/**
 * User authenticated by Friend Connect, and valid local user login detected.
 */
FC_RenderGoodLogin = function (id, name, image) {
  var image_link = '<img align="left" src="' + image + '"></img>';
  var greeting = '&nbsp;&nbsp;' + Drupal.t('Hi ') + name + '!';

  var code = 'google.friendconnect.requestInvite();';
  var invite = '&nbsp;&nbsp;' + '<a href="javascript:' + code
      + '">' + Drupal.t('Invite Friends') + '</a>';

  var code = 'google.friendconnect.requestSettings();';
  var settings = '&nbsp;&nbsp;' + '<a href="javascript:' + code
      + '">' + Drupal.t('Settings') + '</a>';

  var code = 'google.friendconnect.requestSignOut(); return true;';
  var logout = '&nbsp;' + '<a href="'
      + Drupal.settings.friendconnect['logout_url'] + '" onclick="javascript:'
      + code + '">Logout</a>';

  document.getElementById('friendconnect_display').innerHTML
      = image_link + greeting + '<br>' + invite + '<br>'
        + settings + ',' + logout;
};


/**
 * Render profile information for the current viewer (site visitor).
 *
 * State machine for the different views:
 *   FC_NO + DRUPAL_NO = FC_RenderNoLogin/FC_RenderNoLogin_Fancy
 *   FC_NO + DRUPAL_OK = FC_RenderNoLogin (eventual error, no link support yet)
 *   FC_OK + USERCLICK_OK = FC_RenderFirstLogin
 *   FC_OK + DRUPAL_NO = FC_RenderConnectLogin_Fancy
 *   FC_OK + DRUPAL_OK + MAP_NO = FC_RenderBadLogin
 *   FC_OK + DRUPAL_OK + MAP_OK = FC_RenderGoodLogin
 */
FC_RenderFriendConnect = function (data) {
  var viewer = data.get('viewer').getData();

  // user not logged in
  if (!viewer) {
    FC_RenderNoLogin_Fancy();
    return;
  }

  var id = viewer.getField('id');
  var name = viewer.getField('displayName');
  var image = viewer.getField('thumbnailUrl');

  // user login state change => NO to YES transition
  if (Drupal.settings.friendconnect['user_login_click'] == 1) {
    FC_RenderFirstLogin(id, name, image);
    return;
  }

  // logged into Google, but not into site
  if (Drupal.settings.friendconnect['current_uid'] == '0') {
    FC_RenderConnectLogin_Fancy(id, name, image);
    return;
  }

  // logged into Google, but some other unmapped account locally
  if (Drupal.settings.friendconnect['current_fcid'] != id) {
    FC_RenderBadLogin(id, name, image);
    return;
  }

  // logged into Google, and mapped to local account
  FC_RenderGoodLogin(id, name, image);
};


/**
 * Fetch profile information for the current viewer (site visitor).
 * The |securityToken| is currently unused, use it as needed.
 */
FC_GetFriendConnect = function (securityToken) {
   var req = opensocial.newDataRequest();
   var params = {};
   params[opensocial.DataRequest.PeopleRequestFields.PROFILE_DETAILS] = [
       opensocial.Person.Field.ID,
       opensocial.Person.Field.NAME,
       opensocial.Person.Field.THUMBNAIL_URL ];
   req.add(req.newFetchPersonRequest('VIEWER', params), 'viewer');
   req.send(FC_RenderFriendConnect);
};


/**
 * Load the OpenSocial API through the Google Friend Connect Interface.
 */
FC_LoadFriendConnect = function () {
  FC_Fix_logout();

  // Stop if there are no FriendConnect elements displayed.
  if (!$('#friendconnect_display').size()) {
    return;
  }

  Drupal.settings.friendconnect['user_login_click'] = 0; // false
  google.friendconnect.container.setParentUrl(Drupal.settings.friendconnect['parent_url']);
  google.friendconnect.container.initOpenSocialApi({
    site: Drupal.settings.friendconnect['site_id'],
    onload: function(securityToken) { FC_GetFriendConnect(securityToken); }
  });
};

FC_Fix_logout = function () {
  var links = $('a[href*=' + Drupal.settings.friendconnect['logout_url'] + ']');
  links.each(function() {
    $(this).attr('href', '#');
    $(this).click(function() {
      google.friendconnect.requestSignOut();
      window.location.href = Drupal.settings.friendconnect['logout_url'];
    });
  });
};

FC_LoadSocialBar = function () {
  $('body').append('<div id="friendconnect-socialbar"></div>');

  google.friendconnect.container.setParentUrl(Drupal.settings.friendconnect['parent_url']);
  google.friendconnect.container.renderSocialBar(
    {
      'id': 'friendconnect-socialbar',
      'site': Drupal.settings.friendconnect['site_id'],
      'view-params': Drupal.settings.friendconnect['socialbar']['settings']
    },
    Drupal.settings.friendconnect['socialbar']['style']
  );
};

})(jQuery);

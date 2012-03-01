<?php
// $Id: friendconnect.admin.inc,v 1.7 2010/01/20 02:10:42 davereid Exp $

/**
 * @file
 * Admin page callbacks for the friendconnect module.
 */

function friendconnect_settings_form() {
  $form['friendconnect_siteid'] = array(
    '#type' => 'textfield',
    '#title' => t('Site ID'),
    '#required' => TRUE,
    '#size' => 25,
    '#default_value' => variable_get('friendconnect_siteid', ''),
    '#description' => t('Unique site identifier provided by Google Friend Connect during initial registration.'),
  );

  $form['additional_settings'] = array(
    '#type' => 'vertical_tabs',
  );

  $comments = friendconnect_var('comments');
  $form['friendconnect_comments'] = array(
    '#type' => 'fieldset',
    '#title' =>  t('Comments'),
    '#description' => t('Let users post comments and video links. Posts can apply to a specific page or an entire website.'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#group' => 'additional_settings',
    '#tree' => TRUE,
  );
  $form['friendconnect_comments']['enabled'] = array(
    '#type' => 'checkbox',
    '#default_value' => $comments['enabled'],
    '#title' => t('Enable comments'),
    '#description' => t('Note this is a separate comment system than the core Comment module.'),
  );
  $form['friendconnect_comments']['scope'] = array(
    '#type' => 'select',
    '#title' => t('Scope'),
    '#description' => t('This affects whether or not visitors see the same discussion across your entire site regardless of the page they are on, or if each page has its own separate discussion.'),
    '#default_value' => $comments['scope'],
    '#options' => array(
      'SITE' => t('Entire site'),
      'PAGE' => t('Page'),
    ),
  );
  $form['friendconnect_comments']['anonymous'] = array(
    '#type' => 'checkbox',
    '#title' => t('Allow anonymous posts'),
    '#default_value' => $comments['anonymous'],
  );
  $form['friendconnect_comments']['youtube'] = array(
    '#type' => 'checkbox',
    '#title' => t('Allow visitors to post YouTube links'),
    '#default_value' => $comments['youtube'],
  );
  $form['friendconnect_comments']['default_text'] = array(
    '#type' => 'textfield',
    '#title' => t('Start with this text in the comments area'),
    '#default_value' => $comments['default_text'],
  );
  $form['friendconnect_comments']['header_text'] = array(
    '#type' => 'textfield',
    '#title' => t('Comments header'),
    '#default_value' => $comments['header_text'],
  );

  $social_bar = friendconnect_var('socialbar');
  $form['friendconnect_socialbar'] = array(
    '#type' => 'fieldset',
    '#title' => t('Social Bar'),
    '#description' => t('Let users sign in, view other members, leave comments, and see recent site activity from the top or bottom of your website.'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#group' => 'additional_settings',
    '#tree' => TRUE,
  );
  $form['friendconnect_socialbar']['enabled'] = array(
    '#type' => 'checkbox',
    '#title' => t('Enable social bar'),
    '#default_value' => $social_bar['enabled'],
  );
  $form['friendconnect_socialbar']['position'] = array(
    '#type' => 'select',
    '#title' => t('Social bar position'),
    '#description' => t('Choose where you would like to have the social bar appear on your page.'),
    '#default_value' => $social_bar['position'],
    '#options' => array('top' => t('Top'), 'bottom' => t('Bottom')),
  );
  $form['friendconnect_socialbar']['comments'] = array(
    '#type' => 'item',
    '#title' => t('Comments'),
    '#value' => $comments['enabled'] ? t('Enabled') : t('Disabled'),
    '#description' => t('If comments are enabled above, a small comment gadget will be shown in the social bar.'),
  );

  $skin = friendconnect_var('skin');
  $form['friendconnect_skin'] = array(
    '#type' => 'fieldset',
    '#title' =>  t('Gadgets color scheme'),
    '#description' => t('Note that not all colors are used by every gadget.'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#group' => 'additional_settings',
    '#tree' => TRUE,
    '#access' => FALSE,
  );
  $form['friendconnect_skin']['picker'] = array(
    '#type' => 'markup',
    '#value' => '<div id="gfc_color_picker"></div>',
    '#weight' => -2,
  );
  $titles = array(
    'ENDCAP_BG_COLOR' => t('Endcap Background'),
    'ENDCAP_TEXT_COLOR' => t('Endcap Text'),
    'ENDCAP_LINK_COLOR' => t('Endcap Links'),
    'BORDER_COLOR' => t('Border'),
    'CONTENT_HEADLINE_COLOR' => t('Content Headlines'),
    'CONTENT_BG_COLOR' => t('Content Background'),
    'ALTERNATE_BG_COLOR' => t('Alternate Background'),
    'CONTENT_TEXT_COLOR' => t('Content text'),
    'CONTENT_SECONDARY_TEXT_COLOR' => t('Content Secondary Text'),
    'CONTENT_LINK_COLOR' => t('Content Links'),
    'CONTENT_SECONDARY_LINK_COLOR' => t('Content Secondary Links'),
  );
  foreach ($skin as $key => $default) {
    $form['friendconnect_skin'][$key] = array(
      '#type' => 'textfield',
      '#title' => $titles[$key],
      '#default_value' => $default,
      '#size' => 8,
      '#attributes' => array('class' => 'color'),
    );
  }
  foreach (array('ENDCAP_BG_COLOR', 'CONTENT_BG_COLOR', 'ALTERNATE_BG_COLOR') as $key) {
    $form['friendconnect_skin'][$key]['#description'] = t('Empty value means transparent');
  }

  $form['#attached']['library'][] = array('system', 'farbtastic');
  $form['#attached']['css'][] = drupal_get_path('module', 'friendconnect') . '/friendconnect.css';
  $form['#attached']['js'][] = drupal_get_path('module', 'friendconnect') . '/friendconnect.admin.js';

  return system_settings_form($form, FALSE);
}

function friendconnect_settings_add_dependencies($form) {
  foreach (element_children($form) as $key) {
    if ($key == 'enabled') {
      continue;
    }
    //'#process' => array('form_expand_ahah', 'ctools_dependent_process'),
    //'#dependency' => array('edit-friendconnect-socialbar-enabled' => array(1)),
  }
}

<?php /*regions[sidebar_first]     = Sidebar first
  regions[sidebar_second]    = Sidebar second
  regions[content]           = Main Content
  regions[highlighted]       = Highlighted
  regions[content_aside]     = Aside
  regions[secondary_content] = Secondary
  regions[tertiary_content]  = Tertiary
  regions[footer]            = Footer
  regions[leaderboard]       = Leaderboard
  regions[header]            = Header
  regions[menu_bar]          = Menu Bar
  regions[help]              = Help
  regions[page_top]          = Page top
  regions[page_bottom] */
?>
<div id="front-page" class="container">

 <div id="main-links"><?php print render($page['secondary_content']); ?>  </div>

 <div id="users-breifs"><?php print render($page['highlighted']); ?></div>

 <div id="proverb-for-site"><?php print render($page['content_aside']); ?></div>

 <div id="links-main-sections"><?php print render($page['tertiary_content']); ?></div>

 <footer class="clearfix" role="banner">

    <?php if ($linked_site_logo): ?>
      <div id="logo-front-page"><?php print $linked_site_logo; ?></div>
    <?php endif; ?>

    <?php if ($site_name || $site_slogan): ?>
      <hgroup<?php if (!$site_slogan && $hide_site_name): ?> class="<?php print $visibility; ?>"<?php endif; ?>>
        <?php if ($site_name): ?>
          <h1 id="site-name-front-page"<?php if ($hide_site_name): ?> class="<?php print $visibility; ?>"<?php endif; ?>><?php print $site_name; ?></h1>
        <?php endif; ?>
      </hgroup>
    <?php endif; ?>

    <?php print render($page['footer']); ?>



</div>

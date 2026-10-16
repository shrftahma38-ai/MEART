<?php
/**
 * Sidebar.
 *
 * @package Goosht_Shahrvand
 */

if ( ! is_active_sidebar( 'sidebar-1' ) ) {
	return;
}
?>
<aside id="secondary" class="gsh-sidebar">
	<?php dynamic_sidebar( 'sidebar-1' ); ?>
</aside>

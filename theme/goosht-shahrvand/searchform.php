<?php
/**
 * Search form.
 *
 * @package Goosht_Shahrvand
 */

$gsh_search_id = 'gsh-search-' . wp_unique_id();
?>
<form role="search" method="get" class="gsh-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="screen-reader-text" for="<?php echo esc_attr( $gsh_search_id ); ?>"><?php esc_html_e( 'جست‌وجو', 'goosht-shahrvand' ); ?></label>
	<input
		type="search"
		id="<?php echo esc_attr( $gsh_search_id ); ?>"
		class="gsh-search-field"
		value="<?php echo get_search_query(); ?>"
		name="s"
		placeholder="<?php esc_attr_e( 'جست‌وجو در سایت…', 'goosht-shahrvand' ); ?>">
	<button type="submit" class="gsh-search-submit">
		<?php echo gsh_icon( 'search', 20 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<span class="screen-reader-text"><?php esc_html_e( 'جست‌وجو', 'goosht-shahrvand' ); ?></span>
	</button>
</form>

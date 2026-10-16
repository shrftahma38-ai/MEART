<?php
/**
 * Product card inside WooCommerce loops.
 *
 * @package Goosht_Shahrvand
 */

defined( 'ABSPATH' ) || exit;

global $product;

if ( empty( $product ) || ! $product->is_visible() ) {
	return;
}
?>
<li <?php wc_product_class( 'gsh-card gsh-product-card', $product ); ?>>
	<a class="gsh-card-media" href="<?php the_permalink(); ?>">
		<?php echo $product->get_image( 'gsh-card' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<span class="gsh-card-zoom"><?php echo gsh_icon( 'zoom', 22 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
	</a>

	<div class="gsh-card-body">
		<?php
		$gsh_categories = wc_get_product_category_list( $product->get_id(), ', ' );
		if ( $gsh_categories ) {
			echo '<span class="gsh-card-cat">' . wp_kses_post( $gsh_categories ) . '</span>';
		}
		?>

		<h2 class="gsh-card-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>

		<div class="gsh-card-price"><?php echo wp_kses_post( $product->get_price_html() ); ?></div>

		<a class="gsh-btn gsh-btn-ghost gsh-btn-sm" href="<?php the_permalink(); ?>"><?php esc_html_e( 'مشاهده', 'goosht-shahrvand' ); ?></a>
	</div>
</li>

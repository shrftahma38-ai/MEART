<?php
/**
 * WooCommerce integration.
 *
 * The plugin is not bundled with the theme – these hooks and templates only take effect
 * once WooCommerce is installed and activated.
 *
 * @package Goosht_Shahrvand
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Wrap shop pages in the theme markup instead of WooCommerce's generic wrapper.
remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );
remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );

/**
 * Open the shop wrapper.
 */
function gsh_woo_wrapper_start() {
	echo '<main id="primary" class="gsh-main gsh-woo"><div class="gsh-container">';
}
add_action( 'woocommerce_before_main_content', 'gsh_woo_wrapper_start', 10 );

/**
 * Close the shop wrapper.
 */
function gsh_woo_wrapper_end() {
	echo '</div></main>';
}
add_action( 'woocommerce_after_main_content', 'gsh_woo_wrapper_end', 10 );

/**
 * Grid layout matching the design.
 *
 * @return int
 */
function gsh_woo_columns() {
	return 3;
}
add_filter( 'loop_shop_columns', 'gsh_woo_columns', 20 );

/**
 * Products per page.
 *
 * @return int
 */
function gsh_woo_per_page() {
	return 9;
}
add_filter( 'loop_shop_per_page', 'gsh_woo_per_page', 20 );

/**
 * Related products layout.
 *
 * @param array $args Query arguments.
 * @return array
 */
function gsh_woo_related_args( $args ) {
	$args['posts_per_page'] = 3;
	$args['columns']        = 3;

	return $args;
}
add_filter( 'woocommerce_output_related_products_args', 'gsh_woo_related_args', 20 );

/**
 * Cart counter markup.
 *
 * @return string
 */
function gsh_cart_count_html() {
	$count = 0;

	if ( function_exists( 'WC' ) && WC()->cart ) {
		$count = WC()->cart->get_cart_contents_count();
	}

	return '<span class="gsh-cart-count">' . esc_html( gsh_fa_num( $count ) ) . '</span>';
}

/**
 * Cart link for the header.
 */
function gsh_cart_link() {
	$url = function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : '';

	printf(
		'<a class="gsh-cart" href="%1$s" aria-label="%2$s">%3$s%4$s</a>',
		esc_url( $url ),
		esc_attr__( 'سبد خرید', 'goosht-shahrvand' ),
		gsh_icon( 'cart', 22 ),
		gsh_cart_count_html() // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	);
}

/**
 * Keep the cart counter fresh after an AJAX add to cart.
 *
 * @param array $fragments Cart fragments.
 * @return array
 */
function gsh_cart_count_fragment( $fragments ) {
	$fragments['span.gsh-cart-count'] = gsh_cart_count_html();

	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'gsh_cart_count_fragment' );

/* WooCommerce keeps its own stylesheets (they also cover the cart, checkout and RTL);
 * the theme layers its dark palette on top of them in assets/css/main.css. */

<?php
/**
 * Goosht Shahrvand – theme bootstrap.
 *
 * @package Goosht_Shahrvand
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'GSH_VERSION', '1.0.0' );
define( 'GSH_DIR', trailingslashit( get_template_directory() ) );
define( 'GSH_URI', trailingslashit( get_template_directory_uri() ) );

require_once GSH_DIR . 'inc/template-tags.php';
require_once GSH_DIR . 'inc/customizer.php';
require_once GSH_DIR . 'inc/demo-content.php';

if ( class_exists( 'WooCommerce' ) ) {
	require_once GSH_DIR . 'inc/woocommerce.php';
}

if ( ! function_exists( 'gsh_setup' ) ) {
	/**
	 * Register theme features.
	 */
	function gsh_setup() {
		load_theme_textdomain( 'goosht-shahrvand', GSH_DIR . 'languages' );

		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'customize-selective-refresh-widgets' );
		add_theme_support( 'align-wide' );
		add_theme_support( 'responsive-embeds' );
		add_theme_support(
			'html5',
			array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' )
		);
		add_theme_support(
			'custom-logo',
			array(
				'height'      => 64,
				'width'       => 220,
				'flex-height' => true,
				'flex-width'  => true,
			)
		);

		/*
		 * WooCommerce support. The plugin is NOT bundled with this theme: these declarations only
		 * tell WooCommerce how to integrate once the plugin is installed and active.
		 */
		add_theme_support(
			'woocommerce',
			array(
				'thumbnail_image_width' => 600,
				'single_image_width'    => 900,
				'product_grid'          => array(
					'default_rows'    => 3,
					'min_rows'        => 1,
					'max_rows'        => 8,
					'default_columns' => 3,
					'min_columns'     => 2,
					'max_columns'     => 4,
				),
			)
		);
		add_theme_support( 'wc-product-gallery-zoom' );
		add_theme_support( 'wc-product-gallery-lightbox' );
		add_theme_support( 'wc-product-gallery-slider' );

		register_nav_menus(
			array(
				'primary' => esc_html__( 'منوی اصلی', 'goosht-shahrvand' ),
				'footer'  => esc_html__( 'منوی فوتر', 'goosht-shahrvand' ),
			)
		);

		add_image_size( 'gsh-card', 640, 480, true );
		add_image_size( 'gsh-wide', 1440, 810, true );

		$GLOBALS['content_width'] = 1280;
	}
}
add_action( 'after_setup_theme', 'gsh_setup' );

/**
 * The theme is Persian and right-to-left out of the box; it can be switched to LTR
 * from Appearance → Customize → تنظیمات قالب.
 *
 * @param string $output Language attributes.
 * @return string
 */
function gsh_language_attributes( $output ) {
	if ( 'rtl' !== gsh_text_direction() || false !== strpos( $output, 'dir=' ) ) {
		return $output;
	}

	return $output . ' dir="rtl"';
}
add_filter( 'language_attributes', 'gsh_language_attributes' );

/**
 * Styles and scripts.
 */
function gsh_scripts() {
	wp_enqueue_style( 'gsh-fonts', GSH_URI . 'assets/fonts/fonts.css', array(), GSH_VERSION );
	wp_enqueue_style( 'gsh-style', get_stylesheet_uri(), array( 'gsh-fonts' ), GSH_VERSION );
	wp_enqueue_style( 'gsh-main', GSH_URI . 'assets/css/main.css', array( 'gsh-style' ), GSH_VERSION );

	$inline = gsh_customizer_css();
	if ( $inline ) {
		wp_add_inline_style( 'gsh-main', $inline );
	}

	wp_enqueue_script( 'gsh-main', GSH_URI . 'assets/js/main.js', array(), GSH_VERSION, true );
	wp_localize_script(
		'gsh-main',
		'gshSettings',
		array(
			'rtl'      => ( 'rtl' === gsh_text_direction() ),
			'autoplay' => (int) gsh_mod( 'gsh_hero_speed' ),
			'close'    => esc_html__( 'بستن', 'goosht-shahrvand' ),
			'next'     => esc_html__( 'بعدی', 'goosht-shahrvand' ),
			'prev'     => esc_html__( 'قبلی', 'goosht-shahrvand' ),
		)
	);

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'gsh_scripts' );

/**
 * Widget areas.
 */
function gsh_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'کناربرگ', 'goosht-shahrvand' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'در برگه‌های وبلاگ و کنار مطالب نمایش داده می‌شود.', 'goosht-shahrvand' ),
			'before_widget' => '<section id="%1$s" class="gsh-widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="gsh-widget-title">',
			'after_title'   => '</h2>',
		)
	);

	foreach ( array( 1, 2, 3 ) as $gsh_index ) {
		register_sidebar(
			array(
				/* translators: %d: footer column number. */
				'name'          => sprintf( esc_html__( 'فوتر – ستون %d', 'goosht-shahrvand' ), $gsh_index ),
				'id'            => 'footer-' . $gsh_index,
				'before_widget' => '<section id="%1$s" class="gsh-widget %2$s">',
				'after_widget'  => '</section>',
				'before_title'  => '<h2 class="gsh-widget-title">',
				'after_title'   => '</h2>',
			)
		);
	}
}
add_action( 'widgets_init', 'gsh_widgets_init' );

/**
 * Body classes.
 *
 * @param array $classes Existing classes.
 * @return array
 */
function gsh_body_classes( $classes ) {
	$classes[] = 'gsh-' . gsh_text_direction();

	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'gsh-no-sidebar';
	}

	if ( is_front_page() ) {
		$classes[] = 'gsh-front';
	}

	return $classes;
}
add_filter( 'body_class', 'gsh_body_classes' );

/**
 * Menu fallback so the header never renders empty.
 */
function gsh_menu_fallback() {
	wp_page_menu(
		array(
			'menu_class' => 'gsh-menu',
			'before'     => '',
			'after'      => '',
		)
	);
}

/**
 * Excerpt tweaks.
 *
 * @param string $more Default "read more" string.
 * @return string
 */
function gsh_excerpt_more( $more ) {
	return ' …';
}
add_filter( 'excerpt_more', 'gsh_excerpt_more' );

/**
 * Excerpt length.
 *
 * @return int
 */
function gsh_excerpt_length() {
	return 24;
}
add_filter( 'excerpt_length', 'gsh_excerpt_length' );

/**
 * Pingback header.
 */
function gsh_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
	}
}
add_action( 'wp_head', 'gsh_pingback_header' );

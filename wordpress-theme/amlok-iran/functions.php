<?php
/**
 * املاک ایران — توابع قالب.
 *
 * @package amlok-iran
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'AMLOK_IRAN_VERSION', '1.0.0' );
define( 'AMLOK_IRAN_DIR', get_template_directory() );
define( 'AMLOK_IRAN_URI', get_template_directory_uri() );

require_once AMLOK_IRAN_DIR . '/inc/helpers.php';
require_once AMLOK_IRAN_DIR . '/inc/cpt.php';
require_once AMLOK_IRAN_DIR . '/inc/customizer.php';
require_once AMLOK_IRAN_DIR . '/inc/forms.php';

/**
 * راه‌اندازی قالب.
 */
function amlok_iran_setup() {
	load_theme_textdomain( 'amlok-iran', AMLOK_IRAN_DIR . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support(
		'html5',
		array( 'search-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' )
	);
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 64,
			'width'       => 64,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	register_nav_menus(
		array(
			'primary' => __( 'منوی اصلی', 'amlok-iran' ),
			'footer'  => __( 'منوی پابرگ', 'amlok-iran' ),
		)
	);
}
add_action( 'after_setup_theme', 'amlok_iran_setup' );

/**
 * بارگذاری استایل‌ها و اسکریپت‌ها.
 */
function amlok_iran_scripts() {
	wp_enqueue_style( 'amlok-iran-base', AMLOK_IRAN_URI . '/style.css', array(), AMLOK_IRAN_VERSION );
	wp_enqueue_style( 'amlok-iran-theme', AMLOK_IRAN_URI . '/assets/css/theme.css', array( 'amlok-iran-base' ), AMLOK_IRAN_VERSION );

	wp_enqueue_script( 'amlok-iran-hero', AMLOK_IRAN_URI . '/assets/js/hero-scrub.js', array(), AMLOK_IRAN_VERSION, array( 'strategy' => 'defer' ) );
	wp_enqueue_script( 'amlok-iran-main', AMLOK_IRAN_URI . '/assets/js/main.js', array(), AMLOK_IRAN_VERSION, array( 'strategy' => 'defer' ) );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'amlok_iran_scripts' );

/**
 * اجازه آپلود ویدیو mp4 برای مدیران (فیل ویدیوی هیرو).
 */
function amlok_iran_upload_mimes( $mimes ) {
	if ( current_user_can( 'administrator' ) && ! isset( $mimes['mp4'] ) ) {
		$mimes['mp4'] = 'video/mp4';
	}
	return $mimes;
}
add_filter( 'upload_mimes', 'amlok_iran_upload_mimes' );

/**
 * در نخستین فعال‌سازی قالب: ساخت برگه‌ها و منوی پیش‌فرض.
 * همه چیز شرطی است — چیزی بازنویسی یا حذف نمی‌شود.
 */
function amlok_iran_activation() {
	// برگه «علاقه‌مندی‌ها» با قالب اختصاصی.
	if ( ! get_page_by_path( 'saved' ) ) {
		wp_insert_post(
			array(
				'post_title'     => __( 'علاقه‌مندی‌ها', 'amlok-iran' ),
				'post_name'      => 'saved',
				'post_status'    => 'publish',
				'post_type'      => 'page',
				'page_template'  => 'template-saved.php',
				'comment_status' => 'closed',
			)
		);
	}

	// برگه «تماس با ما» با قالب اختصاصی.
	if ( ! get_page_by_path( 'contact' ) ) {
		wp_insert_post(
			array(
				'post_title'     => __( 'تماس با ما', 'amlok-iran' ),
				'post_name'      => 'contact',
				'post_status'    => 'publish',
				'post_type'      => 'page',
				'page_template'  => 'template-contact.php',
				'comment_status' => 'closed',
			)
		);
	}

	// منوی پیش‌فرض، فقط اگر هیچ منویی ثبت نشده باشد.
	$existing = wp_get_nav_menu_object( 'amlok-iran-primary' );
	if ( ! $existing ) {
		$menu_id = wp_create_nav_menu( 'amlok-iran-primary' );
		if ( is_wp_error( $menu_id ) ) {
			return;
		}

		$archive_link = get_post_type_archive_link( 'property' );
		$items        = array(
			array( 'title' => __( 'خانه', 'amlok-iran' ), 'url' => home_url( '/' ) ),
			array( 'title' => __( 'املاک', 'amlok-iran' ), 'url' => $archive_link ? $archive_link : home_url( '/' ) ),
			array( 'title' => __( 'درباره ما', 'amlok-iran' ), 'url' => home_url( '/#about' ) ),
			array( 'title' => __( 'خدمات', 'amlok-iran' ), 'url' => home_url( '/#services' ) ),
			array( 'title' => __( 'تیم ما', 'amlok-iran' ), 'url' => home_url( '/#team' ) ),
			array( 'title' => __( 'تماس با ما', 'amlok-iran' ), 'url' => home_url( '/contact/' ) ),
			array( 'title' => __( 'علاقه‌مندی‌ها', 'amlok-iran' ), 'url' => home_url( '/saved/' ) ),
		);

		foreach ( $items as $item ) {
			if ( empty( $item['url'] ) ) {
				continue;
			}
			wp_update_nav_menu_item(
				$menu_id,
				0,
				array(
					'menu-item-title'  => $item['title'],
					'menu-item-url'    => $item['url'],
					'menu-item-status' => 'publish',
				)
			);
		}

		$locations           = get_theme_mod( 'nav_menu_locations', array() );
		$locations['primary'] = $menu_id;
		$locations['footer']  = $menu_id;
		set_theme_mod( 'nav_menu_locations', $locations );
	}
}
add_action( 'after_switch_theme', 'amlok_iran_activation' );

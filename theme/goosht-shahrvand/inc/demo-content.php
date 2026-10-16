<?php
/**
 * Starter content: pages and menus created by WordPress on a brand-new install.
 *
 * @package Goosht_Shahrvand
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register starter content.
 */
function gsh_starter_content() {
	add_theme_support(
		'starter-content',
		array(
			'posts'     => array(
				'home'     => array(
					'post_type'  => 'page',
					'post_title' => 'خانه',
				),
				'about'    => array(
					'post_type'    => 'page',
					'post_title'   => 'درباره ما',
					'post_content' => 'گوشت شهروند، فروشگاه گوشت و پروتئین تازه در تهران.',
				),
				'products' => array(
					'post_type'  => 'page',
					'post_title' => 'محصولات',
				),
				'gallery'  => array(
					'post_type'  => 'page',
					'post_title' => 'گالری',
				),
				'contact'  => array(
					'post_type'    => 'page',
					'post_title'   => 'تماس با ما',
					'post_content' => 'برای سفارش تلفنی و پرسش‌ها با ما در تماس باشید.',
				),
				'blog'     => array(
					'post_type'  => 'page',
					'post_title' => 'مجله',
				),
			),
			'nav_menus' => array(
				'primary' => array(
					'name'  => 'منوی اصلی',
					'items' => array( 'page_home', 'page_about', 'page_products', 'page_gallery', 'page_contact' ),
				),
				'footer'  => array(
					'name'  => 'منوی فوتر',
					'items' => array( 'page_about', 'page_contact', 'page_blog' ),
				),
			),
			'widgets'   => array(
				'footer-1' => array(
					'text_about' => array(
						'text',
						array(
							'title' => 'درباره گوشت شهروند',
							'text'  => 'گوشت تازه، برش به سفارش و ارسال سریع.',
						),
					),
				),
			),
			'options'   => array(
				'show_on_front'      => 'page',
				'page_on_front'      => '{{home}}',
				'page_for_posts'     => '{{blog}}',
				'posts_per_page'     => 6,
				'blogdescription'    => 'فروشگاه گوشت و پروتئین تازه',
			),
		)
	);
}
add_action( 'after_setup_theme', 'gsh_starter_content' );

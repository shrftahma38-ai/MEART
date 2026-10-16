<?php
/**
 * Theme options. Everything the shop owner needs to edit the front page lives here.
 *
 * @package Goosht_Shahrvand
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Checkbox sanitizer.
 *
 * @param mixed $checked Raw value.
 * @return bool
 */
function gsh_sanitize_checkbox( $checked ) {
	return ( isset( $checked ) && true === (bool) $checked );
}

/**
 * Register a plain (text, url, number, textarea) control.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 * @param string               $key          Setting id.
 * @param array                $args         Control arguments.
 */
function gsh_add_text_control( $wp_customize, $key, $args ) {
	$defaults = gsh_defaults();
	$args     = wp_parse_args(
		$args,
		array(
			'label'       => $key,
			'section'     => 'gsh_contact',
			'type'        => 'text',
			'sanitize'    => 'sanitize_text_field',
			'description' => '',
		)
	);

	$wp_customize->add_setting(
		$key,
		array(
			'default'           => isset( $defaults[ $key ] ) ? $defaults[ $key ] : '',
			'sanitize_callback' => $args['sanitize'],
			'transport'         => 'refresh',
		)
	);

	$wp_customize->add_control(
		$key,
		array(
			'label'       => $args['label'],
			'section'     => $args['section'],
			'type'        => $args['type'],
			'description' => $args['description'],
		)
	);
}

/**
 * Register an image control (stores the attachment URL).
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 * @param string               $key          Setting id.
 * @param array                $args         Control arguments.
 */
function gsh_add_image_control( $wp_customize, $key, $args ) {
	$defaults = gsh_defaults();
	$args     = wp_parse_args(
		$args,
		array(
			'label'       => $key,
			'section'     => 'gsh_hero',
			'description' => '',
		)
	);

	$wp_customize->add_setting(
		$key,
		array(
			'default'           => isset( $defaults[ $key ] ) ? $defaults[ $key ] : '',
			'sanitize_callback' => 'esc_url_raw',
			'transport'         => 'refresh',
		)
	);

	$wp_customize->add_control(
		new WP_Customize_Image_Control(
			$wp_customize,
			$key,
			array(
				'label'       => $args['label'],
				'section'     => $args['section'],
				'description' => $args['description'],
				'settings'    => $key,
			)
		)
	);
}

/**
 * Register all theme options.
 *
 * @param WP_Customize_Manager $wp_customize Customizer instance.
 */
function gsh_customize_register( $wp_customize ) {
	$defaults = gsh_defaults();

	$wp_customize->add_panel(
		'gsh_theme',
		array(
			'title'       => esc_html__( 'تنظیمات قالب گوشت شهروند', 'goosht-shahrvand' ),
			'description' => esc_html__( 'متن‌ها، تصاویر و اطلاعات تماس صفحه اصلی را از این‌جا تغییر دهید.', 'goosht-shahrvand' ),
			'priority'    => 20,
		)
	);

	/* ---------------------------------------------------------------------
	 * Colours and direction
	 * ------------------------------------------------------------------ */
	$wp_customize->add_section(
		'gsh_colors',
		array(
			'title' => esc_html__( 'رنگ‌ها و جهت متن', 'goosht-shahrvand' ),
			'panel' => 'gsh_theme',
		)
	);

	$colors = array(
		'gsh_accent'      => esc_html__( 'رنگ تأکیدی (قرمز)', 'goosht-shahrvand' ),
		'gsh_accent_dark' => esc_html__( 'قرمز تیره', 'goosht-shahrvand' ),
		'gsh_bg'          => esc_html__( 'پس‌زمینه صفحه', 'goosht-shahrvand' ),
		'gsh_panel'       => esc_html__( 'پس‌زمینه کارت‌ها', 'goosht-shahrvand' ),
		'gsh_text'        => esc_html__( 'رنگ متن', 'goosht-shahrvand' ),
		'gsh_muted'       => esc_html__( 'رنگ متن کم‌رنگ', 'goosht-shahrvand' ),
	);

	foreach ( $colors as $key => $label ) {
		$wp_customize->add_setting(
			$key,
			array(
				'default'           => isset( $defaults[ $key ] ) ? $defaults[ $key ] : '',
				'sanitize_callback' => 'sanitize_hex_color',
				'transport'         => 'refresh',
			)
		);

		$wp_customize->add_control(
			new WP_Customize_Color_Control(
				$wp_customize,
				$key,
				array(
					'label'    => $label,
					'section'  => 'gsh_colors',
					'settings' => $key,
				)
			)
		);
	}

	$wp_customize->add_setting(
		'gsh_force_rtl',
		array(
			'default'           => true,
			'sanitize_callback' => 'gsh_sanitize_checkbox',
			'transport'         => 'refresh',
		)
	);
	$wp_customize->add_control(
		'gsh_force_rtl',
		array(
			'section'     => 'gsh_colors',
			'type'        => 'checkbox',
			'label'       => esc_html__( 'نمایش راست‌به‌چپ (RTL)', 'goosht-shahrvand' ),
			'description' => esc_html__( 'اگر زبان وردپرس فارسی نباشد هم قالب راست‌به‌چپ نمایش داده شود.', 'goosht-shahrvand' ),
		)
	);

	/* ---------------------------------------------------------------------
	 * Contact details
	 * ------------------------------------------------------------------ */
	$wp_customize->add_section(
		'gsh_contact',
		array(
			'title' => esc_html__( 'اطلاعات تماس', 'goosht-shahrvand' ),
			'panel' => 'gsh_theme',
		)
	);

	gsh_add_text_control( $wp_customize, 'gsh_address', array( 'label' => esc_html__( 'نشانی', 'goosht-shahrvand' ), 'section' => 'gsh_contact' ) );
	gsh_add_text_control( $wp_customize, 'gsh_phone', array( 'label' => esc_html__( 'شماره تماس (نمایشی)', 'goosht-shahrvand' ), 'section' => 'gsh_contact' ) );
	gsh_add_text_control( $wp_customize, 'gsh_phone_link', array( 'label' => esc_html__( 'شماره تماس (قابل کلیک)', 'goosht-shahrvand' ), 'section' => 'gsh_contact', 'description' => esc_html__( 'فقط رقم؛ برای لینک تماس استفاده می‌شود.', 'goosht-shahrvand' ) ) );
	gsh_add_text_control( $wp_customize, 'gsh_email', array( 'label' => esc_html__( 'ایمیل', 'goosht-shahrvand' ), 'section' => 'gsh_contact', 'sanitize' => 'sanitize_email' ) );
	gsh_add_text_control( $wp_customize, 'gsh_hours', array( 'label' => esc_html__( 'ساعت کاری', 'goosht-shahrvand' ), 'section' => 'gsh_contact' ) );
	gsh_add_text_control( $wp_customize, 'gsh_map_url', array( 'label' => esc_html__( 'نشانی نقشه (embed)', 'goosht-shahrvand' ), 'section' => 'gsh_contact', 'sanitize' => 'esc_url_raw', 'description' => esc_html__( 'نشانی iframe نقشه، مثلاً خروجی OpenStreetMap.', 'goosht-shahrvand' ) ) );

	/* ---------------------------------------------------------------------
	 * Hero slider
	 * ------------------------------------------------------------------ */
	$wp_customize->add_section(
		'gsh_hero',
		array(
			'title' => esc_html__( 'اسلایدر بالای صفحه', 'goosht-shahrvand' ),
			'panel' => 'gsh_theme',
		)
	);

	for ( $i = 1; $i <= 3; $i++ ) {
		/* translators: %d: slide number. */
		$slide_label = sprintf( esc_html__( 'اسلاید %d', 'goosht-shahrvand' ), $i );

		gsh_add_image_control( $wp_customize, "gsh_hero_{$i}_image", array( 'label' => $slide_label . ' – ' . esc_html__( 'تصویر', 'goosht-shahrvand' ), 'section' => 'gsh_hero' ) );
		gsh_add_text_control( $wp_customize, "gsh_hero_{$i}_title", array( 'label' => $slide_label . ' – ' . esc_html__( 'عنوان', 'goosht-shahrvand' ), 'section' => 'gsh_hero' ) );
		gsh_add_text_control( $wp_customize, "gsh_hero_{$i}_subtitle", array( 'label' => $slide_label . ' – ' . esc_html__( 'زیرعنوان', 'goosht-shahrvand' ), 'section' => 'gsh_hero' ) );
		gsh_add_text_control( $wp_customize, "gsh_hero_{$i}_button_text", array( 'label' => $slide_label . ' – ' . esc_html__( 'متن دکمه', 'goosht-shahrvand' ), 'section' => 'gsh_hero' ) );
		gsh_add_text_control( $wp_customize, "gsh_hero_{$i}_button_url", array( 'label' => $slide_label . ' – ' . esc_html__( 'نشانی دکمه', 'goosht-shahrvand' ), 'section' => 'gsh_hero', 'sanitize' => 'esc_url_raw', 'description' => esc_html__( 'خالی بگذارید تا به برگه محصولات/تماس همان اسلاید پیوند داده شود.', 'goosht-shahrvand' ) ) );
	}

	gsh_add_text_control(
		$wp_customize,
		'gsh_hero_speed',
		array(
			'label'       => esc_html__( 'مدت نمایش هر اسلاید (ثانیه)', 'goosht-shahrvand' ),
			'section'     => 'gsh_hero',
			'type'        => 'number',
			'sanitize'    => 'absint',
			'description' => esc_html__( 'عدد صفر، پخش خودکار را خاموش می‌کند.', 'goosht-shahrvand' ),
		)
	);

	/* ---------------------------------------------------------------------
	 * About
	 * ------------------------------------------------------------------ */
	$wp_customize->add_section(
		'gsh_about',
		array(
			'title' => esc_html__( 'بخش درباره ما', 'goosht-shahrvand' ),
			'panel' => 'gsh_theme',
		)
	);

	gsh_add_text_control( $wp_customize, 'gsh_about_title', array( 'label' => esc_html__( 'عنوان', 'goosht-shahrvand' ), 'section' => 'gsh_about' ) );
	gsh_add_text_control( $wp_customize, 'gsh_about_text', array( 'label' => esc_html__( 'متن', 'goosht-shahrvand' ), 'section' => 'gsh_about', 'type' => 'textarea', 'sanitize' => 'wp_kses_post' ) );
	gsh_add_image_control( $wp_customize, 'gsh_about_image', array( 'label' => esc_html__( 'تصویر', 'goosht-shahrvand' ), 'section' => 'gsh_about' ) );
	gsh_add_text_control( $wp_customize, 'gsh_about_button_text', array( 'label' => esc_html__( 'متن دکمه', 'goosht-shahrvand' ), 'section' => 'gsh_about' ) );
	gsh_add_text_control( $wp_customize, 'gsh_about_button_url', array( 'label' => esc_html__( 'نشانی دکمه', 'goosht-shahrvand' ), 'section' => 'gsh_about', 'sanitize' => 'esc_url_raw' ) );

	/* ---------------------------------------------------------------------
	 * Products
	 * ------------------------------------------------------------------ */
	$wp_customize->add_section(
		'gsh_products',
		array(
			'title' => esc_html__( 'بخش محصولات', 'goosht-shahrvand' ),
			'panel' => 'gsh_theme',
		)
	);

	gsh_add_text_control( $wp_customize, 'gsh_products_title', array( 'label' => esc_html__( 'عنوان', 'goosht-shahrvand' ), 'section' => 'gsh_products' ) );
	gsh_add_text_control( $wp_customize, 'gsh_products_intro', array( 'label' => esc_html__( 'متن معرفی', 'goosht-shahrvand' ), 'section' => 'gsh_products', 'type' => 'textarea', 'sanitize' => 'wp_kses_post' ) );
	gsh_add_text_control( $wp_customize, 'gsh_products_count', array( 'label' => esc_html__( 'تعداد محصولات', 'goosht-shahrvand' ), 'section' => 'gsh_products', 'type' => 'number', 'sanitize' => 'absint' ) );
	gsh_add_text_control( $wp_customize, 'gsh_products_button_text', array( 'label' => esc_html__( 'متن دکمه', 'goosht-shahrvand' ), 'section' => 'gsh_products' ) );
	gsh_add_text_control( $wp_customize, 'gsh_products_button_url', array( 'label' => esc_html__( 'نشانی دکمه', 'goosht-shahrvand' ), 'section' => 'gsh_products', 'sanitize' => 'esc_url_raw' ) );

	/* ---------------------------------------------------------------------
	 * Gallery
	 * ------------------------------------------------------------------ */
	$wp_customize->add_section(
		'gsh_gallery',
		array(
			'title' => esc_html__( 'بخش گالری', 'goosht-shahrvand' ),
			'panel' => 'gsh_theme',
		)
	);

	gsh_add_text_control( $wp_customize, 'gsh_gallery_title', array( 'label' => esc_html__( 'عنوان', 'goosht-shahrvand' ), 'section' => 'gsh_gallery' ) );
	gsh_add_text_control( $wp_customize, 'gsh_gallery_text', array( 'label' => esc_html__( 'متن', 'goosht-shahrvand' ), 'section' => 'gsh_gallery', 'type' => 'textarea', 'sanitize' => 'wp_kses_post' ) );
	gsh_add_text_control( $wp_customize, 'gsh_gallery_button_text', array( 'label' => esc_html__( 'متن دکمه', 'goosht-shahrvand' ), 'section' => 'gsh_gallery' ) );
	gsh_add_text_control( $wp_customize, 'gsh_gallery_button_url', array( 'label' => esc_html__( 'نشانی دکمه', 'goosht-shahrvand' ), 'section' => 'gsh_gallery', 'sanitize' => 'esc_url_raw' ) );

	for ( $i = 1; $i <= 6; $i++ ) {
		gsh_add_image_control(
			$wp_customize,
			"gsh_gallery_{$i}",
			array(
				/* translators: %d: image number. */
				'label'   => sprintf( esc_html__( 'تصویر %d', 'goosht-shahrvand' ), $i ),
				'section' => 'gsh_gallery',
			)
		);
	}

	/* ---------------------------------------------------------------------
	 * Footer
	 * ------------------------------------------------------------------ */
	$wp_customize->add_section(
		'gsh_footer',
		array(
			'title' => esc_html__( 'فوتر و شبکه‌های اجتماعی', 'goosht-shahrvand' ),
			'panel' => 'gsh_theme',
		)
	);

	gsh_add_text_control( $wp_customize, 'gsh_footer_about', array( 'label' => esc_html__( 'معرفی کوتاه', 'goosht-shahrvand' ), 'section' => 'gsh_footer', 'type' => 'textarea', 'sanitize' => 'wp_kses_post' ) );
	gsh_add_text_control( $wp_customize, 'gsh_copyright', array( 'label' => esc_html__( 'متن کپی‌رایت', 'goosht-shahrvand' ), 'section' => 'gsh_footer' ) );

	foreach ( array( 'instagram', 'telegram', 'whatsapp', 'facebook', 'linkedin' ) as $network ) {
		gsh_add_text_control(
			$wp_customize,
			'gsh_social_' . $network,
			array(
				'label'    => sprintf( '%s – %s', esc_html__( 'شبکه اجتماعی', 'goosht-shahrvand' ), $network ),
				'section'  => 'gsh_footer',
				'sanitize' => 'esc_url_raw',
			)
		);
	}
}
add_action( 'customize_register', 'gsh_customize_register' );

/**
 * Design tokens printed inline after the main stylesheet so they override the defaults.
 *
 * @return string
 */
function gsh_customizer_css() {
	$tokens = array(
		'--gsh-accent'      => gsh_mod( 'gsh_accent' ),
		'--gsh-accent-dark' => gsh_mod( 'gsh_accent_dark' ),
		'--gsh-bg'          => gsh_mod( 'gsh_bg' ),
		'--gsh-panel'       => gsh_mod( 'gsh_panel' ),
		'--gsh-text'        => gsh_mod( 'gsh_text' ),
		'--gsh-muted'       => gsh_mod( 'gsh_muted' ),
	);

	$css = '';
	foreach ( $tokens as $name => $value ) {
		$value = trim( (string) $value );
		if ( '' === $value ) {
			continue;
		}
		$css .= $name . ':' . $value . ';';
	}

	return $css ? ':root{' . $css . '}' : '';
}

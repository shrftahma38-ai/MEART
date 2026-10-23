<?php
/**
 * تنظیمات سفارشی‌ساز: اطلاعات تماس، شبکه‌های اجتماعی، متن هیرو و آمار.
 *
 * @package amlok-iran
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** ثبت تنظیمات. */
function amlok_customize_register( $wp_customize ) {
	$defaults = amlok_defaults();

	// — اطلاعات تماس —
	$wp_customize->add_section(
		'amlok_contact',
		array(
			'title'    => __( 'املاک ایران — اطلاعات تماس', 'amlok-iran' ),
			'priority' => 20,
		)
	);

	$contact_fields = array(
		'contact_phone'   => array( __( 'تلفن', 'amlok-iran' ), 'sanitize_text_field' ),
		'contact_email'   => array( __( 'ایمیل', 'amlok-iran' ), 'sanitize_email' ),
		'contact_address1' => array( __( 'نشانی — سطر اول', 'amlok-iran' ), 'sanitize_text_field' ),
		'contact_address2' => array( __( 'نشانی — سطر دوم', 'amlok-iran' ), 'sanitize_text_field' ),
		'contact_hours'   => array( __( 'ساعات کاری', 'amlok-iran' ), 'sanitize_text_field' ),
		'contact_license' => array( __( 'متن مجوز (پابرگ)', 'amlok-iran' ), 'sanitize_text_field' ),
	);

	foreach ( $contact_fields as $key => $field ) {
		list( $label, $sanitize ) = $field;
		$wp_customize->add_setting(
			'amlok_' . $key,
			array(
				'default'           => $defaults[ $key ],
				'sanitize_callback' => $sanitize,
			)
		);
		$wp_customize->add_control(
			'amlok_' . $key,
			array(
				'label'   => $label,
				'section' => 'amlok_contact',
				'type'    => 'text',
			)
		);
	}

	// — شبکه‌های اجتماعی —
	$wp_customize->add_section(
		'amlok_socials',
		array(
			'title'    => __( 'املاک ایران — شبکه‌های اجتماعی', 'amlok-iran' ),
			'priority' => 21,
		)
	);

	foreach ( array( 'social_linkedin' => 'لینکدین', 'social_instagram' => 'اینستاگرام', 'social_facebook' => 'فیسبوک' ) as $key => $label ) {
		$wp_customize->add_setting(
			'amlok_' . $key,
			array(
				'default'           => $defaults[ $key ],
				'sanitize_callback' => 'esc_url_raw',
			)
		);
		$wp_customize->add_control(
			'amlok_' . $key,
			array(
				'label'   => $label,
				'section' => 'amlok_socials',
				'type'    => 'url',
			)
		);
	}

	// — متن هیرو —
	$wp_customize->add_section(
		'amlok_hero',
		array(
			'title'    => __( 'املاک ایران — متن هیرو', 'amlok-iran' ),
			'priority' => 22,
		)
	);

	$hero_fields = array(
		'hero_eyebrow'  => array( __( 'برچسب بالای عنوان', 'amlok-iran' ), 'text' ),
		'hero_title_line1' => array( __( 'عنوان — سطر اول', 'amlok-iran' ), 'text' ),
		'hero_title_line2' => array( __( 'عنوان — سطر دوم', 'amlok-iran' ), 'text' ),
		'hero_subtitle' => array( __( 'توضیح کوتاه', 'amlok-iran' ), 'textarea' ),
	);

	foreach ( $hero_fields as $key => $field ) {
		$wp_customize->add_setting(
			'amlok_' . $key,
			array(
				'default'           => $defaults[ $key ],
				'sanitize_callback' => 'sanitize_text_field',
			)
		);
		$wp_customize->add_control(
			'amlok_' . $key,
			array(
				'label'   => $field[0],
				'section' => 'amlok_hero',
				'type'    => $field[1],
			)
		);
	}

	// — آمار (بخش «ما کیستیم» و بخش تیره) —
	$wp_customize->add_section(
		'amlok_stats',
		array(
			'title'    => __( 'املاک ایران — آمار', 'amlok-iran' ),
			'priority' => 23,
		)
	);

	$stat_fields = array(
		'stat1_value' => 'آمار ۱ — عدد (درباره ما)',
		'stat1_label' => 'آمار ۱ — توضیح',
		'stat2_value' => 'آمار ۲ — عدد (درباره ما)',
		'stat2_label' => 'آمار ۲ — توضیح',
		'stat3_value' => 'آمار ۳ — عدد (درباره ما)',
		'stat3_label' => 'آمار ۳ — توضیح',
		'dstat1_value' => 'آمار ۱ — عدد (بخش تیره)',
		'dstat1_label' => 'آمار ۱ — توضیح',
		'dstat2_value' => 'آمار ۲ — عدد (بخش تیره)',
		'dstat2_label' => 'آمار ۲ — توضیح',
		'dstat3_value' => 'آمار ۳ — عدد (بخش تیره)',
		'dstat3_label' => 'آمار ۳ — توضیح',
		'dstat4_value' => 'آمار ۴ — عدد (بخش تیره)',
		'dstat4_label' => 'آمار ۴ — توضیح',
	);

	foreach ( $stat_fields as $key => $label ) {
		$wp_customize->add_setting(
			'amlok_' . $key,
			array(
				'default'           => $defaults[ $key ],
				'sanitize_callback' => 'sanitize_text_field',
			)
		);
		$wp_customize->add_control(
			'amlok_' . $key,
			array(
				'label'   => __( $label, 'amlok-iran' ),
				'section' => 'amlok_stats',
				'type'    => 'text',
			)
		);
	}
}
add_action( 'customize_register', 'amlok_customize_register' );

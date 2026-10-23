<?php
/**
 * توابع کمکی قالب: آیکن‌ها، قالب‌بندی اعداد فارسی، خواندن اطلاعات ملک.
 *
 * @package amlok-iran
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * مقادیر پیش‌فرض تنظیمات (در سفارشی‌ساز قابل تغییرند).
 */
function amlok_defaults() {
	return array(
		'contact_phone'          => '021-22345678',
		'contact_email'          => 'hello@amlokiran.ir',
		'contact_address1'       => 'تهران، خیابان ولیعصر، بالاتر از میدان ونک',
		'contact_address2'       => 'برج آرمان، طبقه ۲۴، واحد ۲۴۰۰',
		'contact_hours'          => 'شنبه تا پنجشنبه، ۹:۰۰ تا ۱۸:۰۰',
		'contact_license'        => 'دارای مجوز رسمی از اتحادیه مشاوران املاک',
		'social_linkedin'        => 'https://www.linkedin.com/',
		'social_instagram'       => 'https://www.instagram.com/',
		'social_facebook'        => 'https://www.facebook.com/',
		'hero_eyebrow'           => 'املاک لوکس · از سال ۱۳۸۳',
		'hero_title_line1'       => 'خانه‌های استثنایی و',
		'hero_title_line2'       => 'سرمایه‌گذاری‌های درجه‌یک',
		'hero_subtitle'          => 'ویلاها و املاک ممتاز در بهترین موقعیت‌ها. خانه رویایی یا سرمایه‌گذاری مطمئن خود را با خیالی آسوده بیابید.',
		'stat1_value'            => '۱۸',
		'stat1_label'            => 'سال تجربه مشاوره',
		'stat2_value'            => '+۱۲۰۰',
		'stat2_label'            => 'ملک منتقل‌شده',
		'stat3_value'            => '۴٫۸ میلیارد دلار',
		'stat3_label'            => 'حجم معاملات',
		'dstat1_value'           => '۴٫۸ میلیارد دلار',
		'dstat1_label'           => 'فروش به امروز',
		'dstat2_value'           => '+۱۲۰۰',
		'dstat2_label'           => 'خانواده ساکن‌شده',
		'dstat3_value'           => '۱۸',
		'dstat3_label'           => 'سال فعالیت',
		'dstat4_value'           => '۹۶٪',
		'dstat4_label'           => 'نسبت قیمت فروش به اعلامی',
	);
}

/** خواندن یک تنظیم از سفارشی‌ساز. */
function amlok_setting( $key ) {
	$defaults = amlok_defaults();
	$default  = isset( $defaults[ $key ] ) ? $defaults[ $key ] : '';
	return get_theme_mod( 'amlok_' . $key, $default );
}

/** تبدیل ارقام لاتین به فارسی و جداکننده هزارگان. */
function amlok_fa_num( $value ) {
	$en = array( '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',' );
	$fa = array( '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '٬' );
	return str_replace( $en, $fa, (string) $value );
}

/** قیمت به شکل خوانا: میلیارد / میلیون تومان. */
function amlok_price_label( $price ) {
	$price = (float) $price;
	if ( $price <= 0 ) {
		return __( 'توافقی', 'amlok-iran' );
	}
	if ( $price >= 1000000000 ) {
		$value = (string) round( $price / 1000000000, 1 );
		$value = rtrim( rtrim( $value, '0' ), '.' );
		return amlok_fa_num( str_replace( '.', '٫', $value ) ) . ' میلیارد تومان';
	}
	if ( $price >= 1000000 ) {
		$value = (string) round( $price / 1000000, 1 );
		$value = rtrim( rtrim( $value, '0' ), '.' );
		return amlok_fa_num( str_replace( '.', '٫', $value ) ) . ' میلیون تومان';
	}
	return amlok_fa_num( number_format( $price ) ) . ' تومان';
}

/** برچسب نوع معامله. */
function amlok_period_label( $period ) {
	return 'for-rent' === $period ? __( 'اجاره', 'amlok-iran' ) : __( 'فروش', 'amlok-iran' );
}

/** تاریخ به فارسی (شمسی با افزونه‌ی تقویم، در غیر این صورت میلادی با ارقام فارسی). */
function amlok_fa_date( $timestamp ) {
	return amlok_fa_num( date_i18n( 'j F Y', $timestamp ) );
}

/** تصویر پیوست یا آدرس بیرونی، با کلاس و اندازه دلخواه. */
function amlok_image( $id_or_url, $size = 'large', $class = '', $sizes_attr = '' ) {
	if ( empty( $id_or_url ) ) {
		return '';
	}
	if ( is_numeric( $id_or_url ) ) {
		$attr = array( 'loading' => 'lazy', 'decoding' => 'async' );
		if ( $class ) {
			$attr['class'] = $class;
		}
		if ( $sizes_attr ) {
			$attr['sizes'] = $sizes_attr;
		}
		return wp_get_attachment_image( (int) $id_or_url, $size, false, $attr );
	}
	return sprintf(
		'<img src="%s" alt="" loading="lazy" decoding="async" class="%s" />',
		esc_url( $id_or_url ),
		esc_attr( $class )
	);
}

/** آدرس کامل تصویر (پیوست یا آدرس بیرونی) برای گالری. */
function amlok_image_url( $id_or_url, $size = 'large' ) {
	if ( empty( $id_or_url ) ) {
		return '';
	}
	if ( is_numeric( $id_or_url ) ) {
		$src = wp_get_attachment_image_src( (int) $id_or_url, $size );
		return $src ? $src[0] : '';
	}
	return esc_url_raw( $id_or_url );
}

/** متنی که هر خط آن یک آیتم است (ویژگی‌ها و امکانات). */
function amlok_lines( $value ) {
	$lines = preg_split( '/\r\n|\r|\n/', (string) $value );
	$lines = array_filter( array_map( 'trim', $lines ) );
	return array_values( $lines );
}

/** شناسه‌های تصاویر گالری (عددی یا آدرس) از فیلد متنی. */
function amlok_gallery_ids( $value ) {
	$parts = array_filter( array_map( 'trim', explode( ',', (string) $value ) ) );
	return array_values( $parts );
}

/**
 * خواندن همه داده‌های یک ملک، با کش درون‌حافظه.
 */
function amlok_property_data( $post_id = 0 ) {
	static $cache = array();

	$post_id = $post_id ? (int) $post_id : get_the_ID();
	if ( isset( $cache[ $post_id ] ) ) {
		return $cache[ $post_id ];
	}

	$locations = wp_get_post_terms( $post_id, 'ai_location', array( 'fields' => 'names' ) );
	$types     = wp_get_post_terms( $post_id, 'ai_type', array( 'fields' => 'names' ) );

	$price = (float) get_post_meta( $post_id, '_ai_price', true );
	$data  = array(
		'id'          => $post_id,
		'title'       => get_the_title( $post_id ),
		'permalink'   => get_permalink( $post_id ),
		'cover'       => get_post_thumbnail_id( $post_id ),
		'price'       => $price,
		'price_label' => amlok_price_label( $price ),
		'period'      => get_post_meta( $post_id, '_ai_period', true ) ?: 'for-sale',
		'bedrooms'    => (int) get_post_meta( $post_id, '_ai_bedrooms', true ),
		'bathrooms'   => (int) get_post_meta( $post_id, '_ai_bathrooms', true ),
		'area'        => (float) get_post_meta( $post_id, '_ai_area', true ),
		'year'        => get_post_meta( $post_id, '_ai_year', true ),
		'garage'      => get_post_meta( $post_id, '_ai_garage', true ),
		'lot'         => get_post_meta( $post_id, '_ai_lot', true ),
		'features'    => amlok_lines( get_post_meta( $post_id, '_ai_features', true ) ),
		'amenities'   => amlok_lines( get_post_meta( $post_id, '_ai_amenities', true ) ),
		'gallery'     => amlok_gallery_ids( get_post_meta( $post_id, '_ai_gallery', true ) ),
		'agent_id'    => (int) get_post_meta( $post_id, '_ai_agent', true ),
		'featured'    => (bool) get_post_meta( $post_id, '_ai_featured', true ),
		'location'    => $locations ? implode( '، ', $locations ) : '',
		'type'        => $types ? $types[0] : '',
	);

	$cache[ $post_id ] = $data;
	return $data;
}

/** آیکن‌های خطی قالب (همان مجموعه طراحی اصلی). */
function amlok_icons() {
	return array(
		'phone'          => array( 'd' => array( 'M6.4 3.6h2.8l1.4 3.7-2 1.4a11.7 11.7 0 0 0 5.5 5.5l1.4-2 3.7 1.4v2.8c0 .9-.7 1.6-1.6 1.6A15.9 15.9 0 0 1 4.8 5.2c0-.9.7-1.6 1.6-1.6Z' ) ),
		'arrow-right'    => array( 'd' => array( 'M4 12h15', 'm12.8 5.8 6.2 6.2-6.2 6.2' ) ),
		'arrow-left'     => array( 'd' => array( 'M20 12H5', 'm11.2 5.8L5 12l6.2 6.2' ) ),
		'arrow-up-right' => array( 'd' => array( 'M7 17 17 7', 'M9 7h8v8' ) ),
		'chevron-left'   => array( 'd' => array( 'M14.5 5.5 8 12l6.5 6.5' ) ),
		'chevron-right'  => array( 'd' => array( 'M9.5 5.5 16 12l-6.5 6.5' ) ),
		'chevron-down'   => array( 'd' => array( 'M5.5 9.5 12 16l6.5-6.5' ) ),
		'heart'          => array( 'd' => array( 'M12 20.2S3.8 15.4 3.8 10.1A4.6 4.6 0 0 1 12 7.1a4.6 4.6 0 0 1 8.2 3c0 5.3-8.2 10.1-8.2 10.1Z' ) ),
		'bed'            => array( 'd' => array( 'M3.5 18.5V7', 'M3.5 12.5h17V18.5', 'M20.5 12.5V9.6a2.1 2.1 0 0 0-2.1-2.1H9.4v5', 'M7.1 10.6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z' ) ),
		'bath'           => array( 'd' => array( 'M4 12.4h16', 'M6.4 12.4V8.1a3.1 3.1 0 0 1 6.1-.4', 'M4 12.4v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3', 'M7.4 18.4v2M16.6 18.4v2' ) ),
		'area'           => array( 'd' => array( 'M4 4h16v16H4z' ) ),
		'pin'            => array( 'd' => array( 'M12 20.8s6.4-5.1 6.4-9.9a6.4 6.4 0 1 0-12.8 0c0 4.8 6.4 9.9 6.4 9.9Z', 'M12 13.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z' ) ),
		'mail'           => array( 'd' => array( 'M4 6.5h16v11H4z', 'm4.6 7.4 7.4 5.2 7.4-5.2' ) ),
		'menu'           => array( 'd' => array( 'M4 7.5h16', 'M4 12h16', 'M4 16.5h16' ) ),
		'close'          => array( 'd' => array( 'M6.5 6.5l11 11', 'M17.5 6.5l-11 11' ) ),
		'search'         => array( 'd' => array( 'M10.6 16.8a6.2 6.2 0 1 0 0-12.4 6.2 6.2 0 0 0 0 12.4Z', 'm15.4 15.4 4.1 4.1' ) ),
		'check'          => array( 'd' => array( 'm5.5 12.4 4.4 4.4L18.8 7.6' ) ),
		'key'            => array( 'd' => array( 'M14.9 4a5.6 5.6 0 0 0-4.7 8.6L3.8 19v1.6h2.6l1-1v-1.5h1.6v-1.6h1.6l1.2-1.2A5.6 5.6 0 1 0 14.9 4Z', 'M16.3 7.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z' ) ),
		'calendar'       => array( 'd' => array( 'M4 6.5h16v13H4z', 'M4 10.6h16', 'M8.8 4v4M15.2 4v4' ) ),
		'sliders'        => array( 'd' => array( 'M4 7.5h4.5M12.5 7.5H20', 'M4 16.5h8.5M16.5 16.5H20', 'M11 4.5v6M14 13.5v6' ) ),
		'linkedin'       => array( 'd' => array( 'M4.5 4.5h15v15h-15z', 'M8.4 10.4v6.1M8.4 7.6v.02', 'M11.7 16.5v-3.6a2 2 0 0 1 4 0v3.6' ) ),
		'instagram'      => array( 'd' => array( 'M4.5 8.6A4.1 4.1 0 0 1 8.6 4.5h6.8a4.1 4.1 0 0 1 4.1 4.1v6.8a4.1 4.1 0 0 1-4.1 4.1H8.6a4.1 4.1 0 0 1-4.1-4.1V8.6Z', 'M12 15.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z', 'M16.9 7.3v.02' ) ),
		'facebook'       => array( 'd' => array( 'M13.6 20.5v-7.7h2.5l.4-3h-2.9V8.1c0-.9.3-1.5 1.6-1.5h1.6V4.1c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.1H8.1v3h2.3v7.3h3.2Z' ), 'fill' => true ),
		'star'           => array( 'd' => array( 'm12 4.4 2.3 4.9 5.3.8-3.8 3.7.9 5.3-4.7-2.5-4.7 2.5.9-5.3L4.4 10l5.3-.8L12 4.4Z' ) ),
		'shield'         => array( 'd' => array( 'M12 3.6 19 6.1v5.4c0 4.4-2.9 7.4-7 8.9-4.1-1.5-7-4.5-7-8.9V6.1l7-2.5Z', 'm9.2 12 2.2 2.2 3.6-3.9' ) ),
		'trend'          => array( 'd' => array( 'M4 16.6 10 10.5l3.5 3.5L20 7.2', 'M15.4 7.2H20v4.6' ) ),
		'users'          => array( 'd' => array( 'M8.6 11.4a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Z', 'M3.6 19.6a5 5 0 0 1 10 0', 'M15.6 11.6a3.1 3.1 0 1 0-1.7-5.7', 'M17.2 19.6a5.1 5.1 0 0 0-1.5-3.6' ) ),
		'home'           => array( 'd' => array( 'M4 11 12 4.2 20 11v9H4v-9Z', 'M10 20v-5.2h4V20' ) ),
	);
}

/** چاپ آیکن SVG. */
function amlok_icon( $name, $size = 20, $class = '', $stroke = 1.5 ) {
	$icons = amlok_icons();
	if ( ! isset( $icons[ $name ] ) ) {
		return;
	}
	$icon  = $icons[ $name ];
	$fill  = ! empty( $icon['fill'] ) ? 'currentColor' : 'none';
	$line  = ! empty( $icon['fill'] ) ? 'none' : 'currentColor';
	$class = $class ? ' ' . $class : '';

	echo '<svg viewBox="0 0 24 24" width="' . esc_attr( $size ) . '" height="' . esc_attr( $size ) . '" class="' . esc_attr( ltrim( $class ) ) . '" fill="' . esc_attr( $fill ) . '" stroke="' . esc_attr( $line ) . '" stroke-width="' . esc_attr( $stroke ) . '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
	foreach ( $icon['d'] as $d ) {
		echo '<path d="' . esc_attr( $d ) . '" />';
	}
	echo '</svg>';
}

/** منوی پیش‌فرض وقتی هنوز منویی ثبت نشده. */
function amlok_menu_fallback() {
	$saved_page   = get_page_by_path( 'saved' );
	$contact_page = get_page_by_path( 'contact' );
	$items        = array(
		__( 'خانه', 'amlok-iran' )      => home_url( '/' ),
		__( 'املاک', 'amlok-iran' )     => get_post_type_archive_link( 'property' ) ?: home_url( '/' ),
		__( 'درباره ما', 'amlok-iran' ) => home_url( '/#about' ),
		__( 'خدمات', 'amlok-iran' )     => home_url( '/#services' ),
		__( 'تیم ما', 'amlok-iran' )    => home_url( '/#team' ),
	);
	if ( $contact_page ) {
		$items[ __( 'تماس با ما', 'amlok-iran' ) ] = get_permalink( $contact_page );
	}
	if ( $saved_page ) {
		$items[ __( 'علاقه‌مندی‌ها', 'amlok-iran' ) ] = get_permalink( $saved_page );
	}

	echo '<ul class="site-nav-menu flex items-center gap-9">';
	foreach ( $items as $label => $url ) {
		echo '<li class="menu-item"><a class="site-nav-link" href="' . esc_url( $url ) . '">' . esc_html( $label ) . '</a></li>';
	}
	echo '</ul>';
}

/** شماره تماس به شکل لینک tel:. */
function amlok_phone_href() {
	$raw = amlok_setting( 'contact_phone' );
	return 'tel:+' . preg_replace( '/[^0-9]/', '', $raw );
}

/** شماره تماس به شکل نمایشی فارسی. */
function amlok_phone_display() {
	return amlok_fa_num( amlok_setting( 'contact_phone' ) );
}

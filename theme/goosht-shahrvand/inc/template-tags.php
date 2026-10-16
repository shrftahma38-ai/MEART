<?php
/**
 * Helpers shared across the theme templates.
 *
 * @package Goosht_Shahrvand
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Every default value of the theme, in one place.
 *
 * @return array
 */
function gsh_defaults() {
	return array(
		// Colours.
		'gsh_accent'      => '#a01212',
		'gsh_accent_dark' => '#6f0b0b',
		'gsh_bg'          => '#1a1a1a',
		'gsh_panel'       => '#232323',
		'gsh_text'        => '#ffffff',
		'gsh_muted'       => '#cccccc',

		// Identity.
		'gsh_force_rtl'   => true,

		// Contact details.
		'gsh_address'     => 'تهران، خیابان ولیعصر، پلاک ۱۲۴',
		'gsh_phone'       => '۰۲۱ ۵۵۵۵ ۵۵۵۵',
		'gsh_phone_link'  => '02155555555',
		'gsh_email'       => 'info@goosht-shahrvand.example',
		'gsh_hours'       => 'هر روز از ساعت ۹ تا ۲۱',
		'gsh_map_url'     => 'https://www.openstreetmap.org/export/embed.html?bbox=51.3800%2C35.6800%2C51.4400%2C35.7300&layer=mapnik&marker=35.7050%2C51.4100',

		// Hero slider.
		'gsh_hero_speed'  => 6,
		'gsh_hero_1_image'    => GSH_URI . 'assets/images/hero-1.svg',
		'gsh_hero_1_title'    => 'گوشت شهروند',
		'gsh_hero_1_subtitle' => 'بازار گوشت و پروتئین تازه',
		'gsh_hero_1_button_text' => 'مشاهده محصولات',
		'gsh_hero_1_button_url'  => '',
		'gsh_hero_2_image'    => GSH_URI . 'assets/images/hero-2.svg',
		'gsh_hero_2_title'    => 'تازه از کشتارگاه',
		'gsh_hero_2_subtitle' => 'گوشت گوساله و گوسفندی، روزانه و تازه',
		'gsh_hero_2_button_text' => 'تماس با ما',
		'gsh_hero_2_button_url'  => '',
		'gsh_hero_3_image'    => GSH_URI . 'assets/images/hero-3.svg',
		'gsh_hero_3_title'    => 'برش به سفارش شما',
		'gsh_hero_3_subtitle' => 'استیک، خورشتی، چرخ‌کرده و کبابی',
		'gsh_hero_3_button_text' => 'گالری تصاویر',
		'gsh_hero_3_button_url'  => '',

		// About.
		'gsh_about_title'       => 'درباره ما',
		'gsh_about_text'        => 'گوشت شهروند با بیش از دو دهه تجربه در بازار گوشت و پروتئین، گوشت تازه را روزانه از کشتارگاه‌های معتبر تهیه می‌کند و بدون واسطه به دست شما می‌رساند. تمام برش‌ها در محل و به سفارش مشتری آماده می‌شوند.',
		'gsh_about_image'       => GSH_URI . 'assets/images/about.svg',
		'gsh_about_button_text' => 'بیشتر بخوانید',
		'gsh_about_button_url'  => '',

		// Products.
		'gsh_products_title'       => 'محصولات',
		'gsh_products_intro'       => 'منتخبی از تازه‌ترین برش‌های گوشت گوساله، گوسفندی و مرغ؛ آماده برای پخت و مصرف روزانه.',
		'gsh_products_count'       => 6,
		'gsh_products_button_text' => 'مشاهده محصولات',
		'gsh_products_button_url'  => '',

		// Gallery.
		'gsh_gallery_title'       => 'گالری',
		'gsh_gallery_text'        => 'تصاویری از فروشگاه، آماده‌سازی گوشت و سفارش‌های مشتریان. برای دیدن تصویر در اندازه بزرگ روی آن کلیک کنید.',
		'gsh_gallery_button_text' => 'مشاهده گالری',
		'gsh_gallery_button_url'  => '',
		'gsh_gallery_1'           => GSH_URI . 'assets/images/gallery-1.svg',
		'gsh_gallery_2'           => GSH_URI . 'assets/images/gallery-2.svg',
		'gsh_gallery_3'           => GSH_URI . 'assets/images/gallery-3.svg',
		'gsh_gallery_4'           => GSH_URI . 'assets/images/gallery-4.svg',
		'gsh_gallery_5'           => GSH_URI . 'assets/images/gallery-5.svg',
		'gsh_gallery_6'           => GSH_URI . 'assets/images/gallery-6.svg',

		// Footer.
		'gsh_footer_about'  => 'گوشت شهروند، فروشگاه گوشت و پروتئین با ضمانت تازگی و کیفیت. سفارش تلفنی و ارسال سریع در تهران.',
		'gsh_copyright'     => 'تمام حقوق برای گوشت شهروند محفوظ است.',
		'gsh_social_instagram' => '#',
		'gsh_social_telegram'  => '#',
		'gsh_social_whatsapp'  => '#',
		'gsh_social_facebook'  => '#',
		'gsh_social_linkedin'  => '#',
	);
}

/**
 * Read a theme option with its built-in default.
 *
 * @param string $key      Setting id.
 * @param mixed  $fallback Fallback when the key is unknown.
 * @return mixed
 */
function gsh_mod( $key, $fallback = '' ) {
	$defaults = gsh_defaults();
	$default  = isset( $defaults[ $key ] ) ? $defaults[ $key ] : $fallback;

	return get_theme_mod( $key, $default );
}

/**
 * Reading direction of the site.
 *
 * @return string Either "rtl" or "ltr".
 */
function gsh_text_direction() {
	if ( is_rtl() || gsh_mod( 'gsh_force_rtl', true ) ) {
		return 'rtl';
	}

	return 'ltr';
}

/**
 * Permalink of a page by its slug, falling back to the home page.
 *
 * @param string $slug Page slug.
 * @return string
 */
function gsh_page_url( $slug ) {
	$page = get_page_by_path( $slug );

	return $page ? get_permalink( $page ) : home_url( '/' );
}

/**
 * Convert latin digits to Persian digits.
 *
 * @param string|int $value Value to convert.
 * @return string
 */
function gsh_fa_num( $value ) {
	$latin    = array( '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' );
	$persian  = array( '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹' );

	return str_replace( $latin, $persian, (string) $value );
}

/**
 * Hero slides built from the customizer.
 *
 * @return array
 */
function gsh_get_hero_slides() {
	$slides = array();

	for ( $i = 1; $i <= 3; $i++ ) {
		$slide = array(
			'image'       => gsh_mod( "gsh_hero_{$i}_image" ),
			'title'       => gsh_mod( "gsh_hero_{$i}_title" ),
			'subtitle'    => gsh_mod( "gsh_hero_{$i}_subtitle" ),
			'button_text' => gsh_mod( "gsh_hero_{$i}_button_text" ),
			'button_url'  => gsh_mod( "gsh_hero_{$i}_button_url" ),
		);

		if ( $slide['image'] || $slide['title'] ) {
			$slides[] = $slide;
		}
	}

	return $slides;
}

/**
 * Gallery images built from the customizer.
 *
 * @return array
 */
function gsh_get_gallery_images() {
	$images = array();

	for ( $i = 1; $i <= 6; $i++ ) {
		$url = gsh_mod( "gsh_gallery_{$i}" );
		if ( $url ) {
			$images[] = $url;
		}
	}

	return $images;
}

/**
 * Social networks configured in the customizer.
 *
 * @return array
 */
function gsh_social_links() {
	$networks = array(
		'instagram' => 'اینستاگرام',
		'telegram'  => 'تلگرام',
		'whatsapp'  => 'واتس‌اپ',
		'facebook'  => 'فیسبوک',
		'linkedin'  => 'لینکدین',
	);
	$links    = array();

	foreach ( $networks as $network => $label ) {
		$url = gsh_mod( 'gsh_social_' . $network );
		/*
		 * The shipped default is "#": it renders the network's icon in the footer so the
		 * design is complete out of the box, without pointing at somebody else's account.
		 * Replace it in Appearance → Customize with the real profile URL.
		 */
		if ( $url ) {
			$links[] = array(
				'network' => $network,
				'label'   => $label,
				'url'     => $url,
			);
		}
	}

	return $links;
}

/**
 * Contact rows shown in the header bar and the footer.
 *
 * @return array
 */
function gsh_contact_rows() {
	$rows = array();

	if ( gsh_mod( 'gsh_address' ) ) {
		$rows[] = array(
			'icon'  => 'pin',
			'label' => gsh_mod( 'gsh_address' ),
			'url'   => '',
		);
	}

	$phone      = gsh_mod( 'gsh_phone' );
	$phone_link = gsh_mod( 'gsh_phone_link' );
	if ( $phone ) {
		$rows[] = array(
			'icon'  => 'phone',
			'label' => $phone,
			'url'   => $phone_link ? 'tel:' . preg_replace( '/[^0-9+]/', '', $phone_link ) : '',
		);
	}

	if ( gsh_mod( 'gsh_email' ) ) {
		$rows[] = array(
			'icon'  => 'mail',
			'label' => gsh_mod( 'gsh_email' ),
			'url'   => 'mailto:' . gsh_mod( 'gsh_email' ),
		);
	}

	if ( gsh_mod( 'gsh_hours' ) ) {
		$rows[] = array(
			'icon'  => 'clock',
			'label' => gsh_mod( 'gsh_hours' ),
			'url'   => '',
		);
	}

	return $rows;
}

/**
 * Site name / logo lockup used in the header and the footer.
 */
function gsh_brand() {
	if ( has_custom_logo() ) {
		the_custom_logo();

		return;
	}

	$tagline = get_bloginfo( 'description', 'display' );
	?>
	<a class="gsh-brand-link" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
		<span class="gsh-brand-name"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></span>
		<?php if ( $tagline ) : ?>
			<span class="gsh-brand-tag"><?php echo esc_html( $tagline ); ?></span>
		<?php endif; ?>
	</a>
	<?php
}

/**
 * Red section heading with the underline rule from the design.
 *
 * @param string $title    Heading text.
 * @param string $subtitle Optional lead paragraph.
 */
function gsh_section_heading( $title, $subtitle = '' ) {
	if ( ! $title ) {
		return;
	}

	echo '<header class="gsh-section-head">';
	echo '<h2 class="gsh-section-title">' . esc_html( $title ) . '</h2>';
	echo '<span class="gsh-rule" aria-hidden="true"></span>';
	if ( $subtitle ) {
		echo '<p class="gsh-section-sub">' . esc_html( $subtitle ) . '</p>';
	}
	echo '</header>';
}

/**
 * URL of the WooCommerce shop, when WooCommerce is there.
 *
 * @return string
 */
function gsh_shop_url() {
	if ( function_exists( 'wc_get_page_permalink' ) ) {
		$shop = wc_get_page_permalink( 'shop' );
		if ( $shop ) {
			return $shop;
		}
	}

	return gsh_page_url( 'products' );
}

/**
 * Inline SVG icons used across the theme.
 *
 * @param string $name Icon name.
 * @param int    $size Pixel size.
 * @param string $class Extra CSS class.
 * @return string
 */
function gsh_icon( $name, $size = 20, $class = '' ) {
	$icons = array(
		'pin'      => '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
		'phone'    => '<path d="M6.6 3h3l1.5 4-2 1.4a12 12 0 0 0 6.5 6.5l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3z"/>',
		'mail'     => '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>',
		'clock'    => '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
		'search'   => '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
		'chevron-left'  => '<path d="m14.5 6-6 6 6 6"/>',
		'chevron-right' => '<path d="m9.5 6 6 6-6 6"/>',
		'cart'     => '<circle cx="9.5" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M3 4h2.3l2.4 11.2h11L21 7H6"/>',
		'menu'     => '<path d="M4 7h16M4 12h16M4 17h16"/>',
		'close'    => '<path d="M6 6 18 18M18 6 6 18"/>',
		'instagram' => '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><path d="M16.7 7.3h.01"/>',
		'telegram'  => '<path d="M21 5 3.7 11.4l4.6 1.4 1 5.2 2.6-3 4.6 3.3z"/>',
		'whatsapp'  => '<path d="M4.2 19.8 5.6 16A8 8 0 1 1 12 20a8 8 0 0 1-3.7-.9z"/><path d="M9.2 9.6c0 2.8 2.4 5.2 5.2 5.2.5 0 .9-.4.9-.9l-.2-.9-1.2-.4-.6.7a4.3 4.3 0 0 1-2-2l.7-.6-.4-1.2-.9-.2c-.5 0-.9.4-.9.9z"/>',
		'facebook'  => '<path d="M13.6 21v-7h2.3l.4-2.9h-2.7V9.3c0-.8.3-1.4 1.5-1.4h1.3V5.2c-.6-.1-1.4-.2-2.3-.2-2.4 0-4 1.4-4 4.1v2h-2.3V14h2.3v7z"/>',
		'linkedin'  => '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 10.5V17M8 7.7v.01M12 17v-3.6c0-1 .7-1.7 1.7-1.7s1.6.8 1.6 1.8V17"/>',
		'zoom'     => '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/><path d="M11 8.8v4.4M8.8 11h4.4"/>',
	);

	if ( ! isset( $icons[ $name ] ) ) {
		return '';
	}

	return sprintf(
		'<svg class="gsh-icon gsh-icon-%1$s %2$s" width="%3$d" height="%3$d" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">%4$s</svg>',
		esc_attr( $name ),
		esc_attr( $class ),
		(int) $size,
		$icons[ $name ]
	);
}

/**
 * Post meta line for blog templates.
 */
function gsh_post_meta() {
	printf(
		'<div class="gsh-meta"><span class="gsh-meta-date">%1$s</span><span class="gsh-meta-author">%2$s</span></div>',
		esc_html( get_the_date() ),
		esc_html( get_the_author() )
	);
}

<?php
/**
 * Creates the Persian demo catalogue for the sandbox.
 *
 * Executed by sandbox/seed/seed.sh as:
 *   wp eval-file /seed/demo-products.php <attachment-id> <attachment-id> …
 *
 * The attachment ids come from the imported demo photos and are handed to the script in $args.
 *
 * @package Goosht_Shahrvand_Sandbox
 */

if ( ! class_exists( 'WC_Product_Simple' ) ) {
	echo "WooCommerce is not active – demo products skipped.\n";

	return;
}

$gsh_media = array();

if ( isset( $args ) && is_array( $args ) ) {
	foreach ( $args as $gsh_arg ) {
		if ( is_numeric( $gsh_arg ) ) {
			$gsh_media[] = (int) $gsh_arg;
		}
	}
}

/**
 * Return the term id of a product category, creating it when needed.
 *
 * @param string $name Category name.
 * @return int
 */
function gsh_demo_category( $name ) {
	$term = term_exists( $name, 'product_cat' );

	if ( ! $term ) {
		$term = wp_insert_term( $name, 'product_cat' );
	}

	if ( is_wp_error( $term ) ) {
		return 0;
	}

	return is_array( $term ) ? (int) $term['term_id'] : (int) $term;
}

$gsh_catalogue = array(
	array(
		'name'    => 'استیک ریب‌آی گوساله',
		'category' => 'گوشت گوساله',
		'price'   => 980000,
		'sale'    => 890000,
		'short'   => 'برش ضخیم و تازه، مناسب گریل و کباب.',
		'desc'    => 'استیک ریب‌آی از ناحیه دنده گوساله برش می‌خورد و چربی میان‌بافتی آن باعث طعم و آبدار بودن گوشت پس از پخت می‌شود. برش به سفارش مشتری و در حضور او انجام می‌شود.',
	),
	array(
		'name'    => 'گوشت چرخ‌کرده مخلوط',
		'category' => 'گوشت گوساله',
		'price'   => 480000,
		'sale'    => '',
		'short'   => 'مناسب کباب، کوفته و سس گوشت.',
		'desc'    => 'گوشت چرخ‌کرده روزانه با نسبت استاندارد چربی و گوشت خالص تهیه می‌شود؛ بدون افزودنی و مناسب پخت خانگی.',
	),
	array(
		'name'    => 'فیله گوسفندی',
		'category' => 'گوشت گوسفندی',
		'price'   => 1250000,
		'sale'    => '',
		'short'   => 'لطیف‌ترین برش گوسفندی برای گریل.',
		'desc'    => 'فیله گوسفندی از نرم‌ترین بخش لاشه تهیه می‌شود و برای گریل و استیک‌های کوچک ایده‌آل است.',
	),
	array(
		'name'    => 'راسته گوسفندی',
		'category' => 'گوشت گوسفندی',
		'price'   => 890000,
		'sale'    => 820000,
		'short'   => 'مناسب خورش و کباب سنتی.',
		'desc'    => 'راسته گوسفندی با استخوان و برش استاندارد، مناسب خورش‌های سنتی ایرانی و کباب.',
	),
	array(
		'name'    => 'مرغ تازه کامل',
		'category' => 'مرغ و پرندگان',
		'price'   => 165000,
		'sale'    => '',
		'short'   => 'کشتار روز، بدون انجماد.',
		'desc'    => 'مرغ تازه کامل، سالم و بدون انجماد؛ آماده برای پخت و بسته‌بندی بهداشتی.',
	),
	array(
		'name'    => 'کباب کوبیده آماده',
		'category' => 'آماده پخت',
		'price'   => 620000,
		'sale'    => '',
		'short'   => 'با ادویه مخصوص گوشت شهروند.',
		'desc'    => 'کباب کوبیده آماده با گوشت تازه گوساله و ادویه مخصوص؛ مناسب پخت سریع در منزل و سفره‌های مهمانی.',
	),
);

$gsh_index  = 0;
$gsh_created = array();

foreach ( $gsh_catalogue as $gsh_item ) {
	$gsh_category_id = gsh_demo_category( $gsh_item['category'] );

	$gsh_product = new WC_Product_Simple();
	$gsh_product->set_name( $gsh_item['name'] );
	$gsh_product->set_status( 'publish' );
	$gsh_product->set_catalog_visibility( 'visible' );
	$gsh_product->set_regular_price( (string) $gsh_item['price'] );

	if ( $gsh_item['sale'] ) {
		$gsh_product->set_sale_price( (string) $gsh_item['sale'] );
	}

	$gsh_product->set_short_description( $gsh_item['short'] );
	$gsh_product->set_description( $gsh_item['desc'] );
	$gsh_product->set_sku( 'GSH-' . ( 100 + $gsh_index ) );
	$gsh_product->set_manage_stock( false );
	$gsh_product->set_stock_status( 'instock' );

	if ( $gsh_category_id ) {
		$gsh_product->set_category_ids( array( $gsh_category_id ) );
	}

	if ( ! empty( $gsh_media ) ) {
		$gsh_image_id = $gsh_media[ $gsh_index % count( $gsh_media ) ];
		$gsh_product->set_image_id( $gsh_image_id );
	}

	$gsh_product_id = $gsh_product->save();

	$gsh_created[] = $gsh_product_id;
	++$gsh_index;
}

printf( "  · created %d products\n", count( $gsh_created ) );
printf( "  · products per page: %d\n", (int) get_option( 'posts_per_page' ) );

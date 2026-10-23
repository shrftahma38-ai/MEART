<?php
/**
 * انواع محتوا: «ملک» و «مشاور»، طبقه‌بندی «منطقه» و «نوع ملک»، و جعبه‌های اطلاعات.
 *
 * @package amlok-iran
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** ثبت انواع محتوا و طبقه‌بندی‌ها. */
function amlok_register_content_types() {
	register_post_type(
		'property',
		array(
			'labels'       => array(
				'name'          => __( 'املاک', 'amlok-iran' ),
				'singular_name' => __( 'ملک', 'amlok-iran' ),
				'add_new'       => __( 'افزودن ملک', 'amlok-iran' ),
				'add_new_item'  => __( 'افزودن ملک جدید', 'amlok-iran' ),
				'edit_item'     => __( 'ویرایش ملک', 'amlok-iran' ),
				'search_items'  => __( 'جستجوی املاک', 'amlok-iran' ),
				'not_found'     => __( 'ملکی یافت نشد', 'amlok-iran' ),
			),
			'public'       => true,
			'has_archive'  => 'amlak',
			'rewrite'      => array( 'slug' => 'amlak' ),
			'menu_icon'    => 'dashicons-building',
			'menu_position' => 21,
			'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
			'show_in_rest' => false,
		)
	);

	register_post_type(
		'agent',
		array(
			'labels'       => array(
				'name'          => __( 'مشاوران', 'amlok-iran' ),
				'singular_name' => __( 'مشاور', 'amlok-iran' ),
				'add_new'       => __( 'افزودن مشاور', 'amlok-iran' ),
				'add_new_item'  => __( 'افزودن مشاور جدید', 'amlok-iran' ),
				'edit_item'     => __( 'ویرایش مشاور', 'amlok-iran' ),
			),
			'public'       => true,
			'has_archive'  => false,
			'rewrite'      => array( 'slug' => 'advisor' ),
			'menu_icon'    => 'dashicons-businessperson',
			'menu_position' => 22,
			'supports'     => array( 'title', 'editor', 'thumbnail' ),
			'show_in_rest' => false,
		)
	);

	register_taxonomy(
		'ai_location',
		'property',
		array(
			'labels'            => array(
				'name'          => __( 'منطقه‌ها', 'amlok-iran' ),
				'singular_name' => __( 'منطقه', 'amlok-iran' ),
				'add_new_item'  => __( 'افزودن منطقه جدید', 'amlok-iran' ),
			),
			'hierarchical'      => true,
			'meta_box_cb'       => 'post_categories_meta_box',
			'show_admin_column' => true,
			'show_in_rest'      => false,
		)
	);

	register_taxonomy(
		'ai_type',
		'property',
		array(
			'labels'            => array(
				'name'          => __( 'نوع ملک', 'amlok-iran' ),
				'singular_name' => __( 'نوع ملک', 'amlok-iran' ),
				'add_new_item'  => __( 'افزودن نوع جدید', 'amlok-iran' ),
			),
			'hierarchical'      => true,
			'meta_box_cb'       => 'post_categories_meta_box',
			'show_admin_column' => true,
			'show_in_rest'      => false,
		)
	);
}
add_action( 'init', 'amlok_register_content_types' );

/** جعبه اطلاعات ملک در پیشخوان. */
function amlok_property_meta_box() {
	add_meta_box(
		'amlok_property_details',
		__( 'مشخصات ملک', 'amlok-iran' ),
		'amlok_property_meta_box_html',
		'property',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'amlok_property_meta_box' );

/** نمایش جعبه اطلاعات ملک. */
function amlok_property_meta_box_html( $post ) {
	wp_nonce_field( 'amlok_property_meta', 'amlok_property_meta_nonce' );

	$price     = get_post_meta( $post->ID, '_ai_price', true );
	$period    = get_post_meta( $post->ID, '_ai_period', true ) ?: 'for-sale';
	$bedrooms  = get_post_meta( $post->ID, '_ai_bedrooms', true );
	$bathrooms = get_post_meta( $post->ID, '_ai_bathrooms', true );
	$area      = get_post_meta( $post->ID, '_ai_area', true );
	$year      = get_post_meta( $post->ID, '_ai_year', true );
	$garage    = get_post_meta( $post->ID, '_ai_garage', true );
	$lot       = get_post_meta( $post->ID, '_ai_lot', true );
	$features  = get_post_meta( $post->ID, '_ai_features', true );
	$amenities = get_post_meta( $post->ID, '_ai_amenities', true );
	$gallery   = get_post_meta( $post->ID, '_ai_gallery', true );
	$agent_id  = (int) get_post_meta( $post->ID, '_ai_agent', true );
	$featured  = get_post_meta( $post->ID, '_ai_featured', true );

	$agents = get_posts(
		array(
			'post_type'      => 'agent',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
		)
	);
	?>
	<style>
		.amlok-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
		.amlok-grid label, .amlok-full label { display: block; margin-bottom: 4px; font-weight: 600; }
		.amlok-grid input, .amlok-full input, .amlok-full select, .amlok-full textarea { width: 100%; }
		.amlok-full { margin-top: 12px; }
		.amlok-note { color: #666; font-size: 12px; margin-top: 4px; }
	</style>
	<div class="amlok-grid">
		<label><?php esc_html_e( 'قیمت (تومان)', 'amlok-iran' ); ?>
			<input type="number" min="0" step="1" name="amlok_price" value="<?php echo esc_attr( $price ); ?>" />
		</label>
		<label><?php esc_html_e( 'نوع معامله', 'amlok-iran' ); ?>
			<select name="amlok_period">
				<option value="for-sale" <?php selected( $period, 'for-sale' ); ?>><?php esc_html_e( 'فروش', 'amlok-iran' ); ?></option>
				<option value="for-rent" <?php selected( $period, 'for-rent' ); ?>><?php esc_html_e( 'اجاره', 'amlok-iran' ); ?></option>
			</select>
		</label>
		<label><?php esc_html_e( 'متراژ (متر مربع)', 'amlok-iran' ); ?>
			<input type="number" min="0" step="1" name="amlok_area" value="<?php echo esc_attr( $area ); ?>" />
		</label>
		<label><?php esc_html_e( 'اتاق خواب', 'amlok-iran' ); ?>
			<input type="number" min="0" step="1" name="amlok_bedrooms" value="<?php echo esc_attr( $bedrooms ); ?>" />
		</label>
		<label><?php esc_html_e( 'سرویس بهداشتی', 'amlok-iran' ); ?>
			<input type="number" min="0" step="1" name="amlok_bathrooms" value="<?php echo esc_attr( $bathrooms ); ?>" />
		</label>
		<label><?php esc_html_e( 'سال ساخت (شمسی)', 'amlok-iran' ); ?>
			<input type="text" name="amlok_year" value="<?php echo esc_attr( $year ); ?>" placeholder="۱۴۰۰" />
		</label>
		<label><?php esc_html_e( 'پارکینگ (تعداد)', 'amlok-iran' ); ?>
			<input type="number" min="0" step="1" name="amlok_garage" value="<?php echo esc_attr( $garage ); ?>" />
		</label>
		<label><?php esc_html_e( 'مساحت زمین', 'amlok-iran' ); ?>
			<input type="text" name="amlok_lot" value="<?php echo esc_attr( $lot ); ?>" placeholder="۴۵۰ متر مربع" />
		</label>
		<label><?php esc_html_e( 'مشاور مسئول', 'amlok-iran' ); ?>
			<select name="amlok_agent">
				<option value=""><?php esc_html_e( '— بدون مشاور —', 'amlok-iran' ); ?></option>
				<?php foreach ( $agents as $agent ) : ?>
					<option value="<?php echo esc_attr( $agent->ID ); ?>" <?php selected( $agent_id, $agent->ID ); ?>><?php echo esc_html( $agent->post_title ); ?></option>
				<?php endforeach; ?>
			</select>
		</label>
	</div>

	<div class="amlok-full">
		<label><?php esc_html_e( 'ویژگی‌های کلیدی (هر خط یک مورد)', 'amlok-iran' ); ?>
			<textarea name="amlok_features" rows="5"><?php echo esc_textarea( $features ); ?></textarea>
		</label>
	</div>
	<div class="amlok-full">
		<label><?php esc_html_e( 'امکانات (هر خط یک مورد)', 'amlok-iran' ); ?>
			<textarea name="amlok_amenities" rows="5"><?php echo esc_textarea( $amenities ); ?></textarea>
		</label>
	</div>
	<div class="amlok-full">
		<label><?php esc_html_e( 'شناسه تصاویر گالری (جداشده با ویرگول)', 'amlok-iran' ); ?>
			<input type="text" name="amlok_gallery" value="<?php echo esc_attr( $gallery ); ?>" />
		</label>
		<p class="amlok-note">
			<?php esc_html_e( 'شناسه هر تصویر را از «رسانه ← کتابخانه» کپی کنید (در ستون «کد» یا از نشانی فایل). تصویر شاخص، تصویر اصلی آگهی است. آدرس کامل تصویر بیرونی هم پذیرفته می‌شود.', 'amlok-iran' ); ?>
		</p>
	</div>
	<div class="amlok-full">
		<label>
			<input type="checkbox" name="amlok_featured" value="1" <?php checked( $featured, '1' ); ?> />
			<?php esc_html_e( 'نمایش در بخش «املاک ویژه» صفحه اصلی', 'amlok-iran' ); ?>
		</label>
	</div>
	<?php
}

/** ذخیره اطلاعات ملک. */
function amlok_save_property_meta( $post_id ) {
	if ( ! isset( $_POST['amlok_property_meta_nonce'] )
		|| ! wp_verify_nonce( sanitize_key( $_POST['amlok_property_meta_nonce'] ), 'amlok_property_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$number_fields = array( 'amlok_price', 'amlok_area', 'amlok_bedrooms', 'amlok_bathrooms', 'amlok_garage' );
	foreach ( $number_fields as $field ) {
		$key = '_' . $field;
		if ( isset( $_POST[ $field ] ) && '' !== $_POST[ $field ] ) {
			update_post_meta( $post_id, $key, sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) );
		} else {
			delete_post_meta( $post_id, $key );
		}
	}

	$text_fields = array( 'amlok_year', 'amlok_lot', 'amlok_features', 'amlok_amenities', 'amlok_gallery' );
	foreach ( $text_fields as $field ) {
		$key = '_' . $field;
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- ویژگی‌ها و امکانات چندخطی‌اند و در خروجی esc می‌شوند.
		update_post_meta( $post_id, $key, sanitize_textarea_field( wp_unslash( $_POST[ $field ] ?? '' ) ) );
	}

	update_post_meta( $post_id, '_ai_period', in_array( $_POST['amlok_period'] ?? '', array( 'for-sale', 'for-rent' ), true ) ? sanitize_key( $_POST['amlok_period'] ) : 'for-sale' );
	update_post_meta( $post_id, '_ai_agent', isset( $_POST['amlok_agent'] ) ? absint( $_POST['amlok_agent'] ) : 0 );
	update_post_meta( $post_id, '_ai_featured', ! empty( $_POST['amlok_featured'] ) ? '1' : '' );
}
add_action( 'save_post_property', 'amlok_save_property_meta' );

/** جعبه اطلاعات مشاور. */
function amlok_agent_meta_box() {
	add_meta_box( 'amlok_agent_details', __( 'اطلاعات مشاور', 'amlok-iran' ), 'amlok_agent_meta_box_html', 'agent', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'amlok_agent_meta_box' );

/** نمایش جعبه اطلاعات مشاور. */
function amlok_agent_meta_box_html( $post ) {
	wp_nonce_field( 'amlok_agent_meta', 'amlok_agent_meta_nonce' );
	$role     = get_post_meta( $post->ID, '_amlok_role', true );
	$phone    = get_post_meta( $post->ID, '_amlok_phone', true );
	$email    = get_post_meta( $post->ID, '_amlok_email', true );
	$linkedin = get_post_meta( $post->ID, '_amlok_linkedin', true );
	?>
	<p>
		<label><?php esc_html_e( 'سمت', 'amlok-iran' ); ?><br />
			<input type="text" name="amlok_role" class="widefat" value="<?php echo esc_attr( $role ); ?>" placeholder="مشاور ارشد املاک" />
		</label>
	</p>
	<p>
		<label><?php esc_html_e( 'تلفن', 'amlok-iran' ); ?><br />
			<input type="text" name="amlok_phone" class="widefat" value="<?php echo esc_attr( $phone ); ?>" />
		</label>
	</p>
	<p>
		<label><?php esc_html_e( 'ایمیل', 'amlok-iran' ); ?><br />
			<input type="email" name="amlok_email" class="widefat" value="<?php echo esc_attr( $email ); ?>" />
		</label>
	</p>
	<p>
		<label><?php esc_html_e( 'لینکدین (نشانی کامل)', 'amlok-iran' ); ?><br />
			<input type="url" name="amlok_linkedin" class="widefat" value="<?php echo esc_attr( $linkedin ); ?>" />
		</label>
	</p>
	<p class="description"><?php esc_html_e( 'تصویر مشاور = تصویر شاخص همین نوشته.', 'amlok-iran' ); ?></p>
	<?php
}

/** ذخیره اطلاعات مشاور. */
function amlok_save_agent_meta( $post_id ) {
	if ( ! isset( $_POST['amlok_agent_meta_nonce'] )
		|| ! wp_verify_nonce( sanitize_key( $_POST['amlok_agent_meta_nonce'] ), 'amlok_agent_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	update_post_meta( $post_id, '_amlok_role', sanitize_text_field( wp_unslash( $_POST['amlok_role'] ?? '' ) ) );
	update_post_meta( $post_id, '_amlok_phone', sanitize_text_field( wp_unslash( $_POST['amlok_phone'] ?? '' ) ) );
	update_post_meta( $post_id, '_amlok_email', sanitize_email( wp_unslash( $_POST['amlok_email'] ?? '' ) ) );
	update_post_meta( $post_id, '_amlok_linkedin', esc_url_raw( wp_unslash( $_POST['amlok_linkedin'] ?? '' ) ) );
}
add_action( 'save_post_agent', 'amlok_save_agent_meta' );

/** ستون‌های فهرست املاک در پیشخوان. */
function amlok_property_columns( $columns ) {
	$columns['amlok_price']   = __( 'قیمت', 'amlok-iran' );
	$columns['amlok_period']  = __( 'معامله', 'amlok-iran' );
	$columns['amlok_featured'] = __( 'ویژه', 'amlok-iran' );
	return $columns;
}
add_filter( 'manage_property_posts_columns', 'amlok_property_columns' );

/** محتوای ستون‌های سفارشی. */
function amlok_property_columns_content( $column, $post_id ) {
	if ( 'amlok_price' === $column ) {
		echo esc_html( amlok_price_label( (float) get_post_meta( $post_id, '_ai_price', true ) ) );
	}
	if ( 'amlok_period' === $column ) {
		echo esc_html( amlok_period_label( get_post_meta( $post_id, '_ai_period', true ) ) );
	}
	if ( 'amlok_featured' === $column ) {
		echo get_post_meta( $post_id, '_ai_featured', true ) ? '★' : '—';
	}
}
add_action( 'manage_property_posts_custom_column', 'amlok_property_columns_content', 10, 2 );

<?php
/**
 * آرشیو املاک — جستجو، فیلتر، مرتب‌سازی و صفحه‌بندی.
 *
 * @package amlok-iran
 */

get_header();

// ——— خواندن فیلترها از نشانی (GET) ———
$filters = array(
	'search'   => isset( $_GET['search'] ) ? sanitize_text_field( wp_unslash( $_GET['search'] ) ) : '', // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	'location' => isset( $_GET['location'] ) ? sanitize_title( wp_unslash( $_GET['location'] ) ) : '', // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	'type'     => isset( $_GET['type'] ) ? sanitize_title( wp_unslash( $_GET['type'] ) ) : '', // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	'price'    => isset( $_GET['price'] ) ? sanitize_title( wp_unslash( $_GET['price'] ) ) : '', // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	'beds'     => isset( $_GET['beds'] ) ? absint( $_GET['beds'] ) : 0, // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	'baths'    => isset( $_GET['baths'] ) ? absint( $_GET['baths'] ) : 0, // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	'sort'     => isset( $_GET['sort'] ) ? sanitize_title( wp_unslash( $_GET['sort'] ) ) : 'featured', // phpcs:ignore WordPress.Security.NonceVerification.Recommended
);

// بازه‌های قیمت (تومان).
$price_buckets = array(
	''           => array( 'label' => __( 'هر قیمتی', 'amlok-iran' ), 'min' => 0, 'max' => 0 ),
	'under-3b'   => array( 'label' => __( 'زیر ۳ میلیارد', 'amlok-iran' ), 'min' => 0, 'max' => 2999999999 ),
	'3b-6b'      => array( 'label' => __( '۳ تا ۶ میلیارد', 'amlok-iran' ), 'min' => 3000000000, 'max' => 6000000000 ),
	'6b-10b'     => array( 'label' => __( '۶ تا ۱۰ میلیارد', 'amlok-iran' ), 'min' => 6000000000, 'max' => 10000000000 ),
	'over-10b'   => array( 'label' => __( 'بالای ۱۰ میلیارد', 'amlok-iran' ), 'min' => 10000000000, 'max' => 0 ),
);

$sort_options = array(
	'featured'   => __( 'ویژه در اولویت', 'amlok-iran' ),
	'price-asc'  => __( 'قیمت — کم به زیاد', 'amlok-iran' ),
	'price-desc' => __( 'قیمت — زیاد به کم', 'amlok-iran' ),
	'size-desc'  => __( 'بزرگ‌ترین اول', 'amlok-iran' ),
	'newest'     => __( 'جدیدترین', 'amlok-iran' ),
);

$query_args = array(
	'post_type'      => 'property',
	'post_status'    => 'publish',
	'posts_per_page' => 9,
	'paged'          => max( 1, get_query_var( 'paged' ), get_query_var( 'page' ) ),
);

if ( $filters['search'] ) {
	$query_args['s'] = $filters['search'];
}

$tax_query = array();
if ( $filters['location'] ) {
	$tax_query[] = array( 'taxonomy' => 'ai_location', 'field' => 'slug', 'terms' => $filters['location'] );
}
if ( $filters['type'] ) {
	$tax_query[] = array( 'taxonomy' => 'ai_type', 'field' => 'slug', 'terms' => $filters['type'] );
}
if ( $tax_query ) {
	$query_args['tax_query'] = $tax_query; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
}

$meta_query = array();
$price_bucket = $price_buckets[ $filters['price'] ] ?? null;
if ( $price_bucket && $filters['price'] !== '' ) {
	$meta_query[] = array( 'key' => '_ai_price', 'type' => 'numeric', 'compare' => 'BETWEEN', 'value' => array( $price_bucket['min'], $price_bucket['max'] > 0 ? $price_bucket['max'] : 999999999999 ) );
} elseif ( 'price-asc' === $filters['sort'] || 'price-desc' === $filters['sort'] ) {
	$meta_query[] = array( 'key' => '_ai_price', 'compare' => 'EXISTS' );
}
if ( $filters['beds'] ) {
	$meta_query[] = array( 'key' => '_ai_bedrooms', 'type' => 'numeric', 'compare' => '>=', 'value' => $filters['beds'] );
}
if ( $filters['baths'] ) {
	$meta_query[] = array( 'key' => '_ai_bathrooms', 'type' => 'numeric', 'compare' => '>=', 'value' => $filters['baths'] );
}
if ( $meta_query ) {
	$query_args['meta_query'] = $meta_query; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
}

switch ( $filters['sort'] ) {
	case 'price-asc':
		$query_args['meta_key'] = '_ai_price'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
		$query_args['orderby']  = 'meta_value_num';
		$query_args['order']    = 'ASC';
		break;
	case 'price-desc':
		$query_args['meta_key'] = '_ai_price'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
		$query_args['orderby']  = 'meta_value_num';
		$query_args['order']    = 'DESC';
		break;
	case 'size-desc':
		$query_args['meta_key'] = '_ai_area'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
		$query_args['orderby']  = 'meta_value_num';
		$query_args['order']    = 'DESC';
		break;
	case 'newest':
		$query_args['orderby'] = 'date';
		$query_args['order']   = 'DESC';
		break;
	default:
		$query_args['orderby'] = array(
			'meta_value_num' => 'DESC',
			'date'           => 'DESC',
		);
		$query_args['meta_key'] = '_ai_featured'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
}

$amlok_query = new WP_Query( $query_args );

// گزینه‌های فیلترها از طبقه‌بندی‌ها.
$amlok_locations = get_terms( array( 'taxonomy' => 'ai_location', 'hide_empty' => false ) );
$amlok_types     = get_terms( array( 'taxonomy' => 'ai_type', 'hide_empty' => false ) );

get_template_part(
	'template-parts/page-banner',
	null,
	array(
		'label'       => __( 'سبد املاک', 'amlok-iran' ),
		'title'       => __( 'مرور همه املاک', 'amlok-iran' ),
		'description' => __( 'مجموعه کامل را بر اساس منطقه، نوع، قیمت و متراژ جستجو کنید؛ سپس آگهی را برای گالری، مشخصات و راه تماس با مشاور باز کنید.', 'amlok-iran' ),
		'crumbs'      => array(
			array( 'label' => __( 'خانه', 'amlok-iran' ), 'url' => home_url( '/' ) ),
			array( 'label' => __( 'املاک', 'amlok-iran' ) ),
		),
	)
);
?>

<section class="bg-white py-14 lg:py-20">
	<div class="shell">
		<!-- ——— پنل فیلتر: یک فرم GET واقعی؛ با جاوااسکریپت خودکار ارسال می‌شود ——— -->
		<form method="get" id="amlok-filters" action="<?php echo esc_url( get_post_type_archive_link( 'property' ) ); ?>"
			class="rounded border border-navy/10 bg-white p-5 sm:p-7">
			<div class="flex flex-col gap-4 lg:flex-row lg:items-end">
				<div class="flex-1">
					<label for="amlok-filter-search" class="label block text-navy/60"><?php esc_html_e( 'جستجو', 'amlok-iran' ); ?></label>
					<div class="relative mt-3">
						<?php amlok_icon( 'search', 17, 'pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-navy/40' ); ?>
						<input id="amlok-filter-search" type="search" name="search" value="<?php echo esc_attr( $filters['search'] ); ?>"
							placeholder="<?php esc_attr_e( 'جستجو بر اساس نام، شهر یا کلیدواژه', 'amlok-iran' ); ?>"
							class="h-12 w-full rounded-sm border border-navy/15 bg-white px-4 pl-4 pr-11 font-sans text-[0.9375rem] text-navy placeholder:text-navy/35 focus:border-navy focus:outline-none" />
					</div>
				</div>

				<div class="flex flex-col gap-4 sm:flex-row sm:items-end">
					<div class="sm:min-w-0 sm:flex-1 lg:flex-none">
						<label for="amlok-filter-sort" class="label block text-navy/60"><?php esc_html_e( 'مرتب‌سازی', 'amlok-iran' ); ?></label>
						<div class="relative mt-3 w-full sm:min-w-[13rem]">
							<select id="amlok-filter-sort" name="sort" class="h-12 w-full appearance-none rounded-sm border border-navy/15 bg-white px-4 pl-10 pr-4 font-sans text-[0.9375rem] text-navy focus:border-navy focus:outline-none">
								<?php foreach ( $sort_options as $value => $label ) : ?>
									<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $filters['sort'], $value ); ?>><?php echo esc_html( $label ); ?></option>
								<?php endforeach; ?>
							</select>
							<?php amlok_icon( 'chevron-down', 16, 'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40' ); ?>
						</div>
					</div>
					<button type="button" data-filters-toggle aria-expanded="false" aria-controls="amlok-filter-advanced"
						class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm border border-navy/20 px-5 font-sans text-[0.8125rem] font-medium text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white sm:w-auto lg:hidden">
						<?php amlok_icon( 'sliders', 16 ); ?>
						<?php esc_html_e( 'فیلترها', 'amlok-iran' ); ?>
					</button>
					<button type="submit" class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-navy px-5 font-sans text-[0.8125rem] font-medium text-white transition-colors duration-300 hover:bg-navy-700 sm:w-auto lg:hidden">
						<?php esc_html_e( 'اعمال', 'amlok-iran' ); ?>
					</button>
				</div>
			</div>

			<div id="amlok-filter-advanced" class="hidden mt-6 border-t border-navy/10 pt-6 lg:block">
				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
					<div>
						<label for="amlok-filter-location" class="label block text-navy/60"><?php esc_html_e( 'منطقه', 'amlok-iran' ); ?></label>
						<div class="relative mt-3">
							<select id="amlok-filter-location" name="location" class="h-12 w-full appearance-none rounded-sm border border-navy/15 bg-white px-4 pl-10 pr-4 font-sans text-[0.9375rem] text-navy focus:border-navy focus:outline-none">
								<option value=""><?php esc_html_e( 'همه منطقه‌ها', 'amlok-iran' ); ?></option>
								<?php foreach ( (array) $amlok_locations as $term ) : ?>
									<option value="<?php echo esc_attr( $term->slug ); ?>" <?php selected( $filters['location'], $term->slug ); ?>><?php echo esc_html( $term->name ); ?></option>
								<?php endforeach; ?>
							</select>
							<?php amlok_icon( 'chevron-down', 16, 'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40' ); ?>
						</div>
					</div>
					<div>
						<label for="amlok-filter-type" class="label block text-navy/60"><?php esc_html_e( 'نوع ملک', 'amlok-iran' ); ?></label>
						<div class="relative mt-3">
							<select id="amlok-filter-type" name="type" class="h-12 w-full appearance-none rounded-sm border border-navy/15 bg-white px-4 pl-10 pr-4 font-sans text-[0.9375rem] text-navy focus:border-navy focus:outline-none">
								<option value=""><?php esc_html_e( 'همه انواع', 'amlok-iran' ); ?></option>
								<?php foreach ( (array) $amlok_types as $term ) : ?>
									<option value="<?php echo esc_attr( $term->slug ); ?>" <?php selected( $filters['type'], $term->slug ); ?>><?php echo esc_html( $term->name ); ?></option>
								<?php endforeach; ?>
							</select>
							<?php amlok_icon( 'chevron-down', 16, 'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40' ); ?>
						</div>
					</div>
					<div>
						<label for="amlok-filter-price" class="label block text-navy/60"><?php esc_html_e( 'بازه قیمت', 'amlok-iran' ); ?></label>
						<div class="relative mt-3">
							<select id="amlok-filter-price" name="price" class="h-12 w-full appearance-none rounded-sm border border-navy/15 bg-white px-4 pl-10 pr-4 font-sans text-[0.9375rem] text-navy focus:border-navy focus:outline-none">
								<?php foreach ( $price_buckets as $value => $bucket ) : ?>
									<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $filters['price'], $value ); ?>>
										<?php echo esc_attr( is_array( $bucket ) ? $bucket['label'] : $bucket ); ?>
									</option>
								<?php endforeach; ?>
							</select>
							<?php amlok_icon( 'chevron-down', 16, 'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40' ); ?>
						</div>
					</div>
					<div>
						<label for="amlok-filter-beds" class="label block text-navy/60"><?php esc_html_e( 'اتاق خواب', 'amlok-iran' ); ?></label>
						<div class="relative mt-3">
							<select id="amlok-filter-beds" name="beds" class="h-12 w-full appearance-none rounded-sm border border-navy/15 bg-white px-4 pl-10 pr-4 font-sans text-[0.9375rem] text-navy focus:border-navy focus:outline-none">
								<option value=""><?php esc_html_e( 'هر تعداد', 'amlok-iran' ); ?></option>
								<?php foreach ( array( 3, 4, 5, 6 ) as $count ) : ?>
									<option value="<?php echo esc_attr( $count ); ?>" <?php selected( $filters['beds'], $count ); ?>><?php echo esc_html( amlok_fa_num( $count ) ); ?> و بیشتر</option>
								<?php endforeach; ?>
							</select>
							<?php amlok_icon( 'chevron-down', 16, 'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40' ); ?>
						</div>
					</div>
					<div>
						<label for="amlok-filter-baths" class="label block text-navy/60"><?php esc_html_e( 'سرویس بهداشتی', 'amlok-iran' ); ?></label>
						<div class="relative mt-3">
							<select id="amlok-filter-baths" name="baths" class="h-12 w-full appearance-none rounded-sm border border-navy/15 bg-white px-4 pl-10 pr-4 font-sans text-[0.9375rem] text-navy focus:border-navy focus:outline-none">
								<option value=""><?php esc_html_e( 'هر تعداد', 'amlok-iran' ); ?></option>
								<?php foreach ( array( 3, 4, 5, 6 ) as $count ) : ?>
									<option value="<?php echo esc_attr( $count ); ?>" <?php selected( $filters['baths'], $count ); ?>><?php echo esc_html( amlok_fa_num( $count ) ); ?> و بیشتر</option>
								<?php endforeach; ?>
							</select>
							<?php amlok_icon( 'chevron-down', 16, 'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40' ); ?>
						</div>
					</div>
				</div>

				<div class="mt-6 flex flex-wrap items-center gap-4">
					<button type="submit" class="inline-flex h-11 items-center gap-2 rounded-sm bg-navy px-6 font-sans text-[0.8125rem] font-medium text-white transition-colors duration-300 hover:bg-navy-700">
						<?php esc_html_e( 'اعمال فیلترها', 'amlok-iran' ); ?>
					</button>
					<a href="<?php echo esc_url( get_post_type_archive_link( 'property' ) ); ?>"
						class="inline-flex items-center gap-2 font-sans text-[0.8125rem] font-medium text-slate transition-colors duration-300 hover:text-champagne-dark">
						<?php amlok_icon( 'close', 14 ); ?>
						<?php esc_html_e( 'حذف همه فیلترها', 'amlok-iran' ); ?>
					</a>
					<p aria-live="polite" class="font-sans text-[0.6875rem] text-slate-soft">
						<?php echo esc_html( amlok_fa_num( $amlok_query->found_posts ) . ' ' . __( 'ملک یافت شد', 'amlok-iran' ) ); ?>
					</p>
				</div>
			</div>
		</form>

		<div class="mt-12">
			<?php if ( $amlok_query->have_posts() ) : ?>
				<div class="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
					<?php while ( $amlok_query->have_posts() ) : ?>
						<?php $amlok_query->the_post(); ?>
						<?php get_template_part( 'template-parts/property-card' ); ?>
					<?php endwhile; ?>
					<?php wp_reset_postdata(); ?>
				</div>

				<?php if ( $amlok_query->max_num_pages > 1 ) : ?>
					<div class="mt-14 flex justify-center gap-2 border-t border-navy/10 pt-10">
						<?php
						echo paginate_links( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- paginate_links امن است.
							array(
								'total'     => $amlok_query->max_num_pages,
								'current'   => max( 1, (int) $amlok_query->get( 'paged' ) ),
								'prev_text' => amlok_icon( 'chevron-right', 16 ) . '<span class="sr-only">' . esc_html__( 'قبلی', 'amlok-iran' ) . '</span>',
								'next_text' => amlok_icon( 'chevron-left', 16 ) . '<span class="sr-only">' . esc_html__( 'بعدی', 'amlok-iran' ) . '</span>',
								'add_args'  => array_filter(
									array(
										'search'   => $filters['search'],
										'location' => $filters['location'],
										'type'     => $filters['type'],
										'price'    => $filters['price'],
										'beds'     => $filters['beds'],
										'baths'    => $filters['baths'],
										'sort'     => $filters['sort'],
									)
								),
							)
						);
						?>
					</div>
				<?php endif; ?>
			<?php else : ?>
				<div class="flex flex-col items-center justify-center rounded border border-dashed border-navy/20 bg-ivory-light px-6 py-20 text-center">
					<span class="inline-flex h-14 w-14 items-center justify-center rounded-full border border-champagne/50 text-champagne-dark">
						<?php amlok_icon( 'search', 22 ); ?>
					</span>
					<h3 class="mt-6 font-display text-xl font-medium text-navy"><?php esc_html_e( 'ملکی با این فیلترها پیدا نشد', 'amlok-iran' ); ?></h3>
					<p class="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-slate"><?php esc_html_e( 'بازه قیمت را بازتر کنید، منطقه دیگری را انتخاب کنید یا فیلترها را پاک کنید تا کل مجموعه را ببینید.', 'amlok-iran' ); ?></p>
					<a href="<?php echo esc_url( get_post_type_archive_link( 'property' ) ); ?>"
						class="mt-7 inline-flex h-12 items-center justify-center gap-3 bg-navy px-7 font-sans text-[0.8125rem] font-medium text-white transition-all duration-300 ease-editorial hover:bg-navy-700">
						<?php esc_html_e( 'حذف همه فیلترها', 'amlok-iran' ); ?>
					</a>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>

<?php get_footer(); ?>

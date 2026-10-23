<?php
/**
 * Template Name: علاقه‌مندی‌ها
 * قالب برگه علاقه‌مندی‌ها — املاک ذخیره‌شده در مرورگر بازدیدکننده.
 *
 * چرخه کار: جاوااسکریپت شناسه‌های ذخیره‌شده را از localStorage می‌خواند، با یک
 * درخواست fetch به همین برگه (پارامتر saved=1,2,3) وصل می‌شود و شبکه‌ای که
 * سرور رندر کرده را جایگزین می‌کند — بدون بازخوانی کل صفحه.
 *
 * @package amlok-iran
 */

get_header();

get_template_part(
	'template-parts/page-banner',
	null,
	array(
		'label'       => __( 'فهرست شما', 'amlok-iran' ),
		'title'       => __( 'علاقه‌مندی‌ها', 'amlok-iran' ),
		'description' => __( 'املاک ذخیره‌شده اینجا نگه داشته می‌شوند — مقایسه کنید و برای گزینه‌های بهتر درخواست بازدید بدهید.', 'amlok-iran' ),
		'crumbs'      => array(
			array( 'label' => __( 'خانه', 'amlok-iran' ), 'url' => home_url( '/' ) ),
			array( 'label' => __( 'علاقه‌مندی‌ها', 'amlok-iran' ) ),
		),
	)
);
?>

<section class="bg-white py-14 lg:py-20">
	<div class="shell">
		<?php
		// فهرست اولیه: اگر آدرس پارامتر saved داشت، همان‌جا رندر می‌شود.
		$ids_param = isset( $_GET['saved'] ) ? sanitize_text_field( wp_unslash( $_GET['saved'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$ids       = array_filter( array_map( 'absint', explode( ',', $ids_param ) ) );
		?>
		<div id="amlok-saved-grid" data-saved-grid>
			<?php
			if ( $ids ) {
				$amlok_saved_query = new WP_Query(
					array(
						'post_type'      => 'property',
						'post_status'    => 'publish',
						'posts_per_page' => 24,
						'post__in'       => $ids,
						'orderby'        => 'post__in',
					)
				);
				if ( $amlok_saved_query->have_posts() ) :
					?>
					<p class="mb-10 font-sans text-[0.6875rem] text-slate-soft">
						<?php echo esc_html( sprintf( __( '%s ملک ذخیره شده', 'amlok-iran' ), amlok_fa_num( $amlok_saved_query->found_posts ) ) ); ?>
					</p>
					<div class="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
						<?php while ( $amlok_saved_query->have_posts() ) : ?>
							<?php $amlok_saved_query->the_post(); ?>
							<?php get_template_part( 'template-parts/property-card' ); ?>
						<?php endwhile; ?>
						<?php wp_reset_postdata(); ?>
					</div>
				<?php endif;
			} else {
				?>
				<div class="flex flex-col items-center justify-center rounded border border-dashed border-navy/20 bg-ivory-light px-6 py-20 text-center">
					<span class="inline-flex h-14 w-14 items-center justify-center rounded-full border border-champagne/50 text-champagne-dark">
						<?php amlok_icon( 'heart', 22 ); ?>
					</span>
					<h3 class="mt-6 font-display text-xl font-medium text-navy"><?php esc_html_e( 'هنوز چیزی ذخیره نکرده‌اید', 'amlok-iran' ); ?></h3>
					<p class="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-slate"><?php esc_html_e( 'روی آیکن قلب هر ملک بزنید تا اینجا کنار هم مقایسه‌شان کنید.', 'amlok-iran' ); ?></p>
					<a href="<?php echo esc_url( get_post_type_archive_link( 'property' ) ?: home_url( '/' ) ); ?>"
						class="mt-7 inline-flex h-12 items-center justify-center gap-3 bg-navy px-7 font-sans text-[0.8125rem] font-medium text-white transition-all duration-300 ease-editorial hover:bg-navy-700">
						<?php esc_html_e( 'مرور املاک', 'amlok-iran' ); ?>
					</a>
				</div>
			<?php } ?>
		</div>

		<noscript>
			<p class="mt-8 text-[0.8125rem] text-slate"><?php esc_html_e( 'برای دیدن فهرست ذخیره‌شده، جاوااسکریپت مرورگر باید فعال باشد.', 'amlok-iran' ); ?></p>
		</noscript>
	</div>
</section>

<?php get_footer(); ?>

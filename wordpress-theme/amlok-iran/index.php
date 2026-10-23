<?php
/**
 * فهرست نوشته‌های وبلاگ و بازگشت‌های عمومی.
 *
 * @package amlok-iran
 */

get_header();

get_template_part(
	'template-parts/page-banner',
	null,
	array(
		'label' => __( 'وبلاگ', 'amlok-iran' ),
		'title' => is_home() ? __( 'یادداشت‌های بازار', 'amlok-iran' ) : get_the_archive_title(),
		'crumbs' => array(
			array( 'label' => __( 'خانه', 'amlok-iran' ), 'url' => home_url( '/' ) ),
			array( 'label' => __( 'وبلاگ', 'amlok-iran' ) ),
		),
	)
);
?>

<section class="bg-white py-14 lg:py-20">
	<div class="shell">
		<?php if ( have_posts() ) : ?>
			<div class="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
				<?php while ( have_posts() ) : ?>
					<?php the_post(); ?>
					<article class="group/card reveal flex flex-col">
						<?php if ( has_post_thumbnail() ) : ?>
							<div class="relative overflow-hidden rounded bg-navy-50 aspect-[4/3]">
								<a href="<?php the_permalink(); ?>" class="after:absolute after:inset-0 after:content-['']">
									<?php the_post_thumbnail( 'large', array( 'class' => 'h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover/card:scale-[1.05]', 'loading' => 'lazy' ) ); ?>
								</a>
							</div>
						<?php endif; ?>
						<div class="pt-5">
							<p class="label text-champagne-dark"><?php echo esc_html( amlok_fa_date( get_the_time( 'U' ) ) ); ?></p>
							<h3 class="mt-3 font-display text-[1.375rem] font-medium leading-snug text-navy transition-colors duration-300 group-hover/card:text-champagne-dark">
								<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
							</h3>
							<p class="mt-3 text-[0.9375rem] leading-relaxed text-slate"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 24 ) ); ?></p>
						</div>
					</article>
				<?php endwhile; ?>
			</div>

			<div class="mt-14 flex justify-center gap-2 border-t border-navy/10 pt-10">
				<?php echo paginate_links( array( 'prev_text' => '‹', 'next_text' => '›' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
		<?php else : ?>
			<div class="flex flex-col items-center justify-center rounded border border-dashed border-navy/20 bg-ivory-light px-6 py-20 text-center">
				<h3 class="font-display text-xl font-medium text-navy"><?php esc_html_e( 'هنوز نوشته‌ای منتشر نشده است', 'amlok-iran' ); ?></h3>
			</div>
		<?php endif; ?>
	</div>
</section>

<?php get_footer(); ?>

<?php
/**
 * کارت ملک — به‌کاررفته در کاروسل، شبکه فهرست، صفحه تک‌ملک و علاقه‌مندی‌ها.
 *
 * @package amlok-iran
 */

$amlok_d = amlok_property_data( isset( $args['post_id'] ) ? $args['post_id'] : get_the_ID() );
?>
<article class="group/card relative flex flex-col" data-fav-card="<?php echo esc_attr( $amlok_d['id'] ); ?>">
	<div class="relative overflow-hidden rounded bg-navy-50 aspect-[4/5]">
		<?php if ( $amlok_d['cover'] ) : ?>
			<?php echo amlok_image( $amlok_d['cover'], 'large', 'h-full w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover/card:scale-[1.05]', '(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 420px' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
		<?php endif; ?>

		<span aria-hidden="true" class="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-navy-950/10 opacity-80"></span>

		<span class="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-navy-950/35 px-3 py-1.5 font-sans text-[0.6875rem] font-medium text-white backdrop-blur-sm">
			<?php echo esc_html( amlok_period_label( $amlok_d['period'] ) ); ?>
		</span>

		<button type="button" data-fav-toggle="<?php echo esc_attr( $amlok_d['id'] ); ?>"
			aria-pressed="false"
			aria-label="<?php esc_attr_e( 'افزودن به علاقه‌مندی‌ها', 'amlok-iran' ); ?>"
			class="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-navy-950/35 text-white backdrop-blur-sm transition-colors duration-300 hover:border-champagne data-[saved=true]:border-champagne data-[saved=true]:bg-champagne data-[saved=true]:text-navy-900">
			<?php amlok_icon( 'heart', 16, 'data-[saved=true]:fill-current' ); ?>
		</button>
	</div>

	<div class="flex flex-1 flex-col pt-5">
		<p class="label flex items-center gap-2 text-champagne-dark">
			<?php amlok_icon( 'pin', 13 ); ?>
			<?php echo esc_html( $amlok_d['location'] ); ?>
		</p>

		<h3 class="mt-3 font-display text-[1.375rem] font-medium leading-snug text-navy transition-colors duration-300 group-hover/card:text-champagne-dark">
			<a href="<?php echo esc_url( $amlok_d['permalink'] ); ?>" class="after:absolute after:inset-0 after:content-['']">
				<?php echo esc_html( $amlok_d['title'] ); ?>
			</a>
		</h3>

		<p class="mt-2 font-display text-lg font-medium text-navy/85"><?php echo esc_html( $amlok_d['price_label'] ); ?></p>

		<div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-navy/10 pt-4 text-[0.8125rem] text-slate">
			<span class="inline-flex items-center gap-2">
				<?php amlok_icon( 'bed', 15, 'text-champagne-dark' ); ?>
				<?php echo esc_html( amlok_fa_num( $amlok_d['bedrooms'] ) ); ?> <?php esc_html_e( 'خواب', 'amlok-iran' ); ?>
			</span>
			<span class="inline-flex items-center gap-2">
				<?php amlok_icon( 'bath', 15, 'text-champagne-dark' ); ?>
				<?php echo esc_html( amlok_fa_num( $amlok_d['bathrooms'] ) ); ?> <?php esc_html_e( 'سرویس', 'amlok-iran' ); ?>
			</span>
			<span class="inline-flex items-center gap-2">
				<?php amlok_icon( 'area', 14, 'text-champagne-dark' ); ?>
				<?php echo esc_html( amlok_fa_num( number_format( $amlok_d['area'] ) ) ); ?> <?php esc_html_e( 'متر مربع', 'amlok-iran' ); ?>
			</span>
		</div>
	</div>
</article>

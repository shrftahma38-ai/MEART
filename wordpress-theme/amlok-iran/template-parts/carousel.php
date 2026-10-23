<?php
/**
 * کاروسل املاک — ریل اسنپ‌شونده با کشیدن با موس، فلش‌ها و نوار پیشرفت.
 * آرگومان: query (WP_Query).
 *
 * @package amlok-iran
 */

if ( empty( $args['query'] ) || ! $args['query']->have_posts() ) {
	return;
}
$amlok_query = $args['query'];
?>
<div data-carousel>
	<div data-carousel-track tabindex="0" role="group"
		aria-label="<?php esc_attr_e( 'ریل املاک', 'amlok-iran' ); ?>"
		class="no-scrollbar -mx-5 px-5 flex gap-5 overflow-x-auto pb-2 cursor-grab snap-x snap-mandatory sm:-mx-8 sm:px-8 sm:gap-7 lg:-mx-10 lg:px-10 xl:-mx-14 xl:px-14">
		<?php foreach ( $amlok_query->posts as $amlok_post ) : ?>
			<div data-card class="w-[80%] shrink-0 snap-start sm:w-[340px] lg:w-[400px] xl:w-[440px]">
				<?php get_template_part( 'template-parts/property-card', null, array( 'post_id' => $amlok_post->ID ) ); ?>
			</div>
		<?php endforeach; ?>
	</div>

	<div class="mx-5 mt-8 flex items-center gap-6 border-t border-navy/10 pt-6 sm:mx-8 lg:mx-10 xl:mx-14">
		<div class="hidden h-px flex-1 bg-navy/10" aria-hidden="true">
			<div data-carousel-progress class="h-px bg-champagne transition-[width] duration-200 ease-out" style="width:12%"></div>
		</div>
		<p class="font-sans text-[0.6875rem] text-slate-soft"><?php esc_html_e( 'برای مرور بکشید یا بکشید و رها کنید', 'amlok-iran' ); ?></p>
		<div class="ms-auto flex items-center gap-3">
			<button type="button" data-carousel-prev disabled
				aria-label="<?php esc_attr_e( 'املاک قبلی', 'amlok-iran' ); ?>"
				class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy/20 text-navy transition-all duration-300 ease-editorial hover:border-navy hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-navy/20 disabled:hover:bg-transparent disabled:hover:text-navy">
				<?php amlok_icon( 'chevron-right', 18 ); ?>
			</button>
			<button type="button" data-carousel-next disabled
				aria-label="<?php esc_attr_e( 'املاک بعدی', 'amlok-iran' ); ?>"
				class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy/20 text-navy transition-all duration-300 ease-editorial hover:border-navy hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-navy/20 disabled:hover:bg-transparent disabled:hover:text-navy">
				<?php amlok_icon( 'chevron-left', 18 ); ?>
			</button>
		</div>
	</div>
</div>

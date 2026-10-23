<?php
/**
 * بنر بالای صفحات داخلی.
 * آرگومان‌ها: label, title, description, crumbs (آرایه‌ای از [label, url?]).
 *
 * @package amlok-iran
 */

$amlok_banner_label       = $args['label'] ?? '';
$amlok_banner_title       = $args['title'] ?? '';
$amlok_banner_description = $args['description'] ?? '';
$amlok_banner_crumbs      = $args['crumbs'] ?? array();
?>
<section class="relative border-b border-champagne/20 bg-navy-900 pb-14 pt-32 text-white lg:pb-20 lg:pt-40">
	<div class="shell">
		<?php if ( $amlok_banner_crumbs ) : ?>
			<nav aria-label="<?php esc_attr_e( 'مسیر صفحه', 'amlok-iran' ); ?>" class="mb-7">
				<ol class="flex flex-wrap items-center gap-3 font-sans text-[0.6875rem] text-white/50">
					<?php foreach ( $amlok_banner_crumbs as $amlok_index => $amlok_crumb ) : ?>
						<li class="flex items-center gap-3">
							<?php if ( ! empty( $amlok_crumb['url'] ) ) : ?>
								<a href="<?php echo esc_url( $amlok_crumb['url'] ); ?>" class="transition-colors duration-300 hover:text-champagne"><?php echo esc_html( $amlok_crumb['label'] ); ?></a>
							<?php else : ?>
								<span aria-current="page" class="text-white/80"><?php echo esc_html( $amlok_crumb['label'] ); ?></span>
							<?php endif; ?>
							<?php if ( $amlok_index < count( $amlok_banner_crumbs ) - 1 ) : ?>
								<span aria-hidden="true">/</span>
							<?php endif; ?>
						</li>
					<?php endforeach; ?>
				</ol>
			</nav>
		<?php endif; ?>

		<p class="label text-champagne"><?php echo esc_html( $amlok_banner_label ); ?></p>
		<h1 class="mt-5 max-w-3xl font-display text-[2rem] font-medium leading-[1.2] text-white sm:text-[2.5rem] lg:text-[3rem]"><?php echo esc_html( $amlok_banner_title ); ?></h1>
		<?php if ( $amlok_banner_description ) : ?>
			<p class="measure mt-5 text-[1.0625rem] leading-[1.85] text-white/70"><?php echo esc_html( $amlok_banner_description ); ?></p>
		<?php endif; ?>
	</div>
</section>

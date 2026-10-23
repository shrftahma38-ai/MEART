<?php
/**
 * گالری تصاویر ملک — تصویر اصلی، ریل بندانگشتی و نمایشگر تمام‌صفحه.
 * آرگومان‌ها: images (آرایه‌ای از شناسه پیوست یا آدرس), name.
 *
 * @package amlok-iran
 */

$amlok_images = array_values( array_filter( (array) ( $args['images'] ?? array() ) ) );
$amlok_name   = $args['name'] ?? '';
if ( empty( $amlok_images ) ) {
	return;
}
$amlok_count = count( $amlok_images );
?>

<div data-gallery>
	<div class="relative overflow-hidden rounded bg-navy-50">
		<?php echo amlok_image( $amlok_images[0], 'full', 'aspect-[4/3] w-full object-cover sm:aspect-[16/10]', '(max-width: 1024px) 100vw, 62vw' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>

		<div class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950/45 to-transparent" aria-hidden="true"></div>

		<p class="absolute bottom-4 right-4 rounded-full border border-white/25 bg-navy-950/40 px-3 py-1.5 font-sans text-[0.6875rem] text-white backdrop-blur-sm">
			<?php echo esc_html( amlok_fa_num( 1 ) . ' / ' . amlok_fa_num( $amlok_count ) ); ?>
		</p>

		<button type="button" data-gallery-open aria-label="<?php esc_attr_e( 'نمایش گالری تمام‌صفحه', 'amlok-iran' ); ?>"
			class="absolute left-4 top-4 inline-flex h-11 items-center gap-2 rounded-full border border-white/35 bg-navy-950/35 px-4 font-sans text-[0.8125rem] font-medium text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-navy">
			<?php amlok_icon( 'area', 15 ); ?>
			<?php esc_html_e( 'نمایش همه', 'amlok-iran' ); ?>
		</button>

		<?php if ( $amlok_count > 1 ) : ?>
			<div class="absolute bottom-4 left-4 flex gap-2">
				<button type="button" data-gallery-prev aria-label="<?php esc_attr_e( 'تصویر قبلی', 'amlok-iran' ); ?>"
					class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-navy-950/35 text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-navy">
					<?php amlok_icon( 'chevron-right', 18 ); ?>
				</button>
				<button type="button" data-gallery-next aria-label="<?php esc_attr_e( 'تصویر بعدی', 'amlok-iran' ); ?>"
					class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-navy-950/35 text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-navy">
					<?php amlok_icon( 'chevron-left', 18 ); ?>
				</button>
			</div>
		<?php endif; ?>
	</div>

	<?php if ( $amlok_count > 1 ) : ?>
		<ul class="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
			<?php foreach ( $amlok_images as $amlok_index => $amlok_image_item ) : ?>
				<li class="shrink-0">
					<button type="button" data-gallery-thumb="<?php echo esc_attr( $amlok_index ); ?>"
						aria-label="<?php echo esc_attr( sprintf( __( 'نمایش تصویر %s از %s', 'amlok-iran' ), amlok_fa_num( $amlok_index + 1 ), amlok_fa_num( $amlok_count ) ) ); ?>"
						class="block h-20 w-24 overflow-hidden rounded border-2 transition-all duration-300 ease-editorial sm:h-24 sm:w-32"
						style="border-color: <?php echo 0 === $amlok_index ? '#C5A358' : 'transparent'; ?>; opacity: <?php echo 0 === $amlok_index ? '1' : '0.65'; ?>;">
						<?php echo amlok_image( $amlok_image_item, 'thumbnail', 'h-full w-full object-cover' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
					</button>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>

	<?php if ( $amlok_count > 1 ) : ?>
		<div data-gallery-modal role="dialog" aria-modal="true" aria-label="<?php echo esc_attr( $amlok_name ); ?>"
			class="fixed inset-0 z-[80] hidden flex-col bg-navy-950/95">
			<div class="flex items-center justify-between px-5 py-4 sm:px-8">
				<p class="font-sans text-[0.6875rem] text-white/70">
					<?php echo esc_html( $amlok_name ); ?> — <span data-gallery-counter><?php echo esc_html( amlok_fa_num( 1 ) . ' / ' . amlok_fa_num( $amlok_count ) ); ?></span>
				</p>
				<button type="button" data-gallery-close aria-label="<?php esc_attr_e( 'بستن گالری', 'amlok-iran' ); ?>"
					class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-navy">
					<?php amlok_icon( 'close', 18 ); ?>
				</button>
			</div>

			<div class="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-2 sm:px-8">
				<button type="button" data-gallery-modal-prev aria-label="<?php esc_attr_e( 'تصویر قبلی', 'amlok-iran' ); ?>"
					class="absolute right-3 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-navy sm:right-6">
					<?php amlok_icon( 'chevron-right', 20 ); ?>
				</button>
				<img data-gallery-large src="<?php echo esc_url( amlok_image_url( $amlok_images[0], 'full' ) ); ?>" alt=""
					class="max-h-full max-w-full rounded object-contain" />
				<button type="button" data-gallery-modal-next aria-label="<?php esc_attr_e( 'تصویر بعدی', 'amlok-iran' ); ?>"
					class="absolute left-3 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-navy sm:left-6">
					<?php amlok_icon( 'chevron-left', 20 ); ?>
				</button>
			</div>

			<ul class="no-scrollbar flex shrink-0 gap-3 overflow-x-auto px-5 py-5 sm:justify-center sm:px-8">
				<?php foreach ( $amlok_images as $amlok_index => $amlok_image_item ) : ?>
					<li class="shrink-0">
						<button type="button" data-gallery-modal-thumb="<?php echo esc_attr( $amlok_index ); ?>"
							aria-label="<?php echo esc_attr( sprintf( __( 'نمایش تصویر %s از %s', 'amlok-iran' ), amlok_fa_num( $amlok_index + 1 ), amlok_fa_num( $amlok_count ) ) ); ?>"
							class="block h-14 w-20 overflow-hidden rounded border-2"
							style="border-color: <?php echo 0 === $amlok_index ? '#C5A358' : 'transparent'; ?>; opacity: <?php echo 0 === $amlok_index ? '1' : '0.5'; ?>;">
							<?php echo amlok_image( $amlok_image_item, 'thumbnail', 'h-full w-full object-cover' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
						</button>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	<?php endif; ?>
</div>

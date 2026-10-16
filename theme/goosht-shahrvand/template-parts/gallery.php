<?php
/**
 * Gallery section with a mosaic grid and a lightbox.
 *
 * @package Goosht_Shahrvand
 */

$gsh_gallery_title = gsh_mod( 'gsh_gallery_title' );
$gsh_gallery_text  = gsh_mod( 'gsh_gallery_text' );
$gsh_gallery_btn   = gsh_mod( 'gsh_gallery_button_text' );
$gsh_gallery_url   = gsh_mod( 'gsh_gallery_button_url' );
$gsh_images        = gsh_get_gallery_images();

if ( ! $gsh_gallery_url ) {
	$gsh_gallery_url = gsh_page_url( 'gallery' );
}
?>
<section class="gsh-section gsh-gallery" id="gallery">
	<div class="gsh-container gsh-gallery-grid">
		<?php if ( $gsh_images ) : ?>
			<div class="gsh-gallery-mosaic">
				<?php foreach ( $gsh_images as $gsh_index => $gsh_src ) : ?>
					<figure class="gsh-mosaic-item gsh-mosaic-<?php echo (int) ( $gsh_index + 1 ); ?>">
						<a class="gsh-lightbox-trigger" href="<?php echo esc_url( $gsh_src ); ?>" data-lightbox="gsh-gallery" data-index="<?php echo (int) $gsh_index; ?>">
							<img src="<?php echo esc_url( $gsh_src ); ?>" alt="<?php echo esc_attr( sprintf( /* translators: %s: image number. */ __( 'تصویر گالری %s', 'goosht-shahrvand' ), gsh_fa_num( $gsh_index + 1 ) ) ); ?>" loading="lazy">
							<?php if ( 0 === $gsh_index ) : ?>
								<span class="gsh-zoom-badge"><?php echo gsh_icon( 'zoom', 22 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
							<?php endif; ?>
						</a>
					</figure>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>

		<div class="gsh-gallery-body">
			<?php gsh_section_heading( $gsh_gallery_title ); ?>

			<?php if ( $gsh_gallery_text ) : ?>
				<div class="gsh-prose"><?php echo wp_kses_post( wpautop( $gsh_gallery_text ) ); ?></div>
			<?php endif; ?>

			<?php if ( $gsh_gallery_btn ) : ?>
				<a class="gsh-btn gsh-btn-primary" href="<?php echo esc_url( $gsh_gallery_url ); ?>"><?php echo esc_html( $gsh_gallery_btn ); ?></a>
			<?php endif; ?>
		</div>
	</div>
</section>

<div class="gsh-lightbox" data-lightbox-modal hidden>
	<button type="button" class="gsh-lightbox-close" data-lightbox-close>
		<?php echo gsh_icon( 'close', 26 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<span class="screen-reader-text"><?php esc_html_e( 'بستن گالری', 'goosht-shahrvand' ); ?></span>
	</button>
	<button type="button" class="gsh-lightbox-nav gsh-lightbox-prev" data-lightbox-prev>
		<?php echo gsh_icon( 'chevron-right', 30 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<span class="screen-reader-text"><?php esc_html_e( 'تصویر قبلی', 'goosht-shahrvand' ); ?></span>
	</button>
	<img class="gsh-lightbox-image" data-lightbox-image src="" alt="">
	<button type="button" class="gsh-lightbox-nav gsh-lightbox-next" data-lightbox-next>
		<?php echo gsh_icon( 'chevron-left', 30 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<span class="screen-reader-text"><?php esc_html_e( 'تصویر بعدی', 'goosht-shahrvand' ); ?></span>
	</button>
</div>

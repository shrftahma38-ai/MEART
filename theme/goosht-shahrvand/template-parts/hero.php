<?php
/**
 * Hero slider.
 *
 * @package Goosht_Shahrvand
 */

$gsh_slides = gsh_get_hero_slides();

if ( ! $gsh_slides ) {
	return;
}

$gsh_slide_count = count( $gsh_slides );
$gsh_heading_tag = is_front_page() ? 'h1' : 'h2';
?>
<section class="gsh-hero" data-hero data-autoplay="<?php echo esc_attr( (int) gsh_mod( 'gsh_hero_speed' ) ); ?>">
	<div class="gsh-hero-track">
		<?php foreach ( $gsh_slides as $gsh_index => $gsh_slide ) : ?>
			<?php
			$gsh_url = $gsh_slide['button_url'];
			if ( ! $gsh_url ) {
				$gsh_url = gsh_shop_url();
			}
			?>
			<article
				class="gsh-slide<?php echo 0 === $gsh_index ? ' is-active' : ''; ?>"
				data-index="<?php echo (int) $gsh_index; ?>"
				<?php echo 0 === $gsh_index ? '' : 'aria-hidden="true"'; ?>>
				<?php if ( $gsh_slide['image'] ) : ?>
					<div class="gsh-slide-media" style="background-image:url('<?php echo esc_url( $gsh_slide['image'] ); ?>')" role="img" aria-label="<?php echo esc_attr( $gsh_slide['title'] ); ?>"></div>
				<?php endif; ?>
				<div class="gsh-slide-scrim" aria-hidden="true"></div>

				<div class="gsh-container gsh-slide-content">
					<?php if ( $gsh_slide['title'] ) : ?>
						<<?php echo esc_attr( $gsh_heading_tag ); ?> class="gsh-slide-title"><?php echo esc_html( $gsh_slide['title'] ); ?></<?php echo esc_attr( $gsh_heading_tag ); ?>>
					<?php endif; ?>

					<?php if ( $gsh_slide['subtitle'] ) : ?>
						<p class="gsh-slide-sub"><?php echo esc_html( $gsh_slide['subtitle'] ); ?></p>
					<?php endif; ?>

					<?php if ( $gsh_slide['button_text'] ) : ?>
						<a class="gsh-btn gsh-btn-primary gsh-btn-lg" href="<?php echo esc_url( $gsh_url ); ?>"><?php echo esc_html( $gsh_slide['button_text'] ); ?></a>
					<?php endif; ?>
				</div>
			</article>
		<?php endforeach; ?>
	</div>

	<?php if ( $gsh_slide_count > 1 ) : ?>
		<button type="button" class="gsh-hero-nav gsh-hero-prev" data-hero-prev>
			<?php echo gsh_icon( 'chevron-right', 28 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<span class="screen-reader-text"><?php esc_html_e( 'اسلاید قبلی', 'goosht-shahrvand' ); ?></span>
		</button>
		<button type="button" class="gsh-hero-nav gsh-hero-next" data-hero-next>
			<?php echo gsh_icon( 'chevron-left', 28 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<span class="screen-reader-text"><?php esc_html_e( 'اسلاید بعدی', 'goosht-shahrvand' ); ?></span>
		</button>

		<div class="gsh-hero-dots" data-hero-dots>
			<?php foreach ( $gsh_slides as $gsh_index => $gsh_slide ) : ?>
				<button type="button" class="gsh-dot<?php echo 0 === $gsh_index ? ' is-active' : ''; ?>" data-hero-dot="<?php echo (int) $gsh_index; ?>">
					<span class="screen-reader-text">
						<?php
						/* translators: %s: slide number. */
						printf( esc_html__( 'اسلاید %s', 'goosht-shahrvand' ), esc_html( gsh_fa_num( $gsh_index + 1 ) ) );
						?>
					</span>
				</button>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</section>

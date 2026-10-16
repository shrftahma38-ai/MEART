<?php
/**
 * About section.
 *
 * @package Goosht_Shahrvand
 */

$gsh_about_title  = gsh_mod( 'gsh_about_title' );
$gsh_about_text   = gsh_mod( 'gsh_about_text' );
$gsh_about_image  = gsh_mod( 'gsh_about_image' );
$gsh_about_btn    = gsh_mod( 'gsh_about_button_text' );
$gsh_about_url    = gsh_mod( 'gsh_about_button_url' );

if ( ! $gsh_about_url ) {
	$gsh_about_url = gsh_page_url( 'about' );
}
?>
<section class="gsh-section gsh-about" id="about">
	<div class="gsh-container gsh-about-grid">
		<div class="gsh-about-body">
			<?php gsh_section_heading( $gsh_about_title ); ?>

			<?php if ( $gsh_about_text ) : ?>
				<div class="gsh-prose gsh-about-text"><?php echo wp_kses_post( wpautop( $gsh_about_text ) ); ?></div>
			<?php endif; ?>

			<?php if ( $gsh_about_btn ) : ?>
				<a class="gsh-btn gsh-btn-primary" href="<?php echo esc_url( $gsh_about_url ); ?>"><?php echo esc_html( $gsh_about_btn ); ?></a>
			<?php endif; ?>
		</div>

		<?php if ( $gsh_about_image ) : ?>
			<figure class="gsh-about-media">
				<img src="<?php echo esc_url( $gsh_about_image ); ?>" alt="<?php echo esc_attr( $gsh_about_title ); ?>" loading="lazy">
			</figure>
		<?php endif; ?>
	</div>
</section>

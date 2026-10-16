<?php
/**
 * Site footer: contact details, map, brand and social links.
 *
 * @package Goosht_Shahrvand
 */

?>
</div><!-- #content -->

<footer id="colophon" class="gsh-footer">
	<div class="gsh-footer-main">
		<div class="gsh-container gsh-footer-grid">
			<div class="gsh-footer-col gsh-footer-contact">
				<?php gsh_section_heading( esc_html__( 'تماس با ما', 'goosht-shahrvand' ) ); ?>
				<ul class="gsh-contact-list gsh-contact-list-stacked">
					<?php foreach ( gsh_contact_rows() as $gsh_row ) : ?>
						<li class="gsh-contact-item">
							<?php echo gsh_icon( $gsh_row['icon'], 18 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							<?php if ( $gsh_row['url'] ) : ?>
								<a href="<?php echo esc_url( $gsh_row['url'] ); ?>"><?php echo esc_html( $gsh_row['label'] ); ?></a>
							<?php else : ?>
								<span><?php echo esc_html( $gsh_row['label'] ); ?></span>
							<?php endif; ?>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>

			<div class="gsh-footer-col gsh-footer-map">
				<?php if ( gsh_mod( 'gsh_map_url' ) ) : ?>
					<iframe
						class="gsh-map"
						title="<?php esc_attr_e( 'نقشه فروشگاه', 'goosht-shahrvand' ); ?>"
						src="<?php echo esc_url( gsh_mod( 'gsh_map_url' ) ); ?>"
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"></iframe>
				<?php endif; ?>
			</div>

			<div class="gsh-footer-col gsh-footer-about">
				<div class="gsh-brand"><?php gsh_brand(); ?></div>
				<p class="gsh-footer-text"><?php echo esc_html( gsh_mod( 'gsh_footer_about' ) ); ?></p>

				<?php $gsh_socials = gsh_social_links(); ?>
				<?php if ( $gsh_socials ) : ?>
					<ul class="gsh-socials">
						<?php foreach ( $gsh_socials as $gsh_social ) : ?>
							<li>
								<a href="<?php echo esc_url( $gsh_social['url'] ); ?>" target="_blank" rel="noopener noreferrer">
									<?php echo gsh_icon( $gsh_social['network'], 20 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
									<span class="screen-reader-text"><?php echo esc_html( $gsh_social['label'] ); ?></span>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
			</div>
		</div>
	</div>

	<?php if ( is_active_sidebar( 'footer-1' ) || is_active_sidebar( 'footer-2' ) || is_active_sidebar( 'footer-3' ) ) : ?>
		<div class="gsh-footer-widgets">
			<div class="gsh-container gsh-footer-widget-grid">
				<?php for ( $gsh_col = 1; $gsh_col <= 3; $gsh_col++ ) : ?>
					<?php if ( is_active_sidebar( 'footer-' . $gsh_col ) ) : ?>
						<div class="gsh-footer-widget-col"><?php dynamic_sidebar( 'footer-' . $gsh_col ); ?></div>
					<?php endif; ?>
				<?php endfor; ?>
			</div>
		</div>
	<?php endif; ?>

	<div class="gsh-footer-bottom">
		<div class="gsh-container gsh-footer-bottom-inner">
			<p class="gsh-copyright">
				<?php
				printf(
					/* translators: 1: current year, 2: copyright text. */
					esc_html__( '© %1$s %2$s', 'goosht-shahrvand' ),
					esc_html( gsh_fa_num( date_i18n( 'Y' ) ) ),
					esc_html( gsh_mod( 'gsh_copyright' ) )
				);
				?>
			</p>

			<?php
			if ( has_nav_menu( 'footer' ) ) {
				wp_nav_menu(
					array(
						'theme_location' => 'footer',
						'menu_class'     => 'gsh-footer-menu',
						'container'      => false,
						'depth'          => 1,
					)
				);
			}
			?>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>

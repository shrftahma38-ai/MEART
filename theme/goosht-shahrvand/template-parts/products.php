<?php
/**
 * Products carousel.
 *
 * Reads live products from WooCommerce when the plugin is active; otherwise it shows a
 * small set of demo cards built from the theme images so the design still renders.
 *
 * @package Goosht_Shahrvand
 */

$gsh_products_title = gsh_mod( 'gsh_products_title' );
$gsh_products_intro = gsh_mod( 'gsh_products_intro' );
$gsh_products_count = max( 1, (int) gsh_mod( 'gsh_products_count' ) );
$gsh_products_btn   = gsh_mod( 'gsh_products_button_text' );
$gsh_products_url   = gsh_mod( 'gsh_products_button_url' );
$gsh_shop           = gsh_shop_url();

if ( ! $gsh_products_url ) {
	$gsh_products_url = $gsh_shop;
}

$gsh_products = array();

if ( function_exists( 'wc_get_products' ) ) {
	$gsh_products = wc_get_products(
		array(
			'status'  => 'publish',
			'limit'   => $gsh_products_count,
			'orderby' => 'date',
			'order'   => 'DESC',
		)
	);
}

$gsh_demo_cards = array(
	array(
		'image' => GSH_URI . 'assets/images/product-1.svg',
		'title' => esc_html__( 'گوشت گوساله مخلوط', 'goosht-shahrvand' ),
	),
	array(
		'image' => GSH_URI . 'assets/images/product-2.svg',
		'title' => esc_html__( 'فیله گوسفندی', 'goosht-shahrvand' ),
	),
	array(
		'image' => GSH_URI . 'assets/images/product-3.svg',
		'title' => esc_html__( 'مرغ تازه', 'goosht-shahrvand' ),
	),
);
?>
<section class="gsh-section gsh-products" id="products">
	<div class="gsh-container">
		<div class="gsh-products-head">
			<?php gsh_section_heading( $gsh_products_title, $gsh_products_intro ); ?>

			<?php if ( $gsh_products_btn ) : ?>
				<a class="gsh-btn gsh-btn-ghost gsh-products-all" href="<?php echo esc_url( $gsh_products_url ); ?>"><?php echo esc_html( $gsh_products_btn ); ?></a>
			<?php endif; ?>
		</div>

		<div class="gsh-carousel" data-carousel>
			<button type="button" class="gsh-carousel-nav gsh-carousel-prev" data-carousel-prev>
				<?php echo gsh_icon( 'chevron-right', 24 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<span class="screen-reader-text"><?php esc_html_e( 'محصولات قبلی', 'goosht-shahrvand' ); ?></span>
			</button>

			<ul class="gsh-carousel-track">
				<?php if ( $gsh_products ) : ?>
					<?php foreach ( $gsh_products as $gsh_product ) : ?>
						<li class="gsh-card">
							<a class="gsh-card-media" href="<?php echo esc_url( $gsh_product->get_permalink() ); ?>">
								<?php echo $gsh_product->get_image( 'gsh-card' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
								<span class="gsh-card-zoom"><?php echo gsh_icon( 'zoom', 22 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
							</a>
							<div class="gsh-card-body">
								<h3 class="gsh-card-title">
									<a href="<?php echo esc_url( $gsh_product->get_permalink() ); ?>"><?php echo esc_html( $gsh_product->get_name() ); ?></a>
								</h3>
								<div class="gsh-card-price"><?php echo wp_kses_post( $gsh_product->get_price_html() ); ?></div>
								<a class="gsh-btn gsh-btn-ghost gsh-btn-sm" href="<?php echo esc_url( $gsh_product->get_permalink() ); ?>"><?php esc_html_e( 'مشاهده', 'goosht-shahrvand' ); ?></a>
							</div>
						</li>
					<?php endforeach; ?>
				<?php else : ?>
					<?php foreach ( $gsh_demo_cards as $gsh_card ) : ?>
						<li class="gsh-card gsh-card-demo">
							<a class="gsh-card-media" href="<?php echo esc_url( $gsh_shop ); ?>">
								<img src="<?php echo esc_url( $gsh_card['image'] ); ?>" alt="<?php echo esc_attr( $gsh_card['title'] ); ?>" loading="lazy">
								<span class="gsh-card-zoom"><?php echo gsh_icon( 'zoom', 22 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
							</a>
							<div class="gsh-card-body">
								<h3 class="gsh-card-title"><a href="<?php echo esc_url( $gsh_shop ); ?>"><?php echo esc_html( $gsh_card['title'] ); ?></a></h3>
								<a class="gsh-btn gsh-btn-ghost gsh-btn-sm" href="<?php echo esc_url( $gsh_shop ); ?>"><?php esc_html_e( 'مشاهده', 'goosht-shahrvand' ); ?></a>
							</div>
						</li>
					<?php endforeach; ?>
				<?php endif; ?>
			</ul>

			<button type="button" class="gsh-carousel-nav gsh-carousel-next" data-carousel-next>
				<?php echo gsh_icon( 'chevron-left', 24 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<span class="screen-reader-text"><?php esc_html_e( 'محصولات بعدی', 'goosht-shahrvand' ); ?></span>
			</button>
		</div>

		<?php if ( ! $gsh_products ) : ?>
			<p class="gsh-carousel-hint">
				<?php esc_html_e( 'برای نمایش محصولات واقعی همراه با قیمت، افزونه ووکامرس را نصب و فعال کنید.', 'goosht-shahrvand' ); ?>
			</p>
		<?php endif; ?>
	</div>
</section>

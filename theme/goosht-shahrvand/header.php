<?php
/**
 * Site header.
 *
 * @package Goosht_Shahrvand
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'رفتن به محتوا', 'goosht-shahrvand' ); ?></a>

<header id="masthead" class="gsh-header">
	<div class="gsh-container gsh-header-top">
		<div class="gsh-brand"><?php gsh_brand(); ?></div>

		<ul class="gsh-contact-list">
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

	<div class="gsh-navbar">
		<div class="gsh-container gsh-navbar-inner">
			<button type="button" class="gsh-nav-toggle" aria-controls="gsh-primary-nav" aria-expanded="false">
				<?php echo gsh_icon( 'menu', 24 ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				<span class="screen-reader-text"><?php esc_html_e( 'منو', 'goosht-shahrvand' ); ?></span>
			</button>

			<nav id="gsh-primary-nav" class="gsh-nav" aria-label="<?php esc_attr_e( 'منوی اصلی', 'goosht-shahrvand' ); ?>">
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'menu_class'     => 'gsh-menu',
						'container'      => false,
						'depth'          => 2,
						'fallback_cb'    => 'gsh_menu_fallback',
					)
				);
				?>
			</nav>

			<div class="gsh-navbar-actions">
				<?php if ( function_exists( 'gsh_cart_link' ) ) : ?>
					<?php gsh_cart_link(); ?>
				<?php endif; ?>
				<a class="gsh-btn gsh-btn-primary gsh-btn-sm" href="<?php echo esc_url( gsh_shop_url() ); ?>"><?php esc_html_e( 'سفارش تلفنی', 'goosht-shahrvand' ); ?></a>
			</div>
		</div>
	</div>
</header>

<div id="content" class="gsh-content">

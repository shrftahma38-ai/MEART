<?php
/**
 * سربرگ قالب — نوار بالا و منو.
 *
 * @package amlok-iran
 */
?><!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="screen-reader-text" href="#amlok-content"><?php esc_html_e( 'رفتن به محتوا', 'amlok-iran' ); ?></a>

<?php
$is_front    = is_front_page() && ! is_paged();
$saved_page  = get_page_by_path( 'saved' );
$fallback    = get_post_type_archive_link( 'property' );
$header_state = $is_front ? 'is-top' : 'is-solid';
?>
<header id="site-header" data-header class="site-header <?php echo esc_attr( $header_state ); ?>">
	<div class="shell flex h-20 items-center justify-between gap-6 lg:h-24">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-center gap-3 text-white" aria-label="<?php esc_attr( get_bloginfo( 'name' ) ); ?>">
			<?php if ( has_custom_logo() ) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="text-champagne" aria-hidden="true">
					<path d="M4 11 12 4.2 20 11v9H4v-9Z" /><path d="M10 20v-5.2h4V20" />
				</svg>
				<span class="flex flex-col leading-none">
					<span class="font-display text-[0.95rem] font-semibold text-white"><?php esc_html_e( 'املاک ایران', 'amlok-iran' ); ?></span>
					<span class="mt-1 font-sans text-[0.55rem] font-light text-white/60"><?php esc_html_e( 'مشاورین املاک', 'amlok-iran' ); ?></span>
				</span>
			<?php endif; ?>
		</a>

		<?php
		wp_nav_menu(
			array(
				'theme_location' => 'primary',
				'container'      => 'nav',
				'container_class'=> 'hidden items-center gap-9 lg:flex',
				'container_aria_label' => __( 'منوی اصلی', 'amlok-iran' ),
				'menu_class'     => 'site-nav-menu flex items-center gap-9',
				'fallback_cb'    => 'amlok_menu_fallback',
				'depth'          => 1,
				'echo'           => true,
			)
		);
		?>

		<div class="flex items-center gap-3">
			<a href="<?php echo esc_url( $saved_page ? get_permalink( $saved_page ) : home_url( '/saved/' ) ); ?>"
				aria-label="<?php esc_attr_e( 'علاقه‌مندی‌ها', 'amlok-iran' ); ?>"
				class="relative hidden h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:border-champagne hover:text-champagne sm:inline-flex">
				<?php amlok_icon( 'heart', 17 ); ?>
				<span data-fav-count class="hidden absolute -left-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-champagne px-1 font-sans text-[0.625rem] font-semibold text-navy-900">0</span>
			</a>

			<a href="<?php echo esc_url( amlok_phone_href() ); ?>"
				class="hidden h-11 items-center gap-2.5 border border-white/40 px-5 font-sans text-[0.8125rem] font-medium text-white transition-all duration-300 ease-editorial hover:border-white hover:bg-white hover:text-navy md:inline-flex">
				<?php amlok_icon( 'phone', 15 ); ?>
				<?php echo esc_html( amlok_phone_display() ); ?>
			</a>

			<button type="button" data-menu-open
				aria-label="<?php esc_attr_e( 'بازکردن منو', 'amlok-iran' ); ?>"
				aria-expanded="false" aria-controls="amlok-mobile-menu"
				class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:border-champagne hover:text-champagne lg:hidden">
				<?php amlok_icon( 'menu', 19 ); ?>
			</button>
		</div>
	</div>
</header>

<?php if ( $saved_page ) : ?>
<div id="amlok-mobile-menu" data-mobile-menu class="fixed inset-0 z-[70] hidden flex-col bg-navy-950/98 px-6 py-6 lg:hidden" role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'منو', 'amlok-iran' ); ?>">
	<div class="flex items-center justify-between">
		<span class="font-display text-[0.95rem] font-semibold text-white"><?php esc_html_e( 'املاک ایران', 'amlok-iran' ); ?></span>
		<button type="button" data-menu-close aria-label="<?php esc_attr_e( 'بستن منو', 'amlok-iran' ); ?>"
			class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:border-champagne hover:text-champagne">
			<?php amlok_icon( 'close', 18 ); ?>
		</button>
	</div>
	<div class="mt-10 flex flex-col gap-1 overflow-y-auto">
		<?php
		wp_nav_menu(
			array(
				'theme_location' => 'primary',
				'container'      => 'nav',
				'menu_class'     => 'site-mobile-menu flex flex-col gap-1',
				'fallback_cb'    => 'amlok_menu_fallback',
				'depth'          => 1,
			)
		);
		?>
	</div>
	<a href="<?php echo esc_url( amlok_phone_href() ); ?>" class="mt-10 inline-flex h-12 items-center justify-center gap-2.5 border border-white/40 px-5 font-sans text-[0.8125rem] font-medium text-white transition-all duration-300 ease-editorial hover:border-white hover:bg-white hover:text-navy">
		<?php amlok_icon( 'phone', 15 ); ?>
		<?php echo esc_html( amlok_phone_display() ); ?>
	</a>
</div>
<?php endif; ?>

<main id="amlok-content">

<?php
/**
 * 404 template.
 *
 * @package Goosht_Shahrvand
 */

get_header();
?>

<main id="primary" class="gsh-main">
	<div class="gsh-container gsh-404">
		<p class="gsh-404-code">۴۰۴</p>
		<h1 class="gsh-404-title"><?php esc_html_e( 'این صفحه پیدا نشد', 'goosht-shahrvand' ); ?></h1>
		<p class="gsh-404-text"><?php esc_html_e( 'ممکن است نشانی را اشتباه وارد کرده باشید. می‌توانید از جست‌وجو یا صفحه اصلی شروع کنید.', 'goosht-shahrvand' ); ?></p>

		<?php get_search_form(); ?>

		<a class="gsh-btn gsh-btn-primary" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'بازگشت به صفحه اصلی', 'goosht-shahrvand' ); ?></a>
	</div>
</main>

<?php
get_footer();

<?php
/**
 * صفحه ۴۰۴.
 *
 * @package amlok-iran
 */

get_header();

get_template_part(
	'template-parts/page-banner',
	null,
	array(
		'label'       => __( '۴۰۴', 'amlok-iran' ),
		'title'       => __( 'این صفحه پیدا نشد', 'amlok-iran' ),
		'description' => __( 'نشانی تغییر کرده یا صفحه حذف شده است. از مسیرهای زیر ادامه دهید.', 'amlok-iran' ),
		'crumbs'      => array(
			array( 'label' => __( 'خانه', 'amlok-iran' ), 'url' => home_url( '/' ) ),
			array( 'label' => __( 'پیدا نشد', 'amlok-iran' ) ),
		),
	)
);
?>

<section class="bg-white py-16">
	<div class="shell flex flex-col items-center gap-6 text-center">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>"
			class="inline-flex h-12 items-center justify-center gap-3 bg-navy px-7 font-sans text-[0.8125rem] font-medium text-white transition-all duration-300 ease-editorial hover:bg-navy-700">
			<?php esc_html_e( 'بازگشت به خانه', 'amlok-iran' ); ?>
			<?php amlok_icon( 'arrow-left', 16 ); ?>
		</a>
		<a href="<?php echo esc_url( get_post_type_archive_link( 'property' ) ?: home_url( '/' ) ); ?>"
			class="inline-flex h-12 items-center justify-center gap-3 border border-navy/25 px-7 font-sans text-[0.8125rem] font-medium text-navy transition-all duration-300 ease-editorial hover:border-navy hover:bg-navy hover:text-white">
			<?php esc_html_e( 'مرور املاک', 'amlok-iran' ); ?>
		</a>
	</div>
</section>

<?php get_footer(); ?>

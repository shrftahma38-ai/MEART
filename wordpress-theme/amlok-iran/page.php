<?php
/**
 * قالب برگه عمومی.
 *
 * @package amlok-iran
 */

get_header();

while ( have_posts() ) :
	the_post();
	get_template_part(
		'template-parts/page-banner',
		null,
		array(
			'label'  => __( 'صفحه', 'amlok-iran' ),
			'title'  => get_the_title(),
			'crumbs' => array(
				array( 'label' => __( 'خانه', 'amlok-iran' ), 'url' => home_url( '/' ) ),
				array( 'label' => get_the_title() ),
			),
		)
	);
	?>
	<section class="bg-white py-14 lg:py-20">
		<div class="shell measure-page">
			<div class="text-[1.0625rem] leading-[1.95] text-slate"><?php the_content(); ?></div>
		</div>
	</section>
	<?php
endwhile;

get_footer();

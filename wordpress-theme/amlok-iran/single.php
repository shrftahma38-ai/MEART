<?php
/**
 * قالب نوشته عمومی.
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
			'label'  => __( 'وبلاگ', 'amlok-iran' ),
			'title'  => get_the_title(),
			'crumbs' => array(
				array( 'label' => __( 'خانه', 'amlok-iran' ), 'url' => home_url( '/' ) ),
				array( 'label' => __( 'وبلاگ', 'amlok-iran' ) ),
			),
		)
	);
	?>
	<article class="bg-white py-14 lg:py-20">
		<div class="shell">
			<?php if ( has_post_thumbnail() ) : ?>
				<div class="mb-12 overflow-hidden rounded">
					<?php the_post_thumbnail( 'full', array( 'class' => 'aspect-[16/9] w-full object-cover' ) ); ?>
				</div>
			<?php endif; ?>
			<div class="mx-auto max-w-3xl text-[1.0625rem] leading-[1.95] text-slate"><?php the_content(); ?></div>
		</div>
	</article>
	<?php
endwhile;

get_footer();

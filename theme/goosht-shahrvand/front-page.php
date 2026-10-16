<?php
/**
 * Front page: hero slider, about, products and gallery, as in the design.
 *
 * @package Goosht_Shahrvand
 */

get_header();
?>

<main id="primary" class="gsh-main">
	<?php
	get_template_part( 'template-parts/hero' );
	get_template_part( 'template-parts/about' );
	get_template_part( 'template-parts/products' );
	get_template_part( 'template-parts/gallery' );

	while ( have_posts() ) :
		the_post();

		if ( trim( wp_strip_all_tags( get_the_content() ) ) ) :
			?>
			<section class="gsh-section gsh-front-content">
				<div class="gsh-container gsh-prose"><?php the_content(); ?></div>
			</section>
			<?php
		endif;
	endwhile;
	?>
</main>

<?php
get_footer();

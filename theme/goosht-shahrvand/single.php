<?php
/**
 * Single post.
 *
 * @package Goosht_Shahrvand
 */

get_header();
?>

<main id="primary" class="gsh-main">
	<div class="gsh-container">
		<div class="gsh-layout">
			<div class="gsh-posts">
				<?php while ( have_posts() ) : ?>
					<?php the_post(); ?>

					<article id="post-<?php the_ID(); ?>" <?php post_class( 'gsh-single' ); ?>>
						<header class="gsh-single-head">
							<h1 class="gsh-single-title"><?php the_title(); ?></h1>
							<?php gsh_post_meta(); ?>
						</header>

						<?php if ( has_post_thumbnail() ) : ?>
							<figure class="gsh-single-thumb"><?php the_post_thumbnail( 'gsh-wide' ); ?></figure>
						<?php endif; ?>

						<div class="gsh-prose"><?php the_content(); ?></div>

						<?php
						wp_link_pages(
							array(
								'before' => '<nav class="gsh-link-pages">',
								'after'  => '</nav>',
							)
						);

						the_tags( '<div class="gsh-tags">', ' ', '</div>' );
						?>
					</article>

					<?php
					the_post_navigation(
						array(
							'prev_text' => '<span class="gsh-nav-label">' . esc_html__( 'مطلب قبلی', 'goosht-shahrvand' ) . '</span><span class="gsh-nav-title">%title</span>',
							'next_text' => '<span class="gsh-nav-label">' . esc_html__( 'مطلب بعدی', 'goosht-shahrvand' ) . '</span><span class="gsh-nav-title">%title</span>',
						)
					);

					if ( comments_open() || get_comments_number() ) {
						comments_template();
					}
					?>
				<?php endwhile; ?>
			</div>

			<?php get_sidebar(); ?>
		</div>
	</div>
</main>

<?php
get_footer();

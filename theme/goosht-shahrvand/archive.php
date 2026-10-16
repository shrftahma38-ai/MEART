<?php
/**
 * Archive template.
 *
 * @package Goosht_Shahrvand
 */

get_header();
?>

<main id="primary" class="gsh-main">
	<div class="gsh-container">
		<header class="gsh-archive-head">
			<?php the_archive_title( '<h1 class="gsh-archive-title">', '</h1>' ); ?>
			<span class="gsh-rule" aria-hidden="true"></span>
			<?php the_archive_description( '<div class="gsh-prose gsh-archive-desc">', '</div>' ); ?>
		</header>

		<div class="gsh-layout">
			<div class="gsh-posts">
				<?php if ( have_posts() ) : ?>
					<div class="gsh-post-grid">
						<?php while ( have_posts() ) : ?>
							<?php the_post(); ?>
							<?php get_template_part( 'template-parts/content', get_post_type() ); ?>
						<?php endwhile; ?>
					</div>

					<?php
					the_posts_pagination(
						array(
							'mid_size'  => 1,
							'prev_text' => esc_html__( 'قبلی', 'goosht-shahrvand' ),
							'next_text' => esc_html__( 'بعدی', 'goosht-shahrvand' ),
						)
					);
					?>
				<?php else : ?>
					<p class="gsh-empty"><?php esc_html_e( 'موردی یافت نشد.', 'goosht-shahrvand' ); ?></p>
				<?php endif; ?>
			</div>

			<?php get_sidebar(); ?>
		</div>
	</div>
</main>

<?php
get_footer();

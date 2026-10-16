<?php
/**
 * Search results.
 *
 * @package Goosht_Shahrvand
 */

get_header();
?>

<main id="primary" class="gsh-main">
	<div class="gsh-container">
		<header class="gsh-archive-head">
			<h1 class="gsh-archive-title">
				<?php
				/* translators: %s: search query. */
				printf( esc_html__( 'نتایج جست‌وجو برای «%s»', 'goosht-shahrvand' ), esc_html( get_search_query() ) );
				?>
			</h1>
			<span class="gsh-rule" aria-hidden="true"></span>
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
					<div class="gsh-empty">
						<p><?php esc_html_e( 'چیزی پیدا نشد. عبارت دیگری را امتحان کنید.', 'goosht-shahrvand' ); ?></p>
						<?php get_search_form(); ?>
					</div>
				<?php endif; ?>
			</div>

			<?php get_sidebar(); ?>
		</div>
	</div>
</main>

<?php
get_footer();

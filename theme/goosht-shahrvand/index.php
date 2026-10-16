<?php
/**
 * Blog index.
 *
 * @package Goosht_Shahrvand
 */

get_header();

$gsh_blog_title = get_option( 'page_for_posts' ) ? get_the_title( get_option( 'page_for_posts' ) ) : esc_html__( 'مجله گوشت شهروند', 'goosht-shahrvand' );
?>

<main id="primary" class="gsh-main">
	<div class="gsh-container">
		<header class="gsh-archive-head">
			<h1 class="gsh-archive-title"><?php echo esc_html( $gsh_blog_title ); ?></h1>
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
					<p class="gsh-empty"><?php esc_html_e( 'هنوز مطلبی منتشر نشده است.', 'goosht-shahrvand' ); ?></p>
				<?php endif; ?>
			</div>

			<?php get_sidebar(); ?>
		</div>
	</div>
</main>

<?php
get_footer();

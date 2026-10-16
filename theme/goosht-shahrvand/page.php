<?php
/**
 * Static page.
 *
 * @package Goosht_Shahrvand
 */

get_header();
?>

<main id="primary" class="gsh-main">
	<?php while ( have_posts() ) : ?>
		<?php the_post(); ?>

		<header class="gsh-page-head">
			<div class="gsh-container">
				<h1 class="gsh-page-title"><?php the_title(); ?></h1>
				<span class="gsh-rule" aria-hidden="true"></span>
			</div>
		</header>

		<article id="post-<?php the_ID(); ?>" <?php post_class( 'gsh-page' ); ?>>
			<?php if ( has_post_thumbnail() ) : ?>
				<figure class="gsh-page-thumb"><?php the_post_thumbnail( 'gsh-wide' ); ?></figure>
			<?php endif; ?>

			<div class="gsh-container gsh-prose"><?php the_content(); ?></div>
		</article>

		<?php
		if ( comments_open() || get_comments_number() ) {
			echo '<div class="gsh-container">';
			comments_template();
			echo '</div>';
		}
		?>
	<?php endwhile; ?>
</main>

<?php
get_footer();

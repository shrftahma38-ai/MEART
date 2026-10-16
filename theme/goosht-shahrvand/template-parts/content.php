<?php
/**
 * Post card used by the blog, archive and search templates.
 *
 * @package Goosht_Shahrvand
 */

?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'gsh-post-card' ); ?>>
	<?php if ( has_post_thumbnail() ) : ?>
		<a class="gsh-post-thumb" href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
			<?php the_post_thumbnail( 'gsh-card', array( 'loading' => 'lazy' ) ); ?>
		</a>
	<?php endif; ?>

	<div class="gsh-post-body">
		<h2 class="gsh-post-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
		<?php gsh_post_meta(); ?>
		<div class="gsh-post-excerpt"><?php the_excerpt(); ?></div>
		<a class="gsh-btn gsh-btn-ghost gsh-btn-sm" href="<?php the_permalink(); ?>"><?php esc_html_e( 'بیشتر بخوانید', 'goosht-shahrvand' ); ?></a>
	</div>
</article>

<?php
/**
 * Comments template.
 *
 * @package Goosht_Shahrvand
 */

if ( post_password_required() ) {
	return;
}
?>
<div id="comments" class="gsh-comments">
	<?php if ( have_comments() ) : ?>
		<h2 class="gsh-comments-title">
			<?php
			$gsh_count = get_comments_number();
			/* translators: %s: comment count in Persian digits. */
			printf( esc_html__( '%s دیدگاه', 'goosht-shahrvand' ), esc_html( gsh_fa_num( $gsh_count ) ) );
			?>
		</h2>

		<ol class="gsh-comment-list">
			<?php
			wp_list_comments(
				array(
					'style'       => 'ol',
					'short_ping'  => true,
					'avatar_size' => 48,
				)
			);
			?>
		</ol>

		<?php
		the_comments_navigation(
			array(
				'prev_text' => esc_html__( 'دیدگاه‌های قبلی', 'goosht-shahrvand' ),
				'next_text' => esc_html__( 'دیدگاه‌های بعدی', 'goosht-shahrvand' ),
			)
		);
		?>

		<?php if ( ! comments_open() ) : ?>
			<p class="gsh-comments-closed"><?php esc_html_e( 'دیدگاه‌ها بسته شده است.', 'goosht-shahrvand' ); ?></p>
		<?php endif; ?>
	<?php endif; ?>

	<?php
	comment_form(
		array(
			'title_reply'          => esc_html__( 'دیدگاه خود را بنویسید', 'goosht-shahrvand' ),
			'title_reply_before'   => '<h2 id="reply-title" class="comment-reply-title">',
			'title_reply_after'    => '</h2>',
			'label_submit'         => esc_html__( 'ارسال دیدگاه', 'goosht-shahrvand' ),
			'class_submit'         => 'gsh-btn gsh-btn-primary',
			'comment_notes_before' => '<p class="comment-notes">' . esc_html__( 'نشانی ایمیل شما منتشر نخواهد شد.', 'goosht-shahrvand' ) . '</p>',
			'comment_field'        => '<p class="comment-form-comment"><label for="comment">' . esc_html__( 'دیدگاه', 'goosht-shahrvand' ) . '</label><textarea id="comment" name="comment" cols="45" rows="6" required></textarea></p>',
		)
	);
	?>
</div>

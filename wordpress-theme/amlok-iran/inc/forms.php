<?php
/**
 * فرم‌ها: استعلام و درخواست بازدید + خبرنامه.
 * هر دو با admin-post.php کار می‌کنند، نانس دارند و بدون جاوااسکریپت هم کار می‌کنند.
 *
 * @package amlok-iran
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** بازگشت به صفحه مبدأ با پرچم وضعیت. */
function amlok_form_back( $flag, $anchor ) {
	$back = wp_get_referer();
	if ( ! $back ) {
		$back = home_url( '/' );
	}
	$back = remove_query_arg( array( 'amlok_sent', 'amlok_error' ), $back );
	$back = add_query_arg( $flag ? array( 'amlok_sent' => $flag ) : array( 'amlok_error' => '1' ), $back );
	wp_safe_redirect( $back . ( $anchor ? '#' . $anchor : '' ) );
	exit;
}

/** دریافت و پاک‌سازی ورودی فرم استعلام. */
function amlok_inquiry_inputs() {
	return array(
		'kind'     => in_array( $_POST['amlok_kind'] ?? '', array( 'contact', 'viewing' ), true ) ? sanitize_key( $_POST['amlok_kind'] ) : 'contact',
		'name'     => sanitize_text_field( wp_unslash( $_POST['name'] ?? '' ) ),
		'email'    => sanitize_email( wp_unslash( $_POST['email'] ?? '' ) ),
		'phone'    => sanitize_text_field( wp_unslash( $_POST['phone'] ?? '' ) ),
		'message'  => sanitize_textarea_field( wp_unslash( $_POST['message'] ?? '' ) ),
		'date'     => sanitize_text_field( wp_unslash( $_POST['preferred_date'] ?? '' ) ),
		'property' => absint( $_POST['property_id'] ?? 0 ),
		'property_title' => sanitize_text_field( wp_unslash( $_POST['property_title'] ?? '' ) ),
	);
}

/** پردازش فرم استعلام / درخواست بازدید. */
function amlok_handle_inquiry() {
	if ( ! isset( $_POST['amlok_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['amlok_nonce'] ), 'amlok_inquiry' ) ) {
		wp_die( esc_html__( 'نشست شما منقضی شده است. صفحه را بازخوانی کنید.', 'amlok-iran' ), '', array( 'response' => 403 ) );
	}

	// تله اسپم.
	if ( ! empty( $_POST['amlok_website'] ) ) {
		amlok_form_back( false, 'amlok-form' );
	}

	$input = amlok_inquiry_inputs();

	if ( mb_strlen( $input['name'] ) < 2 || ! is_email( $input['email'] ) ) {
		amlok_form_back( false, 'amlok-form' );
	}

	$lines   = array(
		'نوع فرم: ' . ( 'viewing' === $input['kind'] ? 'درخواست بازدید' : 'استعلام' ),
		'نام: ' . $input['name'],
		'ایمیل: ' . $input['email'],
	);
	if ( $input['phone'] ) {
		$lines[] = 'تلفن: ' . $input['phone'];
	}
	if ( $input['date'] ) {
		$lines[] = 'تاریخ پیشنهادی: ' . $input['date'];
	}
	if ( $input['property_title'] ) {
		$lines[] = 'ملک: ' . $input['property_title'];
	}
	if ( $input['message'] ) {
		$lines[] = "\nپیام:\n" . $input['message'];
	}

	$subject = sprintf(
		'[%s] %s',
		wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ),
		'viewing' === $input['kind'] ? 'درخواست بازدید' : 'استعلام جدید'
	);

	wp_mail(
		get_option( 'admin_email' ),
		$subject,
		implode( "\n", $lines ),
		array( 'Reply-To: ' . $input['name'] . ' <' . $input['email'] . '>' )
	);

	amlok_form_back( 'viewing' === $input['kind'] ? 'viewing' : 'contact', 'amlok-form' );
}
add_action( 'admin_post_nopriv_amlok_inquiry', 'amlok_handle_inquiry' );
add_action( 'admin_post_amlok_inquiry', 'amlok_handle_inquiry' );

/** پردازش خبرنامه. */
function amlok_handle_newsletter() {
	if ( ! isset( $_POST['amlok_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['amlok_nonce'] ), 'amlok_newsletter' ) ) {
		wp_die( esc_html__( 'نشست شما منقضی شده است. صفحه را بازخوانی کنید.', 'amlok-iran' ), '', array( 'response' => 403 ) );
	}
	if ( ! empty( $_POST['amlok_website'] ) ) {
		amlok_form_back( false, 'amlok-newsletter' );
	}

	$email = sanitize_email( wp_unslash( $_POST['email'] ?? '' ) );
	if ( ! is_email( $email ) ) {
		amlok_form_back( false, 'amlok-newsletter' );
	}

	$subs = get_option( 'amlok_subscribers', array() );
	if ( ! isset( $subs[ $email ] ) ) {
		$subs[ $email ] = time();
		update_option( 'amlok_subscribers', $subs, false );
	}

	amlok_form_back( 'newsletter', 'amlok-newsletter' );
}
add_action( 'admin_post_nopriv_amlok_newsletter', 'amlok_handle_newsletter' );
add_action( 'admin_post_amlok_newsletter', 'amlok_handle_newsletter' );

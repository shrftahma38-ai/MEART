<?php
/**
 * Sandbox-only overrides for the Base44 preview.
 *
 * This file is NOT part of the distributed theme (it lives outside theme/goosht-shahrvand
 * and is only mounted by docker-compose.base44.yml). Everything in it is gated behind an
 * exact BASE44_PREVIEW_MODE=1 check: with the flag unset or set to anything else the file
 * returns immediately and WordPress behaves exactly as stock.
 *
 * Why it is needed:
 *  - The preview proxy reaches the container through https://3000-$BASE44_PUBLIC_HOST_SUFFIX,
 *    so the canonical site URL is built from that variable instead of the request host.
 *  - The proxy rewrites the Host header, which makes WordPress' canonical redirect bounce
 *    between the public URL and the rewritten host; that single redirect is removed here.
 *
 * @package Goosht_Shahrvand_Sandbox
 */

if ( '1' !== getenv( 'BASE44_PREVIEW_MODE' ) ) {
	return;
}

$gsh_sandbox_suffix = getenv( 'BASE44_PUBLIC_HOST_SUFFIX' );

if ( $gsh_sandbox_suffix ) {
	$gsh_sandbox_url = 'https://3000-' . $gsh_sandbox_suffix;

	add_filter(
		'option_home',
		static function () use ( $gsh_sandbox_url ) {
			return $gsh_sandbox_url;
		}
	);

	add_filter(
		'option_siteurl',
		static function () use ( $gsh_sandbox_url ) {
			return $gsh_sandbox_url;
		}
	);
}

/*
 * The preview proxy terminates TLS at the edge and forwards plain HTTP to Apache, so without
 * this WordPress believes the request is insecure and rewrites every same-host asset URL to
 * http:// – which the browser then blocks as mixed content inside the https preview.
 * Proxy requests are recognised by the Host header the proxy rewrites
 * (<port>-<sandbox id>.$BASE44_SANDBOX_HOST_DOMAIN) or the public host
 * (<port>-$BASE44_PUBLIC_HOST_SUFFIX). Direct http://localhost:3000 requests keep working.
 */
$gsh_sandbox_request_host = isset( $_SERVER['HTTP_HOST'] ) ? strtolower( $_SERVER['HTTP_HOST'] ) : '';
$gsh_sandbox_proxied      = false;

foreach ( array( getenv( 'BASE44_SANDBOX_HOST_DOMAIN' ), getenv( 'BASE44_PUBLIC_HOST_SUFFIX' ) ) as $gsh_sandbox_domain ) {
	if ( $gsh_sandbox_domain && false !== strpos( $gsh_sandbox_request_host, strtolower( $gsh_sandbox_domain ) ) ) {
		$gsh_sandbox_proxied = true;
	}
}

if ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && 'https' === $_SERVER['HTTP_X_FORWARDED_PROTO'] ) {
	$gsh_sandbox_proxied = true;
}

if ( $gsh_sandbox_proxied ) {
	$_SERVER['HTTPS']      = 'on';
	$_SERVER['SERVER_PORT'] = '443';
}

// Avoid a redirect loop caused by the proxy's Host header rewrite (see the note above).
remove_action( 'template_redirect', 'redirect_canonical' );

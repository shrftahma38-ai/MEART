<?php
/**
 * فرم استعلام / درخواست بازدید.
 * آرگومان‌ها: kind (contact|viewing), property_id, property_title, tone, with_date,
 * submit_label, message_label, message_placeholder.
 *
 * با admin-post.php ارسال می‌شود؛ نانس دارد؛ بدون جاوااسکریپت هم کار می‌کند.
 *
 * @package amlok-iran
 */

$amlok_form_kind   = $args['kind'] ?? 'contact';
$amlok_form_tone   = $args['tone'] ?? 'dark';
$amlok_on_light    = 'light' === $amlok_form_tone;
$amlok_with_date   = ! empty( $args['with_date'] );
$amlok_prop_id     = (int) ( $args['property_id'] ?? 0 );
$amlok_prop_title  = $args['property_title'] ?? '';
$amlok_submit      = $args['submit_label'] ?? __( 'ارسال استعلام', 'amlok-iran' );
$amlok_msg_label   = $args['message_label'] ?? __( 'پیام', 'amlok-iran' );
$amlok_msg_ph      = $args['message_placeholder'] ?? __( 'درباره آنچه می‌خواهید بنویسید…', 'amlok-iran' );

$amlok_sent  = isset( $_GET['amlok_sent'] ) ? sanitize_key( wp_unslash( $_GET['amlok_sent'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
$amlok_error = isset( $_GET['amlok_error'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
$amlok_success = $amlok_sent === $amlok_form_kind;

$amlok_input     = $amlok_on_light
	? 'h-12 w-full rounded-sm border border-navy/15 bg-white px-4 font-sans text-[0.9375rem] text-navy placeholder:text-navy/35 focus:border-navy focus:outline-none'
	: 'h-12 w-full rounded-sm border border-white/20 bg-white/5 px-4 font-sans text-[0.9375rem] text-white placeholder:text-white/45 focus:border-champagne focus:outline-none';
$amlok_textarea  = $amlok_on_light
	? 'w-full resize-y rounded-sm border border-navy/15 bg-white px-4 py-3 font-sans text-[0.9375rem] text-navy placeholder:text-navy/35 focus:border-navy focus:outline-none'
	: 'w-full resize-y rounded-sm border border-white/20 bg-white/5 px-4 py-3 font-sans text-[0.9375rem] text-white placeholder:text-white/45 focus:border-champagne focus:outline-none';
$amlok_label_cls = 'label block ' . ( $amlok_on_light ? 'text-navy/60' : 'text-white/60' );
?>

<?php if ( $amlok_success ) : ?>
	<div role="status" id="amlok-form" class="flex flex-col items-start gap-4 rounded border border-champagne/40 bg-champagne/10 p-7">
		<span class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne text-champagne-dark">
			<?php amlok_icon( 'check', 18 ); ?>
		</span>
		<h3 class="font-display text-xl font-medium <?php echo $amlok_on_light ? 'text-navy' : 'text-white'; ?>">
			<?php echo 'viewing' === $amlok_form_kind ? esc_html__( 'درخواست بازدید شما ثبت شد', 'amlok-iran' ) : esc_html__( 'سپاس — پیام شما به دست ما رسید', 'amlok-iran' ); ?>
		</h3>
		<p class="text-[0.9375rem] leading-relaxed <?php echo $amlok_on_light ? 'text-slate' : 'text-white/70'; ?>">
			<?php echo 'viewing' === $amlok_form_kind
				? esc_html__( 'مشاور ما تا یک روز کاری زمان بازدید را با ایمیل تأیید می‌کند.', 'amlok-iran' )
				: esc_html__( 'یکی از مشاوران ما تا یک روز کاری پاسخ می‌دهد.', 'amlok-iran' ); ?>
		</p>
		<a href="<?php echo esc_url( remove_query_arg( array( 'amlok_sent', 'amlok_error' ) ) ); ?>"
			class="font-sans text-[0.6875rem] font-medium transition-colors duration-300 <?php echo $amlok_on_light ? 'text-navy hover:text-champagne-dark' : 'text-white hover:text-champagne-light'; ?>">
			<?php esc_html_e( 'ارسال پیام دیگر', 'amlok-iran' ); ?>
		</a>
	</div>
<?php else : ?>
	<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" id="amlok-form" class="flex flex-col gap-5">
		<input type="hidden" name="action" value="amlok_inquiry" />
		<input type="hidden" name="amlok_kind" value="<?php echo esc_attr( $amlok_form_kind ); ?>" />
		<input type="hidden" name="property_id" value="<?php echo esc_attr( $amlok_prop_id ); ?>" />
		<input type="hidden" name="property_title" value="<?php echo esc_attr( $amlok_prop_title ); ?>" />
		<?php wp_nonce_field( 'amlok_inquiry', 'amlok_nonce' ); ?>
		<input type="text" name="amlok_website" value="" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />

		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
			<div>
				<label for="amlok-<?php echo esc_attr( $amlok_form_kind ); ?>-name" class="<?php echo esc_attr( $amlok_label_cls ); ?>"><?php esc_html_e( 'نام و نام خانوادگی', 'amlok-iran' ); ?></label>
				<input id="amlok-<?php echo esc_attr( $amlok_form_kind ); ?>-name" name="name" type="text" required
					autocomplete="name" placeholder="<?php esc_attr_e( 'نام شما', 'amlok-iran' ); ?>"
					class="<?php echo esc_attr( $amlok_input ); ?> mt-3" />
			</div>
			<div>
				<label for="amlok-<?php echo esc_attr( $amlok_form_kind ); ?>-email" class="<?php echo esc_attr( $amlok_label_cls ); ?>"><?php esc_html_e( 'ایمیل', 'amlok-iran' ); ?></label>
				<input id="amlok-<?php echo esc_attr( $amlok_form_kind ); ?>-email" name="email" type="email" required
					autocomplete="email" dir="ltr" placeholder="you@example.com"
					class="<?php echo esc_attr( $amlok_input ); ?> mt-3" />
			</div>
		</div>

		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
			<div>
				<label for="amlok-<?php echo esc_attr( $amlok_form_kind ); ?>-phone" class="<?php echo esc_attr( $amlok_label_cls ); ?>">
					<?php esc_html_e( 'تلفن', 'amlok-iran' ); ?> <span class="opacity-70">(<?php esc_html_e( 'اختیاری', 'amlok-iran' ); ?>)</span>
				</label>
				<input id="amlok-<?php echo esc_attr( $amlok_form_kind ); ?>-phone" name="phone" type="tel" autocomplete="tel" dir="ltr"
					placeholder="۰۹۱۲ ۰۰۰ ۰۰۰۰" class="<?php echo esc_attr( $amlok_input ); ?> mt-3" />
			</div>
			<?php if ( $amlok_with_date ) : ?>
				<div>
					<label for="amlok-<?php echo esc_attr( $amlok_form_kind ); ?>-date" class="<?php echo esc_attr( $amlok_label_cls ); ?>"><?php esc_html_e( 'تاریخ پیشنهادی', 'amlok-iran' ); ?></label>
					<input id="amlok-<?php echo esc_attr( $amlok_form_kind ); ?>-date" name="preferred_date" type="date"
						class="<?php echo esc_attr( $amlok_input ); ?> mt-3" />
				</div>
			<?php endif; ?>
		</div>

		<div>
			<label for="amlok-<?php echo esc_attr( $amlok_form_kind ); ?>-message" class="<?php echo esc_attr( $amlok_label_cls ); ?>"><?php echo esc_html( $amlok_msg_label ); ?></label>
			<textarea id="amlok-<?php echo esc_attr( $amlok_form_kind ); ?>-message" name="message" rows="4"
				placeholder="<?php echo esc_attr( $amlok_msg_ph ); ?>"
				class="mt-3 <?php echo esc_attr( $amlok_textarea ); ?>"></textarea>
		</div>

		<?php if ( $amlok_error ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
			<p role="alert" class="text-[0.8125rem] <?php echo $amlok_on_light ? 'text-red-600' : 'text-red-300'; ?>"><?php esc_html_e( 'ارسال نشد؛ لطفاً نام و ایمیل معتبر را بررسی کنید.', 'amlok-iran' ); ?></p>
		<?php endif; ?>

		<div class="flex flex-wrap items-center gap-5">
			<button type="submit"
				class="group/btn inline-flex h-12 items-center justify-center gap-2.5 px-8 font-sans text-[0.8125rem] font-medium transition-all duration-300 ease-editorial <?php echo $amlok_on_light ? 'bg-navy text-white hover:bg-navy-700' : 'bg-champagne text-navy-900 hover:bg-champagne-light'; ?>">
				<?php echo esc_html( $amlok_submit ); ?>
				<?php amlok_icon( 'arrow-left', 15, 'transition-transform duration-300 group-hover/btn:-translate-x-1' ); ?>
			</button>
			<p class="text-[0.75rem] <?php echo $amlok_on_light ? 'text-slate-soft' : 'text-white/50'; ?>"><?php esc_html_e( 'تا یک روز کاری پاسخ می‌دهیم.', 'amlok-iran' ); ?></p>
		</div>
	</form>
<?php endif; ?>

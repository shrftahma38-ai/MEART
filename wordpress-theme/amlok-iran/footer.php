<?php
/**
 * پابرگ قالب — درباره ما، منو، تماس و خبرنامه.
 *
 * @package amlok-iran
 */

$saved_page = get_page_by_path( 'saved' );
?>
</main>

<footer class="border-t border-champagne/20 bg-navy-900 text-white">
	<div class="shell grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:py-20">
		<div class="lg:col-span-4">
			<div class="flex items-center gap-3">
				<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" class="text-white" aria-hidden="true">
					<path d="M4 11 12 4.2 20 11v9H4v-9Z" /><path d="M10 20v-5.2h4V20" />
				</svg>
				<span class="flex flex-col leading-none">
					<span class="font-display text-[0.95rem] font-semibold text-white"><?php esc_html_e( 'املاک ایران', 'amlok-iran' ); ?></span>
					<span class="mt-1 font-sans text-[0.55rem] font-light text-white/60"><?php esc_html_e( 'مشاورین املاک', 'amlok-iran' ); ?></span>
				</span>
			</div>
			<p class="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-white/65">
				<?php esc_html_e( 'مجموعه‌ای تخصصی برای خانه‌های با معماری خاص، املاک خصوصی و سرمایه‌گذاری‌های بلندمدت در بازار ملک.', 'amlok-iran' ); ?>
			</p>
			<ul class="mt-7 flex gap-3">
				<?php foreach ( array( 'social_linkedin' => 'linkedin', 'social_instagram' => 'instagram', 'social_facebook' => 'facebook' ) as $key => $icon ) : ?>
					<?php $url = amlok_setting( $key ); ?>
					<?php if ( $url ) : ?>
						<li>
							<a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener noreferrer"
								aria-label="<?php echo esc_attr( amlok_setting( $key ) ); ?>"
								class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/75 transition-colors duration-300 hover:border-champagne hover:text-champagne">
								<?php amlok_icon( $icon, 17 ); ?>
							</a>
						</li>
					<?php endif; ?>
				<?php endforeach; ?>
			</ul>
		</div>

		<nav class="lg:col-span-2" aria-label="<?php esc_attr_e( 'منوی پابرگ', 'amlok-iran' ); ?>">
			<h2 class="label text-champagne"><?php esc_html_e( 'دسترسی سریع', 'amlok-iran' ); ?></h2>
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'footer',
					'container'      => 'div',
					'container_class'=> 'mt-5',
					'menu_class'     => 'site-footer-menu space-y-3',
					'fallback_cb'    => 'amlok_menu_fallback',
					'depth'          => 1,
				)
			);
			?>
		</nav>

		<div class="lg:col-span-3">
			<h2 class="label text-champagne"><?php esc_html_e( 'تماس با ما', 'amlok-iran' ); ?></h2>
			<ul class="mt-5 space-y-4 text-[0.9375rem] text-white/75">
				<li>
					<a href="<?php echo esc_url( amlok_phone_href() ); ?>" class="inline-flex items-center gap-3 transition-colors duration-300 hover:text-white">
						<?php amlok_icon( 'phone', 16, 'text-champagne' ); ?>
						<?php echo esc_html( amlok_phone_display() ); ?>
					</a>
				</li>
				<li>
					<a href="mailto:<?php echo esc_attr( amlok_setting( 'contact_email' ) ); ?>" class="inline-flex items-center gap-3 transition-colors duration-300 hover:text-white">
						<?php amlok_icon( 'mail', 16, 'text-champagne' ); ?>
						<?php echo esc_html( amlok_setting( 'contact_email' ) ); ?>
					</a>
				</li>
				<li class="flex items-start gap-3">
					<?php amlok_icon( 'pin', 16, 'mt-1 shrink-0 text-champagne' ); ?>
					<span>
						<span class="block"><?php echo esc_html( amlok_setting( 'contact_address1' ) ); ?></span>
						<span class="block"><?php echo esc_html( amlok_setting( 'contact_address2' ) ); ?></span>
					</span>
				</li>
				<li class="text-white/55"><?php echo esc_html( amlok_setting( 'contact_hours' ) ); ?></li>
			</ul>
		</div>

		<div class="sm:col-span-2 lg:col-span-3" id="amlok-newsletter">
			<h2 class="label text-champagne"><?php esc_html_e( 'خبرنامه', 'amlok-iran' ); ?></h2>
			<p class="mt-5 text-[0.9375rem] leading-relaxed text-white/65">
				<?php esc_html_e( 'فهرست‌های خصوصی و گزارش بازار، هر وقت چیز ارزشمندی داشتیم برایتان می‌فرستیم.', 'amlok-iran' ); ?>
			</p>
			<form action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" method="post" class="mt-6 flex flex-col gap-3" id="amlok-newsletter-form">
				<input type="hidden" name="action" value="amlok_newsletter" />
				<?php wp_nonce_field( 'amlok_newsletter', 'amlok_nonce' ); ?>
				<input type="text" name="amlok_website" value="" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />
				<?php if ( isset( $_GET['amlok_sent'] ) && 'newsletter' === $_GET['amlok_sent'] ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
					<p role="status" class="rounded border border-champagne/40 bg-champagne/10 px-4 py-3 text-[0.8125rem] text-champagne-light"><?php esc_html_e( 'عضویت شما ثبت شد. سپاس!', 'amlok-iran' ); ?></p>
				<?php elseif ( isset( $_GET['amlok_error'] ) ) : // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>
					<p role="alert" class="rounded border border-red-400/40 bg-red-400/10 px-4 py-3 text-[0.8125rem] text-red-300"><?php esc_html_e( 'ارسال نشد؛ ایمیل معتبر وارد کنید.', 'amlok-iran' ); ?></p>
				<?php endif; ?>
				<label for="amlok-newsletter-email" class="label text-white/60"><?php esc_html_e( 'ایمیل', 'amlok-iran' ); ?></label>
				<div class="flex gap-3">
					<input id="amlok-newsletter-email" name="email" type="email" required dir="ltr"
						placeholder="you@example.com"
						class="h-12 w-full rounded-sm border border-white/20 bg-white/5 px-4 font-sans text-[0.9375rem] text-white placeholder:text-white/45 focus:border-champagne focus:outline-none" />
					<button type="submit"
						class="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-champagne px-6 font-sans text-[0.8125rem] font-medium text-navy-900 transition-all duration-300 ease-editorial hover:bg-champagne-light">
						<?php esc_html_e( 'عضویت', 'amlok-iran' ); ?>
					</button>
				</div>
			</form>
		</div>
	</div>

	<div class="border-t border-white/10">
		<div class="shell flex flex-col gap-3 py-6 text-[0.8125rem] text-white/50 sm:flex-row sm:items-center sm:justify-between">
			<p>© <?php echo esc_html( amlok_fa_num( date_i18n( 'Y' ) ) ); ?> <?php esc_html_e( 'املاک ایران. همه حقوق محفوظ است.', 'amlok-iran' ); ?></p>
			<p><?php echo esc_html( amlok_setting( 'contact_license' ) ); ?></p>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>

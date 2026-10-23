<?php
/**
 * Template Name: تماس با ما
 * قالب برگه تماس — اطلاعات دفتر + فرم استعلام.
 *
 * @package amlok-iran
 */

get_header();

get_template_part(
	'template-parts/page-banner',
	null,
	array(
		'label'       => __( 'تماس', 'amlok-iran' ),
		'title'       => __( 'گفت‌وگو با مشاور', 'amlok-iran' ),
		'description' => __( 'خرید، فروش یا حتی بررسی یک جابه‌جایی — همه چیز با یک گفت‌وگو آغاز می‌شود. تا یک روز کاری پاسخ می‌دهیم.', 'amlok-iran' ),
		'crumbs'      => array(
			array( 'label' => __( 'خانه', 'amlok-iran' ), 'url' => home_url( '/' ) ),
			array( 'label' => __( 'تماس با ما', 'amlok-iran' ) ),
		),
	)
);

$contact_img = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb';
?>

<section class="bg-white py-14 lg:py-20">
	<div class="shell grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
		<div class="lg:col-span-5">
			<h2 class="font-display text-[1.5rem] font-medium text-navy"><?php esc_html_e( 'دفتر و اطلاعات تماس', 'amlok-iran' ); ?></h2>

			<dl class="mt-8 space-y-7">
				<div class="flex items-start gap-4">
					<span class="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy/15 text-champagne-dark">
						<?php amlok_icon( 'phone', 17 ); ?>
					</span>
					<div>
						<dt class="font-sans text-[0.6875rem] text-slate-soft"><?php esc_html_e( 'تلفن', 'amlok-iran' ); ?></dt>
						<dd class="mt-2">
							<a href="<?php echo esc_url( amlok_phone_href() ); ?>" class="font-display text-[1.0625rem] font-medium text-navy transition-colors duration-300 hover:text-champagne-dark">
								<?php echo esc_html( amlok_phone_display() ); ?>
							</a>
						</dd>
					</div>
				</div>

				<div class="flex items-start gap-4">
					<span class="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy/15 text-champagne-dark">
						<?php amlok_icon( 'mail', 17 ); ?>
					</span>
					<div>
						<dt class="font-sans text-[0.6875rem] text-slate-soft"><?php esc_html_e( 'ایمیل', 'amlok-iran' ); ?></dt>
						<dd class="mt-2">
							<a href="mailto:<?php echo esc_attr( amlok_setting( 'contact_email' ) ); ?>" class="font-display text-[1.0625rem] font-medium text-navy transition-colors duration-300 hover:text-champagne-dark" dir="ltr">
								<?php echo esc_html( amlok_setting( 'contact_email' ) ); ?>
							</a>
						</dd>
					</div>
				</div>

				<div class="flex items-start gap-4">
					<span class="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy/15 text-champagne-dark">
						<?php amlok_icon( 'pin', 17 ); ?>
					</span>
					<div>
						<dt class="font-sans text-[0.6875rem] text-slate-soft"><?php esc_html_e( 'دفتر', 'amlok-iran' ); ?></dt>
						<dd class="mt-2 text-[1.0625rem] leading-relaxed text-navy">
							<span class="block"><?php echo esc_html( amlok_setting( 'contact_address1' ) ); ?></span>
							<span class="block"><?php echo esc_html( amlok_setting( 'contact_address2' ) ); ?></span>
						</dd>
					</div>
				</div>

				<div class="flex items-start gap-4">
					<span class="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy/15 text-champagne-dark">
						<?php amlok_icon( 'calendar', 17 ); ?>
					</span>
					<div>
						<dt class="font-sans text-[0.6875rem] text-slate-soft"><?php esc_html_e( 'ساعات کاری', 'amlok-iran' ); ?></dt>
						<dd class="mt-2 text-[1.0625rem] text-navy"><?php echo esc_html( amlok_setting( 'contact_hours' ) ); ?></dd>
					</div>
				</div>
			</dl>

			<div class="mt-10 overflow-hidden rounded">
				<?php echo amlok_image( $contact_img, 'large', 'aspect-[4/3] w-full object-cover', '(max-width: 1024px) 92vw, 38vw' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
			</div>

			<ul class="mt-8 flex gap-3">
				<?php foreach ( array( 'social_linkedin' => 'linkedin', 'social_instagram' => 'instagram', 'social_facebook' => 'facebook' ) as $key => $icon ) : ?>
					<?php $url = amlok_setting( $key ); ?>
					<?php if ( $url ) : ?>
						<li>
							<a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener noreferrer"
								aria-label="<?php esc_attr_e( 'شبکه اجتماعی', 'amlok-iran' ); ?>"
								class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white">
								<?php amlok_icon( $icon, 17 ); ?>
							</a>
						</li>
					<?php endif; ?>
				<?php endforeach; ?>
			</ul>
		</div>

		<div class="lg:col-span-7">
			<div class="rounded border border-navy/10 p-6 sm:p-9">
				<p class="label text-champagne-dark"><?php esc_html_e( 'استعلام', 'amlok-iran' ); ?></p>
				<h2 class="mt-4 font-display text-[1.625rem] font-medium text-navy"><?php esc_html_e( 'بگویید دنبال چه هستید', 'amlok-iran' ); ?></h2>
				<p class="mt-3 text-[0.9375rem] leading-relaxed text-slate">
					<?php esc_html_e( 'خرید، فروش، سرمایه‌گذاری یا جابه‌جایی — چند کوتاه کافی است. اگر ملک خاصی مدنظرتان است، اشاره کنید تا پیش از پاسخ، پرونده‌اش را آماده کنیم.', 'amlok-iran' ); ?>
				</p>

				<?php
				get_template_part(
					'template-parts/inquiry-form',
					null,
					array(
						'kind'                => 'contact',
						'tone'                => 'light',
						'submit_label'        => __( 'ارسال استعلام', 'amlok-iran' ),
						'message_label'       => __( 'چطور می‌توانیم کمک کنیم؟', 'amlok-iran' ),
						'message_placeholder' => __( 'چند خط درباره آنچه می‌خواهید، زمان‌بندی و بودجه.', 'amlok-iran' ),
					)
				);
				?>
			</div>
		</div>
	</div>
</section>

<?php get_footer(); ?>

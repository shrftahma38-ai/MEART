<?php
/**
 * صفحه تک‌ملک — سربرگ سرمه‌ای، گالری، مشخصات، مشاور و فرم بازدید.
 *
 * @package amlok-iran
 */

get_header();

while ( have_posts() ) :
	the_post();
	$d = amlok_property_data( get_the_ID() );

	// املاک مشابه: اولویت با نوع یکسان.
	$similar_args = array(
		'post_type'      => 'property',
		'posts_per_page' => 3,
		'post_status'    => 'publish',
		'post__not_in'   => array( get_the_ID() ),
		'orderby'        => array( 'meta_value_num' => 'DESC', 'rand' ),
		'meta_key'       => '_ai_featured', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
	);
	$type_terms = wp_get_post_terms( get_the_ID(), 'ai_type', array( 'fields' => 'ids' ) );
	if ( $type_terms && ! is_wp_error( $type_terms ) ) {
		$similar_args['tax_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
			array( 'taxonomy' => 'ai_type', 'field' => 'term_id', 'terms' => $type_terms ),
		);
	}
	$similar = new WP_Query( $similar_args );

	$specs = array(
		array( __( 'نوع ملک', 'amlok-iran' ), $d['type'] ?: '—' ),
		array( __( 'نوع معامله', 'amlok-iran' ), amlok_period_label( $d['period'] ) ),
		array( __( 'اتاق خواب', 'amlok-iran' ), $d['bedrooms'] ? amlok_fa_num( $d['bedrooms'] ) : '—' ),
		array( __( 'سرویس بهداشتی', 'amlok-iran' ), $d['bathrooms'] ? amlok_fa_num( $d['bathrooms'] ) : '—' ),
		array( __( 'متراژ زیربنا', 'amlok-iran' ), $d['area'] ? amlok_fa_num( number_format( $d['area'] ) ) . ' م²' : '—' ),
		array( __( 'مساحت زمین', 'amlok-iran' ), $d['lot'] ?: '—' ),
		array( __( 'سال ساخت', 'amlok-iran' ), $d['year'] ? amlok_fa_num( $d['year'] ) : '—' ),
		array( __( 'پارکینگ', 'amlok-iran' ), $d['garage'] ? amlok_fa_num( $d['garage'] ) . ' ' . __( 'خودرو', 'amlok-iran' ) : '—' ),
	);

	$chips = array(
		array( 'home', $d['type'] ?: 'ملک' ),
		array( 'bed', amlok_fa_num( $d['bedrooms'] ) . ' ' . __( 'اتاق خواب', 'amlok-iran' ) ),
		array( 'bath', amlok_fa_num( $d['bathrooms'] ) . ' ' . __( 'سرویس', 'amlok-iran' ) ),
		array( 'area', amlok_fa_num( number_format( $d['area'] ) ) . ' م²' ),
	);
	?>

	<article class="bg-white">
		<section class="border-b border-champagne/20 bg-navy-900 pb-12 pt-32 text-white lg:pb-16 lg:pt-40">
			<div class="shell">
				<nav aria-label="<?php esc_attr_e( 'مسیر صفحه', 'amlok-iran' ); ?>" class="mb-7">
					<ol class="flex flex-wrap items-center gap-3 font-sans text-[0.6875rem] text-white/50">
						<li class="flex items-center gap-3">
							<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="transition-colors duration-300 hover:text-champagne"><?php esc_html_e( 'خانه', 'amlok-iran' ); ?></a>
							<span aria-hidden="true">/</span>
						</li>
						<li class="flex items-center gap-3">
							<a href="<?php echo esc_url( get_post_type_archive_link( 'property' ) ); ?>" class="transition-colors duration-300 hover:text-champagne"><?php esc_html_e( 'املاک', 'amlok-iran' ); ?></a>
							<span aria-hidden="true">/</span>
						</li>
						<li aria-current="page" class="text-white/80"><?php echo esc_html( get_the_title() ); ?></li>
					</ol>
				</nav>

				<div class="flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p class="label flex items-center gap-2 text-champagne">
							<?php amlok_icon( 'pin', 13 ); ?>
							<?php echo esc_html( $d['location'] ); ?>
						</p>
						<h1 class="mt-5 max-w-3xl font-display text-[1.875rem] font-medium leading-[1.25] text-white sm:text-[2.375rem] lg:text-[2.875rem]"><?php echo esc_html( get_the_title() ); ?></h1>

						<ul class="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-[0.875rem] text-white/75">
							<?php foreach ( $chips as $chip ) : ?>
								<li class="inline-flex items-center gap-2.5">
									<?php amlok_icon( $chip[0], 16, 'text-champagne' ); ?>
									<?php echo esc_html( $chip[1] ); ?>
								</li>
							<?php endforeach; ?>
						</ul>
					</div>

					<div class="flex flex-col items-start gap-5 lg:items-end">
						<p class="font-display text-[1.75rem] font-medium text-champagne sm:text-[2rem]"><?php echo esc_html( $d['price_label'] ); ?></p>
						<button type="button" data-fav-toggle="<?php echo esc_attr( $d['id'] ); ?>" aria-pressed="false"
							class="inline-flex h-11 items-center gap-2.5 rounded-sm border border-white/25 px-5 font-sans text-[0.8125rem] font-medium text-white transition-colors duration-300 hover:bg-white hover:text-navy data-[saved=true]:bg-champagne data-[saved=true]:text-navy-900 data-[saved=true]:border-champagne">
							<?php amlok_icon( 'heart', 16 ); ?>
							<span data-fav-label><?php esc_html_e( 'افزودن به علاقه‌مندی‌ها', 'amlok-iran' ); ?></span>
						</button>
					</div>
				</div>
			</div>
		</section>

		<?php
		// ——— گالری ———
		$gallery_images = array();
		if ( $d['cover'] ) {
			$gallery_images[] = $d['cover'];
		}
		foreach ( $d['gallery'] as $item ) {
			$gallery_images[] = $item;
		}
		?>
		<?php if ( $gallery_images ) : ?>
			<section class="shell py-10 lg:py-14">
				<?php get_template_part( 'template-parts/property-gallery', null, array( 'images' => $gallery_images, 'name' => get_the_title() ) ); ?>
			</section>
		<?php endif; ?>

		<section class="shell grid grid-cols-1 gap-14 pb-20 lg:grid-cols-12 lg:gap-16 lg:pb-28">
			<div class="lg:col-span-7">
				<h2 class="label text-navy/55"><?php esc_html_e( 'درباره این ملک', 'amlok-iran' ); ?></h2>
				<div class="mt-5 text-[1.0625rem] leading-[1.95] text-slate"><?php the_content(); ?></div>

				<dl class="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 border-y border-navy/10 py-9 sm:grid-cols-4">
					<?php foreach ( $specs as $spec ) : ?>
						<div>
							<dt class="font-sans text-[0.6875rem] text-slate-soft"><?php echo esc_html( $spec[0] ); ?></dt>
							<dd class="mt-2.5 font-display text-[1.0625rem] font-medium text-navy"><?php echo esc_html( $spec[1] ); ?></dd>
						</div>
					<?php endforeach; ?>
				</dl>

				<?php if ( $d['features'] || $d['amenities'] ) : ?>
					<div class="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2">
						<?php if ( $d['features'] ) : ?>
							<div>
								<h2 class="label text-navy/55"><?php esc_html_e( 'ویژگی‌های کلیدی', 'amlok-iran' ); ?></h2>
								<ul class="mt-5 space-y-3.5">
									<?php foreach ( $d['features'] as $feature ) : ?>
										<li class="flex items-start gap-3 text-[0.9375rem] text-slate">
											<?php amlok_icon( 'check', 17, 'mt-0.5 shrink-0 text-champagne-dark' ); ?>
											<?php echo esc_html( $feature ); ?>
										</li>
									<?php endforeach; ?>
								</ul>
							</div>
						<?php endif; ?>

						<?php if ( $d['amenities'] ) : ?>
							<div>
								<h2 class="label text-navy/55"><?php esc_html_e( 'امکانات', 'amlok-iran' ); ?></h2>
								<ul class="mt-5 grid grid-cols-1 gap-x-6 gap-y-3.5">
									<?php foreach ( $d['amenities'] as $amenity ) : ?>
										<li class="flex items-start gap-3 text-[0.9375rem] text-slate">
											<span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne"></span>
											<?php echo esc_html( $amenity ); ?>
										</li>
									<?php endforeach; ?>
								</ul>
							</div>
						<?php endif; ?>
					</div>
				<?php endif; ?>
			</div>

			<aside class="lg:col-span-5">
				<div class="space-y-8 lg:sticky lg:top-32">
					<?php
					$agent_id = $d['agent_id'];
					if ( $agent_id && 'publish' === get_post_status( $agent_id ) ) :
						$agent_role  = get_post_meta( $agent_id, '_amlok_role', true );
						$agent_phone = get_post_meta( $agent_id, '_amlok_phone', true );
						$agent_email = get_post_meta( $agent_id, '_amlok_email', true );
						$agent_li    = get_post_meta( $agent_id, '_amlok_linkedin', true );
						$agent_name  = get_the_title( $agent_id );
						?>
						<div class="rounded border border-navy/10 p-6 sm:p-7">
							<p class="label text-champagne-dark"><?php esc_html_e( 'مشاور این ملک', 'amlok-iran' ); ?></p>
							<div class="mt-5 flex items-start gap-5">
								<div class="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-navy-50">
									<?php echo get_the_post_thumbnail( $agent_id, 'medium', array( 'class' => 'h-24 w-24 object-cover', 'loading' => 'lazy' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
								</div>
								<div class="flex-1">
									<h3 class="font-display text-[1.1875rem] font-medium text-navy"><?php echo esc_html( $agent_name ); ?></h3>
									<?php if ( $agent_role ) : ?>
										<p class="mt-1 font-sans text-[0.75rem] text-champagne-dark"><?php echo esc_html( $agent_role ); ?></p>
									<?php endif; ?>
									<div class="mt-4 flex items-center gap-2.5">
										<?php if ( $agent_phone ) : ?>
											<a href="tel:+<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $agent_phone ) ); ?>" aria-label="<?php echo esc_attr( 'تماس با ' . $agent_name ); ?>"
												class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white">
												<?php amlok_icon( 'phone', 15 ); ?>
											</a>
										<?php endif; ?>
										<?php if ( $agent_email ) : ?>
											<a href="mailto:<?php echo esc_attr( $agent_email ); ?>" aria-label="<?php echo esc_attr( 'ایمیل به ' . $agent_name ); ?>"
												class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white">
												<?php amlok_icon( 'mail', 15 ); ?>
											</a>
										<?php endif; ?>
										<?php if ( $agent_li ) : ?>
											<a href="<?php echo esc_url( $agent_li ); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( $agent_name . ' — لینکدین' ); ?>"
												class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white">
												<?php amlok_icon( 'linkedin', 15 ); ?>
											</a>
										<?php endif; ?>
									</div>
									<?php if ( $agent_phone ) : ?>
										<a href="tel:+<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $agent_phone ) ); ?>" class="mt-4 block font-display text-[1.0625rem] font-medium text-navy transition-colors duration-300 hover:text-champagne-dark" dir="ltr">
											<?php echo esc_html( amlok_fa_num( $agent_phone ) ); ?>
										</a>
									<?php endif; ?>
								</div>
							</div>
						</div>
					<?php endif; ?>

					<div id="amlok-viewing" class="scroll-mt-28 rounded bg-navy-900 p-6 text-white sm:p-7">
						<p class="label text-champagne"><?php esc_html_e( 'بازدید خصوصی', 'amlok-iran' ); ?></p>
						<h2 class="mt-4 font-display text-[1.5rem] font-medium leading-tight"><?php esc_html_e( 'درخواست بازدید', 'amlok-iran' ); ?></h2>
						<p class="mt-3 text-[0.9375rem] leading-relaxed text-white/70">
							<?php esc_html_e( 'بازدیدها خصوصی و هفت روز هفته هماهنگ می‌شوند؛ زمان مناسب را بگویید تا با ایمیل تأیید کنیم.', 'amlok-iran' ); ?>
						</p>
						<?php
						get_template_part(
							'template-parts/inquiry-form',
							null,
							array(
								'kind'                => 'viewing',
								'property_id'         => $d['id'],
								'property_title'      => get_the_title(),
								'with_date'           => true,
								'submit_label'        => __( 'درخواست بازدید', 'amlok-iran' ),
								'message_label'       => __( 'یادداشت برای مشاور', 'amlok-iran' ),
								'message_placeholder' => __( 'چیزی برای هماهنگی بازدید مدنظر دارید؟', 'amlok-iran' ),
							)
						);
						?>
					</div>
				</div>
			</aside>
		</section>

		<?php if ( $similar->have_posts() ) : ?>
			<section class="bg-ivory py-20 lg:py-24">
				<div class="shell">
					<div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<div class="label text-champagne-dark"><?php esc_html_e( 'مشابه', 'amlok-iran' ); ?></div>
							<h2 class="mt-5 font-display text-[2rem] font-medium leading-tight text-navy sm:text-[2.5rem]"><?php esc_html_e( 'شاید این‌ها هم به کارتان بیاید', 'amlok-iran' ); ?></h2>
						</div>
						<a href="<?php echo esc_url( get_post_type_archive_link( 'property' ) ); ?>" class="inline-flex items-center gap-3 font-sans text-[0.875rem] font-medium text-navy transition-colors duration-300 hover:text-champagne-dark">
							<?php esc_html_e( 'مرور همه املاک', 'amlok-iran' ); ?>
							<?php amlok_icon( 'arrow-left', 16 ); ?>
						</a>
					</div>
					<div class="mt-12 grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
						<?php foreach ( $similar->posts as $similar_post ) : ?>
							<?php get_template_part( 'template-parts/property-card', null, array( 'post_id' => $similar_post->ID ) ); ?>
						<?php endforeach; ?>
					</div>
				</div>
			</section>
		<?php endif; ?>

		<!-- نوار چسبان پایین صفحه موبایل: قیمت + تماس + بازدید -->
		<div class="sticky bottom-0 z-40 border-t border-navy/10 bg-white/95 backdrop-blur lg:hidden">
			<div class="shell flex items-center justify-between gap-4 py-3">
				<div>
					<p class="font-display text-[1.0625rem] font-medium text-navy"><?php echo esc_html( $d['price_label'] ); ?></p>
					<p class="font-sans text-[0.625rem] text-slate-soft">
						<?php echo esc_html( amlok_fa_num( $d['bedrooms'] ) . ' ' . __( 'خواب', 'amlok-iran' ) ); ?> ·
						<?php echo esc_html( amlok_fa_num( $d['bathrooms'] ) . ' ' . __( 'سرویس', 'amlok-iran' ) ); ?>
					</p>
				</div>
				<div class="flex items-center gap-3">
					<?php if ( $agent_phone ?? amlok_setting( 'contact_phone' ) ) : ?>
						<a href="tel:+<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $agent_phone ?? amlok_setting( 'contact_phone' ) ) ); ?>"
							aria-label="<?php esc_attr_e( 'تماس تلفنی', 'amlok-iran' ); ?>"
							class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-navy/20 text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white">
							<?php amlok_icon( 'phone', 17 ); ?>
						</a>
					<?php endif; ?>
					<a href="#amlok-viewing" class="inline-flex h-11 items-center gap-2.5 bg-navy px-5 font-sans text-[0.8125rem] font-medium text-white transition-colors duration-300 hover:bg-navy-700">
						<?php esc_html_e( 'بازدید', 'amlok-iran' ); ?>
						<?php amlok_icon( 'calendar', 15 ); ?>
					</a>
				</div>
			</div>
		</div>
	</article>

	<?php wp_reset_postdata(); ?>
<?php endwhile; ?>

<?php get_footer(); ?>

<?php
/**
 * صفحه اصلی — هیروی ویدیویی اسکرول‌محور + بخش‌های معرفی.
 *
 * @package amlok-iran
 */

get_header();

$hero_poster = AMLOK_IRAN_URI . '/assets/img/hero-poster.jpg';
?>

<?php
// ————— هیرو: راهروی ۳۰۰vh با قاب چسبان ۱۰۰svh — اسکرول، تایم‌لاین ویدیو را کنترل می‌کند —————
// ویدیو هرگز play() نمی‌شود و لوپ نمی‌شود؛ فقط با اسکرول به عقب و جلو می‌رود.
?>
<section id="hero" data-scrub-section class="relative isolate h-[300vh] bg-navy-950">
	<div data-scrub-frame class="sticky top-0 h-[100svh] w-full overflow-hidden">
		<img src="<?php echo esc_url( $hero_poster ); ?>" alt="" aria-hidden="true" decoding="async"
			class="absolute inset-0 h-full w-full object-cover" />
		<video data-scrub-video
			data-desktop="<?php echo esc_url( AMLOK_IRAN_URI . '/assets/img/hero-scrub.mp4' ); ?>"
			data-mobile="<?php echo esc_url( AMLOK_IRAN_URI . '/assets/img/hero-scrub-mobile.mp4' ); ?>"
			poster="<?php echo esc_url( $hero_poster ); ?>"
			preload="auto" muted playsinline tabindex="-1" aria-hidden="true"
			class="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-editorial"></video>

		<!-- سایه کافی برای خوانا ماندن هدر و نشانگر اسکرول؛ ویدیو همچنان غالب است. -->
		<div aria-hidden="true" class="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/5 to-navy-950/55"></div>

		<div data-scrub-copy class="absolute inset-0 flex flex-col justify-center">
			<div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(58%_48%_at_50%_50%,rgba(6,18,35,0.62),rgba(6,18,35,0)_72%)]"></div>

			<div class="shell relative w-full pb-24 pt-32 sm:pb-28 lg:pb-32 lg:pt-40">
				<div class="mx-auto max-w-4xl text-center">
					<p class="label animate-fade-up text-champagne" style="animation-delay:80ms"><?php echo esc_html( amlok_setting( 'hero_eyebrow' ) ); ?></p>

					<h1 class="mt-7 animate-fade-up font-display text-[2.35rem] font-medium leading-[1.25] text-white sm:text-[3.25rem] lg:text-[4.25rem] xl:text-[4.75rem]" style="animation-delay:160ms">
						<?php echo esc_html( amlok_setting( 'hero_title_line1' ) ); ?><br />
						<?php echo esc_html( amlok_setting( 'hero_title_line2' ) ); ?>
					</h1>

					<p class="measure mx-auto mt-7 animate-fade-up text-[1.0625rem] leading-[1.9] text-white/80 sm:text-lg" style="animation-delay:260ms">
						<?php echo esc_html( amlok_setting( 'hero_subtitle' ) ); ?>
					</p>

					<div class="mt-10 flex animate-fade-up flex-col items-center justify-center gap-4 sm:flex-row" style="animation-delay:340ms">
						<a href="<?php echo esc_url( get_post_type_archive_link( 'property' ) ?: home_url( '/' ) ); ?>"
							class="group/btn inline-flex h-[3.25rem] items-center justify-center gap-2.5 bg-champagne px-8 font-sans text-[0.875rem] font-medium text-navy-900 transition-all duration-300 ease-editorial hover:bg-champagne-light">
							<?php esc_html_e( 'مشاهده املاک', 'amlok-iran' ); ?>
							<?php amlok_icon( 'arrow-left', 16, 'transition-transform duration-300 group-hover/btn:-translate-x-1' ); ?>
						</a>
						<a href="<?php echo esc_url( get_page_by_path( 'contact' ) ? get_permalink( get_page_by_path( 'contact' ) ) : home_url( '/contact/' ) ); ?>"
							class="inline-flex h-[3.25rem] items-center justify-center gap-2.5 border border-white/45 px-8 font-sans text-[0.875rem] font-medium text-white transition-all duration-300 ease-editorial hover:border-white hover:bg-white hover:text-navy">
							<?php esc_html_e( 'رزرو مشاوره', 'amlok-iran' ); ?>
						</a>
					</div>
				</div>
			</div>

			<div aria-hidden="true" class="absolute inset-x-0 bottom-8 hidden justify-center lg:flex">
				<div class="flex flex-col items-center gap-3">
					<span class="font-sans text-[0.625rem] text-white/55"><?php esc_html_e( 'اسکرول کنید', 'amlok-iran' ); ?></span>
					<span class="h-12 w-px bg-gradient-to-b from-white/60 to-transparent"></span>
				</div>
			</div>
		</div>

		<!-- نشانگر آماده شدن فیلم: یک خط مویی که با آماده شدن ویدیو محو می‌شود. -->
		<div data-scrub-loading aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] opacity-100 transition-opacity duration-700 ease-editorial">
			<span class="block h-full w-full animate-pulse bg-champagne/80"></span>
		</div>
	</div>
</section>

<?php
// ————— ما کیستیم —————
$about_primary = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914';
$about_secondary = 'https://images.unsplash.com/photo-1562438668-bcf0ca6578f0';
?>
<section id="about" class="scroll-mt-28 bg-white py-20 lg:py-28">
	<div class="shell grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
		<div class="reveal">
			<div class="label text-champagne-dark"><?php esc_html_e( 'درباره ما', 'amlok-iran' ); ?></div>
			<h2 class="mt-5 font-display text-[2rem] font-medium leading-tight text-navy sm:text-[2.5rem]"><?php esc_html_e( 'ما کیستیم', 'amlok-iran' ); ?></h2>
			<p class="measure mt-5 text-[1.0625rem] leading-[1.85] text-slate">
				<?php esc_html_e( 'املاک ایران، مردم را با خانه‌های استثنایی و سرمایه‌گذاری‌های هوشمند به هم می‌رساند. صداقت، شفافیت و رضایت مشتری در قلب همه کارهای ماست.', 'amlok-iran' ); ?>
			</p>

			<dl class="mt-10 grid grid-cols-3 gap-6 border-y border-navy/10 py-7">
				<?php for ( $i = 1; $i <= 3; $i++ ) : ?>
					<div>
						<dt class="sr-only"><?php echo esc_html( amlok_setting( "stat{$i}_label" ) ); ?></dt>
						<dd>
							<span class="block font-display text-[1.75rem] font-medium text-navy lg:text-[2rem]"><?php echo esc_html( amlok_setting( "stat{$i}_value" ) ); ?></span>
							<span class="mt-2 block font-sans text-[0.6875rem] text-slate-soft"><?php echo esc_html( amlok_setting( "stat{$i}_label" ) ); ?></span>
						</dd>
					</div>
				<?php endfor; ?>
			</dl>

			<a href="#services"
				class="group/link mt-10 inline-flex h-[3.25rem] items-center gap-3 border border-navy/25 px-7 font-sans text-[0.875rem] font-medium text-navy transition-all duration-300 ease-editorial hover:border-navy hover:bg-navy hover:text-white">
				<?php esc_html_e( 'بیشتر بدانید', 'amlok-iran' ); ?>
				<?php amlok_icon( 'arrow-left', 16, 'transition-transform duration-300 group-hover/link:-translate-x-1' ); ?>
			</a>
		</div>

		<div class="reveal relative" data-reveal-delay="140">
			<div class="group/cluster relative">
				<div class="overflow-hidden rounded">
					<?php echo amlok_image( $about_primary, 'large', 'aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover/cluster:scale-[1.04] sm:aspect-[5/6]', '(max-width: 1024px) 92vw, 46vw' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
				</div>

				<div class="absolute -bottom-6 -right-4 hidden w-[42%] overflow-hidden rounded border-[6px] border-white shadow-[0_18px_50px_-24px_rgba(10,25,47,0.5)] sm:block lg:-right-8">
					<?php echo amlok_image( $about_secondary, 'large', 'aspect-[3/4] w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover/cluster:scale-[1.05]', '20vw' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
				</div>

				<a href="#featured"
					aria-label="<?php esc_attr_e( 'مشاهده املاک ویژه', 'amlok-iran' ); ?>"
					class="absolute bottom-4 left-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-champagne text-navy-900 transition-all duration-500 ease-editorial hover:bg-navy hover:text-white sm:-bottom-6 sm:-left-4 sm:h-20 sm:w-20">
					<?php amlok_icon( 'arrow-up-right', 24 ); ?>
				</a>
			</div>
		</div>
	</div>
</section>

<?php
// ————— املاک ویژه — ریل اسنپ‌شونده —————
$featured_query = new WP_Query(
	array(
		'post_type'      => 'property',
		'posts_per_page' => 8,
		'post_status'    => 'publish',
		'meta_key'       => '_ai_featured',
		'meta_value'     => '1',
	)
);
?>
<section id="featured" class="scroll-mt-24 bg-ivory py-20 lg:py-28">
	<div class="shell">
		<div class="text-center">
			<div class="label text-champagne-dark"><?php esc_html_e( 'منتخب', 'amlok-iran' ); ?></div>
			<h2 class="mt-5 font-display text-[2rem] font-medium leading-tight text-navy sm:text-[2.5rem]"><?php esc_html_e( 'املاک ویژه', 'amlok-iran' ); ?></h2>
			<p class="measure mx-auto mt-5 text-[1.0625rem] leading-[1.85] text-slate">
				<?php esc_html_e( 'گزیده‌ای فشرده از خانه‌ها و املاک منتخب؛ انتخاب‌شده برای معماری، موقعیت و ارزش بلندمدت.', 'amlok-iran' ); ?>
			</p>
		</div>
	</div>

	<div class="shell mt-14 lg:mt-16">
		<?php if ( $featured_query->have_posts() ) : ?>
			<?php get_template_part( 'template-parts/carousel', null, array( 'query' => $featured_query ) ); ?>
		<?php else : ?>
			<p class="rounded border border-navy/10 bg-white px-6 py-10 text-center text-[0.9375rem] text-slate">
				<?php esc_html_e( 'هنوز ملک ویژه‌ای ثبت نشده است. به‌زودی گزیده املاک از اینجا می‌گذرد.', 'amlok-iran' ); ?>
			</p>
		<?php endif; ?>
	</div>
</section>

<?php
// ————— خدمات — فهرست شماره‌دار سرمقاله‌ای —————
$amlok_services = array(
	array( 'فروش خانه‌های لوکس', 'نمایندگی خانه‌های با معماری خاص؛ از نخستین ارزیابی تا فروش دربست و محرمانه.' ),
	array( 'سرمایه‌گذاری املاک', 'مدل‌سازی بازدهی، ساختار سبد ملکی و راهبرد خرید برای سرمایه‌گذاران خصوصی و خانوادگی.' ),
	array( 'بازاریابی املاک', 'عکاسی تخصصی، فیلم و انتشار در مسیرهایی که خریدار واقعی می‌رساند، نه بازدید ساده.' ),
	array( 'مشاوره املاک', 'مشاوره مستقل درباره زمان‌بندی، مذاکره و ارزش بلندمدت یک ملک.' ),
	array( 'ارزش‌گذاری ملک', 'ارزیابی مبتنی بر داده بازار برای وام، املاک موروثی و پیش از عرضه.' ),
	array( 'خدمات جابه‌جایی', 'راهنمای محله، بررسی مدارس و هماهنگی کامل جابه‌جایی برای مشتریان.' ),
);
$services_img = 'https://images.unsplash.com/photo-1670589953882-b94c9cb380f5';
?>
<section id="services" class="scroll-mt-28 bg-white py-20 lg:py-28">
	<div class="shell grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
		<div class="reveal lg:col-span-5">
			<div class="lg:sticky lg:top-32">
				<div class="label text-champagne-dark"><?php esc_html_e( 'خدمات', 'amlok-iran' ); ?></div>
				<h2 class="mt-5 font-display text-[2rem] font-medium leading-tight text-navy sm:text-[2.5rem]"><?php esc_html_e( 'چه کارهایی می‌کنیم', 'amlok-iran' ); ?></h2>
				<p class="measure mt-5 text-[1.0625rem] leading-[1.85] text-slate">
					<?php esc_html_e( 'شش تخصص، یک تیم. هر پروژه را مشاوری از ابتدا تا امضای نهایی همراهی می‌کند.', 'amlok-iran' ); ?>
				</p>

				<div class="mt-9 overflow-hidden rounded">
					<?php echo amlok_image( $services_img, 'large', 'aspect-[4/3] w-full object-cover', '(max-width: 1024px) 92vw, 38vw' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
				</div>

				<a href="<?php echo esc_url( get_page_by_path( 'contact' ) ? get_permalink( get_page_by_path( 'contact' ) ) : home_url( '/contact/' ) ); ?>"
					class="group/link mt-9 inline-flex items-center gap-3 font-sans text-[0.875rem] font-medium text-navy transition-colors duration-300 hover:text-champagne-dark">
					<?php esc_html_e( 'گفت‌وگو با مشاور', 'amlok-iran' ); ?>
					<?php amlok_icon( 'arrow-left', 16, 'transition-transform duration-300 group-hover/link:-translate-x-1' ); ?>
				</a>
			</div>
		</div>

		<div class="lg:col-span-7">
			<ul class="border-t border-navy/10">
				<?php foreach ( $amlok_services as $index => $service ) : ?>
					<li class="border-b border-navy/10">
						<div class="group/row flex items-start gap-5 py-7 transition-all duration-500 ease-editorial hover:bg-ivory/70 hover:px-4 sm:gap-8">
							<span class="mt-1 font-display text-[0.8125rem] font-medium text-champagne-dark"><?php echo esc_html( amlok_fa_num( str_pad( $index + 1, 2, '0', STR_PAD_LEFT ) ) ); ?></span>
							<div class="flex-1">
								<h3 class="font-display text-xl font-medium text-navy transition-colors duration-300 group-hover/row:text-champagne-dark sm:text-[1.375rem]"><?php echo esc_html( $service[0] ); ?></h3>
								<p class="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-slate"><?php echo esc_html( $service[1] ); ?></p>
							</div>
							<?php amlok_icon( 'arrow-up-right', 19, 'mt-1 shrink-0 text-navy/25 transition-all duration-300 ease-editorial group-hover/row:-translate-x-1 group-hover/row:text-champagne-dark' ); ?>
						</div>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
</section>

<?php
// ————— چرا املاک ایران — بخش تیره —————
$amlok_reasons = array(
	array( 'trend', 'هوشمندی بازار', 'داده معاملات خودمان را منتشر می‌کنیم؛ تصمیم قیمت‌گذاری روی شواهد می‌نشیند نه احساس.' ),
	array( 'key', 'دسترسی به املاک خارج از فهرست', 'ثبت خصوصی خانه‌هایی که هرگز به فهرست عمومی نمی‌رسند و پیش از همه به مشتریان می‌رسد.' ),
	array( 'shield', 'نمایندگی محرمانه', 'مأموریت‌های محرمانه، بی‌سروصدا؛ از نخستین بازدید تا تسویه.' ),
	array( 'users', 'خدمت سرتاسری', 'یک تیم برای جستجو، بررسی فنی، معرفی مالی و مراقبت پس از فروش.' ),
);
$why_img = 'https://images.unsplash.com/photo-1757356657991-c3fd6e2e812e';
?>
<section class="bg-navy-900 py-20 text-white lg:py-28">
	<div class="shell grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
		<div class="reveal lg:col-span-5">
			<div class="label text-champagne"><?php esc_html_e( 'چرا املاک ایران', 'amlok-iran' ); ?></div>
			<h2 class="mt-5 font-display text-[2rem] font-medium leading-tight text-white sm:text-[2.5rem]"><?php esc_html_e( 'مشاوره‌ای که هجده سال ساخته شده', 'amlok-iran' ); ?></h2>
			<p class="measure mt-5 text-[1.0625rem] leading-[1.85] text-white/65">
				<?php esc_html_e( 'هم‌زمان با شمار محدودی از مشتریان کار می‌کنیم؛ آن‌قدر محدود که هر ملک و هر خیابانی را که نمایندگی می‌کنیم بشناسیم.', 'amlok-iran' ); ?>
			</p>

			<ul class="mt-10 space-y-8">
				<?php foreach ( $amlok_reasons as $reason ) : ?>
					<li class="flex gap-5">
						<span class="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-champagne/40 text-champagne">
							<?php amlok_icon( $reason[0], 18 ); ?>
						</span>
						<div>
							<h3 class="font-display text-lg font-medium text-white"><?php echo esc_html( $reason[1] ); ?></h3>
							<p class="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-white/65"><?php echo esc_html( $reason[2] ); ?></p>
						</div>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>

		<div class="reveal lg:col-span-7" data-reveal-delay="140">
			<div class="overflow-hidden rounded">
				<?php echo amlok_image( $why_img, 'large', 'aspect-[4/3] w-full object-cover', '(max-width: 1024px) 92vw, 54vw' ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
			</div>

			<dl class="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-white/15 pt-9 sm:grid-cols-4">
				<?php for ( $i = 1; $i <= 4; $i++ ) : ?>
					<div>
						<dt class="sr-only"><?php echo esc_html( amlok_setting( "dstat{$i}_label" ) ); ?></dt>
						<dd>
							<span class="block font-display text-[1.75rem] font-medium text-champagne lg:text-[2rem]"><?php echo esc_html( amlok_setting( "dstat{$i}_value" ) ); ?></span>
							<span class="mt-2 block font-sans text-[0.6875rem] leading-relaxed text-white/55"><?php echo esc_html( amlok_setting( "dstat{$i}_label" ) ); ?></span>
						</dd>
					</div>
				<?php endfor; ?>
			</dl>
		</div>
	</div>
</section>

<?php
// ————— تیم مشاوران —————
$team_query = new WP_Query(
	array(
		'post_type'      => 'agent',
		'posts_per_page' => 8,
		'post_status'    => 'publish',
	)
);
?>
<?php if ( $team_query->have_posts() ) : ?>
<section id="team" class="scroll-mt-28 bg-ivory py-20 lg:py-28">
	<div class="shell">
		<div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<div class="label text-champagne-dark"><?php esc_html_e( 'تیم', 'amlok-iran' ); ?></div>
				<h2 class="mt-5 font-display text-[2rem] font-medium leading-tight text-navy sm:text-[2.5rem]"><?php esc_html_e( 'مشاوران ما', 'amlok-iran' ); ?></h2>
				<p class="measure mt-5 text-[1.0625rem] leading-[1.85] text-slate">
					<?php esc_html_e( 'تیمی فشرده از متخصصان؛ هر کدام مسئول بخشی از بازار.', 'amlok-iran' ); ?>
				</p>
			</div>
			<a href="<?php echo esc_url( get_page_by_path( 'contact' ) ? get_permalink( get_page_by_path( 'contact' ) ) : home_url( '/contact/' ) ); ?>"
				class="inline-flex items-center gap-3 font-sans text-[0.875rem] font-medium text-navy transition-colors duration-300 hover:text-champagne-dark">
				<?php esc_html_e( 'همکاری با ما', 'amlok-iran' ); ?>
				<?php amlok_icon( 'arrow-left', 16 ); ?>
			</a>
		</div>

		<div class="mt-14 grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
			<?php foreach ( $team_query->posts as $index => $agent_post ) : ?>
				<?php
				$role     = get_post_meta( $agent_post->ID, '_amlok_role', true );
				$phone    = get_post_meta( $agent_post->ID, '_amlok_phone', true );
				$email    = get_post_meta( $agent_post->ID, '_amlok_email', true );
				$linkedin = get_post_meta( $agent_post->ID, '_amlok_linkedin', true );
				?>
				<article class="group/member reveal" data-reveal-delay="<?php echo esc_attr( $index * 90 ); ?>">
					<div class="overflow-hidden rounded bg-navy-50">
						<?php if ( has_post_thumbnail( $agent_post ) ) : ?>
							<?php echo get_the_post_thumbnail( $agent_post, 'large', array( 'class' => 'aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-editorial group-hover/member:scale-[1.04]', 'loading' => 'lazy' ) ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
						<?php endif; ?>
					</div>

					<h3 class="mt-5 font-display text-[1.1875rem] font-medium text-navy"><?php echo esc_html( get_the_title( $agent_post ) ); ?></h3>
					<?php if ( $role ) : ?>
						<p class="mt-1.5 font-sans text-[0.75rem] text-champagne-dark"><?php echo esc_html( $role ); ?></p>
					<?php endif; ?>

					<span aria-hidden="true" class="mt-4 block h-px w-0 bg-champagne transition-all duration-500 ease-editorial group-hover/member:w-full"></span>

					<div class="mt-4 flex items-center gap-3">
						<?php if ( $linkedin ) : ?>
							<a href="<?php echo esc_url( $linkedin ); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( get_the_title( $agent_post ) . ' — لینکدین' ); ?>"
								class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white">
								<?php amlok_icon( 'linkedin', 15 ); ?>
							</a>
						<?php endif; ?>
						<?php if ( $email ) : ?>
							<a href="mailto:<?php echo esc_attr( $email ); ?>" aria-label="<?php echo esc_attr( 'ایمیل به ' . get_the_title( $agent_post ) ); ?>"
								class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white">
								<?php amlok_icon( 'mail', 15 ); ?>
							</a>
						<?php endif; ?>
						<?php if ( $phone ) : ?>
							<a href="tel:+<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $phone ) ); ?>" aria-label="<?php echo esc_attr( 'تماس با ' . get_the_title( $agent_post ) ); ?>"
								class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white">
								<?php amlok_icon( 'phone', 15 ); ?>
							</a>
						<?php endif; ?>
					</div>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
<?php endif; ?>

<?php
// ————— نوار فراخوان پایانی —————
$contact_page = get_page_by_path( 'contact' );
?>
<section id="contact-cta" class="scroll-mt-24 bg-mist py-16 lg:py-20">
	<div class="shell">
		<div class="reveal flex flex-col gap-9 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
			<div class="flex items-start gap-6 sm:gap-8">
				<span aria-hidden="true" class="hidden h-20 w-20 shrink-0 items-center justify-center rounded-full border border-navy/15 bg-white text-champagne-dark sm:inline-flex">
					<?php amlok_icon( 'key', 30, '', 1.2 ); ?>
				</span>
				<div>
					<h2 class="font-display text-[1.75rem] font-medium leading-tight text-navy sm:text-4xl"><?php esc_html_e( 'آماده‌اید ملک مناسب خود را پیدا کنید؟', 'amlok-iran' ); ?></h2>
					<p class="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-slate"><?php esc_html_e( 'کارشناسان ما شما را به خانه یا سرمایه‌گذاری درست می‌رسانند.', 'amlok-iran' ); ?></p>
				</div>
			</div>

			<a href="<?php echo esc_url( $contact_page ? get_permalink( $contact_page ) : home_url( '/contact/' ) ); ?>"
				class="group/btn inline-flex h-[3.25rem] shrink-0 items-center justify-center gap-3 self-start bg-navy px-8 font-sans text-[0.875rem] font-medium text-white transition-all duration-300 ease-editorial hover:bg-navy-700 lg:self-auto">
				<?php esc_html_e( 'تماس با ما', 'amlok-iran' ); ?>
				<?php amlok_icon( 'arrow-left', 16, 'transition-transform duration-300 group-hover/btn:-translate-x-1' ); ?>
			</a>
		</div>
	</div>
</section>

<?php get_footer(); ?>

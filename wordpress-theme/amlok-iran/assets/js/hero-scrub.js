/**
 * املاک ایران — هیروی ویدیویی اسکرول‌محور.
 *
 * اسکرول، تایم‌لاین ویدیو را کنترل می‌کند؛ ویدیو هرگز play() نمی‌شود و لوپ
 * نمی‌شود. معماری (به ترتیب جریان داده):
 *   رویداد اسکرول (passive) → پیشرفت هدف → requestAnimationFrame → پیشرفت نرم‌شده
 *   → نوشتن currentTime، فقط وقتی واقعاً تصویر را عوض می‌کند.
 *
 * سه نکته‌ای که جلوتر می‌لرزید را می‌گیرد:
 *   ۱. هندلر اسکرول هرگز ویدیو را نمی‌لوسد، فقط ثبت می‌کند کجا باید باشد؛
 *   ۲. پیشرفت نرم‌شده به سمت هدف اون می‌شود، پس فلیک تند هم سینمایی می‌ماند؛
 *   ۳. سیک‌ها گیت می‌شوند — تا سیک قبلی حل نشده هیچ seek تازه‌ای نوشته نمی‌شود و
 *      حرکت‌های باریک‌تر از نیم‌فریم نوشته نمی‌شوند.
 *
 * درک بازدیدکننده (prefers-reduced-motion) را می‌گیرد: فقط قاب نخست ثابت، بدون راهرو.
 */
(function () {
	'use strict';

	var MIN_SEEK = 1 / 48; // نیم فریمِ منبع ۲۴ فریم؛ ریزتر از این تصویر را عوض نمی‌کند.
	var RATE = 16; // چسبندگی به هدف: حدود ۱۶ فریم تا نشستن کامل.
	var COPY_FADE_START = 0.05;
	var COPY_FADE_END = 0.27;
	var COPY_DRIFT = 30;

	var section = document.querySelector('[data-scrub-section]');
	var video = section ? section.querySelector('[data-scrub-video]') : null;
	if (!section || !video) return;

	var frame = section.querySelector('[data-scrub-frame]');
	var copy = section.querySelector('[data-scrub-copy]');
	var loading = section.querySelector('[data-scrub-loading]');

	// — حرکت کاهش‌یافته: فیلم را کلاً حذف کن، قاب نخست ثابت بماند. —
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		section.style.height = '100svh';
		video.remove();
		if (loading) loading.remove();
		return;
	}

	// — انتخاب منبع یک‌بار در مونت: تعویض src بعداً دانلود را از نو می‌اندازد. —
	var mobileSrc = video.getAttribute('data-mobile');
	var desktopSrc = video.getAttribute('data-desktop');
	if (window.matchMedia('(max-width: 640px)').matches && mobileSrc) {
		video.src = mobileSrc;
	} else {
		video.src = desktopSrc;
	}

	video.pause();
	video.loop = false;

	var reveal = function () {
		video.classList.remove('opacity-0');
		video.classList.add('opacity-100');
		if (loading) {
			loading.classList.remove('opacity-100');
			loading.classList.add('opacity-0');
		}
	};
	video.addEventListener('canplay', reveal);
	video.addEventListener('canplaythrough', reveal);
	video.addEventListener('loadedmetadata', function () {
		// روی فریم نخست پارک کن تا تایم‌لاین از همان‌جا شروع شود.
		try {
			video.currentTime = 0;
		} catch (e) {
			/* متادیتا زودتر رسید؛ حلقه رف خودش می‌رساند */
		}
	});
	video.addEventListener('error', function () {
		if (loading) loading.remove();
	});

	var sectionTop = 0;
	var travel = 1;
	var target = 0;
	var current = 0;
	var written = NaN;
	var raf = 0;
	var last = 0;
	/**
	 * یک‌بار لنگر می‌شود و هرگز پاک نمی‌شود. هر سیک readyState را موقتاً به
	 * HAVE_METADATA می‌برَد؛ تست زنده آن، تایم‌لاین را مدام به فریم اول
	 * می‌بَرد و میخکوبش می‌کند.
	 */
	var armed = false;

	var measure = function () {
		sectionTop = section.getBoundingClientRect().top + window.scrollY;
		var pinned = frame ? frame.offsetHeight : window.innerHeight;
		travel = Math.max(1, section.offsetHeight - pinned);
	};

	var readScroll = function () {
		var raw = (window.scrollY - sectionTop) / travel;
		target = raw < 0 ? 0 : raw > 1 ? 1 : raw;
	};

	var hasTimeline = function () {
		return Number.isFinite(video.duration) && video.duration > 0;
	};

	var tick = function (now) {
		raf = window.requestAnimationFrame(tick);

		var elapsed = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
		last = now;

		if (!armed && video.readyState >= 2 && hasTimeline()) armed = true;

		if (armed) {
			var delta = target - current;
			// ایونگ مستقل از نرخ فریم — همان حس در ۶۰ و ۱۲۰ هرتز یا تب کم‌قوت،
			// و وقتی فاصله نامحسوس شد دقیقاً روی هدف می‌نشیند.
			current = Math.abs(delta) < 0.0005 ? target : current + delta * (1 - Math.exp(-RATE * elapsed));
		} else {
			current = 0;
		}

		// محو تدریجی متن هیرو در نخستین بخش راهرو — مستقیم روی DOM، بدون state.
		if (copy) {
			var fade = Math.min(1, Math.max(0, (current - COPY_FADE_START) / (COPY_FADE_END - COPY_FADE_START)));
			copy.style.opacity = String(1 - fade);
			copy.style.transform = 'translate3d(0, ' + (-COPY_DRIFT * fade).toFixed(2) + 'px, 0)';
			copy.style.pointerEvents = fade > 0.4 ? 'none' : '';
		}

		if (!armed || !hasTimeline() || video.seeking) return;

		var time = current * video.duration;
		if (Math.abs(time - written) < MIN_SEEK) return;
		if (Math.abs(video.currentTime - time) < MIN_SEEK) {
			written = time;
			return;
		}
		written = time;
		video.currentTime = time;
	};

	var start = function () {
		if (raf) return;
		last = 0;
		measure();
		readScroll();
		raf = window.requestAnimationFrame(tick);
	};

	var stop = function () {
		if (!raf) return;
		window.cancelAnimationFrame(raf);
		raf = 0;
	};

	// حلقه فقط وقتی هیرو در دید است می‌چرخد؛ باقی صفحه هیچ هزینه‌ای نمی‌دهد.
	var observer = 'IntersectionObserver' in window
		? new IntersectionObserver(
				function (entries) {
					if (entries[entries.length - 1].isIntersecting) start();
					else stop();
				},
				{ rootMargin: '10% 0px' }
			)
		: null;

	if (observer) observer.observe(section);
	else start();

	var onResize = function () {
		measure();
		readScroll();
	};

	window.addEventListener('scroll', readScroll, { passive: true });
	window.addEventListener('resize', onResize);
	window.addEventListener('orientationchange', onResize);
	window.addEventListener('load', onResize);
})();

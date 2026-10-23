/**
 * املاک ایران — رفتارهای صفحه.
 *
 * هدر چسبان، منوی موبایل، انیمیشن‌های ورود (reveal)، کاروسل املاک، گالری
 * تمام‌صفحه، علاقه‌مندی‌ها (localStorage)، پنل فیلتر و صفحه علاقه‌مندی‌ها.
 */
(function () {
	'use strict';

	var FAVORITES_KEY = 'amlok-iran.favorites';

	// ————— هدر چسبان: شفاف روی هیرو، سرمه‌ای بعد از اسکرول —————
	var header = document.querySelector('[data-header]');
	if (header) {
		var updateHeader = function () {
			var scrolled = window.scrollY > 24;
			header.classList.toggle('is-solid', scrolled || header.getAttribute('data-front') !== '1');
			header.classList.toggle('is-top', !scrolled && header.getAttribute('data-front') === '1');
		};
		header.setAttribute('data-front', document.body.classList.contains('home') ? '1' : '0');
		// روی صفحه اصلی (هیروی ۳۰۰vh) شفاف شروع کن؛ بقیه صفحات همیشه سرمه‌ای‌اند.
		if (!document.querySelector('[data-scrub-section]')) header.setAttribute('data-front', '0');
		updateHeader();
		window.addEventListener('scroll', updateHeader, { passive: true });
	}

	// ————— منوی موبایل —————
	var mobileMenu = document.querySelector('[data-mobile-menu]');
	var openButton = document.querySelector('[data-menu-open]');
	var closeButton = document.querySelector('[data-menu-close]');
	var setMenu = function (open) {
		if (!mobileMenu || !openButton) return;
		mobileMenu.classList.toggle('hidden', !open);
		mobileMenu.classList.toggle('flex', open);
		openButton.setAttribute('aria-expanded', open ? 'true' : 'false');
		document.body.style.overflow = open ? 'hidden' : '';
		if (!open) openButton.focus();
	};
	if (mobileMenu && openButton) {
		openButton.addEventListener('click', function () {
			setMenu(true);
			if (closeButton) closeButton.focus();
		});
		if (closeButton) closeButton.addEventListener('click', function () { setMenu(false); });
		mobileMenu.addEventListener('click', function (event) {
			if (event.target.closest('a')) setMenu(false);
		});
		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape') setMenu(false);
		});
	}

	// ————— انیمیشن‌های ورود —————
	var revealTargets = document.querySelectorAll('.reveal');
	if (revealTargets.length) {
		if ('IntersectionObserver' in window) {
			var revealObserver = new IntersectionObserver(
				function (entries) {
					entries.forEach(function (entry) {
						if (!entry.isIntersecting) return;
						var delay = entry.target.getAttribute('data-reveal-delay');
						if (delay) entry.target.style.transitionDelay = delay + 'ms';
						entry.target.classList.add('reveal-in');
						revealObserver.unobserve(entry.target);
					});
				},
				{ rootMargin: '0px 0px -8% 0px' }
			);
			revealTargets.forEach(function (node) { revealObserver.observe(node); });
		} else {
			revealTargets.forEach(function (node) { node.classList.add('reveal-in'); });
		}
	}

	// ————— کاروسل املاک (RTL): کشیدن با موس + فلش‌ها + نوار پیشرفت —————
	document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
		var track = carousel.querySelector('[data-carousel-track]');
		if (!track) return;
		var prevButton = carousel.querySelector('[data-carousel-prev]');
		var nextButton = carousel.querySelector('[data-carousel-next]');
		var progress = carousel.querySelector('[data-carousel-progress]');
		var drag = { active: false, pointerId: -1, startX: 0, startScroll: 0, moved: 0 };

		// در RTL اسکرول از صفر شروع و منفی می‌شود؛ قدر مطلق، میزان پیشرفت است.
		var maxScroll = function () { return track.scrollWidth - track.clientWidth; };

		var measure = function () {
			var max = maxScroll();
			var scrollable = max > 8;
			if (prevButton) prevButton.disabled = !scrollable;
			if (nextButton) nextButton.disabled = !scrollable;
			if (progress) {
				var ratio = max > 0 ? Math.min(1, Math.max(0, Math.abs(track.scrollLeft) / max)) : 0;
				progress.style.width = Math.max(12, ratio * 100) + '%';
			}
		};

		var step = function () {
			var card = track.querySelector('[data-card]');
			if (!card) return track.clientWidth * 0.8;
			var gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
			return card.offsetWidth + gap;
		};

		// «بعدی» در RTL یعنی حرکت به چپ یعنی کاهش scrollLeft.
		var scrollCards = function (direction) {
			var max = maxScroll();
			var atStart = Math.abs(track.scrollLeft) <= 8;
			var atEnd = Math.abs(track.scrollLeft) >= max - 8;
			if (direction === 1 && atEnd) { track.scrollTo({ left: 0, behavior: 'smooth' }); return; }
			if (direction === -1 && atStart) { track.scrollTo({ left: -max, behavior: 'smooth' }); return; }
			track.scrollBy({ left: -direction * step(), behavior: 'smooth' });
		};

		if (prevButton) prevButton.addEventListener('click', function () { scrollCards(-1); });
		if (nextButton) nextButton.addEventListener('click', function () { scrollCards(1); });

		track.addEventListener('keydown', function (event) {
			if (event.key === 'ArrowRight') { event.preventDefault(); scrollCards(-1); }
			if (event.key === 'ArrowLeft') { event.preventDefault(); scrollCards(1); }
		});

		track.addEventListener('pointerdown', function (event) {
			if (event.pointerType !== 'mouse') return;
			drag = { active: true, pointerId: event.pointerId, startX: event.clientX, startScroll: track.scrollLeft, moved: 0 };
			track.classList.add('cursor-grabbing', 'select-none');
			track.classList.remove('cursor-grab');
			track.style.scrollSnapType = 'none';
			try { track.setPointerCapture(event.pointerId); } catch (e) { /* best-effort */ }
		});

		track.addEventListener('pointermove', function (event) {
			if (!drag.active) return;
			var delta = event.clientX - drag.startX;
			drag.moved = Math.max(drag.moved, Math.abs(delta));
			// کشیدن به چپ (delta منفی) باید محتوای چپ را بیاورد: در RTL یعنی
			// scrollLeft منفی‌تر → scrollLeft = startScroll + delta.
			track.scrollLeft = drag.startScroll + delta;
		});

		var endDrag = function () {
			if (!drag.active) return;
			if (drag.pointerId >= 0) { try { track.releasePointerCapture(drag.pointerId); } catch (e) { /* released */ } }
			drag.active = false;
			track.classList.add('cursor-grab');
			track.classList.remove('cursor-grabbing', 'select-none');
			track.style.scrollSnapType = '';
			measure();
		};
		track.addEventListener('pointerup', endDrag);
		track.addEventListener('pointerleave', endDrag);
		track.addEventListener('pointercancel', endDrag);

		// کلیکی که پایان یک درگ است هرگز نباید ملک زیر موس را باز کند —
		// روی رویداد بومی، پیش از هندلرهای دیگر لغو می‌شود.
		track.addEventListener('click', function (event) {
			if (drag.moved > 6) {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();
			}
		}, true);

		track.addEventListener('scroll', function () {
			window.requestAnimationFrame(measure);
		}, { passive: true });
		window.addEventListener('resize', measure);
		measure();
	});

	// ————— علاقه‌مندی‌ها: فقط در مرورگر (localStorage) —————
	var readFavorites = function () {
		try {
			var raw = window.localStorage.getItem(FAVORITES_KEY);
			var list = raw ? JSON.parse(raw) : [];
			return Array.isArray(list) ? list.map(Number).filter(Boolean) : [];
		} catch (e) {
			return [];
		}
	};
	var writeFavorites = function (list) {
		try { window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(list)); } catch (e) { /* حالت خصوصی */ }
	};
	var favorites = readFavorites();

	var syncFavoriteControls = function () {
		document.querySelectorAll('[data-fav-toggle]').forEach(function (button) {
			var id = Number(button.getAttribute('data-fav-toggle'));
			var saved = favorites.indexOf(id) !== -1;
			button.setAttribute('data-saved', saved ? 'true' : 'false');
			button.setAttribute('aria-pressed', saved ? 'true' : 'false');
			var label = button.querySelector('[data-fav-label]');
			if (label) label.textContent = saved ? 'ذخیره شد' : 'افزودن به علاقه‌مندی‌ها';
		});
		var count = document.querySelector('[data-fav-count]');
		if (count) {
			count.textContent = String(favorites.length);
			count.classList.toggle('hidden', favorites.length === 0);
		}
	};

	document.addEventListener('click', function (event) {
		var button = event.target.closest('[data-fav-toggle]');
		if (!button) return;
		var id = Number(button.getAttribute('data-fav-toggle'));
		if (!id) return;
		favorites = favorites.indexOf(id) !== -1
			? favorites.filter(function (item) { return item !== id; })
			: [id].concat(favorites);
		writeFavorites(favorites);
		syncFavoriteControls();
	});
	syncFavoriteControls();

	// ————— صفحه علاقه‌مندی‌ها: شبکه را سرور می‌سازد، جاوااسکریپت فقط می‌آورد —————
	var savedGrid = document.querySelector('[data-saved-grid]');
	if (savedGrid) {
		var ids = readFavorites();
		var url = window.location.pathname + (ids.length ? '?saved=' + encodeURIComponent(ids.join(',')) : '');
		window.fetch(url, { credentials: 'same-origin' })
			.then(function (response) { return response.text(); })
			.then(function (html) {
				var doc = new DOMParser().parseFromString(html, 'text/html');
				var fresh = doc.querySelector('[data-saved-grid]');
				if (fresh) savedGrid.innerHTML = fresh.innerHTML;
			})
			.catch(function () {
				/* شبکه اولیه از سرور باقی می‌ماند */
			});
	}

	// ————— گالری تک‌ملک —————
	document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
		var mainImage = gallery.querySelector('img');
		var counter = gallery.querySelector('[data-gallery-counter]');
		var large = gallery.querySelector('[data-gallery-large]');
		var modal = gallery.querySelector('[data-gallery-modal]');
		var thumbs = gallery.querySelectorAll('[data-gallery-thumb]');
		var modalThumbs = gallery.querySelectorAll('[data-gallery-modal-thumb]');
		var sources = [];
		gallery.querySelectorAll('[data-gallery-thumb] img, [data-gallery-modal-thumb] img').forEach(function (img) {
			var src = img.currentSrc || img.src;
			if (src && sources.indexOf(src) === -1) sources.push(src);
		});
		if (!mainImage || !sources.length) return;

		var active = 0;
		var render = function () {
			mainImage.src = sources[active];
			thumbs.forEach(function (thumb, index) {
				thumb.style.borderColor = index === active ? '#C5A358' : 'transparent';
				thumb.style.opacity = index === active ? '1' : '0.65';
			});
			if (large) {
				large.src = sources[active];
				large.style.borderColor = 'transparent';
			}
			modalThumbs.forEach(function (thumb, index) {
				thumb.style.borderColor = index === active ? '#C5A358' : 'transparent';
				thumb.style.opacity = index === active ? '1' : '0.5';
			});
			if (counter) counter.textContent = fa(active + 1) + ' / ' + fa(sources.length);
		};
		var fa = function (value) {
			return String(value).replace(/[0-9]/g, function (digit) { return '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]; });
		};
		var go = function (direction) {
			active = (active + direction + sources.length) % sources.length;
			render();
		};
		var open = function () {
			if (!modal) return;
			modal.classList.remove('hidden');
			modal.classList.add('flex');
			document.body.style.overflow = 'hidden';
		};
		var close = function () {
			if (!modal) return;
			modal.classList.add('hidden');
			modal.classList.remove('flex');
			document.body.style.overflow = '';
		};

		gallery.querySelectorAll('[data-gallery-prev]').forEach(function (node) { node.addEventListener('click', function () { go(-1); }); });
		gallery.querySelectorAll('[data-gallery-next]').forEach(function (node) { node.addEventListener('click', function () { go(1); }); });
		gallery.querySelectorAll('[data-gallery-modal-prev]').forEach(function (node) { node.addEventListener('click', function () { go(-1); }); });
		gallery.querySelectorAll('[data-gallery-modal-next]').forEach(function (node) { node.addEventListener('click', function () { go(1); }); });
		gallery.querySelectorAll('[data-gallery-open]').forEach(function (node) { node.addEventListener('click', open); });
		gallery.querySelectorAll('[data-gallery-close]').forEach(function (node) { node.addEventListener('click', close); });
		thumbs.forEach(function (thumb, index) { thumb.addEventListener('click', function () { active = index; render(); }); });
		modalThumbs.forEach(function (thumb, index) { thumb.addEventListener('click', function () { active = index; render(); }); });

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape') close();
			if (event.key === 'ArrowRight') go(-1);
			if (event.key === 'ArrowLeft') go(1);
		});
	});

	// ————— پنل فیلتر: انتخاب‌ها خودکار ارسال می‌شوند؛ جستجو با تاخیر —————
	var filterForm = document.getElementById('amlok-filters');
	if (filterForm) {
		var searchInput = document.getElementById('amlok-filter-search');
		var debounce = 0;
		if (searchInput) {
			searchInput.addEventListener('input', function () {
				window.clearTimeout(debounce);
				debounce = window.setTimeout(function () {
					var selects = filterForm.querySelectorAll('select');
					for (var i = 0; i < selects.length; i++) {
						if (!selects[i].value) selects[i].disabled = true;
					}
					filterForm.submit();
				}, 350);
			});
		}
		filterForm.querySelectorAll('select').forEach(function (select) {
			select.addEventListener('change', function () { filterForm.submit(); });
		});

		var toggle = filterForm.querySelector('[data-filters-toggle]');
		var advanced = document.getElementById('amlok-filter-advanced');
		if (toggle && advanced) {
			toggle.addEventListener('click', function () {
				var open = advanced.classList.toggle('hidden') === false;
				toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
			});
		}
	}
})();

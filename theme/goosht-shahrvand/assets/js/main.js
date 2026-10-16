/**
 * Goosht Shahrvand – front-end interactions (no dependencies).
 *
 * Features: mobile menu, hero slider, products carousel, gallery lightbox,
 * sticky header state and in-page anchors.
 */
( function () {
	'use strict';

	var settings = window.gshSettings || {};
	var isRtl = !! settings.rtl;
	var reduceMotion = window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	/* ------------------------------------------------------------------ *
	 * Mobile navigation
	 * ------------------------------------------------------------------ */
	function initNav() {
		var toggle = document.querySelector( '.gsh-nav-toggle' );
		var nav = document.getElementById( 'gsh-primary-nav' );

		if ( ! toggle || ! nav ) {
			return;
		}

		function close() {
			nav.classList.remove( 'is-open' );
			toggle.setAttribute( 'aria-expanded', 'false' );
		}

		toggle.addEventListener( 'click', function () {
			var open = nav.classList.toggle( 'is-open' );
			toggle.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
		} );

		document.addEventListener( 'keydown', function ( event ) {
			if ( 'Escape' === event.key ) {
				close();
			}
		} );

		document.addEventListener( 'click', function ( event ) {
			if ( ! nav.classList.contains( 'is-open' ) ) {
				return;
			}
			if ( ! nav.contains( event.target ) && ! toggle.contains( event.target ) ) {
				close();
			}
		} );
	}

	/* ------------------------------------------------------------------ *
	 * Hero slider
	 * ------------------------------------------------------------------ */
	function initHero() {
		document.querySelectorAll( '[data-hero]' ).forEach( function ( hero ) {
			var slides = Array.prototype.slice.call( hero.querySelectorAll( '.gsh-slide' ) );
			var dots = Array.prototype.slice.call( hero.querySelectorAll( '[data-hero-dot]' ) );

			if ( slides.length < 2 ) {
				return;
			}

			var index = 0;
			var timer = null;
			var speed = parseInt( hero.getAttribute( 'data-autoplay' ), 10 );
			speed = isNaN( speed ) ? 6 : speed;

			function show( next ) {
				index = ( next + slides.length ) % slides.length;

				slides.forEach( function ( slide, i ) {
					var active = i === index;
					slide.classList.toggle( 'is-active', active );
					if ( active ) {
						slide.removeAttribute( 'aria-hidden' );
					} else {
						slide.setAttribute( 'aria-hidden', 'true' );
					}
				} );

				dots.forEach( function ( dot, i ) {
					dot.classList.toggle( 'is-active', i === index );
				} );
			}

			function stop() {
				if ( timer ) {
					window.clearInterval( timer );
					timer = null;
				}
			}

			function start() {
				stop();
				if ( speed > 0 && ! reduceMotion ) {
					timer = window.setInterval( function () {
						show( index + 1 );
					}, speed * 1000 );
				}
			}

			var prev = hero.querySelector( '[data-hero-prev]' );
			var next = hero.querySelector( '[data-hero-next]' );

			if ( prev ) {
				prev.addEventListener( 'click', function () {
					show( index - 1 );
					start();
				} );
			}

			if ( next ) {
				next.addEventListener( 'click', function () {
					show( index + 1 );
					start();
				} );
			}

			dots.forEach( function ( dot, i ) {
				dot.addEventListener( 'click', function () {
					show( i );
					start();
				} );
			} );

			hero.addEventListener( 'mouseenter', stop );
			hero.addEventListener( 'mouseleave', start );
			hero.addEventListener( 'focusin', stop );
			hero.addEventListener( 'focusout', start );

			hero.addEventListener( 'keydown', function ( event ) {
				if ( 'ArrowLeft' === event.key ) {
					show( isRtl ? index + 1 : index - 1 );
				}
				if ( 'ArrowRight' === event.key ) {
					show( isRtl ? index - 1 : index + 1 );
				}
			} );

			// Touch swipe.
			var startX = null;
			hero.addEventListener( 'touchstart', function ( event ) {
				startX = event.touches[ 0 ].clientX;
			}, { passive: true } );

			hero.addEventListener( 'touchend', function ( event ) {
				if ( null === startX ) {
					return;
				}
				var delta = event.changedTouches[ 0 ].clientX - startX;
				startX = null;

				if ( Math.abs( delta ) < 45 ) {
					return;
				}

				var forward = isRtl ? delta > 0 : delta < 0;
				show( forward ? index + 1 : index - 1 );
				start();
			} );

			show( 0 );
			start();
		} );
	}

	/* ------------------------------------------------------------------ *
	 * Products carousel
	 * ------------------------------------------------------------------ */
	function initCarousel() {
		document.querySelectorAll( '[data-carousel]' ).forEach( function ( carousel ) {
			var track = carousel.querySelector( '.gsh-carousel-track' );
			var prev = carousel.querySelector( '[data-carousel-prev]' );
			var next = carousel.querySelector( '[data-carousel-next]' );

			if ( ! track ) {
				return;
			}

			function step() {
				var card = track.querySelector( '.gsh-card' );
				return card ? card.getBoundingClientRect().width + 26 : track.clientWidth * 0.8;
			}

			function forward( direction ) {
				var amount = step() * direction;
				track.scrollBy( { left: isRtl ? -amount : amount, behavior: reduceMotion ? 'auto' : 'smooth' } );
			}

			if ( next ) {
				next.addEventListener( 'click', function () {
					forward( 1 );
				} );
			}

			if ( prev ) {
				prev.addEventListener( 'click', function () {
					forward( -1 );
				} );
			}

			function update() {
				var max = track.scrollWidth - track.clientWidth;
				var position = Math.abs( track.scrollLeft );

				if ( prev ) {
					prev.disabled = position < 4;
				}
				if ( next ) {
					next.disabled = position > max - 4;
				}
			}

			track.addEventListener( 'scroll', update, { passive: true } );
			window.addEventListener( 'resize', update );
			update();
		} );
	}

	/* ------------------------------------------------------------------ *
	 * Gallery lightbox
	 * ------------------------------------------------------------------ */
	function initLightbox() {
		var modal = document.querySelector( '[data-lightbox-modal]' );
		var triggers = Array.prototype.slice.call( document.querySelectorAll( '.gsh-lightbox-trigger' ) );

		if ( ! modal || ! triggers.length ) {
			return;
		}

		var image = modal.querySelector( '[data-lightbox-image]' );
		var closeBtn = modal.querySelector( '[data-lightbox-close]' );
		var prevBtn = modal.querySelector( '[data-lightbox-prev]' );
		var nextBtn = modal.querySelector( '[data-lightbox-next]' );
		var current = 0;
		var lastFocused = null;

		function render( index ) {
			current = ( index + triggers.length ) % triggers.length;
			var source = triggers[ current ].getAttribute( 'href' );
			var alt = triggers[ current ].querySelector( 'img' );

			image.setAttribute( 'src', source );
			image.setAttribute( 'alt', alt ? alt.getAttribute( 'alt' ) : '' );
		}

		function open( index ) {
			lastFocused = document.activeElement;
			render( index );
			modal.hidden = false;
			document.body.classList.add( 'gsh-no-scroll' );
			if ( closeBtn ) {
				closeBtn.focus();
			}
		}

		function close() {
			modal.hidden = true;
			document.body.classList.remove( 'gsh-no-scroll' );
			if ( lastFocused && lastFocused.focus ) {
				lastFocused.focus();
			}
		}

		triggers.forEach( function ( trigger, index ) {
			trigger.addEventListener( 'click', function ( event ) {
				event.preventDefault();
				open( index );
			} );
		} );

		if ( closeBtn ) {
			closeBtn.addEventListener( 'click', close );
		}

		if ( prevBtn ) {
			prevBtn.addEventListener( 'click', function () {
				render( current - 1 );
			} );
		}

		if ( nextBtn ) {
			nextBtn.addEventListener( 'click', function () {
				render( current + 1 );
			} );
		}

		modal.addEventListener( 'click', function ( event ) {
			if ( event.target === modal ) {
				close();
			}
		} );

		document.addEventListener( 'keydown', function ( event ) {
			if ( modal.hidden ) {
				return;
			}

			if ( 'Escape' === event.key ) {
				close();
			}
			if ( 'ArrowLeft' === event.key ) {
				render( isRtl ? current + 1 : current - 1 );
			}
			if ( 'ArrowRight' === event.key ) {
				render( isRtl ? current - 1 : current + 1 );
			}
		} );
	}

	/* ------------------------------------------------------------------ *
	 * Sticky header + smooth anchors
	 * ------------------------------------------------------------------ */
	function initHeader() {
		var header = document.getElementById( 'masthead' );

		if ( header ) {
			function onScroll() {
				header.classList.toggle( 'is-scrolled', window.scrollY > 40 );
			}

			window.addEventListener( 'scroll', onScroll, { passive: true } );
			onScroll();
		}

		document.querySelectorAll( 'a[href^="#"]:not([href="#"])' ).forEach( function ( link ) {
			link.addEventListener( 'click', function ( event ) {
				var target = document.querySelector( link.getAttribute( 'href' ) );

				if ( ! target ) {
					return;
				}

				event.preventDefault();
				target.scrollIntoView( { behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' } );
			} );
		} );
	}

	function init() {
		initNav();
		initHero();
		initCarousel();
		initLightbox();
		initHeader();
	}

	if ( 'loading' === document.readyState ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();

=== Goosht Shahrvand ===

Contributors: shrftahma38-ai
Requires at least: 5.9
Tested up to: 6.6
Requires PHP: 7.4
Version: 1.0.0
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Tags: rtl-language-support, blog, e-commerce, custom-logo, custom-menu, featured-images, translation-ready, two-columns, right-sidebar, threaded-comments, sticky-post

قالب تیره و راست‌چین «گوشت شهروند» برای فروشگاه‌های گوشت، پروتئین و مواد غذایی.

== Description ==

Features:

* Right-to-left by default with Persian typography, and a switch back to LTR in the Customizer.
* Front page built from the design: full-width hero slider, about section, products carousel and a
  gallery mosaic with a lightbox.
* Bundled fonts (no external requests): Vazirmatn for text, Noto Naskh Arabic for headings.
* Customizer panel for colours, contact details, hero slides, about text, products, gallery images,
  footer text and social links.
* Blog templates: index, archive, search, single post with comments, widgets and pagination.
* WooCommerce support (the plugin is not bundled): product grid, product card, single product,
  cart, checkout and notices inherit the theme's dark styling. Gallery zoom/lightbox/slider are
  declared through `add_theme_support()`.

== Installation ==

1. In your WordPress dashboard go to Appearance → Themes → Add New Theme → Upload Theme.
2. Choose `goosht-shahrvand-wordpress-theme.zip` and click "Install Now".
3. Click "Activate".
4. Optional: install WooCommerce if you want a shop with prices, cart and checkout.
5. Edit the front page content in Appearance → Customize → "تنظیمات قالب گوشت شهروند".

== Frequently Asked Questions ==

= Does the theme work without WooCommerce? =

Yes. The product carousel then shows a small set of demo cards built from the theme's placeholder
images, and a hint points the shop owner to WooCommerce. No prices are invented.

= Are the demo images licensed? =

The images shipped in `assets/images/` are generated placeholder artwork created for this theme,
so they can be replaced freely with your own photography.

= Which fonts are used? =

Vazirmatn (SIL Open Font License 1.1) for body text and Noto Naskh Arabic (SIL Open Font License
1.1) for headings. Both are bundled in `assets/fonts/` and are not fetched from a CDN.

== Credits ==

* Vazirmatn font — Copyright (c) 2015 Saber Rastikerdar, SIL OFL 1.1.
* Noto Naskh Arabic font — Copyright Google, SIL OFL 1.1.
* OpenStreetMap is used for the optional footer map embed (© OpenStreetMap contributors).

== Changelog ==

= 1.0.0 =
* First release: hero slider, about, products carousel, gallery lightbox, contact/footer sections,
  blog templates and WooCommerce support.

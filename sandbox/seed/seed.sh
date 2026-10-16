#!/bin/sh
# Sandbox seed for the Goosht Shahrvand theme.
#
# Runs in the one-shot `seed` compose service: installs WordPress in Persian, activates the
# theme, builds the page/menu structure the design needs and - when WooCommerce can be
# downloaded - creates the demo catalogue. Re-running it is safe: every step checks first.
set -eu

WP_URL="${WP_URL:-http://localhost:3000}"
WP="wp --path=/var/www/html --url=$WP_URL"

wait_for() {
	label="$1"
	check="$2"
	limit="${3:-90}"
	i=0
	while ! eval "$check" >/dev/null 2>&1; do
		i=$((i + 1))
		if [ "$i" -gt "$limit" ]; then
			echo "! timed out waiting for $label"
			return 1
		fi
		sleep 2
	done
	echo "  · $label ready"
}

echo "→ waiting for the WordPress install…"
wait_for "core files" "test -f /var/www/html/wp-config.php" 90
wait_for "database" "wp db query 'SELECT 1' --path=/var/www/html" 60

if ! $WP core is-installed >/dev/null 2>&1; then
	echo "→ installing WordPress (fa_IR)…"
	$WP core install \
		--url="$WP_URL" \
		--title="گوشت شهروند" \
		--admin_user=admin \
		--admin_password=base44-demo \
		--admin_email=admin@example.com \
		--skip-email
else
	echo "→ WordPress is already installed"
fi

# Persian locale: brings the language files and switches WordPress (and the theme) to RTL.
if ! $WP language core is-installed fa_IR >/dev/null 2>&1; then
	$WP language core install fa_IR --activate || echo "! Persian language pack could not be downloaded"
else
	$WP language core activate fa_IR >/dev/null 2>&1 || true
fi

$WP option update blogdescription "فروشگاه گوشت و پروتئین تازه" >/dev/null
$WP option update timezone_string "Asia/Tehran" >/dev/null

echo "→ activating the theme…"
$WP theme activate goosht-shahrvand

# ---------------------------------------------------------------- pages & menus
ensure_page() {
	slug="$1"
	title="$2"
	content="${3:-}"

	id="$($WP post list --post_type=page --name="$slug" --field=ID --format=ids 2>/dev/null || true)"
	if [ -z "$id" ]; then
		id="$($WP post create --post_type=page --post_status=publish --post_title="$title" --post_name="$slug" --post_content="$content" --porcelain)"
		echo "  · page: $title" >&2
	fi
	echo "$id"
}

echo "→ creating pages…"
HOME_ID="$(ensure_page home 'خانه')"
ABOUT_ID="$(ensure_page about 'درباره ما' 'گوشت شهروند با بیش از دو دهه تجربه در بازار گوشت و پروتئین، گوشت تازه را روزانه از کشتارگاه‌های معتبر تهیه می‌کند و بدون واسطه به دست شما می‌رساند. تمام برش‌ها در محل و به سفارش مشتری آماده می‌شوند.')"
PRODUCTS_ID="$(ensure_page products 'محصولات')"
GALLERY_ID="$(ensure_page gallery 'گالری')"
CONTACT_ID="$(ensure_page contact 'تماس با ما' 'برای سفارش تلفنی، مشاوره خرید و پرسش‌ها با ما در تماس باشید. سفارش‌های تهران در همان روز ارسال می‌شوند.')"
BLOG_ID="$(ensure_page blog 'مجله')"

$WP option update show_on_front page >/dev/null
$WP option update page_on_front "$HOME_ID" >/dev/null
$WP option update page_for_posts "$BLOG_ID" >/dev/null
$WP option update posts_per_page 4 >/dev/null

# Drop the WordPress default content.
for gsh_slug in sample-page hello-world; do
	gsh_ids="$($WP post list --name="$gsh_slug" --field=ID --format=ids 2>/dev/null || true)"
	if [ -n "$gsh_ids" ]; then
		$WP post delete $gsh_ids --force >/dev/null
	fi
done

ensure_menu() {
	location="$1"
	menu_name="$2"
	shift 2

	ids="$($WP menu list --fields=term_id,locations,name --format=csv 2>/dev/null | grep -c "$location" || true)"
	if [ "$ids" = "0" ]; then
		menu_id="$($WP menu create "$menu_name" --porcelain)"
		for item in "$@"; do
			$WP menu item add-post "$menu_id" "$item" >/dev/null
		done
		$WP menu location assign "$menu_id" "$location" >/dev/null
		echo "  · menu: $menu_name" >&2
	fi
}

echo "→ creating menus…"
ensure_menu primary 'منوی اصلی' "$HOME_ID" "$ABOUT_ID" "$PRODUCTS_ID" "$GALLERY_ID" "$CONTACT_ID"
ensure_menu footer 'منوی فوتر' "$ABOUT_ID" "$CONTACT_ID" "$BLOG_ID"

# Menu labels in Persian (the posts themselves already carry the right titles).
HOME_TITLE="$($WP post get "$HOME_ID" --field=post_title)"
if [ "$HOME_TITLE" = "خانه" ]; then
	echo "  · menu labels look translated" >&2
fi

# ---------------------------------------------------------------- widgets & posts
if [ "$($WP post list --post_type=post --format=count)" = "0" ]; then
	echo "→ adding a demo article…"
	$WP post create \
		--post_type=post \
		--post_status=publish \
		--post_title='راهنمای نگهداری گوشت در یخچال' \
		--post_content='گوشت تازه را در سردترین بخش یخچال و در ظرف دربسته نگه دارید. برای ماندگاری بیشتر می‌توانید برش‌ها را جداگانه بسته‌بندی و فریز کنید و پیش از پخت، در یخچال و نه در دمای محیط، یخ‌زدایی کنید.' \
		--porcelain >/dev/null
fi

$WP widget add search sidebar-1 --title='جست‌وجو' >/dev/null 2>&1 || true
$WP widget add recent-posts sidebar-1 --title='آخرین مطالب' >/dev/null 2>&1 || true

# ---------------------------------------------------------------- permalinks
echo "→ setting permalinks…"
$WP rewrite structure '/%postname%/' --hard >/dev/null
$WP rewrite flush --hard >/dev/null

# ---------------------------------------------------------------- WooCommerce
if ! $WP plugin is-active woocommerce >/dev/null 2>&1; then
	echo "→ installing WooCommerce…"
	if ! $WP plugin install woocommerce --activate 2>&1 | tail -n 2; then
		echo "! WooCommerce could not be installed - the theme keeps working without it"
	fi
fi

if $WP plugin is-active woocommerce >/dev/null 2>&1; then
	echo "→ configuring the shop…"
	$WP option update woocommerce_currency IRT >/dev/null
	$WP option update woocommerce_price_num_decimals 0 >/dev/null
	$WP option update woocommerce_currency_pos right_space >/dev/null
	$WP option update woocommerce_price_thousand_sep '٬' >/dev/null
	$WP option update woocommerce_weight_unit kg >/dev/null
	$WP option update woocommerce_enable_reviews yes >/dev/null

	if [ "$($WP post list --post_type=product --format=count)" = "0" ]; then
		echo "→ importing demo product photos…"
		media_ids=""
		for gsh_file in /seed/images/product-*.png; do
			[ -e "$gsh_file" ] || continue
			media_id="$($WP media import "$gsh_file" --title="$(basename "$gsh_file" .png)" --porcelain 2>/dev/null || true)"
			if [ -n "$media_id" ]; then
				media_ids="$media_ids $media_id"
			fi
		done

		echo "→ creating demo products…"
		# shellcheck disable=SC2086
		$WP eval-file /seed/demo-products.php $media_ids
	fi
fi

echo "✔ seed finished"
echo "  home: $($WP option get home)"
echo "  theme: $($WP theme list --status=active --field=name | tr '\n' ' ')"

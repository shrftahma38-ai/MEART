#!/bin/sh
# Build the installable WordPress theme ZIP.
#
#   sh scripts/build-theme-zip.sh
#
# Output: dist/goosht-shahrvand-wordpress-theme.zip — a ZIP whose single top-level folder is
# goosht-shahrvand/, exactly what WordPress expects from
# Appearance → Themes → Add New Theme → Upload Theme.
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/theme/goosht-shahrvand"
OUT="$ROOT/dist/goosht-shahrvand-wordpress-theme.zip"

if [ ! -f "$SRC/style.css" ]; then
	echo "! $SRC/style.css is missing – cannot build the theme"
	exit 1
fi

mkdir -p "$ROOT/dist"
rm -f "$OUT"

python3 - "$SRC" "$OUT" <<'PY'
import os
import sys
import zipfile

src, out = sys.argv[1], sys.argv[2]
slug = os.path.basename(src)
skip_dirs = {"node_modules", ".git", "__MACOSX", ".sass-cache"}
skip_files = {".DS_Store", "Thumbs.db", ".gitignore"}

files = []
for root, dirs, names in os.walk(src):
    dirs[:] = sorted(d for d in dirs if d not in skip_dirs and not d.startswith("."))
    for name in sorted(names):
        if name in skip_files or name.startswith("."):
            continue
        path = os.path.join(root, name)
        files.append((path, os.path.join(slug, os.path.relpath(path, src))))

with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for path, arcname in files:
        archive.write(path, arcname)

print("built %s" % out)
print("entries: %d, size: %.1f KB" % (len(files), os.path.getsize(out) / 1024.0))
PY

echo "→ verifying the archive…"
python3 - "$OUT" <<'PY'
import sys
import zipfile

path = sys.argv[1]
required = [
    "goosht-shahrvand/style.css",
    "goosht-shahrvand/functions.php",
    "goosht-shahrvand/index.php",
    "goosht-shahrvand/header.php",
    "goosht-shahrvand/footer.php",
    "goosht-shahrvand/front-page.php",
    "goosht-shahrvand/page.php",
    "goosht-shahrvand/single.php",
    "goosht-shahrvand/screenshot.png",
    "goosht-shahrvand/assets/css/main.css",
    "goosht-shahrvand/assets/js/main.js",
    "goosht-shahrvand/assets/fonts/vazirmatn-regular.woff2",
    "goosht-shahrvand/woocommerce/content-product.php",
]

with zipfile.ZipFile(path) as archive:
    names = archive.namelist()
    bad = archive.testzip()

missing = [name for name in required if name not in names]
roots = {name.split("/")[0] for name in names}

if bad:
    print("! corrupt entry: %s" % bad)
    sys.exit(1)
if roots != {"goosht-shahrvand"}:
    print("! unexpected top-level folders: %s" % ", ".join(sorted(roots)))
    sys.exit(1)
if missing:
    print("! missing files:")
    for name in missing:
        print("   - %s" % name)
    sys.exit(1)

print("✔ %d files, single top-level folder, no corrupt entries" % len(names))
PY

# A tiny page so the archive can be downloaded straight from the sandbox preview.
cat > "$ROOT/dist/index.html" <<'HTML'
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>دانلود قالب وردپرس گوشت شهروند</title>
<style>
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:#1a1a1a; color:#fff;
         font-family:Tahoma, sans-serif; text-align:center; }
  .card { padding:40px 32px; max-width:520px; }
  h1 { font-size:1.5rem; margin:0 0 10px; }
  p { color:#ccc; line-height:2; margin:0 0 26px; }
  a.btn { display:inline-block; padding:14px 34px; background:#a01212; color:#fff; text-decoration:none;
          border-radius:3px; font-weight:bold; }
  code { direction:ltr; display:block; margin-top:18px; color:#999; font-size:.8rem; }
</style>
</head>
<body>
  <div class="card">
    <h1>قالب وردپرس «گوشت شهروند»</h1>
    <p>فایل نصبی قالب آماده دانلود است. از مسیر<br>نمایش &rarr; پوسته‌ها &rarr; افزودن پوسته &rarr; بارگذاری پوسته آن را نصب کنید.</p>
    <a class="btn" href="goosht-shahrvand-wordpress-theme.zip" download>دانلود فایل قالب (ZIP)</a>
    <code>goosht-shahrvand-wordpress-theme.zip</code>
  </div>
</body>
</html>
HTML

echo "→ download page: $ROOT/dist/index.html"

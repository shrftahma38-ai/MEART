import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { SETTING_DEFS } from '../src/settings.js';

const prisma = new PrismaClient();
const here = path.dirname(fileURLToPath(import.meta.url));

const TEXTURES = {
  satin: 'براق و صاف با درخشش ملایم',
  plain: 'مات با بافت ریز و یکدست',
  twill: 'بافت اریب و محکم',
  tweed: 'بافت درشت و گرم',
  jacquard: 'نقش برجسته بافته‌شده',
  lace: 'تور و نقش ریز',
  sheer: 'نازک و سبک با افتی نرم',
  sequin: 'پوشیده از پولک درخشان',
  print: 'طرح چاپی ریز',
  pinstripe: 'راه‌راه ظریف',
  pile: 'سطح مخملی و پرزدار',
  knit: 'بافت کشباف',
  damask: 'نقش کلاسیک بافته‌شده',
};

const PAGES = [
  {
    slug: 'about',
    title: 'درباره ما',
    body: `پارچه‌سرای عرب‌زاده مجموعه‌ای تخصصی در حوزه پارچه است که با تکیه بر شناخت بافت، رنگ و کیفیت، پارچه‌های مناسب برای هر نوع دوخت را انتخاب و عرضه می‌کند.

ما معتقدیم انتخاب پارچه، نیمی از نتیجه دوخت است. به همین دلیل هر پارچه پیش از عرضه از نظر بافت، رنگ‌بندی و ایستایی بررسی می‌شود تا آنچه به دست شما می‌رسد همان چیزی باشد که انتظار دارید.

گروه‌های اصلی محصولات ما شامل پارچه‌های مانتویی، کت‌وشلواری، مجلسی، نخی، جین، پرده‌ای و مبلی است. برای هر گروه، رنگ‌بندی متنوعی در نظر گرفته شده تا هم برای دوخت سفارشی و هم برای خرید عمده قابل استفاده باشد.

اگر در انتخاب پارچه تردید دارید، می‌توانید پیش از خرید با ما تماس بگیرید؛ راهنمایی می‌کنیم کدام بافت و رنگ برای کاربری مورد نظر شما مناسب‌تر است.`,
  },
  {
    slug: 'faq',
    title: 'سؤالات متداول',
    body: `پارچه به چه صورت فروخته می‌شود؟
پارچه‌ها بر اساس متر فروخته می‌شوند و حداقل مقدار سفارش هر محصول در صفحه آن نوشته شده است.

آیا می‌توانم رنگ پارچه را از نزدیک ببینم؟
رنگ‌های موجود هر پارچه در صفحه محصول نمایش داده می‌شود. برای اطمینان از رنگ، می‌توانید پیش از خرید با ما تماس بگیرید.

چرا قیمت برخی محصولات نمایش داده نمی‌شود؟
قیمت‌ها به‌صورت روزانه به‌روزرسانی می‌شوند. تا زمانی که قیمت یک محصول ثبت نشده باشد، امکان ثبت سفارش برای آن وجود ندارد.

آیا امکان مرجوع کردن پارچه وجود دارد؟
پارچه‌های برش‌خورده قابل مرجوع کردن نیستند. در صورت وجود ایراد در بافت یا رنگ، پیش از برش با ما تماس بگیرید تا بررسی شود.

سفارش من چه زمانی ارسال می‌شود؟
پس از تأیید سفارش، آماده‌سازی و ارسال انجام می‌شود. وضعیت سفارش را می‌توانید از صفحه پیگیری سفارش مشاهده کنید.`,
  },
  {
    slug: 'buying-guide',
    title: 'راهنمای خرید',
    body: `۱. دسته‌بندی مناسب را انتخاب کنید.
اگر قصد دوخت مانتو دارید، دسته پارچه مانتویی؛ برای کت و شلوار، پارچه کت‌وشلواری؛ و برای لباس مجلسی، دسته پارچه مجلسی مناسب‌ترین گزینه‌ها هستند.

۲. بافت پارچه را با کاربری هماهنگ کنید.
برای استفاده روزمره، بافت‌های مات و کم‌درخشش مانند کرپ و لینن مناسب‌ترند. برای مجالس، ساتن، ژاکارد و لمه جلوه بهتری دارند.

۳. رنگ را با نور طبیعی بررسی کنید.
تصاویر محصول در نور یکنواخت ثبت می‌شوند، اما درخشش پارچه در نور محیط متفاوت دیده می‌شود.

۴. مقدار مورد نیاز را با احتساب دورگیری محاسبه کنید.
معمولاً مقداری بیشتر از اندازه الگو در نظر بگیرید تا در صورت نیاز به تنظیم، پارچه کم نیاید.

۵. پیش از برش، پارچه را کنترل کنید.
وجود تفاوت جزئی در رنگ هر عدل پارچه طبیعی است؛ سفارش خود را تا پیش از برش بررسی کنید.`,
  },
  {
    slug: 'shipping',
    title: 'روش‌های ارسال',
    body: `ارسال سفارش‌ها پس از تأیید و آماده‌سازی انجام می‌شود. روش و هزینه ارسال در صفحه تسویه‌حساب نمایش داده می‌شود.

ارسال به سراسر کشور از طریق پست و باربری انجام می‌شود. برای سفارش‌های حجیم یا عمده، هماهنگی ارسال پیش از ثبت سفارش انجام می‌گیرد.

هزینه ارسال در تنظیمات فروشگاه تعیین می‌شود و در صورت فعال بودن ارسال رایگان، مبلغ آن به‌صورت خودکار در سبد خرید محاسبه می‌شود.

پس از ارسال، کد رهگیری در صورت ارائه توسط شرکت حمل، به شما اعلام می‌شود.`,
  },
  {
    slug: 'terms',
    title: 'قوانین و مقررات',
    body: `ثبت سفارش در این فروشگاه به معنای پذیرش قوانین زیر است.

۱. قیمت‌ها و موجودی‌ها ممکن است بدون اطلاع قبلی تغییر کنند. مبلغ نهایی سفارش در زمان ثبت سفارش قطعی می‌شود.

۲. سفارش‌ها پس از تأیید و آماده‌سازی ارسال می‌شوند. در صورت ناموجود بودن محصول، با شما تماس گرفته می‌شود.

۳. پارچه‌های برش‌خورده قابل مرجوع کردن نیستند.

۴. اطلاعاتی که در فرم سفارش وارد می‌کنید برای ارسال سفارش استفاده می‌شود و در اختیار اشخاص دیگر قرار نمی‌گیرد.

۵. استفاده از تصاویر و محتوای این سایت بدون اجازه مجاز نیست.`,
  },
  {
    slug: 'privacy',
    title: 'حریم خصوصی',
    body: `اطلاعات شخصی شما مانند نام، شماره تماس و نشانی، تنها برای ثبت و ارسال سفارش استفاده می‌شود.

اطلاعات سفارش‌ها در سامانه فروشگاه نگهداری می‌شود و تنها مدیر فروشگاه و مشتری مربوط به آن سفارش به آن دسترسی دارند.

رمز عبور حساب کاربری به‌صورت رمزنگاری‌شده ذخیره می‌شود و در دسترس هیچ‌کس قرار نمی‌گیرد.

در صورت درخواست حذف اطلاعات حساب، پس از بررسی، اطلاعات شخصی شما حذف می‌شود.`,
  },
];

async function main() {
  const catalog = JSON.parse(fs.readFileSync(path.join(here, 'data', 'catalog.json'), 'utf8'));

  // ---- settings (defaults only; existing values are never overwritten)
  for (const def of SETTING_DEFS) {
    await prisma.setting.upsert({
      where: { key: def.key },
      update: {},
      create: { key: def.key, value: def.default },
    });
  }

  // ---- categories
  for (const [index, cat] of catalog.categories.entries()) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, image: cat.image, sortOrder: index },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        image: cat.image,
        sortOrder: index,
      },
    });
  }
  const categories = await prisma.category.findMany();
  const bySlug = new Map(categories.map((c) => [c.slug, c]));

  // ---- products (prices intentionally start empty)
  for (const [index, p] of catalog.products.entries()) {
    const category = bySlug.get(p.category);
    if (!category) continue;
    const exists = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (exists) continue;
    await prisma.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        categoryId: category.id,
        price: null,
        salePrice: null,
        shortDescription: p.shortDescription,
        description: p.description,
        texture: TEXTURES[p.kind] || null,
        stock: 40,
        minQty: p.minQty || 1,
        unit: p.unit || 'متر',
        sku: `AZ-${String(index + 1).padStart(3, '0')}`,
        isActive: true,
        isAvailable: true,
        showOnHome: true,
        isBestSeller: index % 3 === 0,
        isNew: index % 4 === 1,
        sortOrder: index,
        images: { create: p.images.map((url, i) => ({ url, sortOrder: i })) },
        colors: {
          create: p.colors.map((c, i) => ({
            name: c.name,
            hex: c.hex,
            image: c.image,
            sortOrder: i,
          })),
        },
      },
    });
  }

  // ---- content pages
  for (const page of PAGES) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }

  // ---- store owner account
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@arabzadeh.ir').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'مدیر فروشگاه',
        email: adminEmail,
        passwordHash: await bcrypt.hash(adminPassword, 10),
        role: 'ADMIN',
      },
    });
    console.log(`Admin account created: ${adminEmail}`);
  }

  console.log('Seed completed.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

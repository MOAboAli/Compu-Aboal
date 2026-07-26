const bcrypt = require('bcryptjs');
const dbContext = require('./context/dbContext');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/compu_aboali';

const IMG = {
  laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  ultrabook:
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  gaming:
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  cameraKit:
    'https://images.unsplash.com/photo-1557597774-9d273605dfa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  dome: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  nvr: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  access:
    'https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  network:
    'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  wifi: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  cable: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  hub: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  mouse: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  keyboard:
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  phone: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  charger:
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
};

async function seed(ctx = dbContext) {
  if (ctx.connection.readyState !== 1) {
    await ctx.connect(MONGODB_URI);
  }

  const adminEmail = 'admin@compu-aboali.com';
  let admin = await ctx.User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await ctx.User.create({
      name: 'Super Admin',
      email: adminEmail,
      phone: '01000000000',
      passwordHash: await bcrypt.hash('Admin123!', 10),
      role: 'super_admin',
      isActive: true,
      emailVerified: true,
      phoneVerified: true,
    });
    console.log('Seeded super admin:', adminEmail);
  }

  const paymentMethods = [
    { name: 'InstaPay', code: 'INSTAPAY', description: 'Simulated InstaPay', sortOrder: 1 },
    { name: 'Visa', code: 'VISA', description: 'Simulated Visa', sortOrder: 2 },
    { name: 'MasterCard', code: 'MASTERCARD', description: 'Simulated MasterCard', sortOrder: 3 },
    { name: 'Fawry', code: 'FAWRY', description: 'Simulated Fawry', sortOrder: 4 },
    { name: 'Cash on Delivery', code: 'COD', description: 'Pay on delivery', sortOrder: 5 },
  ];
  for (const method of paymentMethods) {
    const exists = await ctx.PaymentMethod.findOne({ code: method.code });
    if (!exists) {
      await ctx.PaymentMethod.create({ ...method, isActive: true, provider: 'simulator' });
    }
  }

  const categoryDefs = [
    { name: 'Laptops', nameAr: 'أجهزة لابتوب' },
    { name: 'Security camera systems and components', nameAr: 'كاميرات وأنظمة المراقبة' },
    { name: 'Network equipment and components', nameAr: 'معدات ومكونات الشبكات' },
    { name: 'Mobile accessories', nameAr: 'إكسسوارات الموبايل' },
    { name: 'Computer accessories', nameAr: 'إكسسوارات الكمبيوتر' },
  ];
  const categories = [];
  for (const [i, def] of categoryDefs.entries()) {
    const slug = def.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let cat = await ctx.Category.findOne({ slug });
    if (!cat) {
      cat = await ctx.Category.create({
        name: def.name,
        nameAr: def.nameAr,
        slug,
        description: def.name,
        status: 'active',
        sortOrder: i + 1,
      });
    } else if (!cat.nameAr) {
      cat = await ctx.Category.findByIdAndUpdate(cat._id, { nameAr: def.nameAr }, { new: true });
    }
    categories.push(cat);
  }

  const products = [
    {
      name: 'Business Laptop 15"',
      nameAr: 'لابتوب أعمال ١٥ بوصة',
      sku: 'LAP-001',
      barcode: '100001',
      manufacturerCode: 'MFG-LAP-1',
      category: categories[0]._id,
      shortDescription: 'Reliable laptop for office work',
      shortDescriptionAr: 'لابتوب موثوق للعمل المكتبي',
      detailedDescription: 'Intel i7, 16GB RAM, 512GB SSD',
      detailedDescriptionAr: 'معالج Intel i7 وذاكرة ١٦ جيجا وتخزين ٥١٢ جيجا SSD',
      price: 24999,
      discountPrice: 22999,
      stock: 12,
      specs: { cpu: 'i7', ram: '16GB', storage: '512GB SSD' },
      status: 'active',
      featured: true,
      featuredImage: IMG.laptop,
    },
    {
      name: 'Ultrabook 14" Pro',
      nameAr: 'ألترابوك ١٤ بوصة برو',
      sku: 'LAP-002',
      barcode: '100004',
      manufacturerCode: 'MFG-LAP-2',
      category: categories[0]._id,
      shortDescription: 'Lightweight laptop for travel',
      shortDescriptionAr: 'لابتوب خفيف مناسب للسفر',
      detailedDescription: 'Intel i5, 16GB RAM, 1TB SSD, aluminum body',
      detailedDescriptionAr: 'معالج Intel i5 وذاكرة ١٦ جيجا وتخزين ١ تيرا SSD وهيكل ألومنيوم',
      price: 28999,
      stock: 9,
      specs: { cpu: 'i5', ram: '16GB', storage: '1TB SSD' },
      status: 'active',
      featured: true,
      featuredImage: IMG.ultrabook,
    },
    {
      name: 'Gaming Laptop RTX',
      nameAr: 'لابتوب ألعاب RTX',
      sku: 'LAP-003',
      barcode: '100005',
      manufacturerCode: 'MFG-LAP-3',
      category: categories[0]._id,
      shortDescription: 'High-performance gaming laptop',
      shortDescriptionAr: 'لابتوب ألعاب عالي الأداء',
      detailedDescription: 'Ryzen 7, 32GB RAM, RTX 4060, 1TB SSD',
      detailedDescriptionAr: 'معالج Ryzen 7 وذاكرة ٣٢ جيجا وكرت RTX 4060 وتخزين ١ تيرا',
      price: 45999,
      discountPrice: 42999,
      stock: 5,
      specs: { cpu: 'Ryzen 7', ram: '32GB', gpu: 'RTX 4060' },
      status: 'active',
      featured: true,
      featuredImage: IMG.gaming,
    },
    {
      name: '4K IP Camera Kit',
      nameAr: 'طقم كاميرات IP بدقة ٤K',
      sku: 'CAM-100',
      barcode: '100002',
      manufacturerCode: 'MFG-CAM-1',
      category: categories[1]._id,
      shortDescription: '4-camera security kit',
      shortDescriptionAr: 'طقم مراقبة من ٤ كاميرات',
      detailedDescription: 'PoE NVR with 4x 4K cameras',
      detailedDescriptionAr: 'جهاز تسجيل PoE مع ٤ كاميرات بدقة ٤K',
      price: 15999,
      stock: 8,
      status: 'active',
      featured: true,
      featuredImage: IMG.cameraKit,
    },
    {
      name: 'Dome Camera 5MP',
      nameAr: 'كاميرا دوم ٥ ميجابكسل',
      sku: 'CAM-101',
      barcode: '100006',
      manufacturerCode: 'MFG-CAM-2',
      category: categories[1]._id,
      shortDescription: 'Indoor/outdoor dome camera',
      shortDescriptionAr: 'كاميرا دوم للداخل والخارج',
      detailedDescription: '5MP PoE camera with night vision and IP66 housing',
      detailedDescriptionAr: 'كاميرا PoE بدقة ٥ ميجابكسل مع رؤية ليلية وحماية IP66',
      price: 1899,
      discountPrice: 1599,
      stock: 40,
      status: 'active',
      featured: true,
      featuredImage: IMG.dome,
    },
    {
      name: '8-Channel NVR',
      nameAr: 'جهاز تسجيل ٨ قنوات',
      sku: 'CAM-102',
      barcode: '100007',
      manufacturerCode: 'MFG-CAM-3',
      category: categories[1]._id,
      shortDescription: 'Network video recorder',
      shortDescriptionAr: 'جهاز تسجيل شبكي للفيديو',
      detailedDescription: '8-channel NVR with 2TB storage and remote app',
      detailedDescriptionAr: 'جهاز ٨ قنوات مع تخزين ٢ تيرا وتطبيق للتحكم عن بعد',
      price: 7499,
      stock: 15,
      status: 'active',
      featured: false,
      featuredImage: IMG.nvr,
    },
    {
      name: 'Access Control Kit',
      nameAr: 'طقم التحكم في الدخول',
      sku: 'CAM-103',
      barcode: '100008',
      manufacturerCode: 'MFG-ACC-1',
      category: categories[1]._id,
      shortDescription: 'Door access starter kit',
      shortDescriptionAr: 'طقم بداية للتحكم في أبواب الدخول',
      detailedDescription: 'RFID reader, controller, and electric lock set',
      detailedDescriptionAr: 'قارئ RFID ووحدة تحكم وقفل كهربائي',
      price: 5999,
      stock: 10,
      status: 'active',
      featured: true,
      featuredImage: IMG.access,
    },
    {
      name: 'Gigabit Switch 24-Port',
      nameAr: 'سويتش جيجابت ٢٤ منفذ',
      sku: 'NET-24',
      barcode: '100003',
      manufacturerCode: 'MFG-NET-1',
      category: categories[2]._id,
      shortDescription: 'Managed network switch',
      shortDescriptionAr: 'سويتش شبكة قابل للإدارة',
      detailedDescription: '24-port gigabit with VLAN support',
      detailedDescriptionAr: '٢٤ منفذ جيجابت مع دعم VLAN',
      price: 4999,
      stock: 20,
      status: 'active',
      featured: true,
      featuredImage: IMG.network,
    },
    {
      name: 'Wi-Fi 6 Access Point',
      nameAr: 'نقطة وصول Wi-Fi 6',
      sku: 'NET-25',
      barcode: '100009',
      manufacturerCode: 'MFG-NET-2',
      category: categories[2]._id,
      shortDescription: 'Ceiling Wi-Fi 6 AP',
      shortDescriptionAr: 'نقطة وصول Wi-Fi 6 للأسقف',
      detailedDescription: 'Dual-band Wi-Fi 6 access point for offices',
      detailedDescriptionAr: 'نقطة وصول ثنائية النطاق للمكاتب',
      price: 3299,
      discountPrice: 2999,
      stock: 25,
      status: 'active',
      featured: true,
      featuredImage: IMG.wifi,
    },
    {
      name: 'Cat6 Cable Box 305m',
      nameAr: 'بكرة كابل Cat6 بطول ٣٠٥م',
      sku: 'NET-26',
      barcode: '100010',
      manufacturerCode: 'MFG-NET-3',
      category: categories[2]._id,
      shortDescription: 'Bulk Cat6 networking cable',
      shortDescriptionAr: 'كابل شبكات Cat6 بالجملة',
      detailedDescription: '305m Cat6 UTP cable box for structured cabling',
      detailedDescriptionAr: 'بكرة كابل Cat6 UTP بطول ٣٠٥ متر للتمديدات',
      price: 2499,
      stock: 30,
      status: 'active',
      featured: false,
      featuredImage: IMG.cable,
    },
    {
      name: 'USB-C Hub Multiport',
      nameAr: 'محول USB-C متعدد المنافذ',
      sku: 'ACC-001',
      barcode: '100011',
      manufacturerCode: 'MFG-ACC-2',
      category: categories[4]._id,
      shortDescription: '7-in-1 USB-C hub',
      shortDescriptionAr: 'محول USB-C بسبع منافذ',
      detailedDescription: 'HDMI, USB 3.0, SD card, and PD charging',
      detailedDescriptionAr: 'HDMI وUSB 3.0 وبطاقة SD وشحن PD',
      price: 899,
      discountPrice: 749,
      stock: 50,
      status: 'active',
      featured: true,
      featuredImage: IMG.hub,
    },
    {
      name: 'Wireless Mouse Pro',
      nameAr: 'ماوس لاسلكي برو',
      sku: 'ACC-002',
      barcode: '100012',
      manufacturerCode: 'MFG-ACC-3',
      category: categories[4]._id,
      shortDescription: 'Ergonomic wireless mouse',
      shortDescriptionAr: 'ماوس لاسلكي مريح',
      detailedDescription: 'Silent clicks, 2.4GHz + Bluetooth, rechargeable',
      detailedDescriptionAr: 'نقرات هادئة واتصال ٢.٤ جيجا وبلوتوث وقابل للشحن',
      price: 499,
      stock: 60,
      status: 'active',
      featured: false,
      featuredImage: IMG.mouse,
    },
    {
      name: 'Mechanical Keyboard',
      nameAr: 'لوحة مفاتيح ميكانيكية',
      sku: 'ACC-003',
      barcode: '100013',
      manufacturerCode: 'MFG-ACC-4',
      category: categories[4]._id,
      shortDescription: 'RGB mechanical keyboard',
      shortDescriptionAr: 'لوحة مفاتيح ميكانيكية بإضاءة RGB',
      detailedDescription: 'Hot-swappable switches with Arabic/English layout',
      detailedDescriptionAr: 'مفاتيح قابلة للتبديل مع تخطيط عربي/إنجليزي',
      price: 1799,
      stock: 22,
      status: 'active',
      featured: true,
      featuredImage: IMG.keyboard,
    },
    {
      name: 'Phone MagSafe Stand',
      nameAr: 'حامل هاتف MagSafe',
      sku: 'MOB-001',
      barcode: '100014',
      manufacturerCode: 'MFG-MOB-1',
      category: categories[3]._id,
      shortDescription: 'Magnetic charging stand',
      shortDescriptionAr: 'حامل شحن مغناطيسي',
      detailedDescription: 'Adjustable MagSafe-compatible desk stand',
      detailedDescriptionAr: 'حامل مكتبي قابل للتعديل ومتوافق مع MagSafe',
      price: 649,
      discountPrice: 549,
      stock: 35,
      status: 'active',
      featured: true,
      featuredImage: IMG.phone,
    },
    {
      name: '20W Fast Charger',
      nameAr: 'شاحن سريع ٢٠ واط',
      sku: 'MOB-002',
      barcode: '100015',
      manufacturerCode: 'MFG-MOB-2',
      category: categories[3]._id,
      shortDescription: 'USB-C PD wall charger',
      shortDescriptionAr: 'شاحن حائط USB-C PD',
      detailedDescription: '20W Power Delivery charger with cable',
      detailedDescriptionAr: 'شاحن بقوة ٢٠ واط مع كابل',
      price: 299,
      stock: 80,
      status: 'active',
      featured: false,
      featuredImage: IMG.charger,
    },
  ];

  let productsAdded = 0;
  let productsUpdated = 0;
  for (const product of products) {
    const exists = await ctx.Product.findOne({ sku: product.sku });
    if (!exists) {
      await ctx.Product.create(product);
      productsAdded += 1;
    } else {
      await ctx.Product.updateOne(
        { _id: exists._id },
        {
          $set: {
            featuredImage: product.featuredImage,
            featured: product.featured,
            nameAr: product.nameAr,
            shortDescriptionAr: product.shortDescriptionAr,
            detailedDescriptionAr: product.detailedDescriptionAr,
          },
        }
      );
      productsUpdated += 1;
    }
  }
  if (productsAdded) console.log(`Seeded ${productsAdded} products`);
  if (productsUpdated) console.log(`Updated ${productsUpdated} products`);

  let securityCat = await ctx.ServiceCategory.findOne({ slug: 'security-systems' });
  if (!securityCat) {
    securityCat = await ctx.ServiceCategory.create({
      name: 'Security Systems Services',
      nameAr: 'خدمات أنظمة الأمن',
      slug: 'security-systems',
      status: 'active',
      description: 'CCTV, access control, smart building',
    });
  } else if (!securityCat.nameAr) {
    securityCat = await ctx.ServiceCategory.findByIdAndUpdate(
      securityCat._id,
      { nameAr: 'خدمات أنظمة الأمن' },
      { new: true }
    );
  }
  let itCat = await ctx.ServiceCategory.findOne({ slug: 'it-services' });
  if (!itCat) {
    itCat = await ctx.ServiceCategory.create({
      name: 'IT Services',
      nameAr: 'خدمات تقنية المعلومات',
      slug: 'it-services',
      status: 'active',
      description: 'Maintenance, networking, upgrades',
    });
  } else if (!itCat.nameAr) {
    itCat = await ctx.ServiceCategory.findByIdAndUpdate(
      itCat._id,
      { nameAr: 'خدمات تقنية المعلومات' },
      { new: true }
    );
  }
  let networkCat = await ctx.ServiceCategory.findOne({ slug: 'network-services' });
  if (!networkCat) {
    networkCat = await ctx.ServiceCategory.create({
      name: 'Network Services',
      nameAr: 'خدمات الشبكات',
      slug: 'network-services',
      status: 'active',
      description: 'Cabling, Wi-Fi, and infrastructure',
    });
  } else if (!networkCat.nameAr) {
    networkCat = await ctx.ServiceCategory.findByIdAndUpdate(
      networkCat._id,
      { nameAr: 'خدمات الشبكات' },
      { new: true }
    );
  }

  const offerings = [
    {
      name: 'CCTV Site Survey',
      nameAr: 'معاينة موقع كاميرات المراقبة',
      slug: 'cctv-site-survey',
      category: securityCat._id,
      type: 'site_survey',
      description: 'On-site survey for surveillance design',
      descriptionAr: 'معاينة ميدانية لتصميم أنظمة المراقبة',
      basePrice: 350,
      status: 'active',
    },
    {
      name: 'Access Control Survey',
      nameAr: 'معاينة أنظمة التحكم في الدخول',
      slug: 'access-control-survey',
      category: securityCat._id,
      type: 'site_survey',
      description: 'Site assessment for doors, readers, and access zones',
      descriptionAr: 'تقييم الموقع للأبواب والقارئات ومناطق الدخول',
      basePrice: 400,
      status: 'active',
    },
    {
      name: 'Smart Building Survey',
      nameAr: 'معاينة المباني الذكية',
      slug: 'smart-building-survey',
      category: securityCat._id,
      type: 'site_survey',
      description: 'Survey for cameras, sensors, and building automation',
      descriptionAr: 'معاينة للكاميرات والحساسات وأتمتة المباني',
      basePrice: 550,
      status: 'active',
    },
    {
      name: 'Laptop Repair',
      nameAr: 'صيانة اللابتوب',
      slug: 'laptop-repair',
      category: itCat._id,
      type: 'maintenance',
      description: 'Diagnostics and repair for laptops',
      descriptionAr: 'تشخيص وإصلاح أجهزة اللابتوب',
      basePrice: 200,
      status: 'active',
    },
    {
      name: 'Desktop Maintenance',
      nameAr: 'صيانة أجهزة سطح المكتب',
      slug: 'desktop-maintenance',
      category: itCat._id,
      type: 'maintenance',
      description: 'Cleaning, upgrades, and hardware diagnostics',
      descriptionAr: 'تنظيف وترقية وتشخيص قطع الكمبيوتر',
      basePrice: 180,
      status: 'active',
    },
    {
      name: 'Printer & Peripheral Repair',
      nameAr: 'صيانة الطابعات والملحقات',
      slug: 'printer-peripheral-repair',
      category: itCat._id,
      type: 'maintenance',
      description: 'Service for printers, scanners, and office peripherals',
      descriptionAr: 'خدمة الطابعات والماسحات وملحقات المكتب',
      basePrice: 150,
      status: 'active',
    },
    {
      name: 'Data Backup Setup',
      nameAr: 'إعداد النسخ الاحتياطي',
      slug: 'data-backup-setup',
      category: itCat._id,
      type: 'other',
      description: 'Local and cloud backup configuration for businesses',
      descriptionAr: 'إعداد النسخ الاحتياطي المحلي والسحابي للشركات',
      basePrice: 450,
      status: 'active',
    },
    {
      name: 'Network Installation',
      nameAr: 'تركيب الشبكات',
      slug: 'network-installation',
      category: networkCat._id,
      type: 'other',
      description: 'Structured cabling and network setup',
      descriptionAr: 'تمديدات منظمة وإعداد الشبكة',
      basePrice: 800,
      status: 'active',
    },
    {
      name: 'Wi-Fi Coverage Design',
      nameAr: 'تصميم تغطية الواي فاي',
      slug: 'wifi-coverage-design',
      category: networkCat._id,
      type: 'site_survey',
      description: 'Heatmap survey and access point placement plan',
      descriptionAr: 'معاينة التغطية وخطة توزيع نقاط الوصول',
      basePrice: 600,
      status: 'active',
    },
    {
      name: 'Firewall Configuration',
      nameAr: 'إعداد الجدار الناري',
      slug: 'firewall-configuration',
      category: networkCat._id,
      type: 'other',
      description: 'Business firewall setup, VPN, and security policies',
      descriptionAr: 'إعداد الجدار الناري وVPN وسياسات الأمان للشركات',
      basePrice: 700,
      status: 'active',
    },
    {
      name: 'CCTV Maintenance Visit',
      nameAr: 'زيارة صيانة كاميرات المراقبة',
      slug: 'cctv-maintenance-visit',
      category: securityCat._id,
      type: 'maintenance',
      description: 'Camera cleaning, focus check, and recorder health check',
      descriptionAr: 'تنظيف الكاميرات وفحص التركيز وصحة جهاز التسجيل',
      basePrice: 250,
      status: 'active',
    },
    {
      name: 'Office IT Health Check',
      nameAr: 'فحص صحة تقنية المعلومات للمكتب',
      slug: 'office-it-health-check',
      category: itCat._id,
      type: 'other',
      description: 'Full review of PCs, network, backups, and security basics',
      descriptionAr: 'مراجعة شاملة لأجهزة الكمبيوتر والشبكة والنسخ الاحتياطي والأمان',
      basePrice: 500,
      status: 'active',
    },
  ];

  let offeringsAdded = 0;
  let offeringsUpdated = 0;
  for (const offering of offerings) {
    const exists = await ctx.ServiceOffering.findOne({ slug: offering.slug });
    if (!exists) {
      await ctx.ServiceOffering.create(offering);
      offeringsAdded += 1;
    } else {
      await ctx.ServiceOffering.updateOne(
        { _id: exists._id },
        { $set: { nameAr: offering.nameAr, descriptionAr: offering.descriptionAr } }
      );
      offeringsUpdated += 1;
    }
  }
  if (offeringsAdded) console.log(`Seeded ${offeringsAdded} service offerings`);
  if (offeringsUpdated) console.log(`Updated ${offeringsUpdated} service offerings`);

  const cmsDefaults = [
    {
      key: 'home',
      title: 'Technology, security, and IT services',
      content:
        'Shop products and request professional security and IT services from Compu-Aboali.',
      type: 'page',
      metadata: {
        about: 'Compu-Aboali delivers IT, networking, and security solutions across Egypt.',
        aboutAr: 'تقدم كومبيو أبو علي حلول تقنية المعلومات والشبكات والأمن في أنحاء مصر.',
        heroKicker: 'You need to',
        heroKickerAr: 'أنت بحاجة إلى',
        heroTitleAr: 'تميّز الآن',
        heroTextAr: 'تسوق المنتجات واطلب خدمات الأمن وتقنية المعلومات من كومبيو أبو علي.',
        heroImage:
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=80',
        promotions: ['Free site survey for CCTV packages this month'],
        testimonials: [{ author: 'Ahmed', text: 'Excellent installation and support.' }],
        news: [{ title: 'New IP camera kits', body: '4K kits now in stock.' }],
        contact: {
          phone: '+20 100 000 0000',
          email: 'support@compu-aboali.com',
          address: 'Cairo, Egypt',
          intro: 'Reach out for product inquiries, site surveys, or maintenance support.',
          introAr: 'تواصل معنا للاستفسار عن المنتجات أو طلب معاينة موقع أو الصيانة.',
        },
        footer: {
          street: '12 Tahrir Street',
          streetAr: '١٢ شارع التحرير',
          city: 'Cairo, Egypt',
          cityAr: 'القاهرة، مصر',
          aboutTitle: 'About the company',
          aboutTitleAr: 'عن الشركة',
          aboutText:
            'Compu-Aboali delivers computers, networking, security systems, and professional IT services for homes and businesses across Egypt.',
          aboutTextAr:
            'تقدم كومبيو أبو علي أجهزة الكمبيوتر والشبكات وأنظمة الأمن وخدمات تقنية المعلومات للمنازل والشركات في مصر.',
          phone: '+20 100 000 0000',
          email: 'support@compu-aboali.com',
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com',
          linkedin: 'https://linkedin.com',
          github: 'https://github.com/MOAboAli/Compu-Aboal',
        },
      },
    },
    {
      key: 'home-hero',
      title: 'Welcome to Compu-Aboali',
      content: 'Your partner for computers, accessories, and IT services.',
      type: 'banner',
    },
    {
      key: 'privacy-policy',
      title: 'Privacy Policy',
      content: 'We respect your privacy and protect customer data.',
      type: 'policy',
    },
  ];
  for (const block of cmsDefaults) {
    const exists = await ctx.CmsBlock.findOne({ key: block.key });
    if (!exists) await ctx.CmsBlock.create({ ...block, status: 'active', locale: 'en' });
  }

  console.log('Seed complete');
  return { adminEmail };
}

module.exports = seed;
module.exports.seed = seed;

if (require.main === module) {
  require('dotenv').config();
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

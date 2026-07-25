const bcrypt = require('bcryptjs');
const dbContext = require('./context/dbContext');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/compu_aboali';

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

  const categoryNames = [
    'Laptops',
    'Security camera systems and components',
    'Network equipment and components',
    'Mobile accessories',
    'Computer accessories',
  ];
  const categories = [];
  for (const [i, name] of categoryNames.entries()) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let cat = await ctx.Category.findOne({ slug });
    if (!cat) {
      cat = await ctx.Category.create({
        name,
        slug,
        description: name,
        status: 'active',
        sortOrder: i + 1,
      });
    }
    categories.push(cat);
  }

  const products = [
    {
      name: 'Business Laptop 15"',
      sku: 'LAP-001',
      barcode: '100001',
      manufacturerCode: 'MFG-LAP-1',
      category: categories[0]._id,
      shortDescription: 'Reliable laptop for office work',
      detailedDescription: 'Intel i7, 16GB RAM, 512GB SSD',
      price: 24999,
      discountPrice: 22999,
      stock: 12,
      specs: { cpu: 'i7', ram: '16GB', storage: '512GB SSD' },
      status: 'active',
      featured: true,
      featuredImage:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Ultrabook 14" Pro',
      sku: 'LAP-002',
      barcode: '100004',
      manufacturerCode: 'MFG-LAP-2',
      category: categories[0]._id,
      shortDescription: 'Lightweight laptop for travel',
      detailedDescription: 'Intel i5, 16GB RAM, 1TB SSD, aluminum body',
      price: 28999,
      stock: 9,
      specs: { cpu: 'i5', ram: '16GB', storage: '1TB SSD' },
      status: 'active',
      featured: true,
      featuredImage:
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Gaming Laptop RTX',
      sku: 'LAP-003',
      barcode: '100005',
      manufacturerCode: 'MFG-LAP-3',
      category: categories[0]._id,
      shortDescription: 'High-performance gaming laptop',
      detailedDescription: 'Ryzen 7, 32GB RAM, RTX 4060, 1TB SSD',
      price: 45999,
      discountPrice: 42999,
      stock: 5,
      specs: { cpu: 'Ryzen 7', ram: '32GB', gpu: 'RTX 4060' },
      status: 'active',
      featured: true,
      featuredImage:
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: '4K IP Camera Kit',
      sku: 'CAM-100',
      barcode: '100002',
      manufacturerCode: 'MFG-CAM-1',
      category: categories[1]._id,
      shortDescription: '4-camera security kit',
      detailedDescription: 'PoE NVR with 4x 4K cameras',
      price: 15999,
      stock: 8,
      status: 'active',
      featured: true,
      featuredImage:
        'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Dome Camera 5MP',
      sku: 'CAM-101',
      barcode: '100006',
      manufacturerCode: 'MFG-CAM-2',
      category: categories[1]._id,
      shortDescription: 'Indoor/outdoor dome camera',
      detailedDescription: '5MP PoE camera with night vision and IP66 housing',
      price: 1899,
      discountPrice: 1599,
      stock: 40,
      status: 'active',
      featured: true,
      featuredImage:
        'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: '8-Channel NVR',
      sku: 'CAM-102',
      barcode: '100007',
      manufacturerCode: 'MFG-CAM-3',
      category: categories[1]._id,
      shortDescription: 'Network video recorder',
      detailedDescription: '8-channel NVR with 2TB storage and remote app',
      price: 7499,
      stock: 15,
      status: 'active',
      featured: false,
      featuredImage:
        'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Access Control Kit',
      sku: 'CAM-103',
      barcode: '100008',
      manufacturerCode: 'MFG-ACC-1',
      category: categories[1]._id,
      shortDescription: 'Door access starter kit',
      detailedDescription: 'RFID reader, controller, and electric lock set',
      price: 5999,
      stock: 10,
      status: 'active',
      featured: true,
      featuredImage:
        'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Gigabit Switch 24-Port',
      sku: 'NET-24',
      barcode: '100003',
      manufacturerCode: 'MFG-NET-1',
      category: categories[2]._id,
      shortDescription: 'Managed network switch',
      detailedDescription: '24-port gigabit with VLAN support',
      price: 4999,
      stock: 20,
      status: 'active',
      featured: true,
      featuredImage:
        'https://images.unsplash.com/photo-1558494949-ef526b004090?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Wi-Fi 6 Access Point',
      sku: 'NET-25',
      barcode: '100009',
      manufacturerCode: 'MFG-NET-2',
      category: categories[2]._id,
      shortDescription: 'Ceiling Wi-Fi 6 AP',
      detailedDescription: 'Dual-band Wi-Fi 6 access point for offices',
      price: 3299,
      discountPrice: 2999,
      stock: 25,
      status: 'active',
      featured: true,
      featuredImage:
        'https://images.unsplash.com/photo-1606904825846-647eb07f5be6?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Cat6 Cable Box 305m',
      sku: 'NET-26',
      barcode: '100010',
      manufacturerCode: 'MFG-NET-3',
      category: categories[2]._id,
      shortDescription: 'Bulk Cat6 networking cable',
      detailedDescription: '305m Cat6 UTP cable box for structured cabling',
      price: 2499,
      stock: 30,
      status: 'active',
      featured: false,
      featuredImage:
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a2?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'USB-C Hub Multiport',
      sku: 'ACC-001',
      barcode: '100011',
      manufacturerCode: 'MFG-ACC-2',
      category: categories[4]._id,
      shortDescription: '7-in-1 USB-C hub',
      detailedDescription: 'HDMI, USB 3.0, SD card, and PD charging',
      price: 899,
      discountPrice: 749,
      stock: 50,
      status: 'active',
      featured: true,
      featuredImage:
        'https://images.unsplash.com/photo-1625948515291-69613efd103f?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Wireless Mouse Pro',
      sku: 'ACC-002',
      barcode: '100012',
      manufacturerCode: 'MFG-ACC-3',
      category: categories[4]._id,
      shortDescription: 'Ergonomic wireless mouse',
      detailedDescription: 'Silent clicks, 2.4GHz + Bluetooth, rechargeable',
      price: 499,
      stock: 60,
      status: 'active',
      featured: false,
      featuredImage:
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Mechanical Keyboard',
      sku: 'ACC-003',
      barcode: '100013',
      manufacturerCode: 'MFG-ACC-4',
      category: categories[4]._id,
      shortDescription: 'RGB mechanical keyboard',
      detailedDescription: 'Hot-swappable switches with Arabic/English layout',
      price: 1799,
      stock: 22,
      status: 'active',
      featured: true,
      featuredImage:
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Phone MagSafe Stand',
      sku: 'MOB-001',
      barcode: '100014',
      manufacturerCode: 'MFG-MOB-1',
      category: categories[3]._id,
      shortDescription: 'Magnetic charging stand',
      detailedDescription: 'Adjustable MagSafe-compatible desk stand',
      price: 649,
      discountPrice: 549,
      stock: 35,
      status: 'active',
      featured: true,
      featuredImage:
        'https://images.unsplash.com/photo-1592890288564-76628a30a657?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: '20W Fast Charger',
      sku: 'MOB-002',
      barcode: '100015',
      manufacturerCode: 'MFG-MOB-2',
      category: categories[3]._id,
      shortDescription: 'USB-C PD wall charger',
      detailedDescription: '20W Power Delivery charger with cable',
      price: 299,
      stock: 80,
      status: 'active',
      featured: false,
      featuredImage:
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    },
  ];

  let productsAdded = 0;
  for (const product of products) {
    const exists = await ctx.Product.findOne({ sku: product.sku });
    if (!exists) {
      await ctx.Product.create(product);
      productsAdded += 1;
    }
  }
  if (productsAdded) console.log(`Seeded ${productsAdded} products`);

  let securityCat = await ctx.ServiceCategory.findOne({ slug: 'security-systems' });
  if (!securityCat) {
    securityCat = await ctx.ServiceCategory.create({
      name: 'Security Systems Services',
      slug: 'security-systems',
      status: 'active',
      description: 'CCTV, access control, smart building',
    });
  }
  let itCat = await ctx.ServiceCategory.findOne({ slug: 'it-services' });
  if (!itCat) {
    itCat = await ctx.ServiceCategory.create({
      name: 'IT Services',
      slug: 'it-services',
      status: 'active',
      description: 'Maintenance, networking, upgrades',
    });
  }
  let networkCat = await ctx.ServiceCategory.findOne({ slug: 'network-services' });
  if (!networkCat) {
    networkCat = await ctx.ServiceCategory.create({
      name: 'Network Services',
      slug: 'network-services',
      status: 'active',
      description: 'Cabling, Wi-Fi, and infrastructure',
    });
  }

  const offerings = [
    {
      name: 'CCTV Site Survey',
      slug: 'cctv-site-survey',
      category: securityCat._id,
      type: 'site_survey',
      description: 'On-site survey for surveillance design',
      basePrice: 350,
      status: 'active',
    },
    {
      name: 'Access Control Survey',
      slug: 'access-control-survey',
      category: securityCat._id,
      type: 'site_survey',
      description: 'Site assessment for doors, readers, and access zones',
      basePrice: 400,
      status: 'active',
    },
    {
      name: 'Smart Building Survey',
      slug: 'smart-building-survey',
      category: securityCat._id,
      type: 'site_survey',
      description: 'Survey for cameras, sensors, and building automation',
      basePrice: 550,
      status: 'active',
    },
    {
      name: 'Laptop Repair',
      slug: 'laptop-repair',
      category: itCat._id,
      type: 'maintenance',
      description: 'Diagnostics and repair for laptops',
      basePrice: 200,
      status: 'active',
    },
    {
      name: 'Desktop Maintenance',
      slug: 'desktop-maintenance',
      category: itCat._id,
      type: 'maintenance',
      description: 'Cleaning, upgrades, and hardware diagnostics',
      basePrice: 180,
      status: 'active',
    },
    {
      name: 'Printer & Peripheral Repair',
      slug: 'printer-peripheral-repair',
      category: itCat._id,
      type: 'maintenance',
      description: 'Service for printers, scanners, and office peripherals',
      basePrice: 150,
      status: 'active',
    },
    {
      name: 'Data Backup Setup',
      slug: 'data-backup-setup',
      category: itCat._id,
      type: 'other',
      description: 'Local and cloud backup configuration for businesses',
      basePrice: 450,
      status: 'active',
    },
    {
      name: 'Network Installation',
      slug: 'network-installation',
      category: networkCat._id,
      type: 'other',
      description: 'Structured cabling and network setup',
      basePrice: 800,
      status: 'active',
    },
    {
      name: 'Wi-Fi Coverage Design',
      slug: 'wifi-coverage-design',
      category: networkCat._id,
      type: 'site_survey',
      description: 'Heatmap survey and access point placement plan',
      basePrice: 600,
      status: 'active',
    },
    {
      name: 'Firewall Configuration',
      slug: 'firewall-configuration',
      category: networkCat._id,
      type: 'other',
      description: 'Business firewall setup, VPN, and security policies',
      basePrice: 700,
      status: 'active',
    },
    {
      name: 'CCTV Maintenance Visit',
      slug: 'cctv-maintenance-visit',
      category: securityCat._id,
      type: 'maintenance',
      description: 'Camera cleaning, focus check, and recorder health check',
      basePrice: 250,
      status: 'active',
    },
    {
      name: 'Office IT Health Check',
      slug: 'office-it-health-check',
      category: itCat._id,
      type: 'other',
      description: 'Full review of PCs, network, backups, and security basics',
      basePrice: 500,
      status: 'active',
    },
  ];

  let offeringsAdded = 0;
  for (const offering of offerings) {
    const exists = await ctx.ServiceOffering.findOne({ slug: offering.slug });
    if (!exists) {
      await ctx.ServiceOffering.create(offering);
      offeringsAdded += 1;
    }
  }
  if (offeringsAdded) console.log(`Seeded ${offeringsAdded} service offerings`);

  const cmsDefaults = [
    {
      key: 'home',
      title: 'Technology, security, and IT services',
      content:
        'Shop products and request professional security and IT services from Compu-Aboali.',
      type: 'page',
      metadata: {
        about: 'Compu-Aboali delivers IT, networking, and security solutions across Egypt.',
        promotions: ['Free site survey for CCTV packages this month'],
        testimonials: [{ author: 'Ahmed', text: 'Excellent installation and support.' }],
        news: [{ title: 'New IP camera kits', body: '4K kits now in stock.' }],
        contact: {
          phone: '+20 100 000 0000',
          email: 'support@compu-aboali.com',
          address: 'Cairo, Egypt',
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

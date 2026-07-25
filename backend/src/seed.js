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

  if ((await ctx.Product.countDocuments()) === 0) {
    await ctx.Product.insertMany([
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
      },
    ]);
    console.log('Seeded products');
  }

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

  if ((await ctx.ServiceOffering.countDocuments()) === 0) {
    await ctx.ServiceOffering.insertMany([
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
        name: 'Laptop Repair',
        slug: 'laptop-repair',
        category: itCat._id,
        type: 'maintenance',
        description: 'Diagnostics and repair for laptops',
        basePrice: 200,
        status: 'active',
      },
      {
        name: 'Network Installation',
        slug: 'network-installation',
        category: itCat._id,
        type: 'other',
        description: 'Structured cabling and network setup',
        basePrice: 800,
        status: 'active',
      },
    ]);
    console.log('Seeded service offerings');
  }

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

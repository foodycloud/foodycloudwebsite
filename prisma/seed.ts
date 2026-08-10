import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Foody Cloud database...')

  // 1. Admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@foodycloud.in'
  const adminPassword = process.env.ADMIN_PASSWORD || 'FoodyCloud@2026'
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Foody Cloud Admin',
    },
  })
  console.log('✅ Admin user created')

  // 2. Business settings
  const settingsCount = await prisma.businessSettings.count()
  if (settingsCount === 0) {
    await prisma.businessSettings.create({
      data: {
        businessName: 'Foody Cloud',
        tagline: 'Homely Taste, Every Time',
        phone: '90071 82421',
        whatsapp: '90071 82421',
        address: 'Chinar Park, Kolupukur',
        fssaiNumber: '22826136000840',
        instagramUrl: 'https://www.instagram.com/foody.cloud',
        lunchStartTime: '12:00',
        dinnerStartTime: '18:00',
        selfPickupEnabled: true,
        homeDeliveryEnabled: true,
        isOpen: true,
        acceptingOrders: true,
        deliveryCharge: 0,
        minOrderAmount: 0,
        closedMessage:
          'We are currently closed. Lunch orders from 12:00 PM and dinner orders from 6:00 PM.',
      },
    })
    console.log('✅ Business settings created')
  }

  // 3. Homepage settings
  const homepageCount = await prisma.homepageSettings.count()
  if (homepageCount === 0) {
    await prisma.homepageSettings.create({
      data: {
        heroHeading: 'Homely Taste, Every Time',
        heroSubheading: 'Freshly cooked. Purely homemade. Made with love.',
        featuredFoodIds: [],
        featuredCategoryIds: [],
      },
    })
    console.log('✅ Homepage settings created')
  }

  // 4. Categories
  const categories = [
    {
      name: 'Roti & Paratha',
      slug: 'roti-paratha',
      sortOrder: 1,
      description: 'Freshly made rotis and parathas, cooked with love',
    },
    {
      name: 'Sabzi (Veg)',
      slug: 'sabzi-veg',
      sortOrder: 2,
      description: 'Home-style vegetarian curries and sabzis',
    },
    {
      name: 'Snacks',
      slug: 'snacks',
      sortOrder: 3,
      description: 'Crispy, freshly fried snacks',
    },
    {
      name: 'Rice',
      slug: 'rice',
      sortOrder: 4,
      description: 'Aromatic rice dishes',
    },
    {
      name: 'Special Thali',
      slug: 'special-thali',
      sortOrder: 5,
      description: 'A complete meal full of love & satisfaction',
    },
    {
      name: 'Weekend Special',
      slug: 'weekend-special',
      sortOrder: 6,
      description: 'Special items available on weekends',
    },
    {
      name: 'Breakfast',
      slug: 'breakfast',
      sortOrder: 7,
      description: 'A comforting start to your day',
    },
  ]

  const categoryMap: Record<string, string> = {}
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, isActive: true },
    })
    categoryMap[cat.slug] = created.id
  }
  console.log('✅ Categories created')

  // 5. Foods (offline price × 1.20 rounded to nearest integer)
  const foods = [
    // ── ROTI & PARATHA ──────────────────────────────────────────
    {
      name: 'Fulka (Without Ghee)',
      slug: 'fulka-without-ghee',
      description:
        'A delightfully soft and warm roti, crafted to perfection for a wholesome, comforting meal.',
      price: 8,
      categorySlug: 'roti-paratha',
      sortOrder: 1,
      isFeatured: false,
      isPopular: true,
    },
    {
      name: 'Ghee Fulka',
      slug: 'ghee-fulka',
      description:
        'Soft, freshly prepared fulka brushed with a touch of ghee for a rich aroma and delicious homestyle flavour.',
      price: 14,
      categorySlug: 'roti-paratha',
      sortOrder: 2,
      isFeatured: false,
      isPopular: true,
    },
    {
      name: 'Plain Paratha',
      slug: 'plain-paratha',
      description:
        'Freshly prepared, flaky and lightly crisp on the outside while soft and tender inside. A classic homestyle paratha.',
      price: 30,
      categorySlug: 'roti-paratha',
      sortOrder: 3,
      isFeatured: false,
      isPopular: false,
    },
    {
      name: 'Paneer Paratha',
      slug: 'paneer-paratha',
      description:
        'A soft, flaky paratha generously stuffed with seasoned grated paneer and aromatic spices, cooked to golden perfection.',
      price: 60,
      categorySlug: 'roti-paratha',
      sortOrder: 4,
      isFeatured: true,
      isPopular: true,
    },
    {
      name: 'Mix Paratha',
      slug: 'mix-paratha',
      description:
        'A flaky, golden-brown flatbread filled with a delightful medley of fresh vegetables and aromatic spices.',
      price: 48,
      categorySlug: 'roti-paratha',
      sortOrder: 5,
      isFeatured: false,
      isPopular: false,
    },
    {
      name: 'Sattu Paratha',
      slug: 'sattu-paratha',
      description:
        'A savory flatbread perfectly stuffed with wholesome roasted gram flour, offering a delightful taste and satisfying texture.',
      price: 48,
      categorySlug: 'roti-paratha',
      sortOrder: 6,
      isFeatured: false,
      isPopular: false,
    },
    {
      name: 'Papad Bhujia Paratha',
      slug: 'papad-bhujia-paratha',
      description: 'Crispy layers of golden-brown paratha with a delightful crunch of papad and bhujia.',
      price: 60,
      categorySlug: 'roti-paratha',
      sortOrder: 7,
      isFeatured: false,
      isPopular: false,
    },
    {
      name: 'Bhujia Paratha',
      slug: 'bhujia-paratha',
      description: 'Flaky, crispy paratha layered with crunchy bhujia and aromatic spices.',
      price: 60,
      categorySlug: 'roti-paratha',
      sortOrder: 8,
      isFeatured: false,
      isPopular: false,
    },
    // ── SABZI VEG ───────────────────────────────────────────────
    {
      name: 'Jeera Aloo',
      slug: 'jeera-aloo',
      description: 'Tender potatoes tempered with cumin seeds and mild spices — a simple, homely delight.',
      price: 96,
      categorySlug: 'sabzi-veg',
      sortOrder: 1,
      isFeatured: false,
      isPopular: true,
    },
    {
      name: 'Aloo Matar',
      slug: 'aloo-matar',
      description:
        'A classic home-style curry of potatoes and green peas cooked in a warm, spiced tomato gravy.',
      price: 108,
      categorySlug: 'sabzi-veg',
      sortOrder: 2,
      isFeatured: false,
      isPopular: false,
    },
    {
      name: 'Matar Paneer',
      slug: 'matar-paneer',
      description: 'Soft paneer and tender green peas in a rich, spiced tomato-onion gravy.',
      price: 144,
      categorySlug: 'sabzi-veg',
      sortOrder: 3,
      isFeatured: true,
      isPopular: true,
    },
    {
      name: 'Paneer Butter Masala',
      slug: 'paneer-butter-masala',
      description:
        'Creamy, velvety tomato-based gravy with soft paneer cubes — a rich and indulgent classic.',
      price: 144,
      categorySlug: 'sabzi-veg',
      sortOrder: 4,
      isFeatured: true,
      isPopular: true,
    },
    {
      name: 'Malai Kofta',
      slug: 'malai-kofta',
      description:
        'Soft, melt-in-your-mouth cottage cheese and potato dumplings served in a luxurious cream sauce.',
      price: 180,
      categorySlug: 'sabzi-veg',
      sortOrder: 5,
      isFeatured: true,
      isPopular: false,
    },
    {
      name: 'Dal Fry',
      slug: 'dal-fry',
      description:
        'Hearty yellow lentils tempered with cumin, garlic and spices — a timeless comfort food.',
      price: 96,
      categorySlug: 'sabzi-veg',
      sortOrder: 6,
      isFeatured: false,
      isPopular: true,
    },
    {
      name: 'Aloo Dum',
      slug: 'aloo-dum',
      description:
        'Baby potatoes slow-cooked in a spiced yogurt and tomato gravy — rich, bold and deeply satisfying.',
      price: 120,
      categorySlug: 'sabzi-veg',
      sortOrder: 7,
      isFeatured: false,
      isPopular: false,
    },
    // ── SNACKS ──────────────────────────────────────────────────
    {
      name: 'Paneer Pakoda',
      slug: 'paneer-pakoda',
      description:
        'Crispy golden fritters of fresh paneer in a seasoned chickpea batter, served with mint chutney.',
      price: 60,
      categorySlug: 'snacks',
      sortOrder: 1,
      isFeatured: false,
      isPopular: true,
    },
    {
      name: 'Mix Pakoda',
      slug: 'mix-pakoda',
      description:
        'A delightful assortment of crispy fried vegetable fritters — a perfect tea-time snack.',
      price: 60,
      categorySlug: 'snacks',
      sortOrder: 2,
      isFeatured: false,
      isPopular: false,
    },
    {
      name: 'Cheese Ball',
      slug: 'cheese-ball',
      description: 'Golden, crispy bread crumb-coated balls with a gooey, melted cheese centre.',
      price: 144,
      categorySlug: 'snacks',
      sortOrder: 3,
      isFeatured: true,
      isPopular: true,
    },
    {
      name: 'Bread Cheese Pakoda',
      slug: 'bread-cheese-pakoda',
      description: 'Crispy bread pakoda stuffed with melted cheese — an irresistible snack.',
      price: 60,
      categorySlug: 'snacks',
      sortOrder: 4,
      isFeatured: false,
      isPopular: false,
    },
    {
      name: 'Bread Pakoda (2 Pieces)',
      slug: 'bread-pakoda',
      description:
        'Classic bread pakoda — soft spiced potato filling wrapped in crispy chickpea batter.',
      price: 48,
      categorySlug: 'snacks',
      sortOrder: 5,
      isFeatured: false,
      isPopular: false,
    },
    // ── RICE ────────────────────────────────────────────────────
    {
      name: 'Plain Rice',
      slug: 'plain-rice',
      description:
        'A fluffy and aromatic steamed rice — the perfect accompaniment to any sabzi.',
      price: 84,
      categorySlug: 'rice',
      sortOrder: 1,
      isFeatured: false,
      isPopular: false,
    },
    {
      name: 'Jeera Rice',
      slug: 'jeera-rice',
      description:
        'Fragrant basmati rice infused with aromatic cumin, creating a delightful and comforting dish.',
      price: 96,
      categorySlug: 'rice',
      sortOrder: 2,
      isFeatured: false,
      isPopular: true,
    },
    {
      name: 'Veg Pulao',
      slug: 'veg-pulao',
      description:
        'Fragrant basmati rice with colourful vegetables — a delightful and aromatic medley that is truly satisfying.',
      price: 120,
      categorySlug: 'rice',
      sortOrder: 3,
      isFeatured: false,
      isPopular: false,
    },
    // ── SPECIAL THALI ────────────────────────────────────────────
    {
      name: 'Special Thali',
      slug: 'special-thali',
      description:
        'A complete meal full of love and satisfaction. Includes: 1 Paneer Sabji, 1 Dal Fry / Aloo Dum, 4 Roti, Jeera Rice, Achar, Papad.',
      price: 215,
      categorySlug: 'special-thali',
      sortOrder: 1,
      isFeatured: true,
      isPopular: true,
    },
    // ── BREAKFAST ────────────────────────────────────────────────
    {
      name: 'Poha',
      slug: 'poha',
      description:
        'Fluffy rice flakes lightly seasoned and garnished — a comforting and flavorful start to your day.',
      price: 99,
      categorySlug: 'breakfast',
      sortOrder: 1,
      isFeatured: false,
      isPopular: true,
    },
    {
      name: 'Bread Roll',
      slug: 'bread-roll',
      description: 'Crispy golden bread rolls filled with spiced potato — a classic morning snack.',
      price: 89,
      categorySlug: 'breakfast',
      sortOrder: 2,
      isFeatured: false,
      isPopular: false,
    },
    {
      name: 'Aloo Sandwich',
      slug: 'aloo-sandwich',
      description:
        'Layers of flavorful mashed potatoes nestled between crispy bread — a warm and satisfying breakfast.',
      price: 89,
      categorySlug: 'breakfast',
      sortOrder: 3,
      isFeatured: false,
      isPopular: false,
    },
    {
      name: 'Aloo And Veggies Sandwich',
      slug: 'aloo-veggies-sandwich',
      description:
        'A wholesome grilled sandwich loaded with spiced potatoes and garden-fresh vegetables.',
      price: 99,
      categorySlug: 'breakfast',
      sortOrder: 4,
      isFeatured: false,
      isPopular: false,
    },
    {
      name: 'Corn And Cheese Sandwich',
      slug: 'corn-cheese-sandwich',
      description:
        'A delightful grilled sandwich filled with sweet corn and melted cheese — a crowd favourite.',
      price: 99,
      categorySlug: 'breakfast',
      sortOrder: 5,
      isFeatured: true,
      isPopular: true,
    },
  ]

  for (const food of foods) {
    const { categorySlug, ...foodData } = food
    await prisma.food.upsert({
      where: { slug: food.slug },
      update: {},
      create: {
        ...foodData,
        categoryId: categoryMap[categorySlug],
        isAvailable: true,
        isVeg: true,
        isDeleted: false,
      },
    })
  }
  console.log(`✅ ${foods.length} food items created`)

  console.log('🎉 Foody Cloud database seeded successfully!')
  console.log(`   Admin email: ${adminEmail}`)
  console.log(`   Admin password: ${adminPassword}`)
  console.log('   ⚠️  Change the admin password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

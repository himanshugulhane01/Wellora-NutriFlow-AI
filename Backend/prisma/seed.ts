import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding NutriFlow AI database...\n');

  // ─── Clean existing data ───────────────────────────────────────────────────
  await prisma.chatMessage.deleteMany();
  await prisma.mealSlot.deleteMany();
  await prisma.mealPlan.deleteMany();
  await prisma.nutritionLog.deleteMany();
  await prisma.orderTracking.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.groceryItem.deleteMany();
  await prisma.groceryOrder.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.groceryProduct.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.healthProfile.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // ─── Demo Users ───────────────────────────────────────────────────────────
  const hashedPw = await bcrypt.hash('password123', 12);

  const customer = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@nutriflow.ai',
      password: hashedPw,
      phone: '+91 9876543210',
      role: 'CUSTOMER',
      healthProfile: {
        create: {
          age: 28,
          heightCm: 162,
          weightKg: 68,
          targetWeightKg: 60,
          fitnessGoal: 'PCOS Relief',
          dailyCalorieTarget: 1600,
          diseases: JSON.stringify(['PCOS', 'Mild Insulin Sensitivity']),
          activityLevel: 'Moderate',
          dietaryPreference: 'Vegetarian',
          bmi: 25.9,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@nutriflow.ai',
      password: hashedPw,
      role: 'ADMIN',
    },
  });

  console.log('✅ Users created');

  // ─── Restaurants ──────────────────────────────────────────────────────────
  const restaurants = await Promise.all([
    prisma.restaurant.create({
      data: {
        name: 'GreenBowl Kitchen',
        description: 'Healthy, whole-food meals crafted for your wellness goals',
        cuisine: 'Health Food',
        rating: 4.8,
        deliveryMin: 25,
        deliveryMax: 35,
        deliveryFee: 0,
        minOrder: 200,
        tags: JSON.stringify(['PCOS-Friendly', 'Diabetic Safe', 'Keto', 'Vegan']),
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        totalOrders: 2840,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: 'The Protein Factory',
        description: 'High-protein meals for active lifestyles and fitness goals',
        cuisine: 'Fitness Food',
        rating: 4.7,
        deliveryMin: 30,
        deliveryMax: 45,
        deliveryFee: 30,
        minOrder: 299,
        tags: JSON.stringify(['High-Protein', 'Muscle Gain', 'Post-Workout', 'Low-Carb']),
        imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
        totalOrders: 1950,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: 'Sattvic Soul',
        description: 'Traditional Ayurvedic recipes reimagined for modern nutrition',
        cuisine: 'Ayurvedic',
        rating: 4.9,
        deliveryMin: 35,
        deliveryMax: 50,
        deliveryFee: 0,
        minOrder: 250,
        tags: JSON.stringify(['Ayurvedic', 'Sattvic', 'Gut Health', 'Immunity']),
        imageUrl: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400',
        totalOrders: 3210,
      },
    }),
    prisma.restaurant.create({
      data: {
        name: 'Keto Corner',
        description: 'Premium ketogenic meals with zero compromises on taste',
        cuisine: 'Keto',
        rating: 4.6,
        deliveryMin: 20,
        deliveryMax: 35,
        deliveryFee: 49,
        minOrder: 399,
        tags: JSON.stringify(['Keto', 'Low-Carb', 'Diabetes Control', 'Weight Loss']),
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
        totalOrders: 1640,
      },
    }),
  ]);

  console.log('✅ Restaurants created');

  // ─── Meals ────────────────────────────────────────────────────────────────
  const mealData = [
    // GreenBowl Kitchen
    {
      restaurantId: restaurants[0].id,
      name: 'PCOS Healing Bowl',
      description: 'Quinoa, roasted veggies, chickpeas, tahini drizzle — anti-inflammatory powerhouse',
      price: 299,
      category: 'Lunch',
      tags: JSON.stringify(['PCOS-Friendly', 'Low-GI', 'Anti-Inflammatory']),
      isVeg: true,
      calories: 420,
      protein: 18,
      carbs: 52,
      fat: 12,
      fiber: 9,
      sugar: 6,
      sodium: 380,
      glycemicIndex: 38,
      healthScore: 9.5,
      aiHealthTag: 'Best for PCOS',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    },
    {
      restaurantId: restaurants[0].id,
      name: 'Green Power Smoothie Bowl',
      description: 'Spirulina, banana, spinach, mixed berries, chia seeds, granola topping',
      price: 199,
      category: 'Breakfast',
      tags: JSON.stringify(['Low-GI', 'Iron-Rich', 'Antioxidant']),
      isVeg: true,
      calories: 310,
      protein: 9,
      carbs: 58,
      fat: 5,
      fiber: 8,
      sugar: 22,
      sodium: 120,
      glycemicIndex: 42,
      healthScore: 9.2,
      aiHealthTag: 'Iron & Antioxidant Boost',
      imageUrl: 'https://images.unsplash.com/photo-1494597706938-bbdc97c27428?w=400',
    },
    {
      restaurantId: restaurants[0].id,
      name: 'Mediterranean Lentil Soup',
      description: 'Red lentils, tomato, spinach, cumin, lemon — Mediterranean healing bowl',
      price: 180,
      category: 'Dinner',
      tags: JSON.stringify(['High-Fiber', 'Low-Fat', 'Diabetic Safe']),
      isVeg: true,
      calories: 280,
      protein: 16,
      carbs: 42,
      fat: 4,
      fiber: 12,
      sugar: 5,
      sodium: 290,
      glycemicIndex: 32,
      healthScore: 9.6,
      aiHealthTag: 'Diabetic Safe',
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    },
    {
      restaurantId: restaurants[0].id,
      name: 'Avocado Toast Deluxe',
      description: 'Multigrain toast, smashed avocado, microgreens, cherry tomatoes, hemp seeds',
      price: 249,
      category: 'Breakfast',
      tags: JSON.stringify(['Heart-Healthy', 'Good-Fats', 'Low-GI']),
      isVeg: true,
      calories: 385,
      protein: 11,
      carbs: 38,
      fat: 22,
      fiber: 10,
      sugar: 3,
      sodium: 310,
      glycemicIndex: 45,
      healthScore: 9.0,
      aiHealthTag: 'Heart Healthy',
      imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400',
    },
    // The Protein Factory
    {
      restaurantId: restaurants[1].id,
      name: 'Paneer Power Bowl',
      description: 'Grilled paneer 200g, brown rice, stir-fried broccoli, protein gravy',
      price: 349,
      category: 'Lunch',
      tags: JSON.stringify(['High-Protein', 'Muscle Gain', 'Post-Workout']),
      isVeg: true,
      calories: 520,
      protein: 38,
      carbs: 45,
      fat: 18,
      fiber: 6,
      sugar: 4,
      sodium: 420,
      glycemicIndex: 50,
      healthScore: 8.8,
      aiHealthTag: 'Muscle Building',
      imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400',
    },
    {
      restaurantId: restaurants[1].id,
      name: 'Egg White Scramble',
      description: '6 egg whites, sautéed mushrooms, spinach, whole wheat toast — 35g protein',
      price: 219,
      category: 'Breakfast',
      tags: JSON.stringify(['High-Protein', 'Low-Carb', 'Fat-Loss']),
      isVeg: false,
      calories: 280,
      protein: 35,
      carbs: 18,
      fat: 6,
      fiber: 3,
      sugar: 2,
      sodium: 380,
      glycemicIndex: 40,
      healthScore: 9.1,
      aiHealthTag: 'High Protein Breakfast',
      imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400',
    },
    // Sattvic Soul
    {
      restaurantId: restaurants[2].id,
      name: 'Sattvic Thali',
      description: 'Dal, sabzi, brown rice, roti, raita, seasonal pickle — complete Ayurvedic meal',
      price: 270,
      category: 'Lunch',
      tags: JSON.stringify(['Ayurvedic', 'Balanced', 'Gut Health']),
      isVeg: true,
      calories: 480,
      protein: 20,
      carbs: 72,
      fat: 10,
      fiber: 11,
      sugar: 8,
      sodium: 450,
      glycemicIndex: 48,
      healthScore: 9.3,
      aiHealthTag: 'Ayurvedic Balance',
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    },
    {
      restaurantId: restaurants[2].id,
      name: 'Golden Milk Chia Pudding',
      description: 'Chia seeds soaked in turmeric milk, mango compote, pistachio crumble',
      price: 150,
      category: 'Snack',
      tags: JSON.stringify(['Anti-Inflammatory', 'Gut Health', 'Immunity']),
      isVeg: true,
      calories: 220,
      protein: 7,
      carbs: 28,
      fat: 9,
      fiber: 10,
      sugar: 14,
      sodium: 80,
      glycemicIndex: 30,
      healthScore: 9.4,
      aiHealthTag: 'Immunity Boost',
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    },
    // Keto Corner
    {
      restaurantId: restaurants[3].id,
      name: 'Keto Cauliflower Steak',
      description: 'Roasted cauliflower steak, pesto, sun-dried tomatoes, almond flakes',
      price: 329,
      category: 'Dinner',
      tags: JSON.stringify(['Keto', 'Low-Carb', 'Diabetes Control']),
      isVeg: true,
      calories: 340,
      protein: 14,
      carbs: 8,
      fat: 28,
      fiber: 6,
      sugar: 3,
      sodium: 350,
      glycemicIndex: 15,
      healthScore: 9.0,
      aiHealthTag: 'Keto Certified',
      imageUrl: 'https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d?w=400',
    },
    {
      restaurantId: restaurants[3].id,
      name: 'Fat Bomb Energy Balls',
      description: 'Almond butter, coconut oil, dark chocolate, flaxseeds — 3 pieces',
      price: 120,
      category: 'Snack',
      tags: JSON.stringify(['Keto', 'High-Fat', 'Energy']),
      isVeg: true,
      calories: 180,
      protein: 5,
      carbs: 4,
      fat: 16,
      fiber: 3,
      sugar: 1,
      sodium: 60,
      glycemicIndex: 10,
      healthScore: 8.5,
      aiHealthTag: 'Keto Snack',
      imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
    },
  ];

  await prisma.meal.createMany({ data: mealData });
  console.log('✅ Meals created');

  // ─── Grocery Products ─────────────────────────────────────────────────────
  const groceryData = [
    { name: 'Organic Spinach', brand: 'FarmFresh', category: 'Vegetables', price: 49, unit: 'pack', isOrganic: true, calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, healthTag: 'PCOS Friendly', stock: 200 },
    { name: 'Quinoa', brand: 'Organic India', category: 'Grains', price: 299, unit: 'kg', isOrganic: true, calories: 368, protein: 14, carbs: 64, fat: 6, fiber: 7, healthTag: 'Diabetic Safe', stock: 150 },
    { name: 'Almond Milk', brand: 'So Good', category: 'Dairy', price: 149, unit: 'L', isOrganic: false, calories: 40, protein: 1.5, carbs: 3, fat: 2.5, fiber: 0, healthTag: 'Lactose Free', stock: 100 },
    { name: 'Chia Seeds', brand: 'Neuherbs', category: 'Grains', price: 199, unit: 'pack', isOrganic: true, calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, healthTag: 'PCOS Friendly', stock: 180 },
    { name: 'Broccoli', brand: 'FarmFresh', category: 'Vegetables', price: 79, unit: 'kg', isOrganic: false, calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, healthTag: 'Keto Friendly', stock: 120 },
    { name: 'Greek Yogurt', brand: 'Epigamia', category: 'Dairy', price: 89, unit: 'pack', isOrganic: false, calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, healthTag: 'High Protein', stock: 90 },
    { name: 'Avocado', brand: 'Fresh Harvest', category: 'Fruits', price: 120, unit: 'pack', isOrganic: false, calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, healthTag: 'Heart Healthy', stock: 60 },
    { name: 'Almonds Raw', brand: 'Happilo', category: 'Proteins', price: 449, unit: 'kg', isOrganic: false, calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, healthTag: 'Diabetic Safe', stock: 200 },
    { name: 'Flaxseeds', brand: 'True Elements', category: 'Grains', price: 129, unit: 'pack', isOrganic: true, calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27, healthTag: 'PCOS Friendly', stock: 150 },
    { name: 'Turmeric Powder', brand: 'Organic India', category: 'Grains', price: 99, unit: 'pack', isOrganic: true, calories: 312, protein: 9, carbs: 67, fat: 3.3, fiber: 21, healthTag: 'Anti-Inflammatory', stock: 300 },
    { name: 'Blueberries', brand: 'Fresh Harvest', category: 'Fruits', price: 249, unit: 'pack', isOrganic: false, calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, healthTag: 'Antioxidant', stock: 80 },
    { name: 'Paneer Low-Fat', brand: 'Amul', category: 'Dairy', price: 89, unit: 'pack', isOrganic: false, calories: 260, protein: 20, carbs: 3, fat: 18, fiber: 0, healthTag: 'High Protein', stock: 100 },
  ];

  await prisma.groceryProduct.createMany({ data: groceryData });
  console.log('✅ Grocery products created');

  // ─── Doctors ──────────────────────────────────────────────────────────────
  const doctorData = [
    {
      name: 'Dr. Ananya Krishnan',
      specialty: 'Clinical Nutritionist',
      qualification: 'MSc Nutrition, RD',
      experience: 8,
      rating: 4.9,
      fee: 599,
      bio: 'Specializes in PCOS, hormonal imbalances, and women\'s metabolic health. Helped 2000+ patients reverse insulin resistance through personalized nutrition.',
      languages: JSON.stringify(['English', 'Hindi', 'Tamil']),
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    },
    {
      name: 'Dr. Rajesh Mehta',
      specialty: 'Endocrinologist',
      qualification: 'MBBS, MD Endocrinology',
      experience: 14,
      rating: 4.8,
      fee: 899,
      bio: 'Expert in Type-2 Diabetes management, thyroid disorders, and metabolic syndrome. Research published in Lancet and NEJM.',
      languages: JSON.stringify(['English', 'Hindi', 'Gujarati']),
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    },
    {
      name: 'Dr. Meera Nair',
      specialty: 'Dietitian & Sports Nutritionist',
      qualification: 'BSc Dietetics, CSSD',
      experience: 6,
      rating: 4.7,
      fee: 499,
      bio: 'Certified Sports Dietitian working with athletes and fitness enthusiasts. Expert in muscle gain, fat loss, and performance nutrition.',
      languages: JSON.stringify(['English', 'Hindi', 'Malayalam']),
      imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    },
    {
      name: 'Dr. Vikram Patel',
      specialty: 'Ayurvedic Physician',
      qualification: 'BAMS, MD Ayurveda',
      experience: 12,
      rating: 4.9,
      fee: 699,
      bio: 'Blends traditional Ayurvedic wisdom with modern nutrition science. Specializes in gut health, immunity, and lifestyle diseases.',
      languages: JSON.stringify(['English', 'Hindi', 'Marathi']),
      imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    },
  ];

  await prisma.doctor.createMany({ data: doctorData });
  console.log('✅ Doctors created');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Demo Accounts:');
  console.log('  Customer: priya@nutriflow.ai / password123');
  console.log('  Admin:    admin@nutriflow.ai / password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

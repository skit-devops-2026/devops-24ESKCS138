import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ Error: MONGODB_URI not found in server/.env');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas successfully.');

    // Clear existing collections
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing collections.');

    // Create Demo Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password@123', salt);

    const farmerUser = await User.create({
      name: 'Ramesh Patel (Farmer)',
      email: 'farmer@kisanmarket.com',
      password: hashedPassword,
      role: 'farmer',
      phone: '+91 98765 43210',
      location: 'Punjab Mandi',
    });

    const buyerUser = await User.create({
      name: 'Aditi Sharma (Buyer)',
      email: 'buyer@kisanmarket.com',
      password: hashedPassword,
      role: 'buyer',
      phone: '+91 98765 11223',
      location: 'Jaipur, Rajasthan',
    });

    console.log('Created demo users: farmer@kisanmarket.com & buyer@kisanmarket.com');

    // Create Initial Produce Catalog
    const initialProducts = [
      {
        name: 'Organic Wheat',
        category: 'Grains',
        price: 45,
        unit: 'kg',
        stock: 500,
        farmer: farmerUser.name,
        farmerId: farmerUser._id,
        location: 'Punjab Mandi',
        description: 'Freshly harvested, unpolished premium organic wheat direct from farm.',
        icon: '🌾',
        available: true,
      },
      {
        name: 'Fresh Tomatoes',
        category: 'Vegetables',
        price: 35,
        unit: 'kg',
        stock: 120,
        farmer: 'Suresh Kumar',
        farmerId: farmerUser._id,
        location: 'Nashik Mandi',
        description: 'Naturally ripened, juicy farm-grown red tomatoes.',
        icon: '🍅',
        available: true,
      },
      {
        name: 'Fresh Potatoes',
        category: 'Vegetables',
        price: 30,
        unit: 'kg',
        stock: 300,
        farmer: 'Harish Verma',
        farmerId: farmerUser._id,
        location: 'Agra Mandi',
        description: 'High-quality soil-grown potatoes, ideal for everyday cooking.',
        icon: '🥔',
        available: true,
      },
      {
        name: 'Premium Basmati Rice',
        category: 'Grains',
        price: 60,
        unit: 'kg',
        stock: 450,
        farmer: 'Gurpreet Singh',
        farmerId: farmerUser._id,
        location: 'Haryana Mandi',
        description: 'Aromatic long-grain premium basmati rice directly from farmers.',
        icon: '🍚',
        available: true,
      },
      {
        name: 'Fresh Mountain Apples',
        category: 'Fruits',
        price: 120,
        unit: 'kg',
        stock: 80,
        farmer: 'Anil Sharma',
        farmerId: farmerUser._id,
        location: 'Himachal Orchard',
        description: 'Crisp and sweet organic mountain apples harvested this week.',
        icon: '🍎',
        available: true,
      },
      {
        name: 'Moong Dal',
        category: 'Pulses',
        price: 110,
        unit: 'kg',
        stock: 150,
        farmer: 'Balwant Yadav',
        farmerId: farmerUser._id,
        location: 'MP Mandi',
        description: 'Cleaned and unpolished yellow moong dal packed with protein.',
        icon: '🫘',
        available: true,
      },
      {
        name: 'Pure Desi Cow Milk',
        category: 'Dairy',
        price: 75,
        unit: 'L',
        stock: 60,
        farmer: 'Radheshyam Dairy',
        farmerId: farmerUser._id,
        location: 'Vrindavan Farms',
        description: 'Fresh, organic raw A2 Desi cow milk packaged with hygiene.',
        icon: '🥛',
        available: true,
      },
      {
        name: 'Cold-Pressed Mustard Oil',
        category: 'Organic',
        price: 190,
        unit: 'L',
        stock: 40,
        farmer: farmerUser.name,
        farmerId: farmerUser._id,
        location: 'Alwar Organic Press',
        description: 'Traditional wood-pressed virgin mustard oil with rich aroma.',
        icon: '🌱',
        available: true,
      },
    ];

    const insertedProducts = await Product.insertMany(initialProducts);
    console.log(`Inserted ${insertedProducts.length} agricultural produce items.`);

    // Create Initial Demo Order
    await Order.create({
      buyer: buyerUser._id,
      buyerName: buyerUser.name,
      buyerPhone: buyerUser.phone,
      deliveryAddress: 'Flat 402, Green Valley Apts, Jaipur',
      items: [
        {
          product: insertedProducts[0]._id,
          productName: insertedProducts[0].name,
          price: insertedProducts[0].price,
          quantity: 10,
          unit: insertedProducts[0].unit,
        },
      ],
      totalAmount: 450,
      status: 'confirmed',
    });

    console.log('Created initial demo order.');
    console.log('🌾 Kisan Market database seeding completed successfully!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();

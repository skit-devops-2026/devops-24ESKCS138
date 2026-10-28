import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { isDbConnected } from '../config/db.js';

// In-memory initial data for immediate local development / fallback
let memoryProducts = [
  {
    id: '1',
    name: 'Organic Wheat',
    category: 'Grains',
    price: 45,
    unit: 'kg',
    stock: 500,
    farmer: 'Ramesh Patel',
    location: 'Punjab Mandi',
    description: 'Freshly harvested, unpolished premium organic wheat direct from farm.',
    icon: '🌾',
    available: true,
  },
  {
    id: '2',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: 35,
    unit: 'kg',
    stock: 120,
    farmer: 'Suresh Kumar',
    location: 'Nashik Mandi',
    description: 'Naturally ripened, juicy farm-grown red tomatoes.',
    icon: '🍅',
    available: true,
  },
  {
    id: '3',
    name: 'Fresh Potatoes',
    category: 'Vegetables',
    price: 30,
    unit: 'kg',
    stock: 300,
    farmer: 'Harish Verma',
    location: 'Agra Mandi',
    description: 'High-quality soil-grown potatoes, ideal for everyday cooking.',
    icon: '🥔',
    available: true,
  },
  {
    id: '4',
    name: 'Premium Rice',
    category: 'Grains',
    price: 60,
    unit: 'kg',
    stock: 450,
    farmer: 'Gurpreet Singh',
    location: 'Haryana Mandi',
    description: 'Aromatic long-grain premium basmati rice directly from farmers.',
    icon: '🍚',
    available: true,
  },
  {
    id: '5',
    name: 'Fresh Apples',
    category: 'Fruits',
    price: 120,
    unit: 'kg',
    stock: 80,
    farmer: 'Anil Sharma',
    location: 'Himachal Orchard',
    description: 'Crisp and sweet organic mountain apples harvested this week.',
    icon: '🍎',
    available: true,
  },
  {
    id: '6',
    name: 'Moong Dal',
    category: 'Pulses',
    price: 110,
    unit: 'kg',
    stock: 150,
    farmer: 'Balwant Yadav',
    location: 'MP Mandi',
    description: 'Cleaned and unpolished yellow moong dal packed with protein.',
    icon: '🫘',
    available: true,
  },
];

// Helper to determine icon based on category
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Vegetables':
      return '🥦';
    case 'Fruits':
      return '🍎';
    case 'Grains':
      return '🌾';
    case 'Pulses':
      return '🫘';
    case 'Organic':
      return '🌱';
    case 'Dairy':
      return '🥛';
    default:
      return '🌾';
  }
};

// @desc    Get all products (with optional ?category= and ?search=)
// @route   GET /api/products
export const getAllProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    if (isDbConnected()) {
      const query = {};

      if (category && category.toLowerCase() !== 'all categories' && category.toLowerCase() !== 'all') {
        query.category = new RegExp(`^${category}$`, 'i');
      }

      if (search && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ name: regex }, { description: regex }];
      }

      const products = await Product.find(query).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: products.length,
        source: 'mongodb',
        data: products,
      });
    }

    // In-memory fallback
    let results = [...memoryProducts];

    if (category && category.toLowerCase() !== 'all categories' && category.toLowerCase() !== 'all') {
      results = results.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      results = results.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      count: results.length,
      source: 'local_memory',
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
          success: false,
          message: `Invalid product ID: ${id}`,
        });
      }

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${id} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        data: product,
      });
    }

    // In-memory fallback
    const product = memoryProducts.find(
      (p) => String(p.id) === String(id) || String(p._id) === String(id)
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product listing
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, category, price, unit, stock, description, location, farmer } = req.body;

    // Validation
    if (!name || !category || price === undefined || price === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide product name, category, and price',
      });
    }

    const numPrice = Number(price);
    const numStock = stock !== undefined && stock !== '' ? Number(stock) : 10;

    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number',
      });
    }

    const icon = getCategoryIcon(category);

    if (isDbConnected()) {
      const newProduct = await Product.create({
        name: name.trim(),
        category,
        price: numPrice,
        unit: unit || 'kg',
        stock: numStock,
        description: description ? description.trim() : '',
        location: location || 'Direct Farm',
        farmer: farmer || 'Verified Farmer',
        icon,
      });

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct,
      });
    }

    // In-memory fallback
    const newProduct = {
      id: String(Date.now()),
      name: name.trim(),
      category,
      price: numPrice,
      unit: unit || 'kg',
      stock: numStock,
      description: description ? description.trim() : '',
      location: location || 'Direct Farm',
      farmer: farmer || 'Verified Farmer',
      icon,
      available: true,
      createdAt: new Date().toISOString(),
    };

    memoryProducts.unshift(newProduct);

    res.status(201).json({
      success: true,
      message: 'Product created successfully (stored in local store)',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product listing
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
          success: false,
          message: `Invalid product ID: ${id}`,
        });
      }

      if (req.body.category) {
        req.body.icon = getCategoryIcon(req.body.category);
      }

      const updated = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${id} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updated,
      });
    }

    // In-memory fallback
    const index = memoryProducts.findIndex(
      (p) => String(p.id) === String(id) || String(p._id) === String(id)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found`,
      });
    }

    const current = memoryProducts[index];
    const category = req.body.category || current.category;

    memoryProducts[index] = {
      ...current,
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : current.price,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : current.stock,
      icon: getCategoryIcon(category),
      updatedAt: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: memoryProducts[index],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product listing
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
          success: false,
          message: `Invalid product ID: ${id}`,
        });
      }

      const deleted = await Product.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${id} not found`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        data: { id },
      });
    }

    // In-memory fallback
    const index = memoryProducts.findIndex(
      (p) => String(p.id) === String(id) || String(p._id) === String(id)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found`,
      });
    }

    memoryProducts.splice(index, 1);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

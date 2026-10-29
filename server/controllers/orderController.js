import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { isDbConnected } from '../config/db.js';

// In-memory order store for fallback
let memoryOrders = [
  {
    id: 'ord_101',
    buyerName: 'Amit Verma',
    buyerEmail: 'amit@gmail.com',
    buyerPhone: '+91 98765 11111',
    deliveryAddress: 'Flat 402, Green Valley Apts, Delhi',
    items: [
      {
        product: '1',
        productName: 'Organic Wheat',
        price: 45,
        quantity: 10,
        unit: 'kg',
      },
    ],
    totalAmount: 450,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'ord_102',
    buyerName: 'Pooja Sharma',
    buyerEmail: 'pooja@gmail.com',
    buyerPhone: '+91 98765 22222',
    deliveryAddress: 'B-12 Malviya Nagar, Jaipur',
    items: [
      {
        product: '2',
        productName: 'Fresh Tomatoes',
        price: 35,
        quantity: 5,
        unit: 'kg',
      },
    ],
    totalAmount: 175,
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

// @desc    Create a new order (buyer checkout)
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, buyerName, buyerPhone } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    if (!deliveryAddress || deliveryAddress.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide delivery address',
      });
    }

    const customerName = req.user ? req.user.name : buyerName || 'Direct Buyer';
    const customerId = req.user ? req.user.id || req.user._id : null;

    let serverCalculatedTotal = 0;
    const validatedItems = [];

    // Validate each item and calculate server-side total
    for (const item of items) {
      const { productId, quantity } = item;
      const numQty = Number(quantity);

      if (!productId || isNaN(numQty) || numQty <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item quantity or product ID in order request',
        });
      }

      if (isDbConnected()) {
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product with ID ${productId} not found`,
          });
        }

        if (product.stock < numQty) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${product.stock} ${product.unit}`,
          });
        }

        // Deduct stock
        product.stock -= numQty;
        await product.save();

        const itemSubtotal = product.price * numQty;
        serverCalculatedTotal += itemSubtotal;

        validatedItems.push({
          product: product._id,
          productName: product.name,
          price: product.price,
          quantity: numQty,
          unit: product.unit,
        });
      } else {
        // Fallback: estimate price from item or default 50
        const price = item.price || 50;
        serverCalculatedTotal += price * numQty;
        validatedItems.push({
          product: productId,
          productName: item.productName || 'Farm Crop',
          price,
          quantity: numQty,
          unit: item.unit || 'kg',
        });
      }
    }

    if (isDbConnected()) {
      const order = await Order.create({
        buyer: customerId,
        buyerName: customerName,
        items: validatedItems,
        totalAmount: serverCalculatedTotal,
        deliveryAddress: deliveryAddress.trim(),
        status: 'pending',
      });

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: order,
      });
    }

    // In-memory fallback
    const newOrder = {
      id: `ord_${Date.now()}`,
      buyer: customerId,
      buyerName: customerName,
      buyerPhone: buyerPhone || '',
      deliveryAddress: deliveryAddress.trim(),
      items: validatedItems,
      totalAmount: serverCalculatedTotal,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    memoryOrders.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully (simulated/saved)',
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order history for logged-in buyer
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (isDbConnected()) {
      const orders = await Order.find({ buyer: userId }).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    }

    // Return in-memory orders
    res.status(200).json({
      success: true,
      count: memoryOrders.length,
      data: memoryOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders relevant to farmer
// @route   GET /api/orders/farmer-orders
export const getFarmerOrders = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    }

    res.status(200).json({
      success: true,
      count: memoryOrders.length,
      data: memoryOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (farmer order fulfillment)
// @route   PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid order ID' });
      }

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      order.status = status;
      await order.save();

      return res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        data: order,
      });
    }

    // In-memory fallback
    const order = memoryOrders.find(
      (o) => String(o.id) === String(id) || String(o._id) === String(id)
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

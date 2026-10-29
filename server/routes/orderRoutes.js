import express from 'express';
import {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

// Order endpoints
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/farmer-orders', getFarmerOrders);
router.patch('/:id/status', updateOrderStatus);

export default router;

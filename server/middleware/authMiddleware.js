import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kisan_market_jwt_secret_dev_key_2026';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      if (isDbConnected()) {
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'User belonging to this token no longer exists',
          });
        }
        req.user = user;
      } else {
        // Fallback user from decoded token payload
        req.user = {
          id: decoded.id,
          name: decoded.name || 'Demo User',
          email: decoded.email,
          role: decoded.role,
        };
      }

      return next();
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

// Grant access to specific roles (e.g. 'farmer' or 'buyer')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user?.role || 'guest'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

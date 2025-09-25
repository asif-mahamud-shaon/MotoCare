import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  return next();
};

export const requireShopOrVendor = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!['SHOP', 'VENDOR', 'ADMIN'].includes(req.user?.role || '')) {
    return res.status(403).json({
      success: false,
      message: 'Shop or Vendor access required'
    });
  }
  return next();
};

export const requireOwnerOrAbove = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!['OWNER', 'SHOP', 'VENDOR', 'ADMIN'].includes(req.user?.role || '')) {
    return res.status(403).json({
      success: false,
      message: 'Owner access or higher required'
    });
  }
  return next();
};

export const requireOwnerOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  if (userRole === 'ADMIN') {
    return next();
  }

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Check if user owns the resource
  prisma.car.findUnique({
    where: { id },
    select: { userId: true }
  }).then(car => {
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    if (car.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    return next();
  }).catch(error => {
    return res.status(500).json({
      success: false,
      message: 'Error checking ownership'
    });
  });
};

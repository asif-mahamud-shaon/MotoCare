import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { prisma } from '../lib/prisma';
import { authenticateToken, requireOwnerOrAdmin } from '../middleware/auth';
import { uploadMultiple, handleUploadError } from '../middleware/upload';

const router = express.Router();

// Get all cars with pagination and filters
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('brand').optional().isString().withMessage('Brand must be a string'),
  query('condition').optional().isIn(['NEW', 'RECONDITIONED', 'PRE_OWNED']).withMessage('Invalid condition'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
  query('approved').optional().isBoolean().withMessage('Approved must be a boolean'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 12,
      brand,
      condition,
      minPrice,
      maxPrice,
      year,
      approved = true
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where clause
    const where: any = {};

    if (brand) where.brand = { contains: brand as string, mode: 'insensitive' };
    if (condition) where.condition = condition;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (year) where.year = Number(year);
    if (approved !== undefined) where.approved = approved === 'true';

    // Get cars with pagination
    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              gallery: true
            }
          }
        }
      }),
      prisma.car.count({ where })
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
      success: true,
      data: {
        cars,
        pagination: {
          page: Number(page),
          limit: take,
          total,
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single car
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        gallery: true
      }
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.json({
      success: true,
      data: car
    });
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new car
router.post('/', authenticateToken, uploadMultiple, handleUploadError, [
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year required'),
  body('condition').isIn(['NEW', 'RECONDITIONED', 'PRE_OWNED']).withMessage('Valid condition required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  body('description').optional().isString().withMessage('Description must be a string'),
], async (req: any, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { brand, model, year, condition, price, description } = req.body;
    const userId = req.user.id;

    // Handle uploaded images
    const images = req.files ? req.files.map((file: any) => `/uploads/${file.filename}`) : [];

    const car = await prisma.car.create({
      data: {
        brand,
        model,
        year: Number(year),
        condition,
        price: Number(price),
        description,
        images,
        userId,
        approved: false // New cars need approval
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: car
    });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update car
router.put('/:id', authenticateToken, requireOwnerOrAdmin, uploadMultiple, handleUploadError, [
  body('brand').optional().trim().notEmpty().withMessage('Brand cannot be empty'),
  body('model').optional().trim().notEmpty().withMessage('Model cannot be empty'),
  body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year required'),
  body('condition').optional().isIn(['NEW', 'RECONDITIONED', 'PRE_OWNED']).withMessage('Valid condition required'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Valid price required'),
  body('description').optional().isString().withMessage('Description must be a string'),
], async (req: any, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { brand, model, year, condition, price, description } = req.body;

    // Handle uploaded images
    const newImages = req.files ? req.files.map((file: any) => `/uploads/${file.filename}`) : [];

    const updateData: any = {};
    if (brand) updateData.brand = brand;
    if (model) updateData.model = model;
    if (year) updateData.year = Number(year);
    if (condition) updateData.condition = condition;
    if (price) updateData.price = Number(price);
    if (description !== undefined) updateData.description = description;
    if (newImages.length > 0) updateData.images = newImages;

    const car = await prisma.car.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Car updated successfully',
      data: car
    });
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete car
router.delete('/:id', authenticateToken, requireOwnerOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.car.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's cars
router.get('/user/my-cars', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 12 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              gallery: true
            }
          }
        }
      }),
      prisma.car.count({ where: { userId } })
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
      success: true,
      data: {
        cars,
        pagination: {
          page: Number(page),
          limit: take,
          total,
          totalPages,
          hasNext: Number(page) < totalPages,
          hasPrev: Number(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user cars error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;

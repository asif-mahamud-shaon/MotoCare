import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { uploadSingle, handleUploadError } from '../middleware/upload';

const router = express.Router();

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [images, total] = await Promise.all([
      prisma.gallery.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          car: {
            select: {
              id: true,
              brand: true,
              model: true,
              year: true
            }
          }
        }
      }),
      prisma.gallery.count()
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
      success: true,
      data: {
        images,
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
    console.error('Get gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload image to gallery
router.post('/', authenticateToken, uploadSingle, handleUploadError, [
  body('carId').isString().withMessage('Car ID is required'),
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

    const { carId } = req.body;
    const userId = req.user.id;

    // Check if car exists and user owns it
    const car = await prisma.car.findFirst({
      where: {
        id: carId,
        userId: userId
      }
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found or you do not own this car'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const galleryImage = await prisma.gallery.create({
      data: {
        imageUrl,
        carId
      },
      include: {
        car: {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded to gallery successfully',
      data: galleryImage
    });
  } catch (error) {
    console.error('Upload gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete gallery image
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if image exists and user owns the associated car
    const galleryImage = await prisma.gallery.findUnique({
      where: { id },
      include: {
        car: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!galleryImage) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found'
      });
    }

    if (galleryImage.car.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this image'
      });
    }

    await prisma.gallery.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;

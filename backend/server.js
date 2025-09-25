const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = 5000;
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'OWNER', phone, address, businessName, businessType, licenseNumber } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        address,
        businessName,
        businessType,
        licenseNumber,
        isVerified: role === 'OWNER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        businessName: true,
        businessType: true,
        licenseNumber: true,
        isVerified: true,
        createdAt: true
      }
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user, token }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Return user data (without password)
    const { password: _, ...userData } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: { user: userData, token }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        businessName: true,
        businessType: true,
        licenseNumber: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            cars: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Cars API
app.get('/api/cars', async (req, res) => {
  try {
    const { page = 1, limit = 12, brand = '', condition = '', minPrice = '', maxPrice = '', year = '' } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    
    // Build where clause
    const where = {};
    if (brand) where.brand = { contains: brand, mode: 'insensitive' };
    if (condition) where.condition = condition;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice);
      if (maxPrice) where.price.lte = parseInt(maxPrice);
    }
    if (year) where.year = parseInt(year);
    
    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          gallery: {
            select: {
              id: true,
              imageUrl: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.car.count({ where })
    ]);
    
    const totalPages = Math.ceil(total / take);
    
    res.json({
      success: true,
      data: {
        cars,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
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

app.get('/api/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching car with ID:', id);
    
    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            businessName: true,
            businessType: true,
            address: true
          }
        },
        gallery: {
          select: {
            id: true,
            imageUrl: true
          }
        }
      }
    });
    
    if (!car) {
      console.log('Car not found for ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    console.log('Car found:', car.brand, car.model);
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

// Create Car API
app.post('/api/cars', upload.array('images', 10), async (req, res) => {
  try {
    console.log('Received car data:', req.body);
    console.log('Received files:', req.files);
    
    const { brand, model, year, condition, price, description, userId } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.originalname}`) : [];

    // Validate required fields
    if (!brand || !model || !year || !condition || !price || !description) {
      console.log('Validation failed - Missing fields:', {
        brand: !!brand,
        model: !!model,
        year: !!year,
        condition: !!condition,
        price: !!price,
        description: !!description
      });
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create car
    const car = await prisma.car.create({
      data: {
        brand,
        model,
        year: parseInt(year),
        condition,
        price: parseInt(price),
        description,
        images: images || [],
        userId: userId || 'cmfy7iah000012qbxgl0arnpd', // Default to owner user
        approved: false // New cars need approval
      },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        gallery: { select: { id: true, imageUrl: true } }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Car created successfully',
      data: car
    });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Gallery API
app.get('/api/gallery', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    
    const [images, total] = await Promise.all([
      prisma.gallery.findMany({
        skip,
        take,
        include: {
          car: {
            select: {
              id: true,
              brand: true,
              model: true,
              year: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.gallery.count()
    ]);
    
    res.json({
      success: true,
      data: {
        images,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / take)
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

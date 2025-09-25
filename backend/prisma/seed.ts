import { PrismaClient, Role, Condition } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@motocare.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@motocare.com',
      password: adminPassword,
      role: Role.ADMIN,
      isVerified: true,
    },
  });

  // Create owner user
  const ownerPassword = await bcrypt.hash('owner123', 10);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@motocare.com' },
    update: {},
    create: {
      name: 'John Owner',
      email: 'owner@motocare.com',
      password: ownerPassword,
      role: Role.OWNER,
      phone: '+1-555-0101',
      address: '123 Main St, City, State 12345',
      isVerified: true,
    },
  });

  // Create shop user
  const shopPassword = await bcrypt.hash('shop123', 10);
  const shop = await prisma.user.upsert({
    where: { email: 'shop@motocare.com' },
    update: {},
    create: {
      name: 'Auto Shop Manager',
      email: 'shop@motocare.com',
      password: shopPassword,
      role: Role.SHOP,
      phone: '+1-555-0102',
      address: '456 Auto Ave, City, State 12345',
      businessName: 'Premium Auto Shop',
      businessType: 'Automotive Repair & Sales',
      licenseNumber: 'AUTO-SHOP-2023-001',
      isVerified: true,
    },
  });

  // Create vendor user
  const vendorPassword = await bcrypt.hash('vendor123', 10);
  const vendor = await prisma.user.upsert({
    where: { email: 'vendor@motocare.com' },
    update: {},
    create: {
      name: 'Car Vendor',
      email: 'vendor@motocare.com',
      password: vendorPassword,
      role: Role.VENDOR,
      phone: '+1-555-0103',
      address: '789 Vendor Blvd, City, State 12345',
      businessName: 'Elite Car Vendors',
      businessType: 'Automotive Wholesale',
      licenseNumber: 'VENDOR-2023-001',
      isVerified: true,
    },
  });

  // Create sample cars
  const cars = [
    {
      brand: 'BMW',
      model: 'X5',
      year: 2023,
      condition: Condition.NEW,
      price: 75000,
      description: 'Luxury SUV with premium features and excellent performance.',
      images: ['/uploads/bmw-x5-1.jpg', '/uploads/bmw-x5-2.jpg'],
      userId: owner.id,
      approved: true,
    },
    {
      brand: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2022,
      condition: Condition.RECONDITIONED,
      price: 45000,
      description: 'Elegant sedan with modern technology and comfort.',
      images: ['/uploads/mercedes-c-class-1.jpg', '/uploads/mercedes-c-class-2.jpg'],
      userId: shop.id,
      approved: true,
    },
    {
      brand: 'Audi',
      model: 'A4',
      year: 2021,
      condition: Condition.PRE_OWNED,
      price: 35000,
      description: 'Reliable luxury car with great fuel efficiency.',
      images: ['/uploads/audi-a4-1.jpg', '/uploads/audi-a4-2.jpg'],
      userId: vendor.id,
      approved: true,
    },
    {
      brand: 'Toyota',
      model: 'Camry',
      year: 2023,
      condition: Condition.NEW,
      price: 28000,
      description: 'Dependable sedan perfect for daily commuting.',
      images: ['/uploads/toyota-camry-1.jpg', '/uploads/toyota-camry-2.jpg'],
      userId: shop.id,
      approved: true,
    },
    {
      brand: 'Honda',
      model: 'Civic',
      year: 2022,
      condition: Condition.RECONDITIONED,
      price: 22000,
      description: 'Sporty compact car with excellent resale value.',
      images: ['/uploads/honda-civic-1.jpg', '/uploads/honda-civic-2.jpg'],
      userId: vendor.id,
      approved: false,
    },
    {
      brand: 'Ford',
      model: 'F-150',
      year: 2023,
      condition: Condition.NEW,
      price: 55000,
      description: 'Powerful pickup truck for work and adventure.',
      images: ['/uploads/ford-f150-1.jpg', '/uploads/ford-f150-2.jpg'],
      userId: owner.id,
      approved: true,
    },
  ];

  for (const carData of cars) {
    await prisma.car.create({
      data: carData,
    });
  }

  // Create gallery images
  const galleryImages = [
    { imageUrl: '/uploads/gallery-1.jpg', carId: (await prisma.car.findFirst())?.id || '' },
    { imageUrl: '/uploads/gallery-2.jpg', carId: (await prisma.car.findFirst())?.id || '' },
    { imageUrl: '/uploads/gallery-3.jpg', carId: (await prisma.car.findFirst())?.id || '' },
  ];

  for (const galleryData of galleryImages) {
    if (galleryData.carId) {
      await prisma.gallery.create({
        data: galleryData,
      });
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin user: admin@motocare.com / admin123`);
  console.log(`👤 Owner user: owner@motocare.com / owner123`);
  console.log(`🏪 Shop user: shop@motocare.com / shop123`);
  console.log(`🚗 Vendor user: vendor@motocare.com / vendor123`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

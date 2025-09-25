# MotoCare - Auto Industry Marketplace Platform

A full-stack automotive marketplace platform inspired by Beg Autos, built with Next.js, Express, and PostgreSQL.

## 🚀 Features

- **Frontend**: Next.js + TypeScript + TailwindCSS + DaisyUI
- **Backend**: Node.js + Express + TypeScript + PostgreSQL + Prisma
- **Authentication**: JWT-based auth with role-based access control (Owner, Shop, Vendor, Admin)
- **Image Upload**: Multer for handling car image uploads
- **Admin Dashboard**: Manage cars, users, and approve listings
- **Responsive Design**: Mobile-first luxury automotive UI

## 📁 Project Structure

```
MotoCare/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
├── docs/             # Documentation and API specs
└── package.json      # Root package.json for scripts
```

## 🛠 Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd MotoCare
   npm run install:all
   ```

2. **Database Setup:**
   ```bash
   # Create PostgreSQL database
   createdb motocare_db
   
   # Run migrations
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

3. **Environment Variables:**
   
   Create `.env` files in both frontend and backend directories:
   
   **Backend (.env):**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/motocare_db"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=5000
   NODE_ENV="development"
   ```
   
   **Frontend (.env.local):**
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```

4. **Run the application:**
   ```bash
   # Run both frontend and backend
   npm run dev
   
   # Or run separately:
   npm run dev:frontend  # Frontend on http://localhost:3000
   npm run dev:backend   # Backend on http://localhost:5000
   ```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Cars/Inventory
- `GET /api/cars` - Get all cars (with pagination & filters)
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create new car (authenticated)
- `PUT /api/cars/:id` - Update car (owner/admin only)
- `DELETE /api/cars/:id` - Delete car (owner/admin only)

### Gallery
- `GET /api/gallery` - Get all gallery images
- `POST /api/gallery` - Upload image to gallery

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `PUT /api/admin/cars/:id/approve` - Approve car listing

## 🗄 Database Schema

### Users Table
- id, name, email, password, role, createdAt, updatedAt

### Cars Table  
- id, brand, model, year, condition, price, description, images, userId, approved, createdAt, updatedAt

### Gallery Table
- id, imageUrl, carId, createdAt

## 🚀 Deployment

The application is deployment-ready for:
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, Heroku
- **Database**: Supabase, Neon, PlanetScale

## 📝 License

MIT License - see LICENSE file for details
"# MotoCare" 
"# MotoCare" 

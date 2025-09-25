# MotoCare API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2023-12-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2023-12-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET /auth/me
Get current user information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2023-12-01T00:00:00.000Z",
    "_count": {
      "cars": 5
    }
  }
}
```

### Cars

#### GET /cars
Get all cars with pagination and filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12, max: 50)
- `brand` (optional): Filter by brand
- `condition` (optional): Filter by condition (NEW, RECONDITIONED, PRE_OWNED)
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `year` (optional): Filter by year
- `approved` (optional): Filter by approval status (default: true)

**Response:**
```json
{
  "success": true,
  "data": {
    "cars": [
      {
        "id": "car_id",
        "brand": "BMW",
        "model": "X5",
        "year": 2023,
        "condition": "NEW",
        "price": 75000,
        "description": "Luxury SUV...",
        "images": ["/uploads/image1.jpg"],
        "approved": true,
        "userId": "user_id",
        "createdAt": "2023-12-01T00:00:00.000Z",
        "updatedAt": "2023-12-01T00:00:00.000Z",
        "user": {
          "id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "_count": {
          "gallery": 3
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 50,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### GET /cars/:id
Get a single car by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "car_id",
    "brand": "BMW",
    "model": "X5",
    "year": 2023,
    "condition": "NEW",
    "price": 75000,
    "description": "Luxury SUV...",
    "images": ["/uploads/image1.jpg"],
    "approved": true,
    "userId": "user_id",
    "createdAt": "2023-12-01T00:00:00.000Z",
    "updatedAt": "2023-12-01T00:00:00.000Z",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "gallery": [
      {
        "id": "gallery_id",
        "imageUrl": "/uploads/gallery1.jpg",
        "createdAt": "2023-12-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### POST /cars
Create a new car listing.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `brand`: Car brand (required)
- `model`: Car model (required)
- `year`: Manufacturing year (required)
- `condition`: Condition (NEW, RECONDITIONED, PRE_OWNED) (required)
- `price`: Price in USD (required)
- `description`: Car description (optional)
- `images`: Image files (max 10, 5MB each)

**Response:**
```json
{
  "success": true,
  "message": "Car created successfully",
  "data": {
    "id": "car_id",
    "brand": "BMW",
    "model": "X5",
    "year": 2023,
    "condition": "NEW",
    "price": 75000,
    "description": "Luxury SUV...",
    "images": ["/uploads/image1.jpg"],
    "approved": false,
    "userId": "user_id",
    "createdAt": "2023-12-01T00:00:00.000Z",
    "updatedAt": "2023-12-01T00:00:00.000Z",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### PUT /cars/:id
Update a car listing.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- Same as POST /cars (all fields optional)
- Only provided fields will be updated

#### DELETE /cars/:id
Delete a car listing.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Car deleted successfully"
}
```

#### GET /cars/user/my-cars
Get current user's cars.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)

### Gallery

#### GET /gallery
Get all gallery images.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

#### POST /gallery
Upload image to gallery.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `carId`: Car ID (required)
- `image`: Image file (required)

#### DELETE /gallery/:id
Delete gallery image.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Admin

#### GET /admin/stats
Get admin dashboard statistics.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 150,
      "totalCars": 500,
      "approvedCars": 450,
      "pendingCars": 50,
      "totalRevenue": 15000000
    },
    "recentCars": [...],
    "recentUsers": [...]
  }
}
```

#### GET /admin/users
Get all users (admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### GET /admin/cars
Get all cars (admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### PUT /admin/cars/:id/approve
Approve or reject car listing.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "approved": true
}
```

#### DELETE /admin/users/:id
Delete user (admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### DELETE /admin/cars/:id
Delete car (admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

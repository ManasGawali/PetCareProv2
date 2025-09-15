# PetCare Pro Deluxe - Full-Stack Setup Instructions

## Overview

This is a complete full-stack implementation of PetCare Pro Deluxe with:
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth system

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed
- PostgreSQL 12+ installed and running
- Git installed

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/petcare_pro_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create and run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
npx prisma db seed
```

### 4. Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm run build
npm start
```

The backend server will start on `http://localhost:3001`

### 5. Verify Backend Health

Visit `http://localhost:3001/health` - you should see:
```json
{
  "status": "OK",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "uptime": 1.234,
  "environment": "development"
}
```

## Frontend Setup

### 1. Install Dependencies

```bash
# In the root directory (where package.json is)
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Automatically copy the example file
npm run setup-env

# Or manually copy
cp env.local.example .env.local
```

The default configuration should work:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=PetCare Pro Deluxe
REACT_APP_ENABLE_API_LOGGING=true
```

### 3. Start Frontend

```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Database Schema

The application includes these main entities:

### Users
- Authentication and profile management
- Addresses for service delivery
- Role-based access (CUSTOMER, ADMIN, SERVICE_PROVIDER)

### Pets
- Pet profiles with breed, age, special notes
- Linked to user accounts
- Used for booking services

### Services
- Professional pet care services
- Categories: Grooming, Walking, Sitting, Training, Veterinary, Bath & Spa
- Pricing and duration information

### Bookings
- Service appointments
- Status tracking (Pending → Confirmed → In Progress → Completed)
- Payment tracking

### Products
- Pet food and accessories catalog
- Categories: Food, Accessories, Toys, Health, Grooming Supplies
- Stock management

### Cart
- Shopping cart functionality
- Quantity management
- User-specific carts

## Demo Accounts

The database is seeded with these demo accounts:

| Email | Password | Role |
|-------|----------|------|
| demo@petcarepro.com | demo123 | Customer |
| jane.doe@email.com | password123 | Customer |
| john.smith@email.com | mypassword | Customer |

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout

### Services
- `GET /api/services` - List services (with filtering)
- `GET /api/services/:id` - Get service details
- `GET /api/services/categories/summary` - Get categories

### Pets
- `GET /api/pets` - List user's pets
- `POST /api/pets` - Add new pet
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet

### Bookings
- `GET /api/bookings` - List user's bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/summary/stats` - Booking statistics

### Products & Cart
- `GET /api/products` - List products
- `GET /api/cart` - Get cart contents
- `POST /api/cart/items` - Add to cart
- `PUT /api/cart/items/:productId` - Update cart item
- `DELETE /api/cart/items/:productId` - Remove from cart

## Development Workflow

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend (new terminal)
```bash
npm start
```

### 3. Database Management
```bash
# View database in browser
npx prisma studio

# Reset database and reseed
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name your_migration_name
```

## Testing the Application

1. **Registration/Login**: Create a new account or use demo accounts
2. **Browse Services**: View service catalog and categories
3. **Pet Management**: Add pets to your profile
4. **Booking Flow**: Book a service for your pet
5. **Dashboard**: View your bookings and statistics
6. **Shopping**: Browse products and add to cart
7. **Profile**: Update personal information

## Production Deployment

### Backend Deployment (Railway/Render/AWS)

1. Set production environment variables
2. Use a managed PostgreSQL service
3. Update CORS settings for your domain
4. Enable SSL/HTTPS

### Frontend Deployment (Vercel/Netlify)

1. Update `REACT_APP_API_URL` to your backend URL
2. Build and deploy the React application

## Troubleshooting

### Common Issues

1. **Backend not starting**
   - Check PostgreSQL is running
   - Verify database credentials in `.env`
   - Ensure port 3001 is available

2. **Database connection errors**
   - Check PostgreSQL service status
   - Verify DATABASE_URL format
   - Check database exists

3. **Frontend API errors**
   - Verify backend is running on port 3001
   - Check CORS configuration
   - Verify API endpoint URLs

4. **Authentication issues**
   - Clear browser localStorage
   - Check JWT_SECRET is set
   - Verify token expiration settings

5. **Environment variable errors**
   - Ensure `.env.local` file exists in root directory
   - Run `npm run setup-env` to create from template
   - Verify all REACT_APP_ prefixed variables are set
   - Restart the development server after changing env vars

### Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm run build        # Build for production
npx prisma studio    # Database GUI
npx prisma migrate reset  # Reset database

# Frontend  
npm start            # Start development server
npm run build        # Build for production
```

## Features Implemented

✅ **Authentication System**
- JWT-based authentication
- User registration and login
- Protected routes
- Profile management

✅ **Pet Management**
- Add, edit, delete pets
- Pet profiles with details
- Pet-specific booking history

✅ **Service Booking**
- Browse services by category
- Filter and search services
- Complete booking flow
- Booking status tracking

✅ **Shopping Cart**
- Add products to cart
- Quantity management
- Cart persistence
- Responsive cart UI

✅ **Dashboard & Analytics**
- User statistics
- Booking history
- Recent activity
- Profile management

✅ **Responsive Design**
- Mobile-first approach
- Rich animations
- Consistent design system
- Accessibility features

## Next Steps

To extend this application, consider adding:
- Real-time notifications
- Payment processing (Stripe)
- File upload for pet photos
- Email notifications
- Admin dashboard
- Service provider portal
- Chat/messaging system
- Mobile app (React Native)
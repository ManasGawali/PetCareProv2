# PetCare Pro Deluxe - Quick Setup Guide

## Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd petcare-pro-deluxe
   npm install
   cd backend && npm install && cd ..
   ```

2. **Setup Database**
   ```bash
   # Create PostgreSQL database
   createdb petcare_pro_deluxe
   
   # Setup backend environment
   cd backend
   cp .env.example .env
   # Edit .env with your database URL
   
   # Run setup
   npm run setup:db
   npm run seed
   ```

3. **Start Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend  
   npm start
   ```

4. **Access App**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Demo Accounts
- `demo@petcarepro.com` / `demo123`
- `jane.doe@email.com` / `password123`

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://username:password@localhost:5432/petcare_pro_deluxe"
JWT_SECRET="your-secret-key-here"
PORT=3001
NODE_ENV=development
```

That's it! Your local development environment is ready.
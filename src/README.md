# PetCare Pro Deluxe - Local Development

A comprehensive pet care service platform built with React, TypeScript, Node.js, and PostgreSQL.

## Features

- **Service Booking**: Professional pet services with real-time tracking
- **Pet Food & Accessories**: Complete shopping experience with cart functionality
- **User Authentication**: Secure login/signup with JWT tokens
- **Pet Profiles**: Manage multiple pets and their information
- **Booking Dashboard**: Track appointments and service history
- **Live Tracking**: Real-time service provider tracking with ETA
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Motion (Framer Motion) for animations
- Shadcn/ui component library

### Backend
- Node.js with Express
- PostgreSQL database
- Prisma ORM
- JWT authentication
- RESTful API design

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd petcare-pro-deluxe
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Setup PostgreSQL database**
   ```bash
   # Create a new PostgreSQL database
   createdb petcare_pro_deluxe
   
   # Run database setup (from backend folder)
   npm run setup:db
   ```

5. **Configure environment variables**
   ```bash
   # In backend folder, create .env file:
   DATABASE_URL="postgresql://username:password@localhost:5432/petcare_pro_deluxe"
   JWT_SECRET="your-secret-key-here"
   PORT=3001
   ```

6. **Start the development servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Demo Accounts

- **Email**: demo@petcarepro.com | **Password**: demo123
- **Email**: jane.doe@email.com | **Password**: password123
- **Email**: john.smith@email.com | **Password**: mypassword

## Development Scripts

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run setup:db` - Setup database and run migrations
- `npm run seed` - Seed database with sample data
- `npm run migrate` - Run Prisma migrations

## Project Structure

```
petcare-pro-deluxe/
├── components/           # React components
├── utils/               # Frontend utilities
├── styles/              # Global styles
├── backend/             # Node.js backend
│   ├── src/            # TypeScript source
│   ├── prisma/         # Database schema & migrations
│   └── scripts/        # Database setup scripts
└── package.json        # Frontend dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is for educational and demonstration purposes.
# Google OAuth Setup Instructions

## Overview
Your PetCare Pro Deluxe application is set up with backend authentication and prepared for Google OAuth integration. Currently, the app uses email/password authentication with demo accounts.

## Current Authentication Features
- ✅ Backend API integration with Node.js/Express
- ✅ User registration and login
- ✅ JWT token-based authentication
- ✅ Demo accounts for testing
- ✅ Profile management
- 🔄 Google OAuth (setup required)

## Demo Accounts
Use these accounts to test the application:

1. **Demo User**
   - Email: `demo@petcarepro.com`
   - Password: `demo123`

2. **Jane Doe**
   - Email: `jane.doe@email.com`
   - Password: `password123`

3. **John Smith**
   - Email: `john.smith@email.com`
   - Password: `mypassword`

## Google OAuth Setup (Optional)

To enable Google OAuth, you'll need to:

### 1. Set up Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google+ API or Google Identity API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add your domain to authorized origins

### 2. Configure Supabase Authentication
1. In your Supabase dashboard, go to Authentication → Settings
2. Configure Google OAuth provider
3. Add your Google Client ID and Client Secret
4. Set redirect URLs

### 3. Update Environment Variables
Add to your `.env` file:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Update Backend Routes
The backend already includes Google OAuth routes in `/backend/routes/auth.js`:
- `POST /api/auth/google-oauth` - Handle Google authentication

## Backend Database Setup

To use the full backend functionality:

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create `/backend/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=petcare_pro
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

### 3. Setup Database
```bash
npm run db:setup
npm run db:seed
```

### 4. Start Backend Server
```bash
npm run dev
```

## Architecture Overview

```
Frontend (React) → Backend (Node.js/Express) → Database (MySQL)
                ↗ Supabase Auth (Google OAuth)
```

- **Frontend**: React app with TypeScript, Tailwind CSS, Motion animations
- **Backend**: Express.js with Sequelize ORM, JWT authentication
- **Database**: MySQL with comprehensive schema for users, bookings, services, etc.
- **Authentication**: Supabase for Google OAuth + custom backend for email/password

## Current State
The application is fully functional with email/password authentication and demo accounts. Google OAuth can be enabled following the setup instructions above.

## Next Steps
1. Test the application with demo accounts
2. Optionally set up Google OAuth following the instructions above  
3. Start the backend server for full API integration
4. Customize services, products, and other content as needed

The application is production-ready for email/password authentication and can be enhanced with Google OAuth when needed.
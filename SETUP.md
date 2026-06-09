# CineBook - Backend & Frontend Setup

This guide helps you set up and run both the backend API and frontend application.

## Prerequisites

- Node.js (v18+)
- MongoDB (local or cloud)
- npm or yarn

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd cinebook_api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create .env File
Copy from `.env.example` and update with your settings:
```bash
cp .env.example .env
```

Update the `.env` file:
```
PORT=8089
MONGODB_URL=mongodb://localhost:27017/cinebook-db
SECRET_KEY=your_secret_key_here
NODE_ENV=development
```

### 4. Run Backend
```bash
npm run dev
```

The API will be available at `http://localhost:8089`

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd cinebook_next
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create .env.local File
The file is already created, verify it contains:
```
NEXT_PUBLIC_API_URL=http://localhost:8089
```

### 4. Run Frontend
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication Routes

**Register**
- **URL:** `/api/auth/register`
- **Method:** POST
- **Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "securePassword123"
}
```

**Login**
- **URL:** `/api/auth/login`
- **Method:** POST
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

## Features Implemented

✅ User Registration with validation
✅ User Login with JWT token
✅ Password hashing with bcryptjs
✅ CORS enabled for frontend
✅ MongoDB integration
✅ Error handling
✅ API response standardization
✅ Frontend authentication forms with react-hook-form
✅ Zod validation on both backend and frontend

## Project Structure

### Backend
- `src/controllers/` - Request handlers
- `src/services/` - Business logic
- `src/repositories/` - Database operations
- `src/models/` - MongoDB schemas
- `src/dtos/` - Data validation schemas
- `src/routes/` - API routes
- `src/middlewares/` - Express middlewares
- `src/utils/` - Helper functions
- `src/exceptions/` - Custom exceptions

### Frontend
- `app/frontend/` - Authentication pages (login/register)
- `lib/api/` - API integration
- `lib/actions/` - Server actions

## Troubleshooting

### MongoDB Connection Error
Ensure MongoDB is running:
```bash
# macOS/Linux
brew services start mongodb-community

# Windows (if installed via Chocolatey)
mongod
```

### CORS Errors
The backend CORS is configured to accept:
- `http://localhost:3000` (frontend)
- `http://localhost:3001` (fallback)
- `*` (any origin for development)

### Port Already in Use
Change the port in `.env`:
```
PORT=8090
```

Then update frontend `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8090
```

## Development Tips

1. **Backend Development:** Use `npm run dev` for watch mode with auto-reload
2. **Token Storage:** Token is automatically stored in localStorage after login
3. **Authentication Header:** API calls automatically include Bearer token
4. **Logout:** Token is removed from localStorage on logout or 401 response

## Next Steps

1. Set up database with real MongoDB instance
2. Add environment variables for production
3. Implement more API endpoints (movies, bookings, etc.)
4. Add protected routes with authentication middleware
5. Deploy to production (Vercel for frontend, Heroku/Railway for backend)


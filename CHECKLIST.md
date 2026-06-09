# 🎬 CineBook - Quick Reference Checklist

## ✅ Setup Complete - What's Done

### Backend (`cinebook_api/`)
- [x] Express server configured with TypeScript
- [x] MongoDB connection setup
- [x] User model with schema validation
- [x] Registration endpoint (`POST /api/auth/register`)
- [x] Login endpoint (`POST /api/auth/login`)
- [x] JWT token generation
- [x] Password hashing with bcryptjs
- [x] CORS configured for frontend
- [x] Error handling and validation
- [x] API response standardization
- [x] Authorization middleware for protected routes

### Frontend (`cinebook_next/`)
- [x] Next.js 16 with React 19
- [x] Registration page with form validation
- [x] Login page with form validation
- [x] React Hook Form integration
- [x] Zod schema validation
- [x] Axios HTTP client setup
- [x] JWT token storage in localStorage
- [x] Auto token injection in requests
- [x] Error handling and display
- [x] Logout functionality
- [x] Protected route middleware ready

---

## 🚀 How to Run

### Start Backend
```bash
cd cinebook_api
npm install                    # First time only
npm run dev                    # Start server (watch mode)
```
**Backend URL:** `http://localhost:8089`

### Start Frontend
```bash
cd cinebook_next
npm install                    # First time only
npm run dev                    # Start app
```
**Frontend URL:** `http://localhost:3000`

---

## 📋 Testing Checklist

- [ ] Start backend (`npm run dev` in cinebook_api)
- [ ] Start frontend (`npm run dev` in cinebook_next)
- [ ] Go to `http://localhost:3000/register`
- [ ] Create test account
  - First Name: John
  - Last Name: Doe
  - Email: john@example.com
  - Username: johndoe
  - Password: password123
  - Confirm: password123
- [ ] Check backend logs for "User created successfully"
- [ ] Go to `http://localhost:3000/login`
- [ ] Login with credentials from above
- [ ] Check browser localStorage for token
- [ ] Verify redirect to `/dashboard`
- [ ] Open DevTools → Network → observe API calls

---

## 🔧 Configuration Files

### Backend - `.env`
```env
PORT=8089
MONGODB_URL=mongodb://localhost:27017/cinebook-db
SECRET_KEY=merosecretkey
NODE_ENV=development
```

### Frontend - `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8089
```

---

## 📁 Key Files Modified/Created

### Backend
- `src/app.ts` - ✅ Fixed exports and CORS
- `index.ts` - ✅ Fixed imports
- `.env.example` - ✅ Added

### Frontend
- `lib/api/endpoints.ts` - ✅ Created
- `lib/api/axios-instance.ts` - ✅ Created
- `lib/api/auth.ts` - ✅ Created
- `lib/actions/auth-action.ts` - ✅ Created
- `app/frontend/_components/schema.ts` - ✅ Created
- `app/frontend/login/page.tsx` - ✅ Updated
- `app/frontend/register/page.tsx` - ✅ Updated
- `.env.local` - ✅ Created
- `package.json` - ✅ Updated dependencies

---

## 📞 API Endpoints

### Public Routes
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Login user |

### Request/Response Examples

**Register Request:**
```json
POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123"
}
```

**Login Request:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response:**
```json
{
  "status": 200,
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8089 is in use
# Kill process on port 8089 or change PORT in .env
```

### Frontend can't connect to backend
```
Check:
1. Backend is running on port 8089
2. NEXT_PUBLIC_API_URL=http://localhost:8089 in .env.local
3. CORS is enabled (should be in src/app.ts)
```

### MongoDB connection fails
```bash
# Start MongoDB
mongod

# Or if using MongoDB Atlas, update MONGODB_URL in .env
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/cinebook-db
```

### Token not saving to localStorage
```
Check:
1. Login response contains token in data.data.token
2. Browser localStorage is not disabled
3. DevTools → Application → Storage → Local Storage
```

---

## 📚 Documentation Files

- `SETUP.md` - Detailed setup instructions
- `CHANGES.md` - All changes made
- `CHECKLIST.md` - This file

---

## 🎯 Next Development Tasks

1. **Create Movie Endpoints**
   - GET `/api/movies` - List all movies
   - GET `/api/movies/:id` - Get movie details
   - POST `/api/movies` - Create movie (admin only)

2. **Create Booking Endpoints**
   - POST `/api/bookings` - Create booking
   - GET `/api/bookings/:id` - Get booking details
   - GET `/api/bookings/user/:userId` - User bookings

3. **Add Protected Routes**
   - Use `authorized.middleware.ts` for routes
   - Example: `userRouter.get("/profile", authorizedMiddleware, getUserProfile)`

4. **Frontend Protected Pages**
   - Dashboard page
   - User profile page
   - Bookings history page
   - Movie booking flow

5. **Admin Features**
   - Admin dashboard
   - Movie management
   - Booking management

---

## 🌐 Environment Variables Reference

### Backend (.env)
| Variable | Example | Purpose |
|----------|---------|---------|
| PORT | 8089 | Server port |
| MONGODB_URL | mongodb://... | Database connection |
| SECRET_KEY | merosecretkey | JWT signing key |
| NODE_ENV | development | Environment |

### Frontend (.env.local)
| Variable | Example | Purpose |
|----------|---------|---------|
| NEXT_PUBLIC_API_URL | http://localhost:8089 | Backend API URL |

---

## 📊 Project Statistics

- **Backend Routes:** 2 (register, login)
- **Frontend Pages:** 2 (login, register)
- **Database Models:** 1 (User)
- **API Controllers:** 1 (User)
- **TypeScript Files:** 20+
- **Total Dependencies:** 25+

---

## ✨ Technology Stack

### Backend
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- TypeScript
- Zod (validation)

### Frontend
- Next.js 16
- React 19
- React Hook Form
- Zod (validation)
- Axios
- Tailwind CSS
- Lucide React Icons

---

## 💡 Tips & Best Practices

1. **Always run both servers** - Backend and frontend together
2. **Check browser console** - Error messages from frontend
3. **Check terminal logs** - Error messages from backend
4. **Use DevTools Network tab** - Debug API calls
5. **Check localStorage** - Verify token is stored
6. **Restart on .env changes** - Environment variables need restart
7. **Clear browser cache** - If CSS/components not updating
8. **MongoDB Atlas** - Use for production instead of local MongoDB

---

## 📝 Notes

- ✅ All validation is done on both frontend AND backend
- ✅ Passwords are never stored in plain text (bcryptjs hashing)
- ✅ JWT tokens expire in 30 days
- ✅ CORS is configured for development (allow all origins)
- ✅ Error handling is comprehensive
- ✅ API responses are standardized
- ✅ TypeScript is used throughout for type safety

---

**Last Updated:** June 9, 2026
**Status:** Ready for Testing ✅

# CineBook API

Backend API for CineBook movie ticket booking application with mobile-compatible endpoints.

## Features

- User authentication (register/login)
- Mobile-friendly API endpoints
- CORS enabled for web and mobile
- JWT-based authentication
- Password hashing with bcrypt
- MongoDB with Mongoose

## Tech Stack

- Node.js / Express.js
- TypeScript
- MongoDB / Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Zod validation

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
HOST=0.0.0.0
MONGODB_URL=mongodb://localhost:27017/cinebook-db
SECRET_KEY=your_secret_key_change_this_in_production
NODE_ENV=development
```

## Running the Server

```bash
npm run dev
# or
npm start
```

The server will start on `http://${HOST}:${PORT}` (default: http://0.0.0.0:5000)

## Base URLs

| Platform | Base URL |
|----------|----------|
| Web Browser | http://localhost:5000/api/v1 |
| Android Emulator | http://10.0.2.2:5000/api/v1 |
| Physical Android (same WiFi) | http://YOUR_PC_IP:5000/api/v1 |
| Production | https://yourdomain.com/api/v1 |

> **Note**: `HOST=0.0.0.0` allows access from other devices on the same network.
> Use your PC's local IP address from the Android device.

## API Endpoints

### Auth Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/users/register` | Register new user | No |
| POST | `/api/v1/users/login` | Login user | No |
| POST | `/api/v1/students/register` | Register (legacy) | No |
| POST | `/api/v1/students/login` | Login (legacy) | No |

## Request/Response Formats

### Register

**Endpoint:** `POST /api/v1/users/register`

**Request Body:**
```json
{
    "fullName": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "phoneNumber": "0123456789"
}
```

> Both `name` and `fullName` are accepted for registration. The backend maps `fullName` to the internal `name` field.

### Login

**Endpoint:** `POST /api/v1/users/login`

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

### Success Response (Login/Register)

**Status:** `200 OK` (login) / `201 Created` (register)

```json
{
    "success": true,
    "message": "Login successful",
    "token": "jwt-token-here",
    "user": {
        "id": "user_id",
        "fullName": "John Doe",
        "email": "john@example.com",
        "username": "johndoe",
        "phoneNumber": "0123456789"
    }
}
```

### Error Response

```json
{
    "success": false,
    "message": "Error message here"
}
```

## HTTP Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (invalid credentials) |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (duplicate email/username) |
| 500 | Internal Server Error |

## Validation Rules

### Registration Fields

| Field | Required | Rules |
|-------|----------|-------|
| fullName or name | Yes | Minimum 1 character |
| email | Yes | Valid email format |
| username | Yes | Minimum 3 characters |
| password | Yes | Minimum 6 characters |
| phoneNumber | Yes | Minimum 10 digits |

### Login Fields

| Field | Required | Rules |
|-------|----------|-------|
| email | Yes | Valid email format |
| password | Yes | Minimum 1 character |

## Authentication

Protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

Token expires in 30 days.

## Postman / cURL Examples

### Register

```bash
curl -X POST http://localhost:5000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "phoneNumber": "0123456789"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test with token (replace TOKEN with actual JWT)

```bash
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer TOKEN"
```

## Mobile Integration Notes

- **Do not store passwords locally** in the mobile app
- **Use HTTPS in production**
- **Local HTTP is acceptable for development only**
- **No CORS needed** for mobile apps, but backend allows empty origin
- **Use the correct base URL** for your platform (emulator vs physical device)

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `SECRET_KEY`
3. Configure `PORT` and `HOST` appropriately
4. Set up HTTPS with a reverse proxy (nginx/caddy) or TLS termination
5. Use a production MongoDB cluster

## License

ISC

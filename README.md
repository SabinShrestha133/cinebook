🎬 CineBook

Full-Stack Movie Ticket Booking & Cinema Management Platform

CineBook is a full-stack movie ticket booking platform designed to provide a complete digital cinema experience — from discovering movies and selecting showtimes to choosing seats, completing payments, and managing digital tickets.

The project is built around a Next.js web application, Node.js/Express REST API, and MongoDB database, with a focus on clean architecture, secure authentication, API-driven development, testing, and real-world booking workflows.

🚧 This project is actively developed and represents a university software engineering project.

✨ Highlights

🎬 Movie Discovery
Browse movies, view details, genres, descriptions, and available showtimes.

🏢 Cinema & Showtime Management
Manage cinemas, screens, movie schedules, and available showtimes.

💺 Interactive Seat Selection
Select available seats through an interactive cinema seat layout.

🎟️ Digital Booking
Create and manage movie bookings with booking history and confirmation details.

💳 Online Payment Integration
Integrated payment processing using Khalti with server-side verification before confirming bookings.

🔐 Secure Authentication
JWT-based authentication with protected API routes and password hashing.

📱 Mobile-Compatible API
The backend exposes RESTful endpoints designed to support both web and mobile clients.

🧪 Automated Testing
Includes automated testing across application logic, integration workflows, and end-to-end browser scenarios.

🏗️ Clean Architecture
The mobile application follows MVVM and Clean Architecture principles to separate presentation, domain, and data concerns.

🖥️ Application Architecture

                    ┌──────────────────────┐
                    │        Users         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Next.js Web App    │
                    │                      │
                    │  UI / Components     │
                    │  State Management    │
                    │  API Integration     │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │  Node.js + Express   │
                    │                      │
                    │  Authentication      │
                    │  Validation          │
                    │  Business Logic      │
                    │  Booking Services    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │                      │
                    │ Users                │
                    │ Movies               │
                    │ Cinemas              │
                    │ Shows                │
                    │ Seats                │
                    │ Bookings             │
                    └──────────────────────┘

                               │
                               ▼
                    ┌──────────────────────┐
                    │   External Services  │
                    │                      │
                    │ Khalti Payments      │
                    │ QR Ticket System     │
                    └──────────────────────┘

🛠️ Technology Stack

Frontend

Next.js

React

TypeScript

Tailwind CSS

API-driven architecture

Responsive UI

Backend

Node.js

Express.js

TypeScript

MongoDB

Mongoose

JWT

bcrypt

Zod

Mobile

Flutter

Dart

Riverpod

MVVM

Clean Architecture

Testing

Jest

Playwright

Unit Testing

Integration Testing

End-to-End Testing

Development Tools

Git

GitHub

Postman

VS Code

🎯 Core Features

👤 Authentication

User registration

User login

JWT authentication

Protected API routes

Password hashing

Session management

Input validation

🎬 Movie Management

Users can:

Browse available movies

View movie details

Explore movie genres

View descriptions

Find available showtimes

Select cinemas and showtimes

🏢 Cinema & Showtime Management

The platform supports:

Cinema management

Screen management

Showtime management

Movie scheduling

Seat configuration

Availability management

💺 Seat Selection

The booking flow allows users to:

Select Movie
      ↓
Select Cinema
      ↓
Select Showtime
      ↓
View Seat Layout
      ↓
Select Available Seats
      ↓
Review Booking
      ↓
Payment
      ↓
Booking Confirmation
      ↓
Digital Ticket

💳 Payment Flow

CineBook integrates Khalti for online payment processing.

The payment flow is designed so that a booking is not treated as successfully paid until the payment has been verified by the backend.

User selects seats
        ↓
Booking initiated
        ↓
Payment initiated
        ↓
Khalti payment
        ↓
Payment verification
        ↓
Backend validates payment
        ↓
Booking confirmed
        ↓
Digital ticket generated

This prevents the client application from being the sole authority for payment confirmation.

🔐 Security

Security considerations implemented throughout the application include:

JWT-based authentication

Password hashing with bcrypt

Protected API endpoints

Request validation using Zod

Environment-based configuration

CORS configuration

Server-side payment verification

Sensitive credentials excluded through environment variables

Never commit your .env file or production secrets to the repository.

🧪 Testing

Testing is an important part of CineBook's development process.

The project includes multiple testing levels:

Unit Tests

Used to verify individual pieces of application logic in isolation.

Integration Tests

Used to validate interactions between application components and services.

End-to-End Tests

Playwright is used to test important user workflows through the application.

Example Workflow

Login
  ↓
Browse Movies
  ↓
Select Movie
  ↓
Select Showtime
  ↓
Select Seats
  ↓
Create Booking
  ↓
Payment
  ↓
Confirmation

📁 Project Structure

CineBook/
│
├── cinebook_api/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── scripts/
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── cinebook_next/
│   │
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── tests/
│   ├── playwright.config.ts
│   └── package.json
│
└── README.md

🚀 Getting Started

Prerequisites

Make sure you have the following installed:

Node.js 18+

npm

MongoDB

Git

1. Clone the Repository

git clone https://github.com/SabinShrestha133/CIneBook-A-movie-booking-app.git

cd CIneBook-A-movie-booking-app

⚙️ Backend Setup

cd cinebook_api

npm install

Create a .env file:

PORT=5000
HOST=0.0.0.0
MONGODB_URL=your_mongodb_connection_string
SECRET_KEY=your_secret_key
NODE_ENV=development

Start the development server:

npm run dev

The API will run on:

http://localhost:5000

Android Emulator

http://10.0.2.2:5000/api/v1

Web

http://localhost:5000/api/v1

🌐 Frontend Setup

Open another terminal:

cd cinebook_next

npm install

npm run dev

The web application will be available at:

http://localhost:3000

🔌 API

The backend exposes RESTful endpoints for authentication and application functionality.

Authentication

Method

Endpoint

Description

POST

/api/v1/students/register

Register user

POST

/api/v1/students/login

Login

GET

/api/v1/students/profile

Get user profile

📸 Screenshots



🧠 Engineering Decisions

CineBook was designed as more than a simple CRUD application.

The project focuses on several real-world software engineering concerns:

Separation of Concerns

Frontend, backend, business logic, and data access are kept separated to make the application easier to maintain.

API-First Development

The backend exposes REST APIs that can be consumed by multiple clients.

Server-Side Verification

Critical operations such as payment verification are handled by the backend rather than trusting client-side state.

Testability

Application logic is structured so that individual components and complete workflows can be tested independently.

Scalability

The API-based architecture allows additional clients, such as mobile applications, to consume the same backend services.

🗺️ Future Improvements

Production deployment

Push notifications

Advanced movie recommendations

Improved staff ticket-scanning workflow

Analytics dashboard

Performance monitoring

CI/CD pipeline

Expanded API documentation

Additional security hardening

👨‍💻 About the Developer

Sabin Shrestha

Final-semester BSc (Hons) Computing student interested in:

Full-Stack Development

Mobile Application Development

Backend Engineering

Software Architecture

Artificial Intelligence & Machine Learning

📧 Email: stha.sabin133@gmail.com

💼 LinkedIn:
https://www.linkedin.com/in/sabin-shrestha-a67b2a280

🐙 GitHub:
https://github.com/SabinShrestha133

⭐ If you found this project interesting

Feel free to explore the codebase, raise an issue, or connect with me.

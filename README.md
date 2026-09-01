# 🎬 CineBook

### Full-Stack Movie Ticket Booking & Cinema Management Platform

CineBook is a full-stack movie ticket booking platform designed to provide a complete digital cinema experience — from discovering movies and selecting showtimes to choosing seats, completing payments, and managing digital tickets.

The project is built around a **Next.js web application**, **Node.js/Express REST API**, and **MongoDB database**, with a focus on clean architecture, secure authentication, API-driven development, testing, and real-world booking workflows.

> 🚧 This project is actively developed and represents a university software engineering project.

---

## ✨ Highlights

🎬 **Movie Discovery**  
Browse movies, view details, genres, descriptions, and available showtimes.

🏢 **Cinema & Showtime Management**  
Manage cinemas, screens, movie schedules, and available showtimes.

💺 **Interactive Seat Selection**  
Select available seats through an interactive cinema seat layout.

🎟️ **Digital Booking**  
Create and manage movie bookings with booking history and confirmation details.

💳 **Online Payment Integration**  
Integrated payment processing using Khalti with server-side verification before confirming bookings.

🔐 **Secure Authentication**  
JWT-based authentication with protected API routes and password hashing.

📱 **Mobile-Compatible API**  
The backend exposes RESTful endpoints designed to support both web and mobile clients.

🧪 **Automated Testing**  
Includes unit, widget/integration testing and end-to-end browser testing across the application.

🏗️ **Clean Architecture**  
The mobile application follows MVVM and Clean Architecture principles to separate presentation, domain, and data concerns.

---

# 🖥️ Application Architecture

```text
                    ┌──────────────────────┐
                    │      Users           │
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

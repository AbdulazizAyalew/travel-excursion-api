# travel-excursion-api

A RESTful backend API for a Travel & Excursion Booking platform. Users can browse destinations, book trips, and leave reviews. Admins manage tours and view dashboard analytics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT (access + refresh tokens) |
| Documentation | Swagger |
| Containerization | Docker + Docker Compose |
| Email | Nodemailer |
| Rate Limiting | express-rate-limit |

---

## Features

### Authentication
- Register & Login
- JWT access token + refresh token
- Forgot password & reset password
- Role-based access control: **User**, **Tour Guide**, **Admin**

### Destination Management
- Admin: create, update, delete destinations with images, pricing, schedule, available seats
- Public: browse, search, filter (by category, country, price range), and sort destinations

### Booking System
- Reserve seats with date and participant count selection
- Atomic seat deduction to prevent overbooking
- Concurrent request handling via database transactions
- View and cancel bookings
- Booking history per user

### Reviews
- Rate and comment on destinations
- Only users with a confirmed booking can leave a review
- One review per booking enforced

### Admin Dashboard
- Total bookings count
- Monthly revenue breakdown
- Top destinations by booking volume
- Total registered users

### Bonus Features
- **Rate limiting** —> API-wide rate limiting via `express-rate-limit`
- **Email notifications** —> Booking confirmation emails via Nodemailer

---

## Project Structure

```
travel-excursion-api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/          # DB, mailer, env config
│   ├── middlewares/     # auth, role guard, rate limiter, error handler
│   ├── modules/
│   │   ├── auth/
│   │   ├── destinations/
│   │   ├── bookings/
│   │   ├── reviews/
│   │   └── admin/
│   ├── utils/           # response helpers, token utils
│   └── app.js
├── .env.example
├── docker-compose.yml
├── Dockerfile
└── swagger.yaml
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### 1. Clone the repository

```bash
git clone https://github.com/AbdulazizAyalew/travel-excursion-api.git
cd travel-excursion-api
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in the values in `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/travel_excursion_db #Will configure it to point to the Docker container later on

# JWT
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Password Reset
RESET_TOKEN_EXPIRES_IN=1h

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=no-reply@travelexcursion.com
```

### 3. Run with Docker

```bash
docker-compose up --build
```

The API will be available at `http://localhost:3000`

### 4. Run locally (without Docker)

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
```

---

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api-docs
```

---

## Database Schema

```
#I will put the ERD Diagram Here after I do the schema.prisma
```

**Core models:** `User` · `Destination` · `Booking` · `Review` · `RefreshToken` · `PasswordResetToken`

---

## API Endpoints Overview

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh-token` | Public |
| POST | `/api/auth/forgot-password` | Public |
| POST | `/api/auth/reset-password` | Public |

### Destinations
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/destinations` | Public |
| GET | `/api/destinations/:id` | Public |
| POST | `/api/destinations` | Admin |
| PUT | `/api/destinations/:id` | Admin |
| DELETE | `/api/destinations/:id` | Admin |

### Bookings
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/bookings` | User |
| GET | `/api/bookings/my` | User |
| DELETE | `/api/bookings/:id` | User |

### Reviews
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/reviews` | User (booked only) |
| GET | `/api/destinations/:id/reviews` | Public |

### Admin Dashboard
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/admin/stats/bookings` | Admin |
| GET | `/api/admin/stats/revenue` | Admin |
| GET | `/api/admin/stats/top-destinations` | Admin |
| GET | `/api/admin/stats/users` | Admin |

---

## Running Tests

```bash
npm test
```

---

## Postman Collection


```
# I will add the Postman collection after completion here
```

---

## Docker Setup

```yaml
# docker-compose.yml provisions:
# - Node.js API (port 3000)
# - PostgreSQL (port 5432)
```

```bash
# Start all services
docker-compose up --build

# Stop all services
docker-compose down

# Reset database volumes
docker-compose down -v
```

---


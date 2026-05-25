# Travel & Excursion Booking API

A RESTful backend API for a Travel & Excursion Booking Platform.

Users can browse destinations and packages, reserve seats, manage bookings, and leave package reviews. Admins can manage destinations, excursions, packages, and view dashboard analytics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT access + refresh tokens |
| Validation | Zod |
| File Upload | Multer |
| Documentation | Swagger |
| Email | Nodemailer |
| Rate Limiting | express-rate-limit |

---

## Features

### Authentication
- Register and login
- JWT access token and refresh token
- Refresh token rotation
- Forgot password and reset password
- Role-based access control for users and admins

### Destinations
- Public destination browsing
- Search, filter, sort, and pagination
- Admin destination CRUD
- Image uploads for destinations

### Excursions
- Public single excursion details
- Admin excursion CRUD
- Image uploads for excursions

### Packages
- Public package details
- Admin package CRUD
- Package schedules, duration, price, and available seats

### Bookings
- Create bookings with participant count and start date
- Prevent overbooking using Prisma transactions
- Automatically reduce available seats
- View user booking history
- Cancel bookings and restore seats

### Reviews
- Users can review packages through confirmed bookings
- One review per booking
- Package reviews include average rating and total review count

### Admin Dashboard
- Total bookings count
- Total registered users count
- Monthly confirmed revenue
- Top destinations by confirmed booking count

### Bonus Features
- API rate limiting
- Booking confirmation email
- Password reset email
- Development email logging when SMTP is not configured

---

## Project Structure

```txt
travel-excursion-api/
└── travel_excursion_api/
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    ├── src/
    │   ├── config/
    │   ├── middlewares/
    │   ├── modules/
    │   │   ├── admin/
    │   │   ├── auth/
    │   │   ├── bookings/
    │   │   ├── destinations/
    │   │   ├── excursions/
    │   │   ├── packages/
    │   │   └── reviews/
    │   ├── utils/
    │   ├── app.js
    │   └── server.js
    ├── uploads/
    ├── .env.example
    ├── package.json
    └── swagger.json
```

---

## Getting Started

### Prerequisites

Make sure you have:

- Node.js installed
- PostgreSQL installed and running locally
- npm installed
- Git installed

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/AbdulazizAyalew/travel-excursion-api.git
cd travel-excursion-api/travel_excursion_api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4. Configure `.env`

Update `DATABASE_URL`, JWT secrets, and other values based on your local setup.

Example:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/travel_excursion_db"

JWT_ACCESS_SECRET=replace_with_strong_access_secret
JWT_REFRESH_SECRET=replace_with_strong_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

RESET_TOKEN_EXPIRES_IN=1h
FRONTEND_URL=http://localhost:5000

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=no-reply@travelexcursion.com
```

In development, SMTP values can be left empty. Emails will be logged to the console.

### 5. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Start the development server

```bash
npm run dev
```

The API will run at:

```txt
http://localhost:5000
```

---

## API Documentation

Swagger UI:

```txt
http://localhost:5000/api-docs
```

Swagger JSON:

```txt
http://localhost:5000/api-docs.json
```

A generated Swagger export is also available in:

```txt
swagger.json
```

---

## Postman

The Postman collection and environment are located in the `postman/` folder.

Recommended environment variables:

```txt
base_url=http://localhost:5000
access_token=
refresh_token=
admin_access_token=
admin_refresh_token=
destination_id=
excursion_id=
package_id=
booking_id=
review_id=
```

Use `{{base_url}}` in all requests.

For protected user routes, use:

```txt
Authorization: Bearer {{access_token}}
```

For admin routes, use:

```txt
Authorization: Bearer {{admin_access_token}}
```

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

### Excursions

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/excursions/:id` | Public |
| POST | `/api/excursions` | Admin |
| PUT | `/api/excursions/:id` | Admin |
| DELETE | `/api/excursions/:id` | Admin |

### Packages

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/packages/:id` | Public |
| GET | `/api/packages/:id/reviews` | Public |
| POST | `/api/packages` | Admin |
| PUT | `/api/packages/:id` | Admin |
| DELETE | `/api/packages/:id` | Admin |

### Bookings

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/bookings` | User |
| GET | `/api/bookings/my` | User |
| DELETE | `/api/bookings/:id` | User |

### Reviews

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/reviews` | User with confirmed booking |

### Admin Stats

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/admin/stats/bookings` | Admin |
| GET | `/api/admin/stats/users` | Admin |
| GET | `/api/admin/stats/revenue` | Admin |
| GET | `/api/admin/stats/top-destinations` | Admin |

---

## Email Behavior

In development, emails are logged to the terminal when SMTP is not configured.

To send real emails, configure:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
```

---

## Docker

Docker support will be added later. For now, run PostgreSQL locally and configure `DATABASE_URL` in `.env`.

---

## Useful Commands

```bash
npm run dev
npx prisma migrate dev
npx prisma generate
npx prisma studio
```

---

## Status

This project includes authentication, destination management, excursion management, package management, bookings, reviews, admin analytics, rate limiting, email notifications, Swagger docs, and Postman documentation.

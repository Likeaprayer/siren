# siren | Music Booking API

A comprehensive REST API for connecting artists with event organizers, facilitating bookings and payments for musical performances.

## Overview

This API provides a platform for:
- Artists to create and manage their profiles
- Event organizers to discover artists and request bookings
- Negotiation of performance terms between parties
- Confirmation of bookings and processing of payments

Built with Node.js, Express, TypeScript, Knex.js, and Objection.js, this API provides a robust backend for music booking applications.

## Tech Stack

- **Node.js & Express**: Server framework
- **TypeScript**: Type-safe JavaScript
- **Knex.js**: SQL query builder and migration tool
- **Objection.js**: ORM wwrapper for Knex.js
- **PostgreSQL**: Database (supports JSON fields)

## Database Schema
![Untitled (2)](https://github.com/user-attachments/assets/685a22c3-f1ca-44b8-8287-9ae758368719)

The database consists of the following core tables:

- **users**: Authentication and user information
- **user_type**: User role classifications
- **artists**: Artist profile information
- **listing_intent**: Booking requests and negotiations
- **listings**: Confirmed bookings
- **payment_intent**: Payment intentions
- **payments**: Processed payments
- **event_type**: Types of events for bookings

## API Endpoints

### User Management
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user details

### Artist Management
- `GET /api/artists/:id` - Get artist profile
- `POST /api/artists` - Create artist profile
- `PUT /api/artists/:id` - Update artist profile
- `GET /api/artists/search` - Search for artists

### Booking Flow
- `POST /api/listing/intents` - Create booking request
- `GET /api/listing/intents/:id` - Get booking request details
- `PUT /api/listing/intents/:id/respond` - Respond to a booking request
- `POST /api/listing/intents/:id/confirm` - Create confirmed booking from intent
- `GET /api/listings/:id` - Get confirmed booking details
- `PUT /api/listings/:id/status` - Update booking status

### Payment Processing
- `POST /api/payment-intents` - Create payment intent
- `POST /api/payment-intents/:id/process` - Process payment
- `GET /api/payments/:id` - Get payment details

## Getting Started

### Prerequisites
- Docker (recommended)

or 

- Node.js (v16+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Likeaprayer/siren.git
cd siren
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials and other settings
```

4. Run migrations
```bash
npm run migrate-up
```

5. Start the development server
```bash
npm run dev
```

### Database Migrations

Create a new migration:
```bash
npm run migrate:make <migration_name>
```

Run migrations:
```bash
npm run migrate-up
```

Rollback migrations:
```bash
npm run migrate:rollback
```

## Project Structure

```
music-booking-api/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── db/             # Database related files
│   │   ├── migrations/ # Knex migrations
│   │   └── seeds/      # Database seeds
|   |   ├── models/     # Objection.js models
│   │   ├── knexfile.ts # Knex configuration
│   ├── middleware/     # Express middleware
│           
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

To get a token, authenticate using the `/api/auth/login` endpoint.

## Development Workflow

1. Create migrations for database changes
2. Create or update Objection.js models
3. Implement controllers with appropriate validation and error handling
4. Define routes and attach controllers
5. Test endpoints with Postman or similar tool

## Deployment

For production deployment:

```bash
npm run build     # Build TypeScript to JavaScript
npm run start     # Start the production server
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- [Richd0tcom](https://github.com/richd0tcom)

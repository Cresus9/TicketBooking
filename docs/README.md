# AfriTix Documentation

## Overview
AfriTix is a comprehensive event ticketing platform designed specifically for African events. The platform enables event organizers to create and manage events while allowing users to discover, book, and manage tickets for various events across Africa.

## Table of Contents
1. [Architecture](#architecture)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [API Documentation](#api-documentation)
6. [Frontend Documentation](#frontend-documentation)
7. [Backend Documentation](#backend-documentation)
8. [Security](#security)
9. [Monitoring & Logging](#monitoring--logging)
10. [Testing](#testing)

## Architecture

### System Architecture
- Frontend: React SPA with TypeScript
- Backend: NestJS REST API
- Database: PostgreSQL with Prisma ORM
- Real-time: WebSocket with Socket.io
- Caching: Redis
- Monitoring: Prometheus & Grafana
- Logging: Winston

### Key Components
- Authentication Service
- Event Management System
- Ticket Management System
- Real-time Notifications
- Payment Processing
- Admin Dashboard
- Content Management System

## Features

### User Features
- Event Discovery & Search
- Ticket Booking & Management
- Real-time Event Updates
- User Profiles
- Notification System
- Mobile-Responsive Design

### Event Management
- Event Creation & Editing
- Ticket Type Management
- Real-time Ticket Availability
- Event Analytics
- Image Gallery Management
- Event Categories

### Admin Features
- User Management
- Event Moderation
- Analytics Dashboard
- Content Management
- Security Monitoring
- System Health Monitoring

### Security Features
- JWT Authentication
- Role-Based Access Control
- Rate Limiting
- Input Validation
- XSS Protection
- CSRF Protection

## Tech Stack

### Frontend
- React 18
- TypeScript
- TailwindCSS
- React Query
- Socket.io Client
- React Router
- Lucide Icons
- React Hot Toast
- Chart.js
- Testing Library

### Backend
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Socket.io
- Winston Logger
- Prometheus
- Jest

### DevOps
- Docker
- GitHub Actions
- Prometheus
- Grafana
- Redis
- Nginx

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/afritix.git
cd afritix
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Configure environment variables:
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3000/api

# Backend (.env)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/afritix?schema=public"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

4. Start development servers:
```bash
# Start frontend
cd frontend
npm run dev

# Start backend
cd backend
npm run start:dev
```

## API Documentation

### Authentication
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/refresh
- GET /api/auth/profile

### Events
- GET /api/events
- POST /api/events
- GET /api/events/:id
- PUT /api/events/:id
- DELETE /api/events/:id
- GET /api/events/search

### Tickets
- POST /api/tickets
- GET /api/tickets/:id
- POST /api/tickets/:id/validate
- GET /api/tickets/user

### Users
- GET /api/users
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id

### Notifications
- GET /api/notifications
- PUT /api/notifications/:id/read
- POST /api/notifications/preferences

## Frontend Documentation

### Core Components
- AppRoutes: Main routing configuration
- AuthProvider: Authentication context
- EventProvider: Event management context
- NotificationProvider: Notification system
- RealtimeProvider: WebSocket connections

### Features
1. Event Discovery
   - Advanced Search
   - Filtering
   - Categories
   - Real-time Updates

2. Ticket Management
   - Booking Flow
   - QR Code Generation
   - Ticket Validation
   - Real-time Availability

3. User Dashboard
   - Booking History
   - Profile Management
   - Notification Preferences
   - Payment Methods

4. Admin Dashboard
   - Analytics
   - User Management
   - Event Management
   - Content Management

## Backend Documentation

### Core Modules
1. AuthModule
   - JWT Authentication
   - Role-Based Access
   - Password Hashing
   - Token Management

2. EventsModule
   - Event CRUD
   - Search & Filtering
   - Image Management
   - Category Management

3. TicketsModule
   - Ticket Generation
   - Validation
   - QR Code Management
   - Availability Tracking

4. NotificationsModule
   - Push Notifications
   - Email Notifications
   - Real-time Updates
   - Preferences Management

### Database Schema
Detailed database schema documentation available in `prisma/schema.prisma`

### Caching Strategy
- Event Data: 1 hour TTL
- User Data: 30 minutes TTL
- Search Results: 5 minutes TTL
- Static Content: 24 hours TTL

## Security

### Authentication
- JWT-based authentication
- Refresh token rotation
- Secure cookie handling
- Password hashing with bcrypt

### Authorization
- Role-based access control
- Resource-based permissions
- API endpoint protection
- WebSocket authentication

### Data Protection
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting

## Monitoring & Logging

### Metrics
- Request duration
- Error rates
- Active users
- System resources
- Cache hit rates

### Logging
- Application logs
- Error logs
- Audit logs
- Performance logs
- Security logs

### Alerts
- Error rate thresholds
- System resource alerts
- Security incident alerts
- Performance degradation alerts

## Testing

### Frontend Testing
- Unit Tests
- Component Tests
- Integration Tests
- E2E Tests

### Backend Testing
- Unit Tests
- Integration Tests
- E2E Tests
- Load Tests

### Test Coverage
- Frontend: >80%
- Backend: >90%
- E2E: Critical paths

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.
# iMotion Back Office 🏥

**iMotion Back Office** is a comprehensive internal management system for the iMotion therapy platform, designed to manage therapists, devices, patients, therapy sessions, and analytics.

## 🚀 Overview

The project is structured as a **full-stack TypeScript monorepo** containing:
- **client**: React SPA with modern UI/UX built with Vite
- **server**: RESTful API with NestJS and PostgreSQL

## ✨ Key Features

### 📊 **Analytics & Insights**
- **Real-time Dashboard** with today's stats
- **Advanced Analytics** with customizable filters (date range, therapist, device)
- **Session Trends** over time with interactive charts
- **Device Usage Statistics** with percentages
- **Stimuli Breakdown** analysis (Visual, Audio, Tactile)
- **Session Duration Distribution** with smart buckets
- **Therapist Activity** tracking and performance metrics

### 👥 **User Management**
- Role-based access control (Admin, Therapist, Viewer)
- User invitation system with email notifications
- Profile management
- User activity tracking

### 🏥 **Patient Management**
- Patient registration and profiles
- Diagnosis tracking
- Session history per patient
- Privacy-first design (no PHI stored)

### 📱 **Device Management**
- Device registration and tracking
- Device-therapist pairing
- Firmware version monitoring
- Connection status tracking
- Device activity logs

### 🎯 **Session Management**
- Comprehensive session tracking
- Real-time session monitoring
- Session interruption handling
- Pause/Resume functionality
- Settings change tracking
- Activity event logging

### 🔔 **Notifications**
- Customizable notification preferences
- Email and push notifications
- Session alerts
- Device status alerts
- System update notifications

## 🛠️ Tech Stack

### Frontend (client)
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: TailwindCSS 4, Radix UI, Lucide Icons
- **State Management**: @tanstack/react-query v5 (35+ hooks)
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v7
- **HTTP Client**: Axios with interceptors
- **Charts**: Recharts
- **Date Utilities**: date-fns

### Backend (server)
- **Framework**: NestJS 11
- **Language**: TypeScript 5
- **Database**: PostgreSQL 16
- **ORM**: TypeORM with migrations
- **Validation**: class-validator, class-transformer
- **API Documentation**: Swagger/OpenAPI 3
- **Security**: Helmet, CORS, rate limiting
- **Email**: Nodemailer with templates
- **Testing**: Jest + Supertest

## 📂 Project Structure

```
imotion-backoffice/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── backend/            # API services (7 services)
│   │   │   ├── api.service.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── session.service.ts
│   │   │   ├── device.service.ts
│   │   │   ├── patient.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── therapist.service.ts
│   │   │   └── notification.service.ts
│   │   ├── hooks/              # React Query hooks (35+ hooks)
│   │   │   ├── useAnalytics.ts (8 hooks)
│   │   │   ├── useSessions.ts  (5 hooks)
│   │   │   ├── useDevices.ts   (5 hooks)
│   │   │   ├── usePatients.ts  (5 hooks)
│   │   │   ├── useUsers.ts     (7 hooks)
│   │   │   ├── useTherapists.ts (4 hooks)
│   │   │   └── useNotifications.ts (6 hooks)
│   │   ├── pages/              # Application pages
│   │   │   ├── Dashboard/      # Overview & KPIs
│   │   │   ├── Analytics/      # Deep analytics
│   │   │   ├── Sessions/       # Session management
│   │   │   ├── Devices/        # Device management
│   │   │   └── Settings/       # User & system settings
│   │   ├── components/         # Reusable UI components
│   │   ├── layout/             # Layout components
│   │   ├── routing/            # Route definitions
│   │   └── context/            # React contexts
│   └── ...
├── server/                     # Backend NestJS application
│   ├── src/
│   │   ├── modules/            # Feature modules
│   │   │   ├── analytics/      # 8 analytics endpoints
│   │   │   ├── session/        # Session CRUD + lifecycle
│   │   │   ├── session-activity-log/  # Event tracking
│   │   │   ├── device/         # Device management
│   │   │   ├── device-activity-log/   # Device events
│   │   │   ├── patient/        # Patient CRUD
│   │   │   ├── user/           # User & profile management
│   │   │   ├── therapist-phone/  # Therapist management
│   │   │   ├── notification/   # Notification system
│   │   │   ├── notification-settings/  # User preferences
│   │   │   └── role/           # RBAC
│   │   ├── common/             # Shared utilities
│   │   ├── config/             # Configuration
│   │   ├── database/           # Migrations
│   │   └── seed/               # Database seeding
│   └── ...
├── .gitignore
├── DATABASE_STRUCTURE.md      # Complete database schema
└── README.md
```

## 🏁 Getting Started

### Prerequisites
- **Node.js** v18+ (v20 recommended)
- **PostgreSQL** 14+ (v16 recommended)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd imotion-backoffice
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Configuration

#### 1. Backend Setup

Navigate to `server/` and create `.env` from `.env.example`:

```bash
cd server
cp .env.example .env
```

**Configure the following environment variables:**

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=imotion_backoffice

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d

# Email (for user invitations)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@imotion.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### 2. Frontend Setup

Navigate to `client/` and create `.env` from `.env.example`:

```bash
cd ../client
cp .env.example .env
```

**Configure the API URL:**

```env
VITE_API_URL=http://localhost:3000
```

### Database Setup

1. **Create PostgreSQL database:**
   ```bash
   createdb imotion_backoffice
   ```

2. **Run migrations:**
   ```bash
   cd server
   npm run migration:run
   ```

3. **Seed initial data (optional):**
   ```bash
   npm run seed
   ```

### Running the Application

#### Start Backend (Development Mode)
```bash
cd server
npm run start:dev
```
✅ Server running on **http://localhost:3000**
✅ Swagger docs at **http://localhost:3000/api**

#### Start Frontend (Development Mode)
```bash
cd client
npm run dev
```
✅ Client running on **http://localhost:5173**

## 📚 API Documentation

The backend includes **auto-generated Swagger documentation** with all endpoints, request/response schemas, and examples.

**Access Swagger UI:**  
http://localhost:3000/api

### Available API Modules:

| Module | Endpoints | Description |
|--------|-----------|-------------|
| **Analytics** | 8 endpoints | Dashboard stats, charts, filters |
| **Sessions** | 10 endpoints | CRUD, lifecycle, activity logs |
| **Devices** | 8 endpoints | CRUD, pairing, firmware |
| **Patients** | 5 endpoints | CRUD operations |
| **Users** | 7 endpoints | Management, invitations, profile |
| **Therapist Phones** | 5 endpoints | CRUD operations |
| **Notifications** | 6 endpoints | List, mark read, settings |

## 🎣 Frontend Hooks

The client includes **35+ custom React Query hooks** for seamless API integration:

### Analytics Hooks (8)
```typescript
useDashboardStats()
useAnalyticsStats(filters)
useSessionsOverTime(filters)
useDeviceUsage(filters)
useStimuliBreakdown(filters)
useRecentSessions(filters)
useSessionDurationDistribution(filters)
useTherapistActivity(filters)
```

### Session Hooks (5)
```typescript
useSessions()
useSession(id)
useCreateSession()
useDeleteSession()
useSessionsByTherapist(id)
```

### Device Hooks (5)
```typescript
useDevices()
useDevice(id)
useCreateDevice()
useDeleteDevice()
useDevicesByTherapist(id)
```

### Patient Hooks (5)
```typescript
usePatients()
usePatient(id)
useCreatePatient()
useUpdatePatient()
useDeletePatient()
```

### User Hooks (7)
```typescript
useUsers()
useUser(id)
useCurrentUser()
useInviteUser()
useUpdateUser()
useUpdateProfile()
useDeleteUser()
```

### Notification Hooks (6)
```typescript
useNotifications()
useNotificationSettings()
useMarkNotificationRead()
useMarkAllNotificationsRead()
useDeleteNotification()
useUpdateNotificationSettings()
```

## 🧪 Testing

```bash
# Backend Unit Tests
cd server && npm test

# Backend E2E Tests
cd server && npm run test:e2e

# Backend Test Coverage
cd server && npm run test:cov

# Frontend Tests
cd client && npm test
```

## 📊 Database Schema

See **[DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md)** for complete schema documentation.

### Core Entities:

- **Users** - System users with roles
- **Roles** - Role-based access control
- **Patients** - Patient records
- **TherapistPhones** - Therapist devices
- **Devices** - Physical therapy devices
- **Sessions** - Therapy sessions
- **SessionActivityLogs** - Session event tracking
- **DeviceActivityLogs** - Device event tracking
- **Notifications** - User notifications
- **NotificationSettings** - User preferences

## 🚀 Deployment

### Backend Deployment

1. Build the application:
   ```bash
   cd server
   npm run build
   ```

2. Start production server:
   ```bash
   npm run start:prod
   ```

### Frontend Deployment

1. Build for production:
   ```bash
   cd client
   npm run build
   ```

2. Preview production build:
   ```bash
   npm run preview
   ```

3. Deploy `dist/` folder to your hosting service (Vercel, Netlify, etc.)

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Rate limiting
- Input validation
- SQL injection prevention (TypeORM)
- XSS protection

## 🔮 Future Enhancements

- [ ] Advanced AI-driven therapy recommendations
- [ ] Real-time session monitoring dashboard
- [ ] Mobile therapist app integration
- [ ] Multilingual support
- [ ] Advanced reporting & exports
- [ ] Audit log system
- [ ] Two-factor authentication (2FA)
- [ ] WebSocket for real-time updates

## 📄 License

Proprietary - © 2026 iMotion. All rights reserved.

## 👥 Team

Developed with ❤️ by the iMotion Development Team

---

**Need help?** Contact the development team or check the API documentation at `/api`

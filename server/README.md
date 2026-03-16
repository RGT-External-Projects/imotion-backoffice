# iMotion Back Office - Backend (NestJS)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your database credentials

### Database Setup

#### 1. Create Database
```bash
createdb imotion_backoffice
```

#### 2. Generate Initial Migration from Entities
```bash
npm run migration:generate src/database/migrations/InitialSchema
```

This will analyze your entities and create a migration file with all the necessary SQL.

#### 3. Run Migrations
```bash
npm run migration:run
```

## 📝 Migration Commands

### Generate Migration from Entity Changes
When you modify entities, generate a new migration:
```bash
npm run migration:generate src/database/migrations/DescriptiveNameHere
```

### Create Empty Migration
To create a custom migration manually:
```bash
npm run migration:create src/database/migrations/DescriptiveNameHere
```

### Run Pending Migrations
```bash
npm run migration:run
```

### Revert Last Migration
```bash
npm run migration:revert
```

### Drop Entire Schema (⚠️ Careful!)
```bash
npm run schema:drop
```

## 🏃 Running the Application

### Development
```bash
npm run start:dev
```

### Production Build
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 📚 API Documentation

Once the server is running, access Swagger documentation at:
```
http://localhost:3000/api/docs
```

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Project Structure

```
server/
├── src/
│   ├── modules/           # Feature modules
│   │   ├── therapist/     # Therapist module
│   │   ├── device/        # Device module
│   │   └── session/       # Session module
│   ├── config/            # Configuration files
│   ├── database/          # Database migrations
│   │   └── migrations/    # TypeORM migrations
│   ├── common/            # Shared code
│   ├── app.module.ts      # Root module
│   └── main.ts            # Entry point
├── test/                  # E2E tests
├── .env.example           # Environment variables template
└── ormconfig.ts           # TypeORM CLI configuration
```

## 🗄️ Database Schema

### Entities

#### Therapist
- System-generated UUID
- Internal reference only
- Groups devices and sessions

#### Device
- Device ID (unique)
- Linked to Therapist
- Cascade delete with therapist

#### Session
- Patient identifier (code/nickname)
- Session settings (JSONB):
  - speed
  - visualSetting
  - vibrationSetting
  - audioSettings
- Duration (in seconds)
- Timestamp
- Linked to Therapist
- Cascade delete with therapist

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Validation pipes for all inputs
- CORS enabled for specified origins
- Environment-based configuration

## 📈 Workflow

1. Create/modify entities in `src/modules/*/entities/`
2. Generate migration: `npm run migration:generate src/database/migrations/YourMigrationName`
3. Review generated migration in `src/database/migrations/`
4. Run migration: `npm run migration:run`
5. If issues, revert: `npm run migration:revert`

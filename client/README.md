# iMotion Back Office - Frontend

## 🚀 Tech Stack

- **React 19** with TypeScript
- **Vite 7** - Build tool
- **Shadcn/ui** - UI components (new-york style)
- **TailwindCSS 4** - Styling
- **React Query** - Server state management
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hook Form + Zod** - Form validation
- **Lucide React** - Icons

## 📁 Project Structure (Chareli Pattern)

```
client/src/
├── backend/              # API service layer
│   ├── api.service.ts   # Axios instance & interceptors
│   ├── therapist.service.ts
│   ├── device.service.ts
│   ├── session.service.ts
│   └── main.ts          # Export all services
│
├── components/
│   └── ui/              # Shadcn components
│
├── pages/               # Page components (to be created)
├── layout/              # Layout components (to be created)
├── routing/             # Router configuration (to be created)
├── hooks/               # Custom hooks
├── context/             # React contexts
├── config/              # Configuration files
└── lib/
    └── utils.ts         # CN helper (Shadcn)
```

## 🛠️ Getting Started

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file (already created):

```env
VITE_API_URL=http://localhost:3000/api
```

### Shadcn/ui Configuration

Shadcn is initialized with:
- **Style**: new-york
- **Base color**: neutral
- **CSS variables**: enabled
- **Path aliases**: `@/*`

To add more Shadcn components:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add form
```

## 📦 API Services

All API services are in `src/backend/`:

### Usage Example

```typescript
import { therapistService, deviceService, sessionService } from '@/backend/main';

// Get all therapists
const { data } = await therapistService.getAll();

// Create device
await deviceService.create({ 
  deviceId: 'device123', 
  therapistId: 'therapist-id' 
});

// Get sessions by therapist
const sessions = await sessionService.getByTherapist('therapist-id');
```

## 🎨 Path Aliases

Configured aliases:
- `@/*` → `./src/*`

Usage:
```typescript
import { Button } from '@/components/ui/button';
import { therapistService } from '@/backend/main';
import { cn } from '@/lib/utils';
```

## 📋 Next Steps

1. **Create Layouts**
   - RootLayout.tsx
   - MainLayout.tsx

2. **Create Pages**
   - Home
   - Therapists
   - Devices
   - Sessions

3. **Setup Routing**
   - React Router configuration
   - Route definitions

4. **Add More Shadcn Components**
   - Table (for data display)
   - Dialog (for modals)
   - Form (for forms)
   - Select, Input, etc.

5. **Setup React Query**
   - QueryClient provider
   - Create custom hooks with useQuery/useMutation

## 🔗 Backend API

Backend is running on: `http://localhost:3000`
API Documentation (Swagger): `http://localhost:3000/api/docs`

## 📚 Resources

- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Router Documentation](https://reactrouter.com/)

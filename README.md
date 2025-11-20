# Converso Inventory Manager (CIM)

A comprehensive multi-tenant inventory management system with POS, credit tracking, and offline-first architecture.

## Features

- **Multi-tenant Architecture**: Organizations with role-based access (Owner, Manager, Cashier)
- **Organization Approval Workflow**: New organizations require admin approval
- **Point of Sale (POS)**: Fast billing with offline support
- **Inventory Management**: Track stock across multiple stores
- **Customer & Credit Management**: Track credit accounts (Udhar)
- **Reports & Analytics**: Daily sales, cash closing, and inventory reports
- **Offline-First**: Full POS functionality works without internet
- **Real-time Sync**: Automatic background synchronization
- **Dark Mode**: Beautiful UI that adapts to light/dark themes

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui components
- TanStack Query for data fetching
- Dexie.js for offline storage (IndexedDB)
- Wouter for routing

### Backend
- Supabase (PostgreSQL + Auth + Realtime)
- Express.js for custom API routes
- WebSocket support for real-time updates

## Getting Started

### 1. Supabase Setup

1. Create a Supabase project at https://supabase.com
2. Run the SQL schema:
   - Open Supabase SQL Editor
   - Copy contents from `supabase-schema.sql`
   - Execute the query

See `SUPABASE_SETUP.md` for detailed instructions.

### 2. Environment Variables

The following environment variables are already configured:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public key

### 3. Run the Application

```bash
npm install
npm run dev
```

The application will be available at the provided Replit URL.

## Usage

### For New Users

1. **Sign Up**: Create an account and organization
2. **Wait for Approval**: Organization must be approved by admin
3. **Contact Admin**: Use the WhatsApp button to request approval (https://wa.me/923147615183)
4. **Admin Approval**: Admin sets `is_approved = true` in Supabase organizations table
5. **Access System**: Once approved, you can access all features

### For Converso Empire Admin

To approve an organization:
1. Go to Supabase → Table Editor → organizations
2. Find the pending organization
3. Set `is_approved` to `true`
4. User will immediately gain access

## Key Features

### Point of Sale (POS)
- Product search with autocomplete
- Cart management with quantity controls
- Multiple payment methods (Cash, Credit, Mixed)
- Discount support
- Keyboard shortcuts (F2=Cash, F3=Credit, ESC=Clear)
- Works offline with automatic sync

### Inventory Management
- Track stock levels per product per store
- Quick adjustment buttons
- Complete audit log with user tracking
- Low stock alerts

### Credit Management (Udhar)
- Track customer credit accounts
- Payment collection
- Transaction history
- Aging analysis (0-30, 31-60, 60+ days)

### Reports
- Daily sales summary
- Cash closing with variance detection
- Low stock alerts
- Credits outstanding

## Offline Support

The application uses an offline-first architecture:

1. **Local Storage**: All data cached in IndexedDB using Dexie.js
2. **Sync Queue**: Offline actions queued for later sync
3. **Auto Sync**: Background sync every 30 seconds when online
4. **Conflict Resolution**: Event-sourcing with UUID deduplication

### How it Works

- When offline, all POS sales and inventory changes are stored locally
- When connection is restored, data automatically syncs to Supabase
- Real-time updates via Supabase Realtime keep all users in sync

## Architecture

```
client/
  ├── src/
  │   ├── components/     # Reusable UI components
  │   ├── pages/          # Page components
  │   ├── lib/            # Utilities and services
  │   │   ├── supabase.ts       # Supabase client
  │   │   ├── auth-context.tsx  # Authentication
  │   │   ├── db.ts             # Dexie offline database
  │   │   └── sync-manager.ts   # Background sync
  │   └── App.tsx         # Main app with routing

server/
  ├── index.ts      # Express server
  └── routes.ts     # API routes

shared/
  └── schema.ts     # TypeScript types and Zod schemas
```

## Development

The application follows a schema-first development approach:

1. **Shared Types**: All data models defined in `shared/schema.ts`
2. **Database Schema**: Supabase tables match TypeScript types
3. **API Layer**: Express routes for custom business logic
4. **Frontend**: React components with full type safety

## Multi-tenancy

- All data is scoped by `organizationId`
- Row Level Security (RLS) enforces data isolation
- Users can only access their organization's data
- Roles control permissions (Owner > Manager > Cashier)

## Security

- Supabase Auth handles authentication
- Row Level Security on all tables
- API keys stored securely in environment variables
- HTTPS enforced in production

## Support

For organization approval and support:
- WhatsApp: https://wa.me/923147615183
- Contact: Converso Empire owner

## License

Proprietary - Converso Empire

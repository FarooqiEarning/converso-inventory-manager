# Converso Inventory Manager (CIM)

## Overview

Converso Inventory Manager (CIM) is a comprehensive multi-tenant inventory management system designed for retail businesses. The application provides point-of-sale functionality, inventory tracking across multiple stores, customer credit management (Udhar), and offline-first architecture with real-time synchronization. The system implements organization approval workflows where new organizations require admin approval before full access is granted.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Multi-Tenant Architecture

**Problem**: Support multiple independent organizations (businesses) within a single application instance.

**Solution**: Organization-based data isolation with role-based access control (RBAC). All data entities are scoped to an `organizationId`, ensuring complete data separation between tenants.

**Design Decisions**:
- Three-tier user roles: Owner, Manager, and Cashier with hierarchical permissions
- Organization approval workflow requiring admin verification before activation
- Session-based authentication using Supabase Auth with JWT tokens
- User-organization relationships allowing users to belong to multiple organizations

### Offline-First Architecture

**Problem**: Retail operations cannot afford connectivity-dependent downtime, especially during active sales.

**Solution**: Local-first data architecture using IndexedDB with background synchronization.

**Key Components**:
- **Dexie.js**: Provides IndexedDB wrapper for structured offline storage
- **Sync Queue**: Tracks all offline operations (sales, inventory adjustments, payments) for later synchronization
- **Sync Manager**: Background process that periodically syncs pending operations when connectivity is restored
- **Conflict Resolution**: Last-write-wins strategy with timestamp-based ordering

**Pros**: Uninterrupted POS functionality regardless of network status, reduced server load, faster user experience
**Cons**: Requires careful conflict resolution, increased client-side complexity, storage limitations on client devices

### Frontend Architecture

**Framework**: React 18 with TypeScript for type safety and modern component patterns

**Routing**: Wouter (lightweight React router) for declarative client-side routing

**State Management**:
- TanStack Query (React Query) for server state management with automatic caching and background refetching
- React Context for global authentication state
- Local component state for UI-specific concerns

**UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling

**Design System**:
- Typography: Inter for general UI, JetBrains Mono for numerical/monospaced data
- Theming: Light/dark mode support with CSS variables
- Responsive: Mobile-first design with breakpoint-specific layouts

**Alternatives Considered**: Next.js was considered for SSR capabilities but rejected to maintain simpler deployment model and prioritize offline-first approach

### Backend Architecture

**Primary Backend**: Supabase (managed PostgreSQL + Authentication + Realtime)

**Custom API Layer**: Express.js server for business logic that cannot be handled via Supabase RLS (Row Level Security) policies

**Database Design**:
- PostgreSQL as primary data store
- Row Level Security (RLS) policies for multi-tenant data isolation
- Indexed foreign keys for query performance
- Timestamp-based audit trails on all entities

**Key Entities**:
- Organizations, Users, Stores
- Products, InventoryItems, InventoryAdjustments
- Customers, Sales, SaleItems
- Credits, CreditTransactions
- CashClosings for end-of-day reconciliation

**Authentication Flow**:
1. Supabase Auth handles credential verification
2. Custom user profile data stored in `users` table
3. Organization membership verified via `organizationId` relationship
4. RLS policies enforce tenant isolation at database level

### Data Synchronization Strategy

**Challenge**: Reconcile offline operations with server state when connectivity returns.

**Approach**:
- Operations queued in IndexedDB `syncQueue` table with metadata (type, timestamp, synced status)
- Background sync process runs every 30 seconds when online
- Each sync item processed sequentially with server-side validation
- Failed syncs remain in queue for retry
- Successfully synced items marked but retained for audit purposes

**Trade-offs**: Sequential processing prevents overwhelming server but increases sync time; timestamp-based ordering may not capture all business logic dependencies

### Real-time Updates

**Technology**: Supabase Realtime (WebSocket-based) for live data updates

**Enabled Tables**:
- `inventory_items` for stock level changes
- `sales` for transaction notifications
- `products` for catalog updates

**Purpose**: Ensure multiple users see consistent inventory levels and prevent overselling

## External Dependencies

### Core Infrastructure

**Supabase**: Backend-as-a-Service providing PostgreSQL database, authentication, and real-time subscriptions
- Database hosting and management
- Row-level security policies
- JWT-based authentication
- WebSocket real-time subscriptions

**Configuration Required**:
- `VITE_SUPABASE_URL`: Project-specific Supabase API endpoint
- `VITE_SUPABASE_ANON_KEY`: Public API key for client-side operations

### UI Component Libraries

**Radix UI**: Unstyled, accessible component primitives (dialogs, dropdowns, popovers, etc.)

**Shadcn/ui**: Pre-styled components built on Radix UI with customizable design tokens

**Tailwind CSS**: Utility-first CSS framework for styling

### Client-Side Data Management

**Dexie.js**: IndexedDB wrapper for offline storage and sync queue management

**TanStack Query**: Data fetching and caching library with automatic background refetching and invalidation

### Routing & Forms

**Wouter**: Minimalist React router (~1.2KB)

**React Hook Form**: Form state management with validation

**Zod**: TypeScript-first schema validation for forms and API contracts

### Development & Build Tools

**Vite**: Frontend build tool and development server

**TypeScript**: Static typing for both client and server code

**ESBuild**: JavaScript bundler for production builds

**Drizzle Kit**: Database migration tool (configured but Supabase schema currently managed via SQL)

### Typography

**Google Fonts**:
- Inter: Primary sans-serif font family
- JetBrains Mono: Monospaced font for SKUs, currency, and numerical data

### Future Integration Points

The system is architected to support:
- Payment gateway integration for card transactions
- SMS notifications for credit payment reminders
- WhatsApp Business API for customer communications
- Export to accounting software (QuickBooks, Xero)
# Design Guidelines: Converso Inventory Manager (CIM)

## Design Approach

**Selected System**: Shadcn/ui with Material Design influences and Linear-inspired typography
**Rationale**: Enterprise inventory management demands clarity, efficiency, and data density. Shadcn/ui provides accessible, functional components while maintaining modern aesthetics suitable for professional business tools.

**Core Design Principles**:
- Functionality over decoration - every element serves a purpose
- Information hierarchy - critical business data always prominent
- Speed and efficiency - minimize clicks, maximize visibility
- Professional consistency - corporate credibility essential

---

## Typography

**Font System**: Inter (primary), JetBrains Mono (monospace for SKU/numbers)

**Hierarchy**:
- Page titles: text-3xl font-bold (32px)
- Section headers: text-xl font-semibold (20px)
- Card titles: text-lg font-medium (18px)
- Body text: text-base (16px)
- Labels/metadata: text-sm text-muted-foreground (14px)
- Table data: text-sm (14px)
- Small details: text-xs (12px)

**Data Emphasis**: Use JetBrains Mono font-mono for monetary values, SKUs, quantities, and timestamps to enhance scannability.

---

## Layout System

**Spacing Scale**: Use Tailwind units of 1, 2, 4, 6, 8, 12, 16 for consistent rhythm
- Component padding: p-4 to p-6
- Section spacing: space-y-6 to space-y-8
- Card gaps: gap-4
- Form field spacing: space-y-4

**Dashboard Grid**: 12-column grid with responsive breakpoints
- Desktop (lg): Full sidebar + main content
- Tablet (md): Collapsible sidebar
- Mobile: Bottom nav + full-width content

**Max Widths**:
- Dashboard content: max-w-7xl
- Forms/dialogs: max-w-2xl
- Reports: max-w-6xl

---

## Component Library

### Navigation Structure

**Sidebar** (Desktop):
- Width: w-64, fixed position
- Navigation items with icons (Lucide React)
- Active state: bg-accent with border-l-4 border-primary
- Grouped sections: Dashboard, Operations (POS, Products, Inventory), Customers (Customers, Credits), Analytics (Reports), Admin (Settings)
- Organization logo at top
- User profile at bottom

**Top Bar**:
- Height: h-16
- Store selector dropdown (left)
- Global search (center) - w-96 max-w-md
- Notifications bell, user menu (right)
- Breadcrumbs below on larger screens

**Mobile Bottom Nav**: Fixed bottom, 5 key icons (Dashboard, POS, Inventory, Credits, More)

### Data Display Components

**DataTables**:
- Sticky header with shadow on scroll
- Alternating row backgrounds (subtle)
- Hover state: bg-muted/50
- Sortable columns with arrows
- Row actions: dropdown menu (right-aligned)
- Pagination: bottom-right
- Density toggle: compact/comfortable/spacious

**Cards**:
- Rounded corners: rounded-lg
- Border: border
- Shadow: shadow-sm, hover:shadow-md transition
- Padding: p-6
- Header with title + action button

**Stat Cards** (Dashboard):
- Large number: text-3xl font-bold
- Label: text-sm text-muted-foreground
- Trend indicator: small chart or percentage change
- Icon in colored circle (top-right)

### Form Components

**Input Fields**:
- Height: h-10
- Border radius: rounded-md
- Labels above: text-sm font-medium mb-2
- Helper text below: text-xs text-muted-foreground
- Error state: border-destructive, text-destructive below

**Buttons**:
- Primary: High contrast, prominent for main actions
- Secondary: Outline style
- Ghost: For tertiary actions
- Destructive: For delete/remove
- Heights: h-10 (default), h-9 (compact)

**Dialogs/Modals**:
- Max width: max-w-2xl
- Padding: p-6
- Header with close button
- Footer with action buttons (right-aligned)

---

## Page-Specific Guidelines

### Landing/Login Page
- Centered card: max-w-md
- CIM logo + tagline at top
- Login form with email/password
- "Create Account" link below
- Subtle gradient background
- Organization approval notice for new users

### Dashboard Home
- 4-column stat grid (1 col mobile, 2 col tablet)
- Recent sales table (top 10)
- Low stock alerts card
- Outstanding credits summary
- Quick actions: "New Sale", "Add Product"

### POS Page (Critical Priority)
**Two-column layout (lg:grid-cols-2, gap-6)**:

**Left Column** - Product Selection:
- Search bar at top: large, autocomplete with thumbnails
- Category filter tabs below
- Product grid: grid-cols-2 gap-4
- Product cards: image, name, SKU (mono), price (bold), stock badge, "Add" button

**Right Column** - Cart (sticky):
- Cart items list with qty spinners
- Subtotal, discount input, total (large, bold)
- Customer selector (for credit)
- Payment method tabs (Cash/Credit/Mixed)
- Action buttons stacked: "Complete Sale" (primary, large), "Hold", "Clear" (ghost)
- Keyboard shortcuts hint at bottom

### Products Management
- DataTable with search, filters, bulk actions
- Columns: Thumbnail, Name, SKU (mono), Category, Cost, Sell Price, Stock (badge), Actions
- "Add Product" button (top-right, primary)
- Edit dialog with image upload preview

### Reports Page
- Date range picker (top)
- Tab navigation: Daily Sales, Cash Closing, P&L, Inventory, Credits
- Charts: Bar/line for trends (recharts)
- Summary cards above charts
- Export button (PDF/Excel)

### Organization Approval Pending
- Centered message card
- Status badge: "Pending Approval"
- Instructions text
- WhatsApp button: "Request Approval" → https://wa.me/923147615183
- Logout option

---

## Offline Indicators
- Toast notification: "You're offline" with sync icon
- Pending sync badge in top bar showing queue count
- Manual sync button when online
- Success toast: "X items synced"

---

## Images
No hero images needed - this is a business application, not marketing. Use:
- Logo/branding in navigation
- Product thumbnails in grids/tables
- User avatars in profile menus
- Empty state illustrations for blank tables
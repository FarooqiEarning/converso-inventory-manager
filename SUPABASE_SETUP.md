# Supabase Setup Instructions

## Step 1: Create Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase-schema.sql` file
5. Paste it into the SQL editor
6. Click **Run** to execute the schema

This will create all necessary tables, indexes, Row Level Security policies, and triggers.

## Step 2: Verify Tables

After running the schema, verify that all tables were created:

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - organizations
   - users
   - stores
   - products
   - inventory_items
   - inventory_adjustments
   - customers
   - sales
   - sale_items
   - credits
   - credit_transactions
   - cash_closings

## Step 3: Enable Realtime (Optional but Recommended)

For real-time inventory updates:

1. Go to **Database** → **Replication**
2. Enable replication for these tables:
   - inventory_items
   - sales
   - products

## Step 4: Test Organization Approval

To approve an organization:

1. After a user signs up, go to **Table Editor** → **organizations**
2. Find their organization
3. Set `is_approved` to `true`
4. The user will now have full access to the system

## Development Notes

- All tables have Row Level Security (RLS) enabled
- Users can only access data within their own organization
- The `isApproved` flag controls organization access
- Contact https://wa.me/923147615183 for organization approval requests

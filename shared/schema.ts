import { z } from "zod";

// ============================================================================
// ENUMS
// ============================================================================

export const UserRole = {
  OWNER: "OWNER",
  MANAGER: "MANAGER",
  CASHIER: "CASHIER",
} as const;

export const PaymentType = {
  CASH: "CASH",
  CREDIT: "CREDIT",
  MIXED: "MIXED",
} as const;

export const AdjustmentType = {
  IN: "IN",
  OUT: "OUT",
} as const;

// ============================================================================
// ORGANIZATION
// ============================================================================

export const organizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  isApproved: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertOrganizationSchema = organizationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Organization = z.infer<typeof organizationSchema>;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;

// ============================================================================
// USER
// ============================================================================

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum([UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER]),
  organizationId: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// ============================================================================
// STORE
// ============================================================================

export const storeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  address: z.string().optional(),
  organizationId: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertStoreSchema = storeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Store = z.infer<typeof storeSchema>;
export type InsertStore = z.infer<typeof insertStoreSchema>;

// ============================================================================
// PRODUCT
// ============================================================================

export const productSchema = z.object({
  id: z.string().uuid(),
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.string().optional(),
  unit: z.string().optional(),
  costPrice: z.number().min(0),
  sellPrice: z.number().min(0),
  taxPercent: z.number().min(0).max(100).optional(),
  imageUrl: z.string().optional(),
  organizationId: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// ============================================================================
// INVENTORY ITEM
// ============================================================================

export const inventoryItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  storeId: z.string().uuid(),
  quantity: z.number().min(0),
  organizationId: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertInventoryItemSchema = inventoryItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InventoryItem = z.infer<typeof inventoryItemSchema>;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;

// ============================================================================
// INVENTORY ADJUSTMENT (for audit log)
// ============================================================================

export const inventoryAdjustmentSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  storeId: z.string().uuid(),
  type: z.enum([AdjustmentType.IN, AdjustmentType.OUT]),
  quantity: z.number().min(0),
  reason: z.string().optional(),
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  createdAt: z.string(),
});

export const insertInventoryAdjustmentSchema = inventoryAdjustmentSchema.omit({
  id: true,
  createdAt: true,
});

export type InventoryAdjustment = z.infer<typeof inventoryAdjustmentSchema>;
export type InsertInventoryAdjustment = z.infer<typeof insertInventoryAdjustmentSchema>;

// ============================================================================
// CUSTOMER
// ============================================================================

export const customerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  organizationId: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertCustomerSchema = customerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Customer = z.infer<typeof customerSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

// ============================================================================
// SALE
// ============================================================================

export const saleSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
  customerId: z.string().uuid().optional(),
  subtotal: z.number().min(0),
  discount: z.number().min(0),
  total: z.number().min(0),
  paymentType: z.enum([PaymentType.CASH, PaymentType.CREDIT, PaymentType.MIXED]),
  cashAmount: z.number().min(0).optional(),
  creditAmount: z.number().min(0).optional(),
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  createdAt: z.string(),
});

export const insertSaleSchema = saleSchema.omit({
  id: true,
  createdAt: true,
});

export type Sale = z.infer<typeof saleSchema>;
export type InsertSale = z.infer<typeof insertSaleSchema>;

// ============================================================================
// SALE ITEM
// ============================================================================

export const saleItemSchema = z.object({
  id: z.string().uuid(),
  saleId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().min(0),
  unitPrice: z.number().min(0),
  lineTotal: z.number().min(0),
  organizationId: z.string().uuid(),
  createdAt: z.string(),
});

export const insertSaleItemSchema = saleItemSchema.omit({
  id: true,
  createdAt: true,
});

export type SaleItem = z.infer<typeof saleItemSchema>;
export type InsertSaleItem = z.infer<typeof insertSaleItemSchema>;

// ============================================================================
// CREDIT
// ============================================================================

export const creditSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  totalAmount: z.number().min(0),
  paidAmount: z.number().min(0),
  outstandingAmount: z.number().min(0),
  organizationId: z.string().uuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const insertCreditSchema = creditSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Credit = z.infer<typeof creditSchema>;
export type InsertCredit = z.infer<typeof insertCreditSchema>;

// ============================================================================
// CREDIT TRANSACTION
// ============================================================================

export const creditTransactionSchema = z.object({
  id: z.string().uuid(),
  creditId: z.string().uuid(),
  type: z.enum(["CREDIT_GIVEN", "PAYMENT_RECEIVED"]),
  amount: z.number().min(0),
  note: z.string().optional(),
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  createdAt: z.string(),
});

export const insertCreditTransactionSchema = creditTransactionSchema.omit({
  id: true,
  createdAt: true,
});

export type CreditTransaction = z.infer<typeof creditTransactionSchema>;
export type InsertCreditTransaction = z.infer<typeof insertCreditTransactionSchema>;

// ============================================================================
// CASH CLOSING
// ============================================================================

export const cashClosingSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
  date: z.string(),
  openingCash: z.number().min(0),
  systemSales: z.number().min(0),
  expectedClosing: z.number().min(0),
  actualClosing: z.number().min(0),
  variance: z.number(),
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  createdAt: z.string(),
});

export const insertCashClosingSchema = cashClosingSchema.omit({
  id: true,
  createdAt: true,
});

export type CashClosing = z.infer<typeof cashClosingSchema>;
export type InsertCashClosing = z.infer<typeof insertCashClosingSchema>;

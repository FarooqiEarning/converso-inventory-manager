import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Minus, Plus, X, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CartItem = {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
};

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentType, setPaymentType] = useState<"CASH" | "CREDIT" | "MIXED">("CASH");
  const [cashAmount, setCashAmount] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const products = []; // Will be loaded from Supabase in Task 2

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  function addToCart(product: any) {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function updateQuantity(id: string, delta: number) {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id: string) {
    setCart(cart.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
    setDiscount(0);
    setCashAmount("");
    setSelectedCustomer("");
  }

  function completeSale() {
    // Will implement in Task 2
    alert("Sale will be processed in Task 2!");
    clearCart();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
        <p className="text-muted-foreground mt-1">
          Quick and efficient billing system
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Product Search */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name or SKU..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-product-search"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                No products available. Add products from the Products page.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Cart & Checkout */}
        <div className="space-y-4">
          <Card className="lg:sticky lg:top-4">
            <CardHeader>
              <CardTitle>Cart</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Cart is empty. Add products to start a sale.
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                      data-testid={`cart-item-${item.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          SKU: {item.sku}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-mono w-8 text-center" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold font-mono">
                          PKR {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{item.price.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => removeFromCart(item.id)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono" data-testid="text-subtotal">
                    PKR {subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="discount" className="text-muted-foreground">
                    Discount (%)
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-24 font-mono"
                    data-testid="input-discount"
                  />
                  {discount > 0 && (
                    <span className="text-sm font-mono" data-testid="text-discount-amount">
                      -PKR {discountAmount.toFixed(2)}
                    </span>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="font-mono" data-testid="text-total">
                    PKR {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Payment Method</Label>
                <Tabs value={paymentType} onValueChange={(v: any) => setPaymentType(v)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="CASH" data-testid="tab-payment-cash">Cash</TabsTrigger>
                    <TabsTrigger value="CREDIT" data-testid="tab-payment-credit">Credit</TabsTrigger>
                    <TabsTrigger value="MIXED" data-testid="tab-payment-mixed">Mixed</TabsTrigger>
                  </TabsList>

                  <TabsContent value="CASH" className="mt-3">
                    <p className="text-sm text-muted-foreground">
                      Full payment in cash
                    </p>
                  </TabsContent>

                  <TabsContent value="CREDIT" className="mt-3 space-y-3">
                    <div>
                      <Label htmlFor="customer">Select Customer</Label>
                      <Select
                        value={selectedCustomer}
                        onValueChange={setSelectedCustomer}
                      >
                        <SelectTrigger id="customer" data-testid="select-customer">
                          <SelectValue placeholder="Choose customer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No customers yet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="MIXED" className="mt-3 space-y-3">
                    <div>
                      <Label htmlFor="cash-amount">Cash Amount</Label>
                      <Input
                        id="cash-amount"
                        type="number"
                        min="0"
                        max={total}
                        placeholder="0.00"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        className="font-mono"
                        data-testid="input-cash-amount"
                      />
                      {cashAmount && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Credit: PKR {(total - Number(cashAmount)).toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="customer-mixed">Select Customer</Label>
                      <Select
                        value={selectedCustomer}
                        onValueChange={setSelectedCustomer}
                      >
                        <SelectTrigger id="customer-mixed">
                          <SelectValue placeholder="Choose customer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No customers yet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  disabled={cart.length === 0}
                  onClick={completeSale}
                  data-testid="button-complete-sale"
                >
                  Complete Sale
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" disabled data-testid="button-hold-sale">
                    Hold Sale
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={clearCart}
                    disabled={cart.length === 0}
                    data-testid="button-clear-cart"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground pt-2">
                  Keyboard: F2=Cash • F3=Credit • ESC=Clear
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

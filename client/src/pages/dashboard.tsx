import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, Users, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDailySalesStats } from "@/hooks/use-sales";
import { useProducts } from "@/hooks/use-products";
import { useLowStockItems } from "@/hooks/use-inventory";
import { useCreditStats } from "@/hooks/use-credits";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: salesStats, isLoading: salesLoading } = useDailySalesStats();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: lowStock, isLoading: lowStockLoading } = useLowStockItems();
  const { data: creditStats, isLoading: creditsLoading } = useCreditStats();

  const stats = [
    {
      title: "Today's Sales",
      value: salesLoading ? <Skeleton className="h-8 w-24" /> : `PKR ${salesStats?.total.toFixed(2) || '0.00'}`,
      change: salesLoading ? '...' : `${salesStats?.count || 0} transactions`,
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-500",
    },
    {
      title: "Products",
      value: productsLoading ? <Skeleton className="h-8 w-16" /> : `${products?.length || 0}`,
      change: "Total items",
      icon: Package,
      color: "text-blue-600 dark:text-blue-500",
    },
    {
      title: "Low Stock Alerts",
      value: lowStockLoading ? <Skeleton className="h-8 w-16" /> : `${lowStock?.length || 0}`,
      change: "Items need restock",
      icon: AlertCircle,
      color: "text-amber-600 dark:text-amber-500",
    },
    {
      title: "Credits Outstanding",
      value: creditsLoading ? <Skeleton className="h-8 w-24" /> : `PKR ${creditStats?.total.toFixed(2) || '0.00'}`,
      change: creditsLoading ? '...' : `From ${creditStats?.count || 0} customers`,
      icon: Users,
      color: "text-purple-600 dark:text-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your business.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} data-testid={`card-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`rounded-full p-2 bg-muted ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono" data-testid={`text-${stat.title.toLowerCase().replace(/\s+/g, '-')}-value`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              No sales yet. Start selling from the POS page!
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              All products are well stocked
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <a
            href="/pos"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover-elevate active-elevate-2 transition-colors"
            data-testid="link-quick-pos"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium">New Sale</span>
          </a>

          <a
            href="/products"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover-elevate active-elevate-2 transition-colors"
            data-testid="link-quick-products"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium">Add Product</span>
          </a>

          <a
            href="/customers"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover-elevate active-elevate-2 transition-colors"
            data-testid="link-quick-customers"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium">Add Customer</span>
          </a>

          <a
            href="/reports"
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover-elevate active-elevate-2 transition-colors"
            data-testid="link-quick-reports"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-medium">View Reports</span>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

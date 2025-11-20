import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, TrendingUp, Package, CreditCard } from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Analyze business performance and insights
          </p>
        </div>
        <Button variant="outline" data-testid="button-export">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Tabs defaultValue="daily-sales">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="daily-sales" data-testid="tab-daily-sales">Daily Sales</TabsTrigger>
          <TabsTrigger value="cash-closing" data-testid="tab-cash-closing">Cash Closing</TabsTrigger>
          <TabsTrigger value="inventory" data-testid="tab-inventory">Inventory</TabsTrigger>
          <TabsTrigger value="credits" data-testid="tab-credits">Credits</TabsTrigger>
        </TabsList>

        <TabsContent value="daily-sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-mono">PKR 0.00</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cash Sales</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-mono">PKR 0.00</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Credit Sales</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold font-mono">PKR 0.00</div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center py-12 text-muted-foreground border rounded-lg">
                No sales data available for today
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cash-closing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Cash Closing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="opening-cash">Opening Cash</Label>
                  <Input
                    id="opening-cash"
                    type="number"
                    placeholder="0.00"
                    className="font-mono"
                    data-testid="input-opening-cash"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actual-closing">Actual Closing Cash</Label>
                  <Input
                    id="actual-closing"
                    type="number"
                    placeholder="0.00"
                    className="font-mono"
                    data-testid="input-actual-closing"
                  />
                </div>
              </div>

              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">System Sales</span>
                  <span className="font-mono">PKR 0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected Closing</span>
                  <span className="font-mono">PKR 0.00</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Variance</span>
                  <span className="font-mono">PKR 0.00</span>
                </div>
              </div>

              <Button className="w-full" data-testid="button-save-closing">
                Save Cash Closing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground border rounded-lg">
                No inventory data available
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credits Outstanding Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground border rounded-lg">
                No credit data available
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

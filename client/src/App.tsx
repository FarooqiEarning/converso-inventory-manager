import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { OfflineIndicator } from "@/components/offline-indicator";
import { startSyncManager } from "@/lib/sync-manager";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import PendingApproval from "@/pages/pending-approval";
import Dashboard from "@/pages/dashboard";
import POS from "@/pages/pos";
import Products from "@/pages/products";
import Inventory from "@/pages/inventory";
import Customers from "@/pages/customers";
import Credits from "@/pages/credits";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, user, organization, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return <Redirect to="/" />;
  }

  if (!organization?.isApproved) {
    return <Redirect to="/pending-approval" />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <PublicRoute>
          <Landing />
        </PublicRoute>
      </Route>

      <Route path="/pending-approval">
        <PendingApproval />
      </Route>

      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/pos">
        <ProtectedRoute>
          <DashboardLayout>
            <POS />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/products">
        <ProtectedRoute>
          <DashboardLayout>
            <Products />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/inventory">
        <ProtectedRoute>
          <DashboardLayout>
            <Inventory />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/customers">
        <ProtectedRoute>
          <DashboardLayout>
            <Customers />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/credits">
        <ProtectedRoute>
          <DashboardLayout>
            <Credits />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/reports">
        <ProtectedRoute>
          <DashboardLayout>
            <Reports />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/settings">
        <ProtectedRoute>
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  useEffect(() => {
    startSyncManager();
  }, []);

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b gap-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-4">
              <OfflineIndicator />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

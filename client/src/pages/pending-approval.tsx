import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, MessageCircle, LogOut } from "lucide-react";
import { useLocation } from "wouter";

export default function PendingApproval() {
  const { organization, user, signOut } = useAuth();
  const [, setLocation] = useLocation();

  async function handleSignOut() {
    await signOut();
    setLocation("/");
  }

  function handleWhatsApp() {
    window.open("https://wa.me/923147615183", "_blank");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20">
              <Clock className="h-8 w-8 text-amber-600 dark:text-amber-500" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Organization Pending Approval</CardTitle>
            <CardDescription className="text-base mt-2">
              Your organization is awaiting approval from Converso Empire
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Organization</p>
                <p className="font-semibold">{organization?.name}</p>
              </div>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500" data-testid="badge-status">
                Pending
              </Badge>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Account Owner</p>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
            </div>
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              <strong>What happens next?</strong>
              <br />
              Your organization request has been submitted successfully. Once approved by the
              Converso Empire administrator, you'll be able to access all features including:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Point of Sale (POS) system</li>
                <li>Inventory management</li>
                <li>Customer and credit tracking</li>
                <li>Reports and analytics</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button
              onClick={handleWhatsApp}
              className="w-full"
              size="lg"
              data-testid="button-whatsapp"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Request Approval via WhatsApp
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Contact Converso Empire owner to expedite your approval
            </p>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full"
              data-testid="button-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Package, TrendingUp, Users, CreditCard } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupOrgName, setSignupOrgName] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);

    try {
      await signIn(loginEmail, loginPassword);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSignupLoading(true);

    try {
      await signUp(signupEmail, signupPassword, signupName, signupOrgName);
      toast({
        title: "Account created!",
        description: "Please wait for organization approval.",
      });
      setLocation("/pending-approval");
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSignupLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Converso Inventory Manager
            </h1>
            <p className="text-lg text-muted-foreground">
              Professional multi-tenant inventory management with POS, credit tracking, and offline support
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-6">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Smart Inventory</h3>
              <p className="text-sm text-muted-foreground">
                Track stock levels across multiple stores in real-time
              </p>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Sales Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive reports and daily cash closing
              </p>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">POS System</h3>
              <p className="text-sm text-muted-foreground">
                Fast billing with offline support and credit management
              </p>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Multi-tenant</h3>
              <p className="text-sm text-muted-foreground">
                Role-based access for owners, managers, and cashiers
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Sign in to your account or create a new organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" data-testid="tab-login">Sign In</TabsTrigger>
                <TabsTrigger value="signup" data-testid="tab-signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      data-testid="input-login-email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      data-testid="input-login-password"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginLoading}
                    data-testid="button-login-submit"
                  >
                    {loginLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Your Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      data-testid="input-signup-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      data-testid="input-signup-email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      data-testid="input-signup-password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-org">Organization Name</Label>
                    <Input
                      id="signup-org"
                      type="text"
                      placeholder="My Store"
                      value={signupOrgName}
                      onChange={(e) => setSignupOrgName(e.target.value)}
                      required
                      data-testid="input-signup-org"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={signupLoading}
                    data-testid="button-signup-submit"
                  >
                    {signupLoading ? "Creating account..." : "Create Account"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Your organization will require approval before you can access all features
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

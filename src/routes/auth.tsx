import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account | Adharsh's Mart" },
      { name: "description", content: "Access your Adharsh's Mart orders, wishlist and saved addresses. Demo authentication — no real credentials are verified." },
      { property: "og:title", content: "Sign in | Adharsh's Mart" },
      { property: "og:description", content: "Sign in to Adharsh's Mart to track orders and sync your cart." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn } = useStore();
  const navigate = useNavigate();
  const [login, setLogin] = useState({ id: "", password: "" });
  const [signup, setSignup] = useState({ name: "", email: "", phone: "", password: "" });

  const demoSignIn = (name: string, email: string, phone: string) => {
    signIn({ name, email, phone });
    toast.success("Signed in to the demo account", { description: "This is a simulated session stored on this device only." });
    navigate({ to: "/account" });
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-12 sm:px-5">
      <img src={logo} alt="" width={48} height={48} className="size-12" />
      <h1 className="mt-3 text-2xl font-bold">Welcome to Adharsh's Mart</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">Everything you need. Delivered smarter.</p>

      <div className="surface mt-6 w-full p-6">
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-3 pt-4">
            <div>
              <Label htmlFor="login-id" className="mb-1 block">
                Email or phone
              </Label>
              <Input id="login-id" value={login.id} onChange={(e) => setLogin((l) => ({ ...l, id: e.target.value }))} placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="login-pw" className="mb-1 block">
                Password
              </Label>
              <Input id="login-pw" type="password" value={login.password} onChange={(e) => setLogin((l) => ({ ...l, password: e.target.value }))} />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (!login.id || !login.password) {
                  toast.error("Enter your email/phone and password");
                  return;
                }
                demoSignIn(login.id.split("@")[0] || "Shopper", login.id.includes("@") ? login.id : `${login.id}@adharshmart.app`, "+91 98450 12345");
              }}
            >
              Sign in
            </Button>
            <button type="button" className="w-full text-center text-xs text-primary underline" onClick={() => toast("Recovery link sent to your registered email (demo)")}>
              Forgot password?
            </button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-3 pt-4">
            {(["name", "email", "phone", "password"] as const).map((k) => (
              <div key={k}>
                <Label htmlFor={`su-${k}`} className="mb-1 block capitalize">
                  {k}
                </Label>
                <Input
                  id={`su-${k}`}
                  type={k === "password" ? "password" : "text"}
                  value={signup[k]}
                  onChange={(e) => setSignup((s) => ({ ...s, [k]: e.target.value }))}
                />
              </div>
            ))}
            <Button
              className="w-full"
              onClick={() => {
                if (!signup.name || !signup.email || !signup.password) {
                  toast.error("Name, email and password are required");
                  return;
                }
                demoSignIn(signup.name, signup.email, signup.phone || "+91 98450 12345");
              }}
            >
              Create account
            </Button>
          </TabsContent>
        </Tabs>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" className="w-full" onClick={() => demoSignIn("Adharsh S", "adharsh@adharshmart.app", "+91 98450 12345")}>
          Continue with Google (demo)
        </Button>
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
        This storefront uses a simulated authentication flow. No credentials are sent anywhere, and no real account is created.
      </p>
    </div>
  );
}

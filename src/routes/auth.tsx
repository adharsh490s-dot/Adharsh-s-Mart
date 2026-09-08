import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account | Adharsh's Mart" },
      { name: "description", content: "Access your Adharsh's Mart orders, wishlist and saved addresses with a secure account." },
      { property: "og:title", content: "Sign in | Adharsh's Mart" },
      { property: "og:description", content: "Sign in to Adharsh's Mart to track orders and sync your cart." },
    ],
  }),
  component: AuthPage,
});

function passwordProblem(pw: string) {
  if (pw.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) return "Password needs at least one letter and one number";
  return null;
}

function AuthPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState({ name: "", email: "", phone: "", password: "" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/account", replace: true });
    });
  }, [navigate]);

  const handleLogin = async () => {
    if (!login.email || !login.password) {
      toast.error("Enter your email and password");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: login.email.trim(), password: login.password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    navigate({ to: "/account" });
  };

  const handleSignup = async () => {
    if (!signup.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(signup.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    const problem = passwordProblem(signup.password);
    if (problem) {
      toast.error(problem);
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: signup.email.trim(),
      password: signup.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: signup.name.trim(), phone: signup.phone.trim() },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      toast.success("Account created");
      navigate({ to: "/account" });
    } else {
      setCheckEmail(true);
      toast.success("Almost there — confirm your email to finish signing up");
    }
  };

  const handleGoogle = async () => {
    try {
      await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    } catch {
      toast.error("Google sign-in could not be started");
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-12 sm:px-5">
      <img src={logo} alt="" width={48} height={48} className="size-12" />
      <h1 className="mt-3 text-2xl font-bold">Welcome to Adharsh's Mart</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">Everything you need. Delivered smarter.</p>

      <div className="surface mt-6 w-full p-6">
        {checkEmail ? (
          <div className="space-y-3 text-center">
            <h2 className="text-lg font-semibold">Check your inbox</h2>
            <p className="text-sm text-muted-foreground">
              We sent a confirmation link to <span className="font-medium text-foreground">{signup.email}</span>. Click it to activate your account, then come back and sign in.
            </p>
            <Button variant="outline" className="w-full" onClick={() => setCheckEmail(false)}>
              Back to sign in
            </Button>
          </div>
        ) : (
          <>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-3 pt-4">
                <div>
                  <Label htmlFor="login-email" className="mb-1 block">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={login.email}
                    onChange={(e) => setLogin((l) => ({ ...l, email: e.target.value }))}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="login-pw" className="mb-1 block">
                    Password
                  </Label>
                  <Input
                    id="login-pw"
                    type="password"
                    autoComplete="current-password"
                    value={login.password}
                    onChange={(e) => setLogin((l) => ({ ...l, password: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
                <Button className="w-full" disabled={busy} onClick={handleLogin}>
                  {busy && <Loader2 className="size-4 animate-spin" />} Sign in
                </Button>
                <button
                  type="button"
                  className="w-full text-center text-xs text-primary underline"
                  onClick={async () => {
                    if (!login.email) {
                      toast.error("Enter your email first");
                      return;
                    }
                    const { error } = await supabase.auth.resetPasswordForEmail(login.email.trim(), {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    toast[error ? "error" : "success"](error ? error.message : "Password reset link sent");
                  }}
                >
                  Forgot password?
                </button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-3 pt-4">
                <div>
                  <Label htmlFor="su-name" className="mb-1 block">
                    Full name
                  </Label>
                  <Input id="su-name" value={signup.name} onChange={(e) => setSignup((s) => ({ ...s, name: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="su-email" className="mb-1 block">
                    Email
                  </Label>
                  <Input id="su-email" type="email" autoComplete="email" value={signup.email} onChange={(e) => setSignup((s) => ({ ...s, email: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="su-phone" className="mb-1 block">
                    Phone (optional)
                  </Label>
                  <Input id="su-phone" value={signup.phone} onChange={(e) => setSignup((s) => ({ ...s, phone: e.target.value }))} placeholder="+91 98450 12345" />
                </div>
                <div>
                  <Label htmlFor="su-pw" className="mb-1 block">
                    Password
                  </Label>
                  <Input
                    id="su-pw"
                    type="password"
                    autoComplete="new-password"
                    value={signup.password}
                    onChange={(e) => setSignup((s) => ({ ...s, password: e.target.value }))}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">At least 8 characters, including a letter and a number.</p>
                </div>
                <Button className="w-full" disabled={busy} onClick={handleSignup}>
                  {busy && <Loader2 className="size-4 animate-spin" />} Create account
                </Button>
              </TabsContent>
            </Tabs>

            <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogle}>
              Continue with Google
            </Button>
          </>
        )}
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
        Your account is secured with encrypted sign-in. We never share your details.
      </p>
    </div>
  );
}

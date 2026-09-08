import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password | Adharsh's Mart" },
      { name: "description", content: "Choose a new password for your Adharsh's Mart account." },
      { property: "og:title", content: "Reset your password | Adharsh's Mart" },
      { property: "og:description", content: "Choose a new password for your Adharsh's Mart account." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      toast.error("Password needs 8+ characters with a letter and a number");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    navigate({ to: "/account" });
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-5">
      <h1 className="text-2xl font-bold">Set a new password</h1>
      <div className="surface mt-6 space-y-3 p-6">
        <div>
          <Label htmlFor="pw" className="mb-1 block">
            New password
          </Label>
          <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="pw2" className="mb-1 block">
            Confirm password
          </Label>
          <Input id="pw2" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <Button className="w-full" disabled={busy} onClick={submit}>
          Update password
        </Button>
      </div>
    </div>
  );
}

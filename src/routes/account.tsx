import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { User, Package, Heart, MapPin, CreditCard, Bell, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { products } from "@/lib/catalog";
import { categoryImage, inr, shortDate } from "@/lib/media";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your Account | SwiftCart" },
      { name: "description", content: "Manage your SwiftCart profile, orders, wishlist, addresses, payment methods and notification settings." },
      { property: "og:title", content: "Your Account | SwiftCart" },
      { property: "og:description", content: "One dashboard for orders, addresses, wishlist and preferences." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, signOut, orders, wishlist, addresses, removeAddress, setDefaultAddress } = useStore();
  const [profile, setProfile] = useState({ name: user?.name ?? "Guest shopper", email: user?.email ?? "guest@swiftcart.app", phone: user?.phone ?? "+91 98450 12345" });
  const wishlistProducts = wishlist.map((id) => products.find((p) => p.id === id)).filter((p): p is (typeof products)[number] => Boolean(p));

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-5">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-12 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground">{profile.name.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold sm:text-2xl">{profile.name}</h1>
            <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>
        {user ? (
          <Button variant="outline" onClick={() => { signOut(); toast("Signed out"); }}>
            <LogOut className="size-4" /> Sign out
          </Button>
        ) : (
          <Button asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
        )}
      </header>

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList className="no-scrollbar flex w-full justify-start overflow-x-auto">
          {[
            ["profile", "Profile", User],
            ["orders", "My Orders", Package],
            ["wishlist", "Wishlist", Heart],
            ["addresses", "Addresses", MapPin],
            ["payments", "Payments", CreditCard],
            ["notifications", "Notifications", Bell],
            ["settings", "Settings", Settings],
          ].map(([v, label, Icon]) => {
            const I = Icon as typeof User;
            return (
              <TabsTrigger key={v as string} value={v as string} className="shrink-0 gap-1.5">
                <I className="size-4" /> {label as string}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="profile">
          <div className="surface grid gap-4 p-6 sm:grid-cols-2">
            {(["name", "email", "phone"] as const).map((k) => (
              <div key={k} className={k === "name" ? "sm:col-span-2" : ""}>
                <Label htmlFor={`p-${k}`} className="mb-1 block capitalize">
                  {k}
                </Label>
                <Input id={`p-${k}`} value={profile[k]} onChange={(e) => setProfile((p) => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <Button onClick={() => toast.success("Profile updated")}>Save changes</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="surface p-6">
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <ul className="space-y-3">
                {orders.map((o) => (
                  <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 last:border-0">
                    <div>
                      <p className="text-sm font-semibold">#{o.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {shortDate(o.createdAt)} · {o.items.length} item(s) · {o.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">{inr(o.total)}</span>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/orders/$orderId" params={{ orderId: o.id }}>
                          Track
                        </Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </TabsContent>

        <TabsContent value="wishlist">
          <div className="surface p-6">
            {wishlistProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing saved yet.</p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {wishlistProducts.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <img src={categoryImage(p.category)} alt={p.title} loading="lazy" width={100} height={100} className="size-12 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium">{p.title}</p>
                      <p className="text-sm font-bold">{inr(p.price)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Button asChild variant="outline" className="mt-4">
              <Link to="/wishlist">Open wishlist</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="addresses">
          <div className="surface space-y-3 p-6">
            {addresses.map((a) => (
              <div key={a.id} className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border p-4">
                <div>
                  <p className="text-sm font-semibold">
                    {a.name} · {a.type} {a.isDefault && <span className="ml-1 rounded bg-accent px-1.5 py-0.5 text-[11px]">Default</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {a.line1}, {a.city}, {a.state} {a.pincode}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!a.isDefault && (
                    <Button size="sm" variant="ghost" onClick={() => setDefaultAddress(a.id)}>
                      Set default
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => removeAddress(a.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            <Button asChild variant="outline">
              <Link to="/checkout">Add address at checkout</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="surface grid gap-3 p-6 sm:grid-cols-2">
            {[
              { label: "UPI · adharsh@swiftpay", note: "Primary" },
              { label: "Credit Card · **** 4821", note: "Expires 09/29" },
              { label: "Wallet · SwiftCash", note: `Balance ${inr(1250)}` },
            ].map((m) => (
              <div key={m.label} className="rounded-lg border border-border p-4">
                <p className="text-sm font-semibold">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.note}</p>
              </div>
            ))}
            <p className="text-xs text-muted-foreground sm:col-span-2">Demo data only — no real payment instruments are stored.</p>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="surface space-y-3 p-6">
            {["Order updates", "Price drop alerts", "Deals and promotions", "Delivery reminders"].map((n) => (
              <div key={n} className="flex items-center justify-between gap-4">
                <Label htmlFor={`n-${n}`} className="font-normal">
                  {n}
                </Label>
                <Switch id={`n-${n}`} defaultChecked onCheckedChange={() => toast("Preference updated")} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="surface space-y-4 p-6">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="private" className="font-normal">
                Hide my reviews from public profile
              </Label>
              <Switch id="private" onCheckedChange={() => toast("Privacy setting saved")} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="theme" className="font-normal">
                Use dark theme
              </Label>
              <Switch
                id="theme"
                onCheckedChange={(c) => {
                  document.documentElement.classList.toggle("dark", c);
                  toast(c ? "Dark theme on" : "Light theme on");
                }}
              />
            </div>
            <Button variant="outline" onClick={() => toast("Account data export requested")}>
              Request data export
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

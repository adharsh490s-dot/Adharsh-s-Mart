import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { IndianRupee, ShoppingBag, Users, Package, TrendingUp, Percent, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories, discountOf, products as seedProducts } from "@/lib/catalog";
import { inr, shortDate } from "@/lib/media";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | SwiftCart" },
      { name: "description", content: "SwiftCart operations dashboard: sales analytics, product inventory, order status, customers, categories and coupons." },
      { property: "og:title", content: "Admin Dashboard | SwiftCart" },
      { property: "og:description", content: "Sales, orders, inventory and coupon management for SwiftCart operators." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const salesSeries = [
  { month: "Feb", revenue: 1840000, orders: 1210 },
  { month: "Mar", revenue: 2120000, orders: 1385 },
  { month: "Apr", revenue: 1975000, orders: 1290 },
  { month: "May", revenue: 2460000, orders: 1602 },
  { month: "Jun", revenue: 2890000, orders: 1841 },
  { month: "Jul", revenue: 3320000, orders: 2104 },
  { month: "Aug", revenue: 3615000, orders: 2288 },
];

const customers = [
  { name: "Ananya Rao", email: "ananya@example.com", orders: 14, spend: 184200 },
  { name: "Rahul Menon", email: "rahul@example.com", orders: 9, spend: 96400 },
  { name: "Sneha Patil", email: "sneha@example.com", orders: 21, spend: 262900 },
  { name: "Vikram Singh", email: "vikram@example.com", orders: 4, spend: 38700 },
  { name: "Aisha Khan", email: "aisha@example.com", orders: 11, spend: 142300 },
];

function AdminPage() {
  const { orders } = useStore();
  const [catalog, setCatalog] = useState(seedProducts.slice(0, 12).map((p) => ({ id: p.id, title: p.title, category: p.category, price: p.price, stock: p.stock })));
  const [draft, setDraft] = useState({ title: "", category: "electronics", price: "", stock: "" });
  const [coupons, setCoupons] = useState([
    { code: "SWIFT10", percent: 10, expires: "2026-12-31" },
    { code: "FEST20", percent: 20, expires: "2026-09-30" },
  ]);
  const [couponDraft, setCouponDraft] = useState({ code: "", percent: "", expires: "" });
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  const categoryPerformance = useMemo(
    () =>
      categories.map((c) => ({
        name: c.name,
        revenue: seedProducts.filter((p) => p.category === c.slug).reduce((a, p) => a + p.price * (p.reviews / 100), 0),
      })),
    [],
  );

  const stats = [
    { label: "Total Sales", value: inr(18220000), icon: IndianRupee, delta: "+18.2%" },
    { label: "Orders", value: "11,720", icon: ShoppingBag, delta: "+9.4%" },
    { label: "Customers", value: "8,436", icon: Users, delta: "+12.1%" },
    { label: "Products", value: String(seedProducts.length), icon: Package, delta: "+4 new" },
    { label: "Revenue (30d)", value: inr(3615000), icon: TrendingUp, delta: "+8.8%" },
    { label: "Conversion Rate", value: "3.94%", icon: Percent, delta: "+0.6pt" },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-5">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold sm:text-3xl">Admin dashboard</h1>
          <p className="text-sm text-muted-foreground">Operations overview for the SwiftCart storefront.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/">View storefront</Link>
        </Button>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <s.icon className="size-4 text-primary" />
            </div>
            <p className="mt-2 text-xl font-bold">{s.value}</p>
            <p className="text-xs text-success">{s.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="surface p-5">
          <h2 className="text-base font-bold">Revenue over time</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesSeries}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(v: number) => `${Math.round(v / 100000)}L`} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="text-base font-bold">Orders per month</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="orders" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-5 lg:col-span-2">
          <h2 className="text-base font-bold">Category performance</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} interval={0} angle={-20} height={60} textAnchor="end" />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(v: number) => `${Math.round(v / 100000)}L`} />
                <Tooltip formatter={(v: number) => inr(Math.round(v))} />
                <Bar dataKey="revenue" fill="var(--color-chart-4)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Tabs defaultValue="products" className="mt-6">
        <TabsList className="no-scrollbar flex w-full justify-start overflow-x-auto">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="surface p-5">
            <div className="grid gap-3 sm:grid-cols-5">
              <div className="sm:col-span-2">
                <Label htmlFor="np-title" className="mb-1 block text-xs">Product title</Label>
                <Input id="np-title" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="np-cat" className="mb-1 block text-xs">Category</Label>
                <Select value={draft.category} onValueChange={(v) => setDraft((d) => ({ ...d, category: v }))}>
                  <SelectTrigger id="np-cat"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="np-price" className="mb-1 block text-xs">Price (₹)</Label>
                <Input id="np-price" inputMode="numeric" value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="np-stock" className="mb-1 block text-xs">Stock</Label>
                <Input id="np-stock" inputMode="numeric" value={draft.stock} onChange={(e) => setDraft((d) => ({ ...d, stock: e.target.value }))} />
              </div>
              <div className="sm:col-span-5">
                <Button
                  onClick={() => {
                    if (!draft.title || !draft.price) {
                      toast.error("Title and price are required");
                      return;
                    }
                    setCatalog((c) => [
                      { id: `SC${9000 + c.length}`, title: draft.title, category: draft.category, price: Number(draft.price), stock: Number(draft.stock || 10) },
                      ...c,
                    ]);
                    setDraft({ title: "", category: "electronics", price: "", stock: "" });
                    toast.success("Product added to the catalogue");
                  }}
                >
                  <Plus className="size-4" /> Add product
                </Button>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalog.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="max-w-[280px] truncate font-medium">{p.title}</TableCell>
                      <TableCell className="capitalize">{p.category}</TableCell>
                      <TableCell>{inr(p.price)}</TableCell>
                      <TableCell>
                        <Input
                          className="h-8 w-20"
                          value={p.stock}
                          aria-label={`Stock for ${p.title}`}
                          onChange={(e) => setCatalog((c) => c.map((x) => (x.id === p.id ? { ...x, stock: Number(e.target.value) || 0 } : x)))}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setCatalog((c) => c.map((x) => (x.id === p.id ? { ...x, price: Math.round(x.price * 0.9) } : x)));
                            toast.success("10% discount applied");
                          }}
                        >
                          Discount 10%
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          aria-label={`Delete ${p.title}`}
                          onClick={() => {
                            setCatalog((c) => c.filter((x) => x.id !== p.id));
                            toast("Product removed");
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="surface overflow-x-auto p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Refund</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">#{o.id}</TableCell>
                    <TableCell>{shortDate(o.createdAt)}</TableCell>
                    <TableCell>{o.items.length}</TableCell>
                    <TableCell>{inr(o.total)}</TableCell>
                    <TableCell>
                      <Select
                        value={statuses[o.id] ?? o.status}
                        onValueChange={(v) => {
                          setStatuses((s) => ({ ...s, [o.id]: v }));
                          toast.success(`Order #${o.id} marked ${v}`);
                        }}
                      >
                        <SelectTrigger className="h-8 w-40" aria-label={`Status for order ${o.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Placed", "Shipped", "Out for delivery", "Delivered", "Cancelled"].map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => toast.success(`Refund of ${inr(o.total)} simulated for #${o.id}`)}>
                        Refund
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <div className="surface overflow-x-auto p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead className="text-right">Lifetime spend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.email}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.email}</TableCell>
                    <TableCell>{c.orders}</TableCell>
                    <TableCell className="text-right">{inr(c.spend)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="surface grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const count = seedProducts.filter((p) => p.category === c.slug).length;
              const avgDiscount = Math.round(
                seedProducts.filter((p) => p.category === c.slug).reduce((a, p) => a + discountOf(p), 0) / Math.max(1, count),
              );
              return (
                <div key={c.slug} className="rounded-xl border border-border p-4">
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{count} products · avg {avgDiscount}% off</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast.success(`${c.name} updated`)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => toast("Category archived (demo)")}>
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="coupons">
          <div className="surface p-5">
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <Label htmlFor="c-code" className="mb-1 block text-xs">Code</Label>
                <Input id="c-code" value={couponDraft.code} onChange={(e) => setCouponDraft((c) => ({ ...c, code: e.target.value.toUpperCase() }))} />
              </div>
              <div>
                <Label htmlFor="c-pct" className="mb-1 block text-xs">Discount %</Label>
                <Input id="c-pct" inputMode="numeric" value={couponDraft.percent} onChange={(e) => setCouponDraft((c) => ({ ...c, percent: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="c-exp" className="mb-1 block text-xs">Expires</Label>
                <Input id="c-exp" type="date" value={couponDraft.expires} onChange={(e) => setCouponDraft((c) => ({ ...c, expires: e.target.value }))} />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    if (!couponDraft.code || !couponDraft.percent) {
                      toast.error("Code and discount are required");
                      return;
                    }
                    setCoupons((c) => [...c, { code: couponDraft.code, percent: Number(couponDraft.percent), expires: couponDraft.expires || "2026-12-31" }]);
                    setCouponDraft({ code: "", percent: "", expires: "" });
                    toast.success("Coupon created");
                  }}
                >
                  Create coupon
                </Button>
              </div>
            </div>

            <ul className="mt-5 space-y-2">
              {coupons.map((c) => (
                <li key={c.code} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                  <span className="font-semibold">{c.code}</span>
                  <span className="text-muted-foreground">{c.percent}% off · expires {c.expires}</span>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setCoupons((x) => x.filter((y) => y.code !== c.code))}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingCart, Heart, User, MapPin, Menu, Package, Home, LayoutGrid, X, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { categories, products } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const popular = ["wireless earbuds", "5G phone", "air fryer", "running shoes", "coffee beans"];

export function Navbar() {
  const { cartCount, wishlist, user, searches, pushSearch } = useStore();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const matches = query.trim()
    ? products.filter((p) => (p.title + p.brand + p.category).toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
    : [];
  const matchedCategories = query.trim() ? categories.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 3) : [];

  const submit = (value: string) => {
    const q = value.trim();
    if (!q) return;
    pushSearch(q);
    setOpen(false);
    navigate({ to: "/search", search: { q } });
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-ink text-ink-foreground">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-3 sm:px-5">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="text-ink-foreground hover:bg-white/10 lg:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Browse Adharsh's Mart</SheetTitle>
              </SheetHeader>
              <nav className="grid gap-1 p-4 pt-0">
                <Link to="/products" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                  All products
                </Link>
                <Link to="/deals" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                  Today's Deals
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    to="/products/$category"
                    params={{ category: c.slug }}
                    className="rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  >
                    {c.name}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                <Link to="/account" className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
                  Your account
                </Link>
                <Link to="/orders" className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
                  Your orders
                </Link>
                <Link to="/admin" className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
                  Admin dashboard
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Adharsh's Mart home">
            <img src={logo} alt="" width={32} height={32} className="size-8" />
            <span className="font-display text-lg font-bold tracking-tight">Adharsh's Mart</span>
          </Link>

          <button
            type="button"
            onClick={() => navigate({ to: "/account" })}
            className="hidden shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-white/10 md:flex"
          >
            <MapPin className="size-4 text-primary" />
            <span className="leading-tight">
              <span className="block text-white/60">Deliver to</span>
              <span className="block font-semibold">Bengaluru 560038</span>
            </span>
          </button>

          <div ref={boxRef} className="relative min-w-0 flex-1">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                submit(query);
              }}
              className="flex items-center"
            >
              <label htmlFor="site-search" className="sr-only">
                Search Adharsh's Mart
              </label>
              <Input
                id="site-search"
                value={query}
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                placeholder="Search products, brands and categories"
                className="h-10 rounded-r-none border-0 bg-card text-foreground"
                autoComplete="off"
              />
              <Button type="submit" aria-label="Search" className="h-10 rounded-l-none px-4">
                <Search className="size-4" />
              </Button>
            </form>

            {open && (
              <div className="absolute inset-x-0 top-12 z-50 max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-xl">
                {query.trim() === "" ? (
                  <>
                    {searches.length > 0 && (
                      <Section title="Recent searches" icon={<Clock className="size-3.5" />}>
                        {searches.map((s) => (
                          <Suggestion key={s} label={s} onClick={() => submit(s)} />
                        ))}
                      </Section>
                    )}
                    <Section title="Popular on Adharsh's Mart" icon={<TrendingUp className="size-3.5" />}>
                      {popular.map((s) => (
                        <Suggestion key={s} label={s} onClick={() => submit(s)} />
                      ))}
                    </Section>
                  </>
                ) : matches.length === 0 && matchedCategories.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-muted-foreground">
                    No matches for “{query}”. Try <button type="button" className="font-semibold text-primary underline" onClick={() => submit("earbuds")}>earbuds</button>?
                  </p>
                ) : (
                  <>
                    {matchedCategories.length > 0 && (
                      <Section title="Categories" icon={<LayoutGrid className="size-3.5" />}>
                        {matchedCategories.map((c) => (
                          <Suggestion key={c.slug} label={c.name} onClick={() => navigate({ to: "/products/$category", params: { category: c.slug } })} />
                        ))}
                      </Section>
                    )}
                    <Section title="Products" icon={<Search className="size-3.5" />}>
                      {matches.map((p) => (
                        <Suggestion
                          key={p.id}
                          label={p.title}
                          hint={p.brand}
                          onClick={() => navigate({ to: "/product/$productId", params: { productId: p.id } })}
                        />
                      ))}
                    </Section>
                  </>
                )}
              </div>
            )}
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            <NavItem to="/account" top={user ? `Hello, ${user.name.split(" ")[0]}` : "Hello, sign in"} bottom="Account" />
            <NavItem to="/orders" top="Returns &" bottom="Orders" />
          </nav>

          <Link to="/wishlist" className="relative hidden shrink-0 rounded-lg p-2 hover:bg-white/10 sm:block" aria-label="Wishlist">
            <Heart className="size-5" />
            {wishlist.length > 0 && <Count value={wishlist.length} />}
          </Link>
          <Link to="/cart" className="relative flex shrink-0 items-center gap-2 rounded-lg p-2 hover:bg-white/10" aria-label="Cart">
            <ShoppingCart className="size-5" />
            {cartCount > 0 && <Count value={cartCount} />}
            <span className="hidden text-sm font-semibold lg:inline">Cart</span>
          </Link>
        </div>

        <div className="border-t border-white/10 bg-ink/95">
          <div className="no-scrollbar mx-auto flex max-w-[1400px] items-center gap-1 overflow-x-auto px-3 py-1.5 text-sm sm:px-5">
            <Link to="/deals" className="whitespace-nowrap rounded-md px-3 py-1.5 font-semibold text-deal hover:bg-white/10">
              Today's Deals
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/products/$category"
                params={{ category: c.slug }}
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-ink-foreground/85 hover:bg-white/10 hover:text-ink-foreground"
                activeProps={{ className: "bg-white/15 text-ink-foreground" }}
              >
                {c.name}
              </Link>
            ))}
            <Link to="/products" search={{ sort: "newest" }} className="whitespace-nowrap rounded-md px-3 py-1.5 text-ink-foreground/85 hover:bg-white/10">
              New Arrivals
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Count({ value }: { value: number }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-deal text-[11px] font-bold text-deal-foreground">
      {value}
    </span>
  );
}

function NavItem({ to, top, bottom }: { to: string; top: string; bottom: string }) {
  return (
    <Link to={to} className="rounded-lg px-2.5 py-1.5 text-xs leading-tight hover:bg-white/10">
      <span className="block text-white/60">{top}</span>
      <span className="block text-sm font-semibold">{bottom}</span>
    </Link>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="py-1">
      <p className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {title}
      </p>
      {children}
    </div>
  );
}

function Suggestion({ label, hint, onClick }: { label: string; hint?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"
    >
      <span className="truncate">{label}</span>
      {hint && <span className="shrink-0 text-xs text-muted-foreground">{hint}</span>}
    </button>
  );
}

export function MobileTabBar() {
  const { cartCount } = useStore();
  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/products", label: "Categories", icon: LayoutGrid },
    { to: "/search", label: "Search", icon: Search },
    { to: "/cart", label: "Cart", icon: ShoppingCart },
    { to: "/account", label: "Account", icon: User },
  ] as const;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {items.map((i) => (
          <li key={i.to}>
            <Link
              to={i.to}
              search={i.to === "/search" ? { q: "" } : {}}
              className="relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] text-muted-foreground"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: i.to === "/" }}
            >
              <i.icon className="size-5" />
              {i.label}
              {i.to === "/cart" && cartCount > 0 && (
                <span className="absolute right-4 top-2 grid size-4 place-items-center rounded-full bg-deal text-[10px] font-bold text-deal-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function CloseIcon() {
  return <X className="size-4" />;
}

export function PackageIcon() {
  return <Package className="size-4" />;
}

export const navClass = cn;

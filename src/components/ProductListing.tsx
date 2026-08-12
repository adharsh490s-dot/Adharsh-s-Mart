import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LayoutGrid, List, SlidersHorizontal, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/States";
import { RatingStars } from "@/components/RatingStars";
import { brands, discountOf, products as allProducts, type Product } from "@/lib/catalog";
import { inr } from "@/lib/media";
import { cn } from "@/lib/utils";

export const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "Newest" },
  { value: "best", label: "Best Selling" },
  { value: "discount", label: "Biggest Discount" },
] as const;

const PAGE_SIZE = 12;

export type Filters = {
  price: [number, number];
  rating: number;
  brands: string[];
  minDiscount: number;
  inStockOnly: boolean;
};

const defaultFilters: Filters = { price: [0, 140000], rating: 0, brands: [], minDiscount: 0, inStockOnly: false };

export function sortProducts(list: Product[], sort: string) {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "newest":
      return copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "best":
      return copy.sort((a, b) => b.reviews - a.reviews);
    case "discount":
      return copy.sort((a, b) => discountOf(b) - discountOf(a));
    default:
      return copy.sort((a, b) => b.rating * Math.log(b.reviews) - a.rating * Math.log(a.reviews));
  }
}

export function ProductListing({
  heading,
  description,
  source = allProducts,
  initialSort = "featured",
  query = "",
}: {
  heading: string;
  description?: string;
  source?: Product[];
  initialSort?: string;
  query?: string;
}) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sort, setSort] = useState(initialSort);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const scopeBrands = useMemo(() => Array.from(new Set(source.map((p) => p.brand))).sort(), [source]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = source.filter((p) => {
      if (q && !(p.title + " " + p.brand + " " + p.category + " " + p.description).toLowerCase().includes(q)) return false;
      if (p.price < filters.price[0] || p.price > filters.price[1]) return false;
      if (filters.rating && p.rating < filters.rating) return false;
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (discountOf(p) < filters.minDiscount) return false;
      if (filters.inStockOnly && p.stock <= 0) return false;
      return true;
    });
    return sortProducts(result, sort);
  }, [source, filters, sort, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const update = (patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };

  const sidebar = (
    <div className="space-y-6">
      <FilterBlock title="Price range">
        <Slider
          value={filters.price}
          min={0}
          max={140000}
          step={500}
          onValueChange={(v) => update({ price: [v[0] ?? 0, v[1] ?? 140000] })}
          aria-label="Price range"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {inr(filters.price[0])} — {inr(filters.price[1])}
        </p>
      </FilterBlock>

      <FilterBlock title="Customer rating">
        <div className="space-y-1.5">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => update({ rating: filters.rating === r ? 0 : r })}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted",
                filters.rating === r && "bg-accent text-accent-foreground",
              )}
            >
              <RatingStars rating={r} /> <span>{r} & up</span>
            </button>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Brand">
        <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
          {scopeBrands.map((b) => (
            <div key={b} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${b}`}
                checked={filters.brands.includes(b)}
                onCheckedChange={(c) => update({ brands: c ? [...filters.brands, b] : filters.brands.filter((x) => x !== b) })}
              />
              <Label htmlFor={`brand-${b}`} className="text-sm font-normal">
                {b}
              </Label>
            </div>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Discount">
        <div className="flex flex-wrap gap-2">
          {[10, 25, 40, 50].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => update({ minDiscount: filters.minDiscount === d ? 0 : d })}
              className={cn(
                "rounded-full border border-border px-3 py-1 text-xs font-medium hover:border-primary",
                filters.minDiscount === d && "border-primary bg-primary text-primary-foreground",
              )}
            >
              {d}% or more
            </button>
          ))}
        </div>
      </FilterBlock>

      <FilterBlock title="Availability">
        <div className="flex items-center gap-2">
          <Checkbox id="in-stock" checked={filters.inStockOnly} onCheckedChange={(c) => update({ inStockOnly: Boolean(c) })} />
          <Label htmlFor="in-stock" className="text-sm font-normal">
            In stock only
          </Label>
        </div>
      </FilterBlock>

      <Button variant="outline" className="w-full" onClick={() => setFilters(defaultFilters)}>
        Clear all filters
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-5">
      <header className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">{heading}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="surface hidden h-fit p-5 lg:block">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <SlidersHorizontal className="size-4" /> Filters
          </h2>
          {sidebar}
        </aside>

        <div className="min-w-0">
          <div className="surface mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-3">
            <p className="min-w-0 truncate text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> products
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="size-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="p-4 pt-0">{sidebar}</div>
                </SheetContent>
              </Sheet>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-9 w-[150px] sm:w-[190px]" aria-label="Sort products">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="hidden items-center rounded-lg border border-border sm:flex">
                <Button variant={layout === "grid" ? "secondary" : "ghost"} size="icon" aria-label="Grid view" onClick={() => setLayout("grid")}>
                  <LayoutGrid className="size-4" />
                </Button>
                <Button variant={layout === "list" ? "secondary" : "ghost"} size="icon" aria-label="List view" onClick={() => setLayout("list")}>
                  <List className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {visible.length === 0 ? (
            <EmptyState
              icon={<SearchX className="size-6" />}
              title="No products matched"
              body="Try removing a filter or widening your price range — the rest of the catalogue is waiting."
              action={
                <Button onClick={() => setFilters(defaultFilters)}>Reset filters</Button>
              }
            />
          ) : (
            <div className={cn(layout === "grid" ? "grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-4")}>
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} layout={layout} />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
              <Button variant="outline" size="sm" disabled={current === 1} onClick={() => setPage(current - 1)}>
                Previous
              </Button>
              {Array.from({ length: pageCount }).map((_, i) => (
                <Button
                  key={i}
                  variant={current === i + 1 ? "default" : "outline"}
                  size="sm"
                  aria-current={current === i + 1 ? "page" : undefined}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" disabled={current === pageCount} onClick={() => setPage(current + 1)}>
                Next
              </Button>
            </nav>
          )}
        </div>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        Looking for something else? <Link to="/products" className="font-medium text-primary underline">Browse the full catalogue</Link> of {allProducts.length} products across {brands.length} brands.
      </p>
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

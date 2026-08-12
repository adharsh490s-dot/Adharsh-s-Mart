import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, products } from "@/lib/catalog";
import { sortProducts } from "@/components/ProductListing";

type SearchParams = { q: string };

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Search SwiftCart — Find products fast" },
      { name: "description", content: "Search across SwiftCart's catalogue with instant suggestions, category matches and smart fallbacks." },
      { property: "og:title", content: "Search | SwiftCart" },
      { property: "og:description", content: "Find exactly what you need across electronics, fashion, home, beauty and more." },
    ],
  }),
  component: SearchPage,
});

function score(text: string, q: string) {
  const t = text.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .reduce((acc, token) => acc + (t.includes(token) ? 1 : 0), 0);
}

function SearchPage() {
  const { q } = Route.useSearch();
  const [term, setTerm] = useState(q);

  const active = term.trim();

  const results = useMemo(() => {
    if (!active) return [];
    const scored = products
      .map((p) => ({ p, s: score(`${p.title} ${p.brand} ${p.category} ${p.description}`, active) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    return sortProducts(scored.map((x) => x.p), "featured");
  }, [active]);

  const suggestion = useMemo(() => {
    if (!active || results.length > 0) return null;
    const first = active.toLowerCase().slice(0, 4);
    const match = products.find((p) => p.title.toLowerCase().includes(first) || p.brand.toLowerCase().includes(first));
    return match ? match.brand : "wireless earbuds";
  }, [active, results.length]);

  const matchedCategories = categories.filter((c) => active && c.name.toLowerCase().includes(active.toLowerCase()));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-5">
      <h1 className="text-2xl font-bold sm:text-3xl">{active ? `Results for “${active}”` : "Search SwiftCart"}</h1>

      <form
        className="mt-4 flex max-w-xl gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setTerm(term.trim());
        }}
      >
        <label htmlFor="search-page-input" className="sr-only">
          Search products
        </label>
        <Input id="search-page-input" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Try “gaming keyboard” or “sunscreen”" />
        <Button type="submit">Search</Button>
      </form>

      {matchedCategories.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {matchedCategories.map((c) => (
            <Link
              key={c.slug}
              to="/products/$category"
              params={{ category: c.slug }}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary"
            >
              Browse {c.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6">
        {!active ? (
          <p className="text-sm text-muted-foreground">Start typing to search across {products.length} products.</p>
        ) : results.length === 0 ? (
          <EmptyState
            icon={<SearchX className="size-6" />}
            title={`No results for “${active}”`}
            body={suggestion ? `Did you mean “${suggestion}”? Check the spelling or try a broader term.` : "Check the spelling or try a broader term."}
            action={
              <Button
                onClick={() => {
                  if (suggestion) setTerm(suggestion);
                }}
              >
                Search “{suggestion}”
              </Button>
            }
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">{results.length} matching products</p>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

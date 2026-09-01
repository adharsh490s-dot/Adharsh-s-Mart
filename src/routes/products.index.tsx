import { createFileRoute } from "@tanstack/react-router";
import { ProductListing } from "@/components/ProductListing";

type ProductsSearch = { sort?: string | undefined; q?: string | undefined };

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    sort: typeof search["sort"] === "string" ? (search["sort"] as string) : undefined,
    q: typeof search["q"] === "string" ? (search["q"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "All Products — Shop 48 Curated Picks | Adharsh's Mart" },
      { name: "description", content: "Browse every Adharsh's Mart product with live filters for price, brand, rating, discount and availability." },
      { property: "og:title", content: "All Products | Adharsh's Mart" },
      { property: "og:description", content: "Filter, sort and compare thousands of products across ten categories on Adharsh's Mart." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const search = Route.useSearch();
  return (
    <ProductListing
      heading="All products"
      description="Every Adharsh's Mart listing, filterable by price, brand, rating and discount."
      initialSort={search.sort ?? "featured"}
      query={search.q ?? ""}
    />
  );
}

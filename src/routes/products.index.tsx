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
      { title: "All Products — Shop 48 Curated Picks | SwiftCart" },
      { name: "description", content: "Browse every SwiftCart product with live filters for price, brand, rating, discount and availability." },
      { property: "og:title", content: "All Products | SwiftCart" },
      { property: "og:description", content: "Filter, sort and compare thousands of products across ten categories on SwiftCart." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const search = Route.useSearch();
  return (
    <ProductListing
      heading="All products"
      description="Every SwiftCart listing, filterable by price, brand, rating and discount."
      initialSort={search.sort ?? "featured"}
      query={search.q ?? ""}
    />
  );
}

import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductListing } from "@/components/ProductListing";
import { categoryBySlug, products } from "@/lib/catalog";

export const Route = createFileRoute("/products/$category")({
  loader: ({ params }) => {
    const category = categoryBySlug(params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Category not found | Adharsh's Mart" }, { name: "robots", content: "noindex" }] };
    const { category } = loaderData;
    return {
      meta: [
        { title: `${category.name} — ${category.tagline} | Adharsh's Mart` },
        { name: "description", content: `Shop ${category.name.toLowerCase()} on Adharsh's Mart. ${category.tagline}, with fast delivery and verified sellers.` },
        { property: "og:title", content: `${category.name} | Adharsh's Mart` },
        { property: "og:description", content: `${category.tagline} — shop the ${category.name.toLowerCase()} range on Adharsh's Mart.` },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const source = products.filter((p) => p.category === category.slug);
  return <ProductListing heading={category.name} description={category.tagline} source={source} />;
}

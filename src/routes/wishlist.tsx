import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/States";
import { discountOf, products } from "@/lib/catalog";
import { categoryImage, inr } from "@/lib/media";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist | SwiftCart" },
      { name: "description", content: "Everything you saved on SwiftCart, with stock status and price-drop indicators." },
      { property: "og:title", content: "Your Wishlist | SwiftCart" },
      { property: "og:description", content: "Save products, watch prices and move items to your cart in one tap." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist, toggleWishlist, moveToCart } = useStore();
  const items = wishlist.map((id) => products.find((p) => p.id === id)).filter((p): p is (typeof products)[number] => Boolean(p));

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-5">
      <h1 className="text-2xl font-bold sm:text-3xl">Your wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<Heart className="size-6" />}
            title="Nothing saved yet."
            body="Tap the heart on any product and it will be waiting here for you."
            action={
              <Button asChild>
                <Link to="/products">Browse products</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {items.map((p) => (
            <li key={p.id} className="surface grid grid-cols-[80px_minmax(0,1fr)] gap-4 p-4">
              <Link to="/product/$productId" params={{ productId: p.id }}>
                <img src={categoryImage(p.category)} alt={p.title} loading="lazy" width={200} height={200} className="aspect-square w-full rounded-lg object-cover" />
              </Link>
              <div className="min-w-0">
                <h2 className="line-clamp-2 text-sm font-semibold">
                  <Link to="/product/$productId" params={{ productId: p.id }} className="hover:text-primary">
                    {p.title}
                  </Link>
                </h2>
                <p className="text-xs text-muted-foreground">{p.brand}</p>
                <div className="mt-1 flex flex-wrap items-baseline gap-2">
                  <span className="text-base font-bold">{inr(p.price)}</span>
                  <span className="text-xs text-muted-foreground line-through">{inr(p.mrp)}</span>
                  {discountOf(p) >= 30 && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                      <TrendingDown className="size-3.5" /> Price dropped {discountOf(p)}%
                    </span>
                  )}
                </div>
                <p className={p.stock > 0 ? "mt-1 text-xs text-success" : "mt-1 text-xs text-destructive"}>
                  {p.stock > 0 ? (p.stock <= 5 ? `Only ${p.stock} left` : "In stock") : "Out of stock"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    disabled={p.stock === 0}
                    onClick={() => {
                      moveToCart(p.id);
                      toast.success("Moved to cart", { description: p.title });
                    }}
                  >
                    Move to cart
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => {
                      toggleWishlist(p.id);
                      toast("Removed from wishlist");
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

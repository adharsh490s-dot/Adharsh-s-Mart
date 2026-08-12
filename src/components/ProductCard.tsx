import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, Truck, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/RatingStars";
import { discountOf, type Product } from "@/lib/catalog";
import { categoryImage, inr } from "@/lib/media";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product, layout = "grid" }: { product: Product; layout?: "grid" | "list" }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const wished = wishlist.includes(product.id);
  const discount = discountOf(product);

  const add = () => {
    addToCart(product.id);
    toast.success("Added to cart", { description: product.title });
  };

  const wish = () => {
    toggleWishlist(product.id);
    toast(wished ? "Removed from wishlist" : "Added to wishlist ♥", { description: product.title });
  };

  return (
    <article
      className={cn(
        "group surface lift relative flex overflow-hidden",
        layout === "grid" ? "h-full flex-col" : "flex-col gap-4 p-4 sm:flex-row",
      )}
    >
      <div className={cn("relative overflow-hidden bg-muted", layout === "grid" ? "aspect-square" : "aspect-square w-full shrink-0 rounded-lg sm:w-48")}>
        <Link to="/product/$productId" params={{ productId: product.id }} aria-label={product.title}>
          <img
            src={categoryImage(product.category)}
            alt={product.title}
            loading="lazy"
            width={900}
            height={900}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1">
          {discount >= 10 && (
            <span className="rounded-md bg-destructive px-2 py-0.5 text-[11px] font-bold text-destructive-foreground">{discount}% OFF</span>
          )}
          {product.badge && <span className="rounded-md bg-ink px-2 py-0.5 text-[11px] font-semibold text-ink-foreground">{product.badge}</span>}
        </div>
        <button
          type="button"
          onClick={wish}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-card/90 backdrop-blur transition-colors hover:bg-card"
        >
          <Heart className={cn("size-4 transition-colors", wished ? "fill-destructive text-destructive pop-heart" : "text-muted-foreground")} />
        </button>
        {layout === "grid" && (
          <div className="absolute inset-x-2 bottom-2 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button asChild size="sm" variant="secondary" className="w-full backdrop-blur">
              <Link to="/product/$productId" params={{ productId: product.id }}>
                <Eye className="size-4" /> Quick view
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className={cn("flex min-w-0 flex-1 flex-col gap-1.5", layout === "grid" && "p-4")}>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{product.brand}</p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          <Link to="/product/$productId" params={{ productId: product.id }} className="hover:text-primary">
            {product.title}
          </Link>
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <RatingStars rating={product.rating} />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews.toLocaleString("en-IN")})</span>
        </div>
        <div className="mt-1 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight">{inr(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{inr(product.mrp)}</span>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-success">
          <Truck className="size-3.5" /> FREE Delivery Tomorrow
        </p>
        {product.stock <= 5 && <p className="text-xs font-medium text-destructive">Only {product.stock} left in stock</p>}
        {layout === "list" && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>}
        <div className="mt-auto pt-3">
          <Button onClick={add} className="w-full" size="sm">
            <ShoppingCart className="size-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}

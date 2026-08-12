import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, Trash2, BookmarkPlus, TicketPercent } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/States";
import { products } from "@/lib/catalog";
import { categoryImage, inr } from "@/lib/media";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | SwiftCart" },
      { name: "description", content: "Review the items in your SwiftCart basket, apply coupons and see your total savings before checkout." },
      { property: "og:title", content: "Your Cart | SwiftCart" },
      { property: "og:description", content: "Review items, apply a coupon and check out securely on SwiftCart." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cartProducts, totals, setQty, removeFromCart, saveForLater, saved, moveToCart, applyCoupon, coupon } = useStore();
  const [code, setCode] = useState("");
  const savedProducts = saved.map((id) => products.find((p) => p.id === id)).filter((p): p is (typeof products)[number] => Boolean(p));

  const submitCoupon = () => {
    if (applyCoupon(code)) {
      toast.success("Coupon applied", { description: `${code.toUpperCase()} is now active on this order.` });
      setCode("");
    } else {
      toast.error("Invalid coupon", { description: "Try SWIFT10, NEW500 or FEST20." });
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-5">
      <h1 className="text-2xl font-bold sm:text-3xl">Shopping cart</h1>

      {cartProducts.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<ShoppingBag className="size-6" />}
            title="Your cart is waiting."
            body="Your next great find could be just one click away."
            action={
              <Button asChild>
                <Link to="/products">Start Shopping</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            {cartProducts.map(({ product, qty }) => (
              <article key={product.id} className="surface grid grid-cols-[88px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[120px_minmax(0,1fr)]">
                <Link to="/product/$productId" params={{ productId: product.id }} className="shrink-0">
                  <img
                    src={categoryImage(product.category)}
                    alt={product.title}
                    loading="lazy"
                    width={200}
                    height={200}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                </Link>
                <div className="min-w-0">
                  <h2 className="line-clamp-2 text-sm font-semibold">
                    <Link to="/product/$productId" params={{ productId: product.id }} className="hover:text-primary">
                      {product.title}
                    </Link>
                  </h2>
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                  <p className="mt-1 text-xs text-success">In stock · FREE delivery</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-lg border border-border">
                      <Button variant="ghost" size="icon" aria-label="Decrease quantity" onClick={() => setQty(product.id, qty - 1)}>
                        −
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                      <Button variant="ghost" size="icon" aria-label="Increase quantity" onClick={() => setQty(product.id, Math.min(10, qty + 1))}>
                        +
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => saveForLater(product.id)}>
                      <BookmarkPlus className="size-4" /> Save for later
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => {
                        removeFromCart(product.id);
                        toast("Removed from cart", { description: product.title });
                      }}
                    >
                      <Trash2 className="size-4" /> Remove
                    </Button>
                    <span className="ml-auto text-right">
                      <span className="block text-base font-bold">{inr(product.price * qty)}</span>
                      <span className="block text-xs text-muted-foreground line-through">{inr(product.mrp * qty)}</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}

            {savedProducts.length > 0 && (
              <section className="surface p-5">
                <h2 className="text-base font-bold">Saved for later ({savedProducts.length})</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {savedProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <img src={categoryImage(p.category)} alt={p.title} loading="lazy" width={100} height={100} className="size-14 rounded-md object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium">{p.title}</p>
                        <p className="text-sm font-bold">{inr(p.price)}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => moveToCart(p.id)}>
                        Move to cart
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="surface h-fit space-y-3 p-5 lg:sticky lg:top-32">
            <h2 className="text-lg font-bold">Order summary</h2>
            <Row label="Subtotal" value={inr(totals.subtotal)} />
            <Row label="Discount" value={`-${inr(totals.discount)}`} tone="success" />
            {totals.coupon > 0 && <Row label={`Coupon (${coupon})`} value={`-${inr(totals.coupon)}`} tone="success" />}
            <Row label="Delivery" value={totals.delivery === 0 ? "FREE" : inr(totals.delivery)} tone={totals.delivery === 0 ? "success" : undefined} />
            <Row label="Tax (18% GST)" value={inr(totals.tax)} />
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>{inr(totals.total)}</span>
            </div>
            <p className="rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success">
              You saved {inr(totals.discount + totals.coupon)} on this order
            </p>

            <div className="flex gap-2 pt-1">
              <label htmlFor="coupon" className="sr-only">
                Coupon code
              </label>
              <Input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" />
              <Button variant="outline" onClick={submitCoupon}>
                <TicketPercent className="size-4" /> Apply
              </Button>
            </div>

            <Button asChild size="lg" className="w-full">
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link to="/products">Continue shopping</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "success" | undefined }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={tone === "success" ? "font-medium text-success" : "font-medium"}>{value}</span>
    </div>
  );
}

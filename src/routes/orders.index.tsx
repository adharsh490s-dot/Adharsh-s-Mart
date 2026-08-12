import { createFileRoute, Link } from "@tanstack/react-router";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/States";
import { categoryImage, inr, shortDate } from "@/lib/media";
import { products } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "Your Orders | SwiftCart" },
      { name: "description", content: "See every SwiftCart order you've placed, track live shipments and reorder in one tap." },
      { property: "og:title", content: "Your Orders | SwiftCart" },
      { property: "og:description", content: "Order history, live tracking and quick reordering on SwiftCart." },
    ],
  }),
  component: OrdersPage,
});

const statusTone: Record<string, string> = {
  Placed: "bg-accent text-accent-foreground",
  Shipped: "bg-primary/15 text-primary",
  "Out for delivery": "bg-deal/20 text-deal-foreground",
  Delivered: "bg-success/15 text-success",
  Cancelled: "bg-destructive/10 text-destructive",
};

function OrdersPage() {
  const { orders, addToCart } = useStore();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-5">
      <h1 className="text-2xl font-bold sm:text-3xl">Your orders</h1>

      {orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<PackageSearch className="size-6" />}
            title="No orders yet"
            body="When you place an order it will appear here with live tracking."
            action={
              <Button asChild>
                <Link to="/products">Start shopping</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <article key={o.id} className="surface p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold">Order #{o.id}</h2>
                  <p className="text-xs text-muted-foreground">
                    Placed {shortDate(o.createdAt)} · {o.delivery} · {o.payment}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusTone[o.status] ?? "bg-muted"}`}>{o.status}</span>
              </div>

              <div className="mt-4 space-y-3">
                {o.items.map((item) => {
                  const p = products.find((x) => x.id === item.productId);
                  return (
                    <div key={item.productId} className="flex items-center gap-3">
                      <img
                        src={categoryImage(p?.category ?? "electronics")}
                        alt={item.title}
                        loading="lazy"
                        width={100}
                        height={100}
                        className="size-14 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">Qty {item.qty} · {inr(item.price)}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => addToCart(item.productId)}>
                        Buy again
                      </Button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                <span className="text-sm font-bold">Total {inr(o.total)}</span>
                <Button asChild size="sm">
                  <Link to="/orders/$orderId" params={{ orderId: o.id }}>
                    Track order
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

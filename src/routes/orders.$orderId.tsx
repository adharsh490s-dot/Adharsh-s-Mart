import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Circle, MapPin, PackageSearch, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/States";
import { products } from "@/lib/catalog";
import { categoryImage, inr, shortDate } from "@/lib/media";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/$orderId")({
  head: () => ({
    meta: [
      { title: "Track your order | SwiftCart" },
      { name: "description", content: "Live SwiftCart order tracking with courier status, delivery timeline and estimated arrival." },
      { property: "og:title", content: "Track your order | SwiftCart" },
      { property: "og:description", content: "Follow your SwiftCart parcel from warehouse to doorstep." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TrackPage,
});

const timeline = ["Order Placed", "Payment Confirmed", "Preparing Order", "Shipped", "Out for Delivery", "Delivered"];

function TrackPage() {
  const { orderId } = Route.useParams();
  const { orders, hydrated } = useStore();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-5">
        <EmptyState
          icon={<PackageSearch className="size-6" />}
          title={hydrated ? "Order not found" : "Loading your order…"}
          body="We couldn't find this order on this device. Check your order history for the full list."
          action={
            <Button asChild>
              <Link to="/orders">Go to orders</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const stage = order.status === "Delivered" ? 5 : order.status === "Out for delivery" ? 4 : order.status === "Shipped" ? 3 : 2;
  const progress = ((stage + 1) / timeline.length) * 100;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-5">
      <nav aria-label="Breadcrumb" className="mb-3 text-xs text-muted-foreground">
        <Link to="/orders" className="hover:text-primary">
          Your orders
        </Link>{" "}
        / #{order.id}
      </nav>
      <h1 className="text-2xl font-bold sm:text-3xl">Tracking order #{order.id}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Placed {shortDate(order.createdAt)} · {order.delivery} · Estimated arrival {shortDate(order.eta)}
      </p>

      <div className="surface mt-6 p-6">
        <div className="flex items-center gap-3">
          <Truck className="size-5 text-primary" />
          <p className="text-sm font-semibold">
            {order.status === "Delivered" ? "Delivered — thanks for shopping with SwiftCart" : "SwiftEx courier · package in transit"}
          </p>
        </div>
        <Progress value={progress} className="mt-4 h-2" />
        <ol className="mt-6 space-y-4">
          {timeline.map((t, i) => {
            const done = i < stage;
            const currentStep = i === stage;
            return (
              <li key={t} className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border",
                    done ? "border-success bg-success text-success-foreground" : currentStep ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3.5" /> : <Circle className="size-2 fill-current" />}
                </span>
                <div>
                  <p className={cn("text-sm font-medium", !done && !currentStep && "text-muted-foreground")}>{t}</p>
                  {currentStep && <p className="text-xs text-primary">In progress now</p>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="surface mt-4 p-6">
        <h2 className="text-base font-bold">Items in this shipment</h2>
        <div className="mt-3 space-y-3">
          {order.items.map((item) => {
            const p = products.find((x) => x.id === item.productId);
            return (
              <div key={item.productId} className="flex items-center gap-3">
                <img src={categoryImage(p?.category ?? "electronics")} alt={item.title} loading="lazy" width={100} height={100} className="size-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Qty {item.qty}</p>
                </div>
                <span className="text-sm font-semibold">{inr(item.price * item.qty)}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-sm">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
          <p className="text-muted-foreground">
            {order.address.name}, {order.address.line1}, {order.address.city}, {order.address.state} {order.address.pincode}
          </p>
        </div>
        <p className="mt-3 text-right text-lg font-bold">Total {inr(order.total)}</p>
      </div>
    </div>
  );
}

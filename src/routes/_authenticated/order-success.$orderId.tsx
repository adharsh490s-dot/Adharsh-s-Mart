import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/States";
import { deliveryDate, inr } from "@/lib/media";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/order-success/$orderId")({
  head: () => ({
    meta: [
      { title: "Order Confirmed | Adharsh's Mart" },
      { name: "description", content: "Your Adharsh's Mart order is confirmed. Track its progress or keep shopping." },
      { property: "og:title", content: "Order Confirmed | Adharsh's Mart" },
      { property: "og:description", content: "Order placed successfully on Adharsh's Mart." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { orderId } = Route.useParams();
  const { orders, hydrated } = useStore();
  const order = orders.find((o) => o.id === orderId);

  if (hydrated && !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-5">
        <EmptyState
          icon={<PackageSearch className="size-6" />}
          title="We couldn't find that order"
          body="The order reference may have expired on this device. Your order history is still available."
          action={
            <Button asChild>
              <Link to="/orders">View orders</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-5">
      <div className="surface fade-up flex flex-col items-center gap-3 p-8 text-center sm:p-12">
        <div className="grid size-16 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-9" />
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">Order Confirmed!</h1>
        <p className="text-sm text-muted-foreground">Your order has been successfully placed.</p>

        <dl className="mt-4 grid w-full gap-3 rounded-xl bg-muted/60 p-4 text-left text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Order ID</dt>
            <dd className="font-semibold">#{orderId}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Estimated delivery</dt>
            <dd className="font-semibold">{deliveryDate(order?.delivery === "Same-Day Delivery" ? 0 : 2)}</dd>
          </div>
          {order && (
            <>
              <div>
                <dt className="text-muted-foreground">Paid via</dt>
                <dd className="font-semibold">{order.payment}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Order total</dt>
                <dd className="font-semibold">{inr(order.total)}</dd>
              </div>
            </>
          )}
        </dl>

        {order && order.savings > 0 && (
          <p className="text-sm font-medium text-success">You saved {inr(order.savings)} on this order</p>
        )}

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/orders/$orderId" params={{ orderId }}>
              Track Order
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

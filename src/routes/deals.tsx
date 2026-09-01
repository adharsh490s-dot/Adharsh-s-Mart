import { createFileRoute, Link } from "@tanstack/react-router";
import { Timer } from "lucide-react";
import { ProductListing } from "@/components/ProductListing";
import { Countdown } from "@/components/Countdown";
import { discountOf, products } from "@/lib/catalog";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Today's Deals — Up to 60% off | Adharsh's Mart" },
      { name: "description", content: "Live Adharsh's Mart deals refreshed daily: discounts up to 60% off across electronics, home, fashion and beauty." },
      { property: "og:title", content: "Today's Deals | Adharsh's Mart" },
      { property: "og:description", content: "Limited-time price drops across the Adharsh's Mart catalogue. Ends soon." },
    ],
  }),
  component: DealsPage,
});

function DealsPage() {
  const deals = products.filter((p) => discountOf(p) >= 25);
  return (
    <div>
      <div className="gradient-deal">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-5 text-deal-foreground sm:px-5">
          <div>
            <h2 className="text-lg font-bold">Festive Week price drops</h2>
            <p className="text-sm opacity-80">{deals.length} products discounted right now.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-black/15 px-4 py-2 text-sm font-bold">
            <Timer className="size-4" /> Ends in <Countdown hours={7} />
          </span>
        </div>
      </div>
      <ProductListing heading="Today's Deals" description="Every discounted listing, sorted by the biggest savings first." source={deals} initialSort="discount" />
      <p className="sr-only">
        <Link to="/products">All products</Link>
      </p>
    </div>
  );
}

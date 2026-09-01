import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, ShieldCheck, RotateCcw, BadgeCheck, ArrowRight, Timer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCarousel } from "@/components/ProductCarousel";
import { ProductCard } from "@/components/ProductCard";
import { Countdown } from "@/components/Countdown";
import { categories, discountOf, products } from "@/lib/catalog";
import { categoryImage, inr } from "@/lib/media";
import { useStore } from "@/lib/store";
import heroImage from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Adharsh's Mart — Everything you need. Delivered smarter." },
      {
        name: "description",
        content: "Shop electronics, mobiles, fashion, home, beauty and more on Adharsh's Mart. Daily deals, verified sellers and fast free delivery across India.",
      },
      { property: "og:title", content: "Adharsh's Mart — Everything you need. Delivered smarter." },
      { property: "og:description", content: "Millions of products, unbeatable deals and fast delivery — all in one smarter cart." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { recent, hydrated } = useStore();
  const deals = products.filter((p) => discountOf(p) >= 35).slice(0, 12);
  const trending = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 12);
  const recommended = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const recentProducts = recent.map((id) => products.find((p) => p.id === id)).filter((p): p is (typeof products)[number] => Boolean(p));

  return (
    <div className="mx-auto max-w-[1400px] space-y-14 px-4 py-6 sm:px-5">
      <section className="fade-up relative overflow-hidden rounded-3xl gradient-hero text-ink-foreground">
        <img
          src={heroImage}
          alt="A curated selection of Adharsh's Mart bestsellers floating on a deep blue studio backdrop"
          width={1600}
          height={1104}
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="relative grid gap-6 px-6 py-14 sm:px-12 sm:py-20 lg:w-3/5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles className="size-3.5 text-deal" /> Festive Week · up to 60% off
          </span>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">Everything you need. One smarter cart.</h1>
          <p className="max-w-xl text-sm text-white/80 sm:text-base">
            Discover millions of products, unbeatable deals, and fast delivery—all in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/products">
                Shop Now <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/deals">Explore Deals</Link>
            </Button>
          </div>
        </div>
      </section>

      <ProductCarousel
        title="Today's Deals"
        subtitle="Prices drop again in a few hours — grab them while they last."
        products={deals}
        action={
          <span className="mr-2 hidden items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive sm:inline-flex">
            <Timer className="size-3.5" /> Ends in <Countdown hours={7} />
          </span>
        }
      />

      <section className="space-y-4">
        <h2 className="text-xl font-bold sm:text-2xl">Popular categories</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/products/$category"
              params={{ category: c.slug }}
              className="surface lift group overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={categoryImage(c.slug)}
                  alt={c.name}
                  loading="lazy"
                  width={900}
                  height={900}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold">{c.name}</h3>
                <p className="truncate text-xs text-muted-foreground">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <h2 className="truncate text-xl font-bold sm:text-2xl">Recommended for you</h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/products">View all</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {recommended.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <ProductCarousel title="Trending this week" subtitle="What thousands of Adharsh's Mart shoppers are buying right now." products={trending} />

      {hydrated && recentProducts.length > 0 && (
        <ProductCarousel title="Recently viewed" subtitle="Pick up where you left off." products={recentProducts} />
      )}

      <section className="grid gap-4 md:grid-cols-2">
        {[
          { title: "Limited-time electronics fest", copy: "Flagship audio, wearables and smart home at their lowest prices this season.", to: "electronics", hours: 5 },
          { title: "Home upgrade week", copy: "Cookware, comfort and cleaning tech bundled with extra savings.", to: "home", hours: 11 },
        ].map((offer) => (
          <div key={offer.to} className="surface relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-0 gradient-deal opacity-10" aria-hidden />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-deal/20 px-3 py-1 text-xs font-bold text-deal-foreground">
                <Timer className="size-3.5" /> Ends in <Countdown hours={offer.hours} />
              </span>
              <h3 className="mt-3 text-xl font-bold">{offer.title}</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">{offer.copy}</p>
              <Button asChild className="mt-4" size="sm">
                <Link to="/products/$category" params={{ category: offer.to }}>
                  Shop the offer <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold sm:text-2xl">Why Adharsh's Mart?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Zap, title: "Fast Delivery", copy: "Same-day and next-day delivery in 180+ cities." },
            { icon: ShieldCheck, title: "Secure Payments", copy: "256-bit encrypted checkout with trusted providers." },
            { icon: RotateCcw, title: "Easy Returns", copy: "7-day no-questions replacement on eligible items." },
            { icon: BadgeCheck, title: "Verified Products", copy: "Every seller is quality-audited before listing." },
          ].map((f) => (
            <div key={f.title} className="surface lift p-5">
              <div className="grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="text-lg font-bold">Save more with code ADHARSH10</h2>
          <p className="text-sm text-muted-foreground">Flat 10% off your first order above {inr(1499)}. Applied at checkout.</p>
        </div>
        <Button asChild>
          <Link to="/products">Start shopping</Link>
        </Button>
      </section>
    </div>
  );
}

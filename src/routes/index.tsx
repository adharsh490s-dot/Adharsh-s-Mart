import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, ShieldCheck, RotateCcw, BadgeCheck, ArrowRight, Timer, Crown, MoveUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCarousel } from "@/components/ProductCarousel";
import { ProductCard } from "@/components/ProductCard";
import { Countdown } from "@/components/Countdown";
import { categories, discountOf, products } from "@/lib/catalog";
import { categoryImage, inr, productImage } from "@/lib/media";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
    <div className="mx-auto max-w-[1400px] space-y-20 px-4 py-5 sm:px-6 lg:space-y-28 lg:py-8">
      <section className="fade-up relative min-h-[520px] overflow-hidden rounded-lg border border-primary/20 text-ink-foreground lg:min-h-[650px]">
        <img
          src={heroImage}
          alt="A curated selection of Adharsh's Mart bestsellers floating on a deep blue studio backdrop"
          width={1600}
          height={1104}
          className="ambient-zoom absolute inset-0 size-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
        <div className="relative flex min-h-[520px] max-w-3xl flex-col justify-center gap-6 px-7 py-14 sm:px-14 lg:min-h-[650px] lg:px-20">
          <span className="editorial-kicker inline-flex items-center gap-2">
            <Crown className="size-4" /> The AdharshMart Collection
          </span>
          <h1 className="max-w-2xl text-5xl leading-[0.94] sm:text-7xl lg:text-8xl">Elevate your everyday.</h1>
          <p className="max-w-xl text-sm leading-7 text-ink-foreground/75 sm:text-base">
            Exceptional technology, considered living, and modern essentials—curated with concierge-level service.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button asChild size="lg" className="px-8 uppercase tracking-widest">
              <Link to="/products">
                Shop the collection <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-ink-foreground/30 bg-ink/20 px-8 uppercase tracking-widest text-ink-foreground backdrop-blur hover:bg-ink-foreground/10">
              <Link to="/deals">Discover the edit</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-6 right-6 hidden border-l border-primary/40 pl-5 text-right lg:block">
          <p className="editorial-kicker">White-glove delivery</p>
          <p className="mt-1 text-sm text-ink-foreground/70">Across 180+ Indian cities</p>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-end justify-between gap-4 border-b border-border pb-5">
          <div><p className="editorial-kicker">Private selection</p><h2 className="mt-2 text-4xl sm:text-5xl">Featured designs</h2></div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex"><Link to="/products">View boutique <MoveUpRight className="size-4" /></Link></Button>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {recommended.slice(0, 3).map((p, index) => (
            <Link key={p.id} to="/product/$productId" params={{ productId: p.id }} className="group fade-up" style={{ animationDelay: `${index * 90}ms` }}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
                <img src={productImage(p.id, p.category)} alt={p.title} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-x-4 bottom-4 translate-y-2 rounded-md bg-ink/85 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest opacity-0 backdrop-blur transition-all group-hover:translate-y-0 group-hover:opacity-100">View edition</span>
              </div>
              <p className="editorial-kicker mt-5">{p.brand}</p>
              <h3 className="mt-2 text-2xl leading-tight">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{inr(p.price)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div><p className="editorial-kicker">Explore the house</p><h2 className="mt-2 text-4xl sm:text-5xl">Curated departments</h2></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.slice(0, 10).map((c) => (
            <Link
              key={c.slug}
              to="/products/$category"
              params={{ category: c.slug }}
              className="group relative aspect-[4/5] overflow-hidden rounded-md border border-border"
            >
              <div className="absolute inset-0 overflow-hidden bg-muted">
                <img
                  src={categoryImage(c.slug)}
                  alt={c.name}
                  loading="lazy"
                  width={900}
                  height={900}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="text-2xl text-ink-foreground">{c.name}</h3>
                <p className="mt-1 truncate text-xs text-ink-foreground/65">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-border pb-5">
          <div><p className="editorial-kicker">Chosen for you</p><h2 className="mt-2 truncate text-4xl sm:text-5xl">The daily edit</h2></div>
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

      <ProductCarousel title="Trending this week" subtitle="What thousands of AdharshMart clients are choosing right now." products={trending} />

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
        <div className="text-center"><p className="editorial-kicker">The service standard</p><h2 className="mt-2 text-4xl sm:text-5xl">Beyond delivery</h2></div>
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

      <section className="glass flex flex-col items-start gap-3 rounded-md border-primary/30 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
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

import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Heart, ShoppingCart, Truck, ShieldCheck, RotateCcw, MapPin, ChevronLeft, ChevronRight, CheckCircle2, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RatingStars } from "@/components/RatingStars";
import { ProductCarousel } from "@/components/ProductCarousel";
import { discountOf, productById, products, questionsFor, ratingDistribution, reviewsFor } from "@/lib/catalog";
import { categoryImage, deliveryDate, inr, shortDate } from "@/lib/media";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = productById(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product unavailable | Adharsh's Mart" }, { name: "robots", content: "noindex" }] };
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.title} — ${inr(product.price)} | Adharsh's Mart` },
        { name: "description", content: product.description },
        { property: "og:title", content: product.title },
        { property: "og:description", content: product.description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, wishlist, pushRecent } = useStore();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    pushRecent(product.id);
    setActive(0);
    setQty(1);
  }, [product.id, pushRecent]);

  const image = categoryImage(product.category);
  const gallery = [image, image, image, image];
  const wished = wishlist.includes(product.id);
  const discount = discountOf(product);
  const reviews = reviewsFor(product);
  const distribution = ratingDistribution(product);
  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 10);
  const bundle = products.filter((p) => p.id !== product.id).slice(0, 2);
  const bundleTotal = bundle.reduce((a, p) => a + p.price, product.price);

  const add = () => {
    addToCart(product.id, qty);
    toast.success("Added to cart", { description: `${qty} × ${product.title}` });
  };

  const buyNow = () => {
    addToCart(product.id, qty);
    navigate({ to: "/checkout" });
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-5">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link to="/products/$category" params={{ category: product.category }} className="hover:text-primary capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="truncate text-foreground">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)_300px]">
        <div className="space-y-3">
          <div
            className="surface relative aspect-square overflow-hidden bg-muted"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
          >
            <img
              src={gallery[active] ?? image}
              alt={`${product.title} — view ${active + 1}`}
              width={900}
              height={900}
              className={cn("size-full object-cover transition-transform duration-500", zoom && "scale-125")}
            />
            <Button
              variant="secondary"
              size="icon"
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2"
              onClick={() => setActive((a) => (a - 1 + gallery.length) % gallery.length)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setActive((a) => (a + 1) % gallery.length)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            {gallery.map((g, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={cn("size-16 overflow-hidden rounded-lg border-2 bg-muted", active === i ? "border-primary" : "border-border")}
              >
                <img src={g} alt="" loading="lazy" width={200} height={200} className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">{product.brand}</p>
            <h1 className="mt-1 text-2xl font-bold leading-tight sm:text-3xl">{product.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <RatingStars rating={product.rating} size={16} />
              <span className="font-semibold">{product.rating}</span>
              <a href="#reviews" className="text-primary hover:underline">
                {product.reviews.toLocaleString("en-IN")} reviews
              </a>
              {product.bestSeller && <Badge variant="secondary">Bestseller</Badge>}
              {product.badge && <Badge>{product.badge}</Badge>}
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold tracking-tight">{inr(product.price)}</span>
              <span className="text-base text-muted-foreground line-through">{inr(product.mrp)}</span>
              <span className="rounded-md bg-destructive px-2 py-0.5 text-sm font-bold text-destructive-foreground">{discount}% OFF</span>
            </div>
            <p className="mt-1 text-sm text-success">You save {inr(product.mrp - product.price)} · Inclusive of all taxes</p>
            <p className="mt-1 text-sm text-muted-foreground">
              No-cost EMI from <span className="font-semibold text-foreground">{inr(Math.round(product.price / 6))}/month</span> for 6 months
            </p>
          </div>

          <div className="surface space-y-2 p-4 text-sm">
            <h2 className="font-semibold">Available offers</h2>
            <p>• Flat 10% off with code <span className="font-semibold">ADHARSH10</span> on orders above {inr(1499)}</p>
            <p>• Extra {inr(500)} off on your first Adharsh's Mart order with <span className="font-semibold">NEW500</span></p>
            <p>• Bank offer: 5% cashback on eligible credit cards</p>
          </div>

          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {product.highlights.map((h: string) => (
              <li key={h} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="surface h-fit space-y-4 p-5">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="font-medium">Deliver to Bengaluru 560038</p>
              <p className="text-muted-foreground">Arrives {deliveryDate(1)}</p>
            </div>
          </div>
          <p className="text-sm font-semibold text-success">
            {product.stock > 0 ? (product.stock <= 5 ? `In stock — only ${product.stock} left` : "In stock") : "Currently unavailable"}
          </p>

          <div className="flex items-center gap-3">
            <label htmlFor="qty" className="text-sm font-medium">
              Qty
            </label>
            <div className="flex items-center rounded-lg border border-border">
              <Button variant="ghost" size="icon" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </Button>
              <span id="qty" className="w-8 text-center text-sm font-semibold">
                {qty}
              </span>
              <Button variant="ghost" size="icon" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))}>
                +
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Button onClick={add} disabled={product.stock === 0} className="w-full">
              <ShoppingCart className="size-4" /> Add to Cart
            </Button>
            <Button onClick={buyNow} disabled={product.stock === 0} variant="secondary" className="w-full">
              Buy Now
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                toggleWishlist(product.id);
                toast(wished ? "Removed from wishlist" : "Added to wishlist ♥");
              }}
            >
              <Heart className={cn("size-4", wished && "fill-destructive text-destructive")} /> {wished ? "In wishlist" : "Add to wishlist"}
            </Button>
          </div>

          <Separator />
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2"><Truck className="size-4 text-primary" /> Free delivery on this order</li>
            <li className="flex items-center gap-2"><RotateCcw className="size-4 text-primary" /> 7-day replacement</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Secure Adharsh's Mart checkout</li>
          </ul>
        </aside>
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="surface p-6">
          <h2 className="text-lg font-bold">About this product</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {product.description} Designed by {product.brand} for people who expect their everyday gear to keep up. Every unit ships through Adharsh's Mart's
            verification pipeline, so what arrives is exactly what was listed — no grey imports, no surprises.
          </p>
        </div>
        <div className="surface overflow-hidden p-6">
          <h2 className="text-lg font-bold">Specifications</h2>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {product.specs.map((s: { label: string; value: string }) => (
                <tr key={s.label} className="border-b border-border last:border-0">
                  <th scope="row" className="py-2 pr-4 text-left font-medium text-muted-foreground">{s.label}</th>
                  <td className="py-2 text-right">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="surface mt-6 p-6">
        <h2 className="text-lg font-bold">Frequently bought together</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {[product, ...bundle].map((p, i) => (
            <div key={p.id} className="flex items-center gap-4">
              {i > 0 && <span className="text-lg text-muted-foreground">+</span>}
              <Link to="/product/$productId" params={{ productId: p.id }} className="flex w-40 flex-col gap-2">
                <img src={categoryImage(p.category)} alt={p.title} loading="lazy" width={200} height={200} className="aspect-square rounded-lg object-cover" />
                <span className="line-clamp-2 text-xs font-medium">{p.title}</span>
                <span className="text-sm font-bold">{inr(p.price)}</span>
              </Link>
            </div>
          ))}
          <div className="ml-auto">
            <p className="text-sm text-muted-foreground">Combined price</p>
            <p className="text-2xl font-bold">{inr(bundleTotal)}</p>
            <Button
              className="mt-2"
              onClick={() => {
                [product, ...bundle].forEach((p) => addToCart(p.id));
                toast.success("3 items added to cart");
              }}
            >
              Add all three to cart
            </Button>
          </div>
        </div>
      </section>

      <section id="reviews" className="mt-6 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="surface h-fit p-6">
          <h2 className="text-lg font-bold">Customer reviews</h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-bold">{product.rating}</span>
            <div>
              <RatingStars rating={product.rating} size={16} />
              <p className="text-xs text-muted-foreground">{product.reviews.toLocaleString("en-IN")} global ratings</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {distribution.map((pct, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-10 shrink-0">{5 - i} star</span>
                <Progress value={pct} className="h-2" />
                <span className="w-9 shrink-0 text-right text-muted-foreground">{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((r) => (
            <article key={r.id} className="surface p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{r.author}</span>
                {r.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                    <CheckCircle2 className="size-3" /> Verified purchase
                  </span>
                )}
                <span className="ml-auto text-xs text-muted-foreground">{shortDate(r.date)}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <RatingStars rating={r.rating} />
                <h3 className="text-sm font-semibold">{r.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => toast("Thanks for the feedback")}>
                <ThumbsUp className="size-4" /> Helpful ({r.helpful})
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="surface mt-6 p-6">
        <h2 className="text-lg font-bold">Questions & answers</h2>
        <Accordion type="single" collapsible className="mt-2">
          {questionsFor(product).map((qa, i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger className="text-left text-sm">{qa.q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">{qa.a}</p>
                <p className="mt-1 text-xs text-muted-foreground">Answered by {qa.by}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <div className="mt-12">
        <ProductCarousel title="Similar products" products={similar} />
      </div>
    </div>
  );
}

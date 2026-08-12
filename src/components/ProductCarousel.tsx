import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/catalog";

export function ProductCarousel({ title, subtitle, products, action }: { title: string; subtitle?: string; products: Product[]; action?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    ref.current?.scrollBy({ left: dir * Math.max(280, (ref.current?.clientWidth ?? 600) * 0.8), behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {action}
          <Button variant="outline" size="icon" aria-label="Scroll left" onClick={() => scrollBy(-1)} className="hidden sm:inline-flex">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Scroll right" onClick={() => scrollBy(1)} className="hidden sm:inline-flex">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2">
        {products.map((p) => (
          <div key={p.id} className="w-[220px] shrink-0 snap-start sm:w-[250px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

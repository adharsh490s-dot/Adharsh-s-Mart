import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

const columns = [
  { title: "Get to Know Us", links: ["About SwiftCart", "Careers", "Press", "Investor Relations"] },
  { title: "Customer Service", links: ["Help Center", "Returns", "Shipping", "Contact Us"] },
  { title: "Make Money With Us", links: ["Sell on SwiftCart", "Affiliate Program", "Advertise Products"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-ink-foreground">
      <div className="mx-auto max-w-[1400px] px-5 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="" width={32} height={32} loading="lazy" className="size-8" />
              <span className="font-display text-lg font-bold">SwiftCart</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-foreground/70">Everything you need. Delivered smarter.</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink-foreground/70">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link to="/products" className="transition-colors hover:text-ink-foreground">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1400px] px-5 py-5 text-center text-xs text-ink-foreground/60">
          © 2026 SwiftCart. All rights reserved. Demo storefront — no real transactions are processed.
        </p>
      </div>
    </footer>
  );
}

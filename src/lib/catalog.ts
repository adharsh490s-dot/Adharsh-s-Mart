export type Category = {
  slug: string;
  name: string;
  tagline: string;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  stock: number;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  badge?: string;
  bestSeller?: boolean;
  newArrival?: boolean;
  deal?: boolean;
  createdAt: string;
};

export const categories: Category[] = [
  { slug: "electronics", name: "Electronics", tagline: "Audio, wearables & more" },
  { slug: "mobiles", name: "Mobiles", tagline: "Latest smartphones" },
  { slug: "laptops", name: "Laptops", tagline: "Work & play machines" },
  { slug: "fashion", name: "Fashion", tagline: "Everyday premium wear" },
  { slug: "home", name: "Home & Kitchen", tagline: "Live better, daily" },
  { slug: "beauty", name: "Beauty", tagline: "Skin, hair & self-care" },
  { slug: "sports", name: "Sports", tagline: "Train harder" },
  { slug: "books", name: "Books", tagline: "Stories & ideas" },
  { slug: "gaming", name: "Gaming", tagline: "Level up your setup" },
  { slug: "groceries", name: "Groceries", tagline: "Fresh essentials" },
];

type Seed = [
  title: string,
  brand: string,
  category: string,
  price: number,
  mrp: number,
  rating: number,
  reviews: number,
  stock: number,
  desc: string,
];

const seeds: Seed[] = [
  ["Aurora Pro ANC Wireless Headphones", "Nova Audio", "electronics", 8499, 12999, 4.6, 4821, 12, "Studio-grade 40mm drivers with adaptive noise cancellation and 48-hour playback."],
  ["Pulse Buds 3 True Wireless Earbuds", "Nova Audio", "electronics", 2999, 4999, 4.4, 12840, 45, "Compact earbuds with dual-mic ENC calling, low-latency game mode and IPX5 protection."],
  ["Halo Watch S2 AMOLED Smartwatch", "Kinetiq", "electronics", 4499, 7999, 4.3, 6421, 8, "1.85-inch AMOLED display, SpO2 and heart-rate tracking with 100+ sport modes."],
  ["Lumen 4K Streaming Media Stick", "Vantru", "electronics", 3299, 4499, 4.5, 2210, 30, "4K HDR streaming with voice remote and instant app switching."],
  ["SoundSlab 200W Party Speaker", "Nova Audio", "electronics", 10999, 16999, 4.2, 1180, 6, "Room-filling 200W output with dual subwoofers and reactive LED rings."],
  ["Voltcore 20000mAh Fast Power Bank", "Voltcore", "electronics", 1999, 3199, 4.4, 9820, 60, "65W bi-directional charging with three-device output and a live power display."],
  ["Zenith 12 Pro 5G (256GB, Titan Grey)", "Zenith", "mobiles", 62999, 79999, 4.7, 15230, 9, "Flagship 6.7-inch LTPO display, triple 50MP camera system and 5000mAh silicon battery."],
  ["Zenith Lite 5G (128GB, Mist Blue)", "Zenith", "mobiles", 17499, 22999, 4.3, 22110, 40, "Balanced everyday 5G phone with 120Hz display and 45W fast charging."],
  ["Orbit Neo 5G (256GB, Aurora Green)", "Orbit", "mobiles", 28999, 35999, 4.5, 8740, 15, "Slim curved-glass build with 108MP main camera and clean, ad-free software."],
  ["Orbit Fold X Foldable Phone", "Orbit", "mobiles", 114999, 139999, 4.4, 1320, 4, "7.6-inch inner foldable panel with hinge-free crease design and desktop mode."],
  ["Mint M6 Budget Smartphone (64GB)", "Mint", "mobiles", 8999, 11999, 4.0, 31420, 80, "Reliable daily driver with 6000mAh battery and clean stock-style Android."],
  ["Zenith Buds Case Rugged Cover", "Zenith", "mobiles", 799, 1499, 4.1, 5120, 120, "Military-grade drop protection with raised camera lip and matte finish."],
  ["Stratos 14 Ultrabook (16GB / 512GB)", "Stratos", "laptops", 74999, 94999, 4.6, 3120, 7, "1.1kg magnesium chassis, 2.8K OLED display and 18-hour real-world battery."],
  ["Stratos Creator 16 (32GB / 1TB)", "Stratos", "laptops", 129999, 159999, 4.7, 940, 3, "Colour-accurate 16-inch mini-LED panel with discrete graphics for editors."],
  ["Forge G7 Gaming Laptop RTX Series", "Forge", "laptops", 98999, 124999, 4.4, 2610, 5, "240Hz QHD panel, vapour-chamber cooling and per-key RGB keyboard."],
  ["Basecamp 15 Everyday Laptop", "Basecamp", "laptops", 42999, 54999, 4.1, 7420, 22, "Dependable 15.6-inch productivity laptop with full-size keypad and dual SSD slots."],
  ["Stratos Dock 9-in-1 USB-C Hub", "Stratos", "laptops", 3499, 5499, 4.5, 4110, 55, "Dual 4K output, 100W passthrough charging and gigabit ethernet."],
  ["Northline Merino Crew Sweater", "Northline", "fashion", 3299, 5999, 4.4, 2840, 18, "Extra-fine 19.5 micron merino knit that breathes in every season."],
  ["Northline Tailored Chino Trousers", "Northline", "fashion", 1999, 3499, 4.2, 6210, 34, "Four-way stretch cotton twill with a clean, tapered tailored fit."],
  ["Marlow Leather Derby Shoes", "Marlow", "fashion", 5499, 8999, 4.5, 1420, 9, "Full-grain leather uppers with cushioned cork footbed and Goodyear welt."],
  ["Driftwear Oversized Cotton Tee", "Driftwear", "fashion", 899, 1499, 4.1, 18420, 200, "240 GSM combed cotton with a relaxed drop-shoulder silhouette."],
  ["Marlow Minimal Analog Watch", "Marlow", "fashion", 4299, 7499, 4.3, 2110, 11, "Sapphire crystal, 5ATM water resistance and an interchangeable strap system."],
  ["Driftwear Weekender Duffel Bag", "Driftwear", "fashion", 2799, 4599, 4.4, 1810, 25, "Water-repellent recycled canvas with a padded 15-inch laptop sleeve."],
  ["Hearthline 5.5L Air Fryer Pro", "Hearthline", "home", 6499, 10999, 4.5, 9410, 14, "Rapid convection cooking with 12 presets and a dishwasher-safe basket."],
  ["Hearthline Triply Cookware Set (5 pcs)", "Hearthline", "home", 5999, 9999, 4.6, 3210, 16, "Induction-ready stainless triply construction with even heat distribution."],
  ["Cloudrest Memory Foam Mattress (Queen)", "Cloudrest", "home", 18999, 29999, 4.4, 5410, 7, "Zoned pressure relief with a breathable gel-infused comfort layer."],
  ["Cloudrest 4-Piece Cotton Bedsheet Set", "Cloudrest", "home", 1899, 3299, 4.2, 8120, 60, "300 thread count long-staple cotton, softer after every wash."],
  ["Hearthline Robot Vacuum Mop V4", "Hearthline", "home", 21999, 34999, 4.3, 1920, 5, "LiDAR mapping, 4000Pa suction and automatic mop-pad lifting."],
  ["Glow Ritual Vitamin C Serum 30ml", "Glow Ritual", "beauty", 899, 1699, 4.4, 21400, 90, "15% stabilised vitamin C with ferulic acid for visibly brighter skin."],
  ["Glow Ritual Ceramide Moisturiser", "Glow Ritual", "beauty", 749, 1299, 4.5, 14120, 75, "Barrier-repair cream with ceramides and squalane, fragrance-free."],
  ["Solstice SPF 50 Invisible Sunscreen", "Solstice", "beauty", 649, 999, 4.6, 30210, 140, "Broad-spectrum, no-white-cast gel sunscreen for daily urban use."],
  ["Solstice Argan Repair Hair Oil", "Solstice", "beauty", 549, 899, 4.2, 9120, 100, "Cold-pressed argan and jojoba blend for frizz control and shine."],
  ["Vertex Adjustable Dumbbell 24kg", "Vertex", "sports", 12999, 19999, 4.5, 2140, 6, "Dial-a-weight system replacing 15 pairs of dumbbells in one footprint."],
  ["Vertex Pro Yoga Mat 6mm", "Vertex", "sports", 1499, 2499, 4.3, 7810, 48, "Non-slip TPE surface with alignment markers and a carry strap."],
  ["Trailhead Running Shoes X3", "Trailhead", "sports", 4999, 7999, 4.4, 5410, 20, "Responsive nitrogen-infused foam with a breathable engineered mesh upper."],
  ["Trailhead 40L Trekking Backpack", "Trailhead", "sports", 3499, 5999, 4.2, 2210, 17, "Ventilated back panel, rain cover and load-balancing hip belt."],
  ["The Quiet Algorithm — Hardcover", "Meridian Press", "books", 599, 899, 4.6, 4210, 33, "A gripping account of how invisible systems shape modern decisions."],
  ["Atlas of Small Habits — Paperback", "Meridian Press", "books", 349, 599, 4.5, 18210, 70, "A practical field guide to building habits that actually survive."],
  ["Monsoon Letters — Fiction Bestseller", "Inkfall", "books", 429, 699, 4.3, 6120, 41, "A tender novel about family, migration and the year the rains came late."],
  ["Deep Work Notebook Set (3 pcs)", "Inkfall", "books", 799, 1299, 4.4, 2810, 64, "Dot-grid 120 GSM paper with lay-flat binding for long writing sessions."],
  ["Vector X Wireless Gaming Mouse", "Vector", "gaming", 4299, 6999, 4.6, 8210, 19, "26K DPI optical sensor, 68g shell and 90-hour battery life."],
  ["Vector K8 Hot-Swap Mechanical Keyboard", "Vector", "gaming", 6999, 10999, 4.7, 4120, 10, "Gasket-mounted board with pre-lubed switches and south-facing RGB."],
  ["Arcline 27\" 180Hz QHD Gaming Monitor", "Arcline", "gaming", 22999, 32999, 4.5, 2310, 8, "Fast IPS panel with 1ms response, HDR400 and adaptive sync."],
  ["Arcline Elite Gaming Chair", "Arcline", "gaming", 15999, 24999, 4.2, 1420, 6, "4D armrests, lumbar support and a breathable hybrid-mesh back."],
  ["Harvest Cold-Pressed Olive Oil 1L", "Harvest", "groceries", 899, 1299, 4.5, 5410, 88, "First cold-press extra virgin olive oil in a light-blocking bottle."],
  ["Harvest Roasted Almonds 500g", "Harvest", "groceries", 649, 949, 4.4, 12410, 150, "Slow-roasted California almonds, no added oil or preservatives."],
  ["Daybreak Arabica Coffee Beans 500g", "Daybreak", "groceries", 749, 1099, 4.6, 8120, 95, "Single-estate Chikmagalur arabica with notes of cocoa and orange peel."],
  ["Daybreak Organic Green Tea (100 bags)", "Daybreak", "groceries", 499, 799, 4.2, 6210, 120, "Whole-leaf organic green tea in plastic-free biodegradable bags."],
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

const specBank: Record<string, { label: string; value: string }[]> = {
  electronics: [
    { label: "Connectivity", value: "Bluetooth 5.3, USB-C" },
    { label: "Battery life", value: "Up to 48 hours" },
    { label: "Warranty", value: "1 year manufacturer warranty" },
  ],
  mobiles: [
    { label: "Display", value: "6.7-inch AMOLED, 120Hz" },
    { label: "Processor", value: "Octa-core 4nm" },
    { label: "Battery", value: "5000mAh, 67W fast charge" },
  ],
  laptops: [
    { label: "Processor", value: "12-core, up to 4.8GHz" },
    { label: "Memory", value: "16GB LPDDR5" },
    { label: "Storage", value: "512GB NVMe SSD" },
  ],
  fashion: [
    { label: "Material", value: "Premium natural fibres" },
    { label: "Care", value: "Machine wash cold" },
    { label: "Fit", value: "Regular / true to size" },
  ],
  home: [
    { label: "Material", value: "Food-grade stainless & BPA-free" },
    { label: "Power", value: "230V, energy efficient" },
    { label: "Warranty", value: "2 years" },
  ],
  beauty: [
    { label: "Skin type", value: "All skin types" },
    { label: "Format", value: "Fragrance-free, dermat tested" },
    { label: "Shelf life", value: "24 months" },
  ],
  sports: [
    { label: "Build", value: "Reinforced training-grade" },
    { label: "Use", value: "Home & studio" },
    { label: "Warranty", value: "1 year" },
  ],
  books: [
    { label: "Language", value: "English" },
    { label: "Pages", value: "324" },
    { label: "Publisher", value: "Meridian Press" },
  ],
  gaming: [
    { label: "Polling rate", value: "1000Hz" },
    { label: "Connectivity", value: "2.4GHz / Bluetooth / USB-C" },
    { label: "Warranty", value: "2 years" },
  ],
  groceries: [
    { label: "Type", value: "Vegetarian" },
    { label: "Storage", value: "Cool, dry place" },
    { label: "Shelf life", value: "12 months" },
  ],
};

export const products: Product[] = seeds.map((s, i) => {
  const [title, brand, category, price, mrp, rating, reviews, stock, description] = s;
  const discount = Math.round(((mrp - price) / mrp) * 100);
  return {
    id: `SC${(1001 + i).toString()}`,
    slug: slugify(title),
    title,
    brand,
    category,
    price,
    mrp,
    rating,
    reviews,
    stock,
    description,
    highlights: [
      description,
      "Backed by SwiftCart Verified quality checks",
      "Free 7-day replacement on eligible returns",
      "Ships from the nearest SwiftCart fulfilment hub",
    ],
    specs: [
      { label: "Brand", value: brand },
      { label: "Model ID", value: `SC-${1001 + i}` },
      ...(specBank[category] ?? []),
      { label: "Country of origin", value: "India" },
    ],
    badge: i % 7 === 0 ? "SwiftCart Choice" : discount >= 40 ? "Big Saving" : undefined,
    bestSeller: reviews > 9000,
    newArrival: i % 5 === 2,
    deal: discount >= 35,
    createdAt: new Date(2026, 0, 1 + ((i * 7) % 210)).toISOString(),
  };
});

export const productById = (id: string) => products.find((p) => p.id === id);
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

export const brands = Array.from(new Set(products.map((p) => p.brand))).sort();

export const discountOf = (p: Product) => Math.round(((p.mrp - p.price) / p.mrp) * 100);

export type Review = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
};

const reviewAuthors = ["Ananya R.", "Rahul M.", "Sneha P.", "Vikram S.", "Aisha K.", "Dev N.", "Priya T.", "Karan J."];
const reviewTitles = [
  "Exceeded expectations",
  "Great value for the price",
  "Solid, would buy again",
  "Very good, with minor niggles",
  "Exactly as described",
];
const reviewBodies = [
  "Delivery was quick and the packaging was excellent. Build quality feels genuinely premium for this price point.",
  "Used it daily for three weeks now. Performance has been consistent and there were no surprises after purchase.",
  "Does the job really well. Took a couple of days to get used to, but I would recommend it to a friend.",
  "Good product overall. The only thing I would change is the bundled accessories, which feel basic.",
  "Fantastic pick during the sale. The savings made it a no-brainer and quality is on par with pricier options.",
];

export function reviewsFor(product: Product): Review[] {
  const seedNum = parseInt(product.id.replace("SC", ""), 10);
  return Array.from({ length: 5 }, (_, i) => {
    const k = (seedNum + i * 3) % reviewAuthors.length;
    return {
      id: `${product.id}-r${i}`,
      author: reviewAuthors[k],
      rating: Math.max(3, Math.min(5, Math.round(product.rating + (i % 3) - 1))),
      title: reviewTitles[(seedNum + i) % reviewTitles.length],
      body: reviewBodies[(seedNum + i * 2) % reviewBodies.length],
      date: new Date(2026, 5, 1 + ((seedNum + i * 5) % 60)).toISOString(),
      verified: i !== 3,
      helpful: ((seedNum * (i + 2)) % 87) + 3,
    };
  });
}

export function ratingDistribution(product: Product) {
  const base = product.rating;
  const five = Math.round(((base - 2.6) / 2.4) * 78) + 8;
  const four = Math.round((100 - five) * 0.55);
  const three = Math.round((100 - five - four) * 0.5);
  const two = Math.round((100 - five - four - three) * 0.55);
  const one = Math.max(0, 100 - five - four - three - two);
  return [five, four, three, two, one];
}

export type Question = { q: string; a: string; by: string };

export function questionsFor(product: Product): Question[] {
  return [
    { q: `Is the ${product.brand} warranty valid across India?`, a: "Yes, the warranty is honoured at all authorised service partners nationwide.", by: "SwiftCart Seller" },
    { q: "Is this the latest model available?", a: "Yes, this is the current-generation model listed by the brand for 2026.", by: "Verified Buyer" },
    { q: "Does it qualify for no-cost EMI?", a: "No-cost EMI is available on orders above ₹3,000 with most major bank cards.", by: "SwiftCart Support" },
  ];
}

import electronics from "@/assets/cat-electronics.jpg";
import mobiles from "@/assets/cat-mobiles.jpg";
import laptops from "@/assets/cat-laptops.jpg";
import fashion from "@/assets/cat-fashion.jpg";
import home from "@/assets/cat-home.jpg";
import beauty from "@/assets/cat-beauty.jpg";
import sports from "@/assets/cat-sports.jpg";
import books from "@/assets/cat-books.jpg";
import gaming from "@/assets/cat-gaming.jpg";
import groceries from "@/assets/cat-groceries.jpg";

const map: Record<string, string> = {
  electronics,
  mobiles,
  laptops,
  fashion,
  home,
  beauty,
  sports,
  books,
  gaming,
  groceries,
};

export function categoryImage(slug: string) {
  return map[slug] ?? electronics;
}

export function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function deliveryDate(daysAhead: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type Product } from "./catalog";

export type CartLine = { productId: string; qty: number };
export type Address = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  type: "Home" | "Work" | "Other";
  isDefault: boolean;
};
export type OrderItem = { productId: string; title: string; qty: number; price: number };
export type Order = {
  id: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  savings: number;
  address: Address;
  delivery: string;
  payment: string;
  status: "Placed" | "Shipped" | "Out for delivery" | "Delivered" | "Cancelled";
  eta: string;
};
export type User = { name: string; email: string; phone: string } | null;

type State = {
  cart: CartLine[];
  saved: string[];
  wishlist: string[];
  recent: string[];
  orders: Order[];
  addresses: Address[];
  user: User;
  searches: string[];
  coupon: string | null;
};

const STORAGE_KEY = "swiftcart:v1";

const demoAddress: Address = {
  id: "addr-1",
  name: "Adharsh S",
  phone: "+91 98450 12345",
  line1: "412, Lakeview Residency, 2nd Cross, Indiranagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560038",
  type: "Home",
  isDefault: true,
};

function demoOrders(): Order[] {
  const p0 = products[6]!;
  const p1 = products[24]!;
  const p2 = products[29]!;
  return [
    {
      id: "AM-2026-41027",
      createdAt: new Date(2026, 6, 22).toISOString(),
      items: [{ productId: p0.id, title: p0.title, qty: 1, price: p0.price }],
      total: p0.price,
      savings: p0.mrp - p0.price,
      address: demoAddress,
      delivery: "Express Delivery",
      payment: "UPI",
      status: "Delivered",
      eta: new Date(2026, 6, 24).toISOString(),
    },
    {
      id: "AM-2026-43918",
      createdAt: new Date(2026, 7, 6).toISOString(),
      items: [
        { productId: p1.id, title: p1.title, qty: 1, price: p1.price },
        { productId: p2.id, title: p2.title, qty: 2, price: p2.price },
      ],
      total: p1.price + p2.price * 2,
      savings: 3200,
      address: demoAddress,
      delivery: "FREE Delivery",
      payment: "Credit Card",
      status: "Shipped",
      eta: new Date(2026, 7, 13).toISOString(),
    },
  ];
}

const initialState: State = {
  cart: [],
  saved: [],
  wishlist: [products[12]!.id, products[40]!.id],
  recent: [],
  orders: demoOrders(),
  addresses: [demoAddress],
  user: null,
  searches: [],
  coupon: null,
};

type Ctx = State & {
  hydrated: boolean;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  pushRecent: (id: string) => void;
  pushSearch: (q: string) => void;
  placeOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => Order;
  addAddress: (a: Omit<Address, "id">) => void;
  updateAddress: (a: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  signIn: (u: NonNullable<User>) => void;
  signOut: () => void;
  applyCoupon: (code: string) => boolean;
  cartCount: number;
  cartProducts: { product: Product; qty: number }[];
  totals: { subtotal: number; mrpTotal: number; discount: number; coupon: number; delivery: number; tax: number; total: number };
};

const StoreContext = createContext<Ctx | null>(null);

export const COUPONS: Record<string, number> = { ADHARSH10: 10, NEW500: 5, FEST20: 20 };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as Partial<State>) });
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  const patch = useCallback((fn: (s: State) => State) => setState((s) => fn(s)), []);

  const addToCart = useCallback(
    (id: string, qty = 1) =>
      patch((s) => {
        const existing = s.cart.find((l) => l.productId === id);
        return {
          ...s,
          cart: existing
            ? s.cart.map((l) => (l.productId === id ? { ...l, qty: Math.min(10, l.qty + qty) } : l))
            : [...s.cart, { productId: id, qty }],
        };
      }),
    [patch],
  );

  const removeFromCart = useCallback((id: string) => patch((s) => ({ ...s, cart: s.cart.filter((l) => l.productId !== id) })), [patch]);
  const setQty = useCallback(
    (id: string, qty: number) =>
      patch((s) => ({
        ...s,
        cart: qty <= 0 ? s.cart.filter((l) => l.productId !== id) : s.cart.map((l) => (l.productId === id ? { ...l, qty } : l)),
      })),
    [patch],
  );
  const clearCart = useCallback(() => patch((s) => ({ ...s, cart: [], coupon: null })), [patch]);
  const saveForLater = useCallback(
    (id: string) => patch((s) => ({ ...s, cart: s.cart.filter((l) => l.productId !== id), saved: s.saved.includes(id) ? s.saved : [...s.saved, id] })),
    [patch],
  );
  const moveToCart = useCallback(
    (id: string) =>
      patch((s) => ({
        ...s,
        saved: s.saved.filter((x) => x !== id),
        wishlist: s.wishlist.filter((x) => x !== id),
        cart: s.cart.some((l) => l.productId === id) ? s.cart : [...s.cart, { productId: id, qty: 1 }],
      })),
    [patch],
  );
  const toggleWishlist = useCallback(
    (id: string) => patch((s) => ({ ...s, wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [id, ...s.wishlist] })),
    [patch],
  );
  const pushRecent = useCallback((id: string) => patch((s) => ({ ...s, recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 10) })), [patch]);
  const pushSearch = useCallback(
    (q: string) => patch((s) => (q.trim() ? { ...s, searches: [q.trim(), ...s.searches.filter((x) => x !== q.trim())].slice(0, 6) } : s)),
    [patch],
  );

  const cartProducts = useMemo(
    () =>
      state.cart
        .map((l) => {
          const product = products.find((p) => p.id === l.productId);
          return product ? { product, qty: l.qty } : null;
        })
        .filter((x): x is { product: Product; qty: number } => x !== null),
    [state.cart],
  );

  const totals = useMemo(() => {
    const subtotal = cartProducts.reduce((a, l) => a + l.product.price * l.qty, 0);
    const mrpTotal = cartProducts.reduce((a, l) => a + l.product.mrp * l.qty, 0);
    const discount = mrpTotal - subtotal;
    const couponPct = state.coupon ? (COUPONS[state.coupon] ?? 0) : 0;
    const coupon = Math.round((subtotal * couponPct) / 100);
    const net = subtotal - coupon;
    const delivery = net === 0 || net > 999 ? 0 : 49;
    const tax = Math.round(net * 0.18);
    return { subtotal, mrpTotal, discount, coupon, delivery, tax, total: net + delivery + tax };
  }, [cartProducts, state.coupon]);

  const placeOrder = useCallback<Ctx["placeOrder"]>(
    (o) => {
      const order: Order = {
        ...o,
        id: `AM-2026-${Math.floor(10000 + Math.random() * 89999)}`,
        createdAt: new Date().toISOString(),
        status: "Placed",
      };
      patch((s) => ({ ...s, orders: [order, ...s.orders], cart: [], coupon: null }));
      return order;
    },
    [patch],
  );

  const addAddress = useCallback<Ctx["addAddress"]>(
    (a) =>
      patch((s) => {
        const next: Address = { ...a, id: `addr-${Date.now()}` };
        return { ...s, addresses: [...s.addresses.map((x) => (next.isDefault ? { ...x, isDefault: false } : x)), next] };
      }),
    [patch],
  );
  const updateAddress = useCallback<Ctx["updateAddress"]>((a) => patch((s) => ({ ...s, addresses: s.addresses.map((x) => (x.id === a.id ? a : x)) })), [patch]);
  const removeAddress = useCallback((id: string) => patch((s) => ({ ...s, addresses: s.addresses.filter((x) => x.id !== id) })), [patch]);
  const setDefaultAddress = useCallback(
    (id: string) => patch((s) => ({ ...s, addresses: s.addresses.map((x) => ({ ...x, isDefault: x.id === id })) })),
    [patch],
  );
  const signIn = useCallback((u: NonNullable<User>) => patch((s) => ({ ...s, user: u })), [patch]);
  const signOut = useCallback(() => patch((s) => ({ ...s, user: null })), [patch]);
  const applyCoupon = useCallback(
    (code: string) => {
      const key = code.trim().toUpperCase();
      if (!COUPONS[key]) return false;
      patch((s) => ({ ...s, coupon: key }));
      return true;
    },
    [patch],
  );

  const value: Ctx = {
    ...state,
    hydrated,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    saveForLater,
    moveToCart,
    toggleWishlist,
    pushRecent,
    pushSearch,
    placeOrder,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    signIn,
    signOut,
    applyCoupon,
    cartCount: state.cart.reduce((a, l) => a + l.qty, 0),
    cartProducts,
    totals,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

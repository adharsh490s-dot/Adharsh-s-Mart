import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, CreditCard, Truck, MapPin, ShieldCheck, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/States";
import { categoryImage, deliveryDate, inr } from "@/lib/media";
import { useStore, type Address } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout | Adharsh's Mart" },
      { name: "description", content: "Complete your Adharsh's Mart order in four quick steps: address, delivery method, payment and review." },
      { property: "og:title", content: "Secure Checkout | Adharsh's Mart" },
      { property: "og:description", content: "A fast, secure four-step checkout. This demo never collects real payment credentials." },
    ],
  }),
  component: CheckoutPage,
});

const deliveryOptions = [
  { id: "FREE Delivery", copy: "Arrives in 4-5 days", price: 0 },
  { id: "Express Delivery", copy: "Arrives in 2 days", price: 99 },
  { id: "Same-Day Delivery", copy: "Arrives today before 9 PM", price: 199 },
];

const paymentOptions = ["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallet", "Cash on Delivery"];

const steps = ["Address", "Delivery", "Payment", "Review"];

function CheckoutPage() {
  const { cartProducts, totals, addresses, addAddress, setDefaultAddress, removeAddress, placeOrder, user } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [addressId, setAddressId] = useState(addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? "");
  const [delivery, setDelivery] = useState(deliveryOptions[0]!.id);
  const [payment, setPayment] = useState(paymentOptions[0]!);
  const [showForm, setShowForm] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [draft, setDraft] = useState({ name: "", phone: "", line1: "", city: "", state: "", pincode: "" });

  const selected = addresses.find((a) => a.id === addressId) ?? addresses[0];
  const deliveryFee = deliveryOptions.find((d) => d.id === delivery)?.price ?? 0;
  const grandTotal = totals.total + deliveryFee;

  if (cartProducts.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-5">
        <EmptyState
          icon={<ShoppingBag className="size-6" />}
          title="Nothing to check out yet"
          body="Add a product to your cart and your checkout will be ready in seconds."
          action={
            <Button asChild>
              <Link to="/products">Browse products</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const saveAddress = () => {
    if (!draft.name || !draft.phone || !draft.line1 || !draft.city || !draft.pincode) {
      toast.error("Please complete the address", { description: "Name, phone, address, city and pincode are required." });
      return;
    }
    addAddress({ ...draft, state: draft.state || "Karnataka", type: "Home", isDefault: addresses.length === 0 });
    setShowForm(false);
    setDraft({ name: "", phone: "", line1: "", city: "", state: "", pincode: "" });
    toast.success("Address saved");
  };

  const confirm = () => {
    if (!selected) {
      toast.error("Add a delivery address first");
      setStep(0);
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      const order = placeOrder({
        items: cartProducts.map(({ product, qty }) => ({ productId: product.id, title: product.title, qty, price: product.price })),
        total: grandTotal,
        savings: totals.discount + totals.coupon,
        address: selected,
        delivery,
        payment,
        eta: new Date(Date.now() + (delivery === "Same-Day Delivery" ? 1 : delivery === "Express Delivery" ? 2 : 5) * 86400000).toISOString(),
      });
      toast.success("Order placed successfully ✓", { description: `Order ${order.id}` });
      setPlacing(false);
      navigate({ to: "/order-success/$orderId", params: { orderId: order.id } });
    }, 900);
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-5">
      <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <ShieldCheck className="size-4 text-success" /> Secure demo checkout — no real payment details are collected.
      </p>

      <ol className="mt-6 grid grid-cols-4 gap-2" aria-label="Checkout progress">
        {steps.map((s, i) => (
          <li key={s} className="min-w-0">
            <button
              type="button"
              onClick={() => setStep(Math.min(i, step))}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold",
                i === step ? "border-primary bg-accent text-accent-foreground" : i < step ? "border-success/40 text-success" : "border-border text-muted-foreground",
              )}
            >
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-current/10">{i < step ? <Check className="size-3" /> : i + 1}</span>
              <span className="truncate">{s}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="surface p-5 sm:p-6">
          {step === 0 && (
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <MapPin className="size-5 text-primary" /> Delivery address
              </h2>
              <RadioGroup value={addressId} onValueChange={setAddressId} className="space-y-3">
                {addresses.map((a: Address) => (
                  <div key={a.id} className="flex items-start gap-3 rounded-xl border border-border p-4">
                    <RadioGroupItem value={a.id} id={a.id} className="mt-1" />
                    <Label htmlFor={a.id} className="flex-1 cursor-pointer font-normal">
                      <span className="block font-semibold">
                        {a.name} · {a.type} {a.isDefault && <span className="ml-1 rounded bg-accent px-1.5 py-0.5 text-[11px]">Default</span>}
                      </span>
                      <span className="block text-sm text-muted-foreground">
                        {a.line1}, {a.city}, {a.state} {a.pincode}
                      </span>
                      <span className="block text-sm text-muted-foreground">{a.phone}</span>
                    </Label>
                    <div className="flex shrink-0 flex-col gap-1">
                      {!a.isDefault && (
                        <Button variant="ghost" size="sm" onClick={() => setDefaultAddress(a.id)}>
                          Set default
                        </Button>
                      )}
                      {addresses.length > 1 && (
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeAddress(a.id)}>
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </RadioGroup>

              {showForm ? (
                <div className="grid gap-3 rounded-xl border border-dashed border-border p-4 sm:grid-cols-2">
                  {[
                    ["name", "Full name"],
                    ["phone", "Phone number"],
                    ["line1", "Address"],
                    ["city", "City"],
                    ["state", "State"],
                    ["pincode", "Pincode"],
                  ].map(([key, label]) => (
                    <div key={key} className={key === "line1" ? "sm:col-span-2" : ""}>
                      <Label htmlFor={`addr-${key}`} className="mb-1 block text-xs">
                        {label}
                      </Label>
                      <Input
                        id={`addr-${key}`}
                        value={draft[key as keyof typeof draft]}
                        onChange={(e) => setDraft((d) => ({ ...d, [key as string]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div className="flex gap-2 sm:col-span-2">
                    <Button onClick={saveAddress}>Save address</Button>
                    <Button variant="ghost" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setShowForm(true)}>
                  + Add a new address
                </Button>
              )}

              <Button className="w-full sm:w-auto" onClick={() => setStep(1)} disabled={!selected}>
                Deliver to this address
              </Button>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Truck className="size-5 text-primary" /> Delivery method
              </h2>
              <RadioGroup value={delivery} onValueChange={setDelivery} className="space-y-3">
                {deliveryOptions.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 rounded-xl border border-border p-4">
                    <RadioGroupItem value={d.id} id={d.id} />
                    <Label htmlFor={d.id} className="flex-1 cursor-pointer font-normal">
                      <span className="block font-semibold">{d.id}</span>
                      <span className="block text-sm text-muted-foreground">{d.copy}</span>
                    </Label>
                    <span className="text-sm font-semibold">{d.price === 0 ? "FREE" : inr(d.price)}</span>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button onClick={() => setStep(2)}>Continue to payment</Button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <CreditCard className="size-5 text-primary" /> Payment method
              </h2>
              <RadioGroup value={payment} onValueChange={setPayment} className="grid gap-3 sm:grid-cols-2">
                {paymentOptions.map((p) => (
                  <div key={p} className="flex items-center gap-3 rounded-xl border border-border p-4">
                    <RadioGroupItem value={p} id={`pay-${p}`} />
                    <Label htmlFor={`pay-${p}`} className="cursor-pointer font-normal">
                      {p}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                This is a simulated payment step. Adharsh's Mart's demo never asks for card numbers, UPI PINs or bank credentials.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>Review order</Button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold">Review your order</h2>
              <div className="space-y-3">
                {cartProducts.map(({ product, qty }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <img src={categoryImage(product.category)} alt={product.title} loading="lazy" width={100} height={100} className="size-14 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium">{product.title}</p>
                      <p className="text-xs text-muted-foreground">Qty {qty}</p>
                    </div>
                    <span className="text-sm font-semibold">{inr(product.price * qty)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Delivering to</dt>
                  <dd className="font-medium">{selected ? `${selected.name}, ${selected.city} ${selected.pincode}` : "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Estimated delivery</dt>
                  <dd className="font-medium">{deliveryDate(delivery === "Same-Day Delivery" ? 0 : delivery === "Express Delivery" ? 2 : 5)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Delivery method</dt>
                  <dd className="font-medium">{delivery}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Payment</dt>
                  <dd className="font-medium">{payment}</dd>
                </div>
              </dl>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={confirm} disabled={placing} size="lg">
                  {placing ? "Placing order…" : `Place Order · ${inr(grandTotal)}`}
                </Button>
              </div>
            </section>
          )}
        </div>

        <aside className="surface h-fit space-y-3 p-5 lg:sticky lg:top-32">
          <h2 className="text-lg font-bold">Summary</h2>
          {user && <p className="text-xs text-muted-foreground">Signed in as {user.email}</p>}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items ({cartProducts.length})</span>
            <span>{inr(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Savings</span>
            <span className="text-success">-{inr(totals.discount + totals.coupon)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span>{deliveryFee === 0 ? "FREE" : inr(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>{inr(totals.tax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{inr(grandTotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

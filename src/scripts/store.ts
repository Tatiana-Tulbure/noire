// Cart + wishlist state, kept in localStorage so it survives page loads.
// This is a demo storefront: nothing is sent to a server.

export interface CatalogEntry {
  name: string;
  price: number;
  image: string;
}

export interface CartLine {
  slug: string;
  qty: number;
}

const CART_KEY = "noire:cart";
const WISH_KEY = "noire:wishlist";
const ORDER_KEY = "noire:last-order";
export const CHANGE_EVENT = "noire:change";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode) — state lives for this page only */
  }
  document.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

let catalog: Record<string, CatalogEntry> | null = null;

export function getCatalog(): Record<string, CatalogEntry> {
  if (!catalog) {
    const el = document.getElementById("noire-catalog");
    catalog = el ? JSON.parse(el.textContent || "{}") : {};
  }
  return catalog!;
}

/* ---------- Cart ---------- */

export function getCart(): CartLine[] {
  const known = getCatalog();
  return read<CartLine[]>(CART_KEY, []).filter((l) => known[l.slug] && l.qty > 0);
}

export function addToCart(slug: string, qty = 1) {
  const cart = getCart();
  const line = cart.find((l) => l.slug === slug);
  if (line) line.qty += qty;
  else cart.push({ slug, qty });
  write(CART_KEY, cart);
}

export function setQty(slug: string, qty: number) {
  const cart = getCart()
    .map((l) => (l.slug === slug ? { ...l, qty } : l))
    .filter((l) => l.qty > 0);
  write(CART_KEY, cart);
}

export function removeFromCart(slug: string) {
  write(CART_KEY, getCart().filter((l) => l.slug !== slug));
}

export function emptyCart() {
  write(CART_KEY, []);
}

export function cartCount(): number {
  return getCart().reduce((n, l) => n + l.qty, 0);
}

export function cartTotal(lines: CartLine[] = getCart()): number {
  const known = getCatalog();
  return lines.reduce((sum, l) => sum + known[l.slug].price * l.qty, 0);
}

/* ---------- Last order (shown on the confirmation step) ---------- */

export function placeOrder() {
  write(ORDER_KEY, getCart());
  write(CART_KEY, []);
}

export function getLastOrder(): CartLine[] {
  const known = getCatalog();
  return read<CartLine[]>(ORDER_KEY, []).filter((l) => known[l.slug]);
}

/* ---------- Wishlist ---------- */

export function getWishlist(): string[] {
  const known = getCatalog();
  return read<string[]>(WISH_KEY, []).filter((s) => known[s]);
}

export function isWished(slug: string): boolean {
  return getWishlist().includes(slug);
}

export function toggleWish(slug: string): boolean {
  const list = getWishlist();
  const on = !list.includes(slug);
  write(WISH_KEY, on ? [...list, slug] : list.filter((s) => s !== slug));
  return on;
}

export const onChange = (fn: () => void) => document.addEventListener(CHANGE_EVENT, fn);

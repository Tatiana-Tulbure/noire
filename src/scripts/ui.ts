import {
  getCatalog, getCart, setQty, removeFromCart, emptyCart, cartTotal, addToCart,
  getWishlist, toggleWish, onChange, type CartLine,
} from "./store";

const MINUS = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const PLUS = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12H19M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
export const euroSuffix = (n: number) => `${n} €`;

/** Markup for one cart line. `editable` adds the quantity stepper + remove link. */
export function lineHTML(line: CartLine, editable: boolean): string {
  const p = getCatalog()[line.slug];
  const href = `/product/${line.slug}/`;
  const price = editable ? p.price : p.price * line.qty;
  return `
    <li class="line${editable ? "" : " line--static"}" data-line="${line.slug}">
      <a class="line__img" href="${href}" tabindex="-1"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy" /></a>
      <div class="line__info">
        <a class="line__name" href="${href}">${esc(p.name)}</a>
        <p class="line__price">${euroSuffix(price)}${!editable && line.qty > 1 ? ` · ×${line.qty}` : ""}</p>
        ${editable ? `
        <div class="qty" role="group" aria-label="Quantity for ${esc(p.name)}">
          <button type="button" data-qty="-1" aria-label="Decrease quantity" ${line.qty <= 1 ? "disabled" : ""}>${MINUS}</button>
          <span class="qty__value" aria-live="polite">${line.qty}</span>
          <button type="button" data-qty="1" aria-label="Increase quantity">${PLUS}</button>
        </div>
        <button class="line__remove" type="button" data-remove>Remove from cart</button>` : ""}
      </div>
    </li>`;
}

/** Wire +/- and remove buttons inside a list of editable lines */
export function bindLineControls(list: HTMLElement) {
  list.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const li = target.closest<HTMLElement>("[data-line]");
    if (!li) return;
    const slug = li.dataset.line!;
    const step = target.closest<HTMLElement>("[data-qty]");
    if (step) {
      const line = getCart().find((l) => l.slug === slug);
      if (line) setQty(slug, Math.max(1, line.qty + Number(step.dataset.qty)));
    } else if (target.closest("[data-remove]")) {
      removeFromCart(slug);
    }
  });
}

/* ---------- Cart drawer ---------- */

const drawer = document.getElementById("cart-drawer");
let lastFocus: HTMLElement | null = null;

function renderCart() {
  if (!drawer) return;
  const cart = getCart();
  drawer.classList.toggle("is-empty", cart.length === 0);
  const list = drawer.querySelector<HTMLElement>("[data-cart-lines]")!;
  list.innerHTML = cart.map((l) => lineHTML(l, true)).join("");
  const total = euroSuffix(cartTotal(cart));
  drawer.querySelector("[data-cart-subtotal]")!.textContent = total;
  drawer.querySelector("[data-cart-total]")!.textContent = total;
}

export function openCart() {
  if (!drawer) return;
  lastFocus = document.activeElement as HTMLElement;
  renderCart();
  drawer.hidden = false;
  document.body.classList.add("is-locked");
  drawer.querySelector<HTMLElement>(".cart__close")?.focus();
}

function closeCart() {
  if (!drawer || drawer.hidden) return;
  drawer.hidden = true;
  document.body.classList.remove("is-locked");
  lastFocus?.focus();
}

if (drawer) {
  bindLineControls(drawer.querySelector<HTMLElement>("[data-cart-lines]")!);
  drawer.querySelector("[data-cart-empty]")?.addEventListener("click", () => emptyCart());
  drawer.querySelectorAll("[data-cart-close]").forEach((el) => el.addEventListener("click", closeCart));
  // On the collection page "Continue shopping" just closes the drawer
  drawer.querySelector("[data-cart-continue]")?.addEventListener("click", (e) => {
    if (location.pathname.startsWith("/collection")) {
      e.preventDefault();
      closeCart();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });
  onChange(() => {
    if (!drawer.hidden) renderCart();
  });
}

document.querySelectorAll("[data-cart-open]").forEach((el) => el.addEventListener("click", openCart));

/* "Add to cart" buttons anywhere: data-add-to-cart="slug" (optional data-qty-source="#id") */
document.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-add-to-cart]");
  if (!btn) return;
  const src = btn.dataset.qtySource ? document.querySelector<HTMLElement>(btn.dataset.qtySource) : null;
  const qty = src ? Number(src.textContent) || 1 : 1;
  addToCart(btn.dataset.addToCart!, qty);
  openCart();
});

/* ---------- Wishlist hearts ---------- */

function syncHearts() {
  const list = getWishlist();
  document.querySelectorAll<HTMLElement>("[data-wish]").forEach((btn) => {
    const on = list.includes(btn.dataset.wish!);
    btn.setAttribute("aria-pressed", String(on));
    const name = getCatalog()[btn.dataset.wish!]?.name ?? "item";
    btn.setAttribute("aria-label", on ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`);
  });
}

document.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-wish]");
  if (!btn) return;
  e.preventDefault();
  toggleWish(btn.dataset.wish!);
});
onChange(syncHearts);
syncHearts();

/* ---------- Mobile menu ---------- */

const menuBtn = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
const menu = document.getElementById("mobile-menu");
menuBtn?.addEventListener("click", () => {
  if (!menu) return;
  const open = menu.hidden;
  menu.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("is-locked", open);
});

/* ---------- Carousels with the Figma progress indicator ---------- */

document.querySelectorAll<HTMLElement>("[data-carousel]").forEach((root) => {
  const track = root.querySelector<HTMLElement>("[data-carousel-track]");
  const thumb = root.querySelector<HTMLElement>("[data-carousel-thumb]");
  if (!track || !thumb) return;
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    const visible = track.clientWidth / track.scrollWidth;
    const progress = max > 0 ? track.scrollLeft / max : 0;
    thumb.style.width = `${Math.min(100, visible * 100)}%`;
    thumb.style.left = `${progress * (100 - Math.min(100, visible * 100))}%`;
  };
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
});

/* ---------- Accordions (product info, filters, order history) ---------- */

document.querySelectorAll<HTMLButtonElement>("[data-accordion]").forEach((btn) => {
  const panel = document.getElementById(btn.getAttribute("aria-controls")!);
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", String(open));
    if (panel) panel.hidden = !open;
  });
});

/* ---------- Newsletter (demo — no data is sent) ---------- */

document.querySelectorAll<HTMLFormElement>("[data-newsletter]").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.reset();
    const thanks = form.querySelector<HTMLElement>(".footer__thanks");
    if (thanks) thanks.hidden = false;
  });
});

# NOIRÉ — luxury furniture e-commerce (concept)

A front-end build of the NOIRÉ UI design (Figma: *💌 3 – UI Design*): a dark, editorial furniture store with a working cart, wishlist, filters and a three-step checkout.

> **UI/UX concept project by Tatiana Tulbure — not a real store.** Designed in Figma, built with Astro & GSAP, deployed on Vercel.
>
> No real orders, payments or accounts: cart and wishlist live in the browser's `localStorage` and the forms only validate locally.

## Stack

- [Astro 7](https://astro.build) — static site, no UI framework
- Vanilla TypeScript for the interactive parts (`src/scripts`)
- [GSAP](https://gsap.com) (ScrollTrigger, SplitText, Flip) for motion, disabled under `prefers-reduced-motion`
- Fluid em-based scaling from the 1920px Figma frame (`src/styles/global.css`)
- Fonts: Cormorant Garamond + Raleway (Google Fonts)

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run preview  # serve the build
```

Node 22.12+ is required.

## Pages

| Route | Figma screen |
|---|---|
| `/` | Home_page |
| `/collection/` | all products (filters, search, "More results") |
| `/product/[slug]/` | product_page (one page per product) |
| Cart drawer (any page) | cart / cart (empty) |
| `/wishlist/` | Wishlist |
| `/login/`, `/register/`, `/forgot-password/` | welcome back, create your account, create new password |
| `/account/`, `/account/orders/`, `/account/addresses/` | my account, order history, my addresses |
| `/checkout/shipping/` → `/checkout/payment/` → `/checkout/confirmation/` | Shipping details, Payment (+ error state), Order confirmation |
| `/terms/`, `/delivery-returns/` | Terms & conditions (2 screens) |
| 404 | 404 |

## Project structure

```
src/
  components/   Navbar, Footer, ProductCard, CartDrawer, form + page shells, home sections
  data/         products.ts (catalogue) + image-sizes.json
  icons/        SVG icons exported from Figma
  layouts/      BaseLayout.astro (meta, fonts, nav, footer, cart)
  pages/        routes
  scripts/      store.ts (cart/wishlist), ui.ts (drawer, hearts, carousels), forms.ts
  styles/       global.css (tokens + fluid scale), commerce.css
public/assets/images/   optimised WebP images exported from Figma
```

## Live

https://noire-furniture.vercel.app — deployed on Vercel; every push to `main` redeploys automatically.

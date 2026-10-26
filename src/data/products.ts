import sizes from "./image-sizes.json";

export type Category = "Lounge chairs" | "Armchairs" | "Dining tables" | "Lighting" | "Sofas" | "Accessories";
export type Room = "Living room" | "Dining room" | "Bedroom" | "Home office" | "Outdoor";
export type Color = "Ivory" | "Beige" | "Pink" | "Olive" | "White";
export type Material = "Velvet" | "Cotton" | "Walnut" | "Marble" | "Metal";
export type NavGroup = "sofas" | "tables" | "seating" | "accessories";

export interface Product {
  slug: string;
  name: string;
  price: number;
  image: string;
  category: Category;
  group: NavGroup;
  rooms: Room[];
  colors: Color[];
  materials: Material[];
  description: string;
  dimensions?: string;
}

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
}

/** Look up a processed image in /assets/images by base name. */
export function img(name: string): ImageAsset {
  const size = (sizes as Record<string, { w: number; h: number }>)[name];
  if (!size) throw new Error(`Unknown image: ${name}`);
  return { src: `/assets/images/${name}.webp`, width: size.w, height: size.h };
}

const FAT_DESCRIPTION =
  "The Fat collection is engineered to hug the body and deliver maximum comfort. Each piece is crafted from moulded foam, hand-finished and upholstered in Europe by experienced craftsmen. The collection is re-engineered to be lighter and more streamlined for easier handling and movement. Available in a wide range of fabrics.";

// Names and prices are taken from the Figma screens (Home, All products, Product, Wishlist, Cart).
export const products: Product[] = [
  {
    slug: "fat-lounge-chair", name: "Fat Lounge Chair", price: 1176, image: "product-fat-lounge-chair",
    category: "Lounge chairs", group: "seating", rooms: ["Living room", "Bedroom"], colors: ["Pink"], materials: ["Cotton", "Metal"],
    description: FAT_DESCRIPTION, dimensions: "Dimensions: W 80 × D 78 × H 75 cm · Seat height 45 cm",
  },
  {
    slug: "cloud-boucle-armchair", name: "Cloud Bouclé Armchair", price: 2890, image: "product-cloud-boucle-armchair",
    category: "Armchairs", group: "seating", rooms: ["Living room", "Bedroom"], colors: ["Ivory", "White"], materials: ["Cotton"],
    description: "A soft, enveloping armchair wrapped in ivory bouclé. Its rounded silhouette brings a calm, sculptural presence to any living space.",
  },
  {
    slug: "luca-chairs", name: "Luca Chairs", price: 2850, image: "product-luca-chairs",
    category: "Lounge chairs", group: "seating", rooms: ["Living room"], colors: ["Beige", "Pink"], materials: ["Cotton"],
    description: "Generous curves and a low, welcoming seat in a warm peach bouclé — a statement lounge chair made for slow evenings.",
  },
  {
    slug: "navy-velvet-dining-chair", name: "Navy Velvet Dining Chair", price: 1985, image: "product-navy-velvet-dining-chair",
    category: "Armchairs", group: "seating", rooms: ["Dining room"], colors: [], materials: ["Velvet", "Metal"],
    description: "Deep navy velvet on slender brass-finished legs. A refined dining chair that combines practicality with visual charm.",
  },
  {
    slug: "blush-curve-sofa", name: "Blush Curve Sofa", price: 5890, image: "product-blush-curve-sofa",
    category: "Sofas", group: "sofas", rooms: ["Living room"], colors: ["Pink"], materials: ["Cotton"],
    description: "A curved sofa upholstered in blush textured fabric, designed to soften the room and invite conversation.",
  },
  {
    slug: "bloom-pouf", name: "Bloom Pouf", price: 490, image: "product-bloom-pouf",
    category: "Accessories", group: "accessories", rooms: ["Bedroom", "Living room"], colors: ["Pink"], materials: ["Velvet"],
    description: "A playful velvet pouf with a soft backrest — an accent piece that adds colour and comfort.",
  },
  {
    slug: "pheaby-chairs", name: "Pheaby Chairs", price: 3250, image: "product-pheaby-chairs",
    category: "Lounge chairs", group: "seating", rooms: ["Living room"], colors: ["Beige", "Ivory"], materials: ["Cotton"],
    description: "A sculpted bouclé lounge chair on a pedestal base, balancing a cocooning back with a light, modern profile.",
  },
  {
    slug: "rows-table", name: "Rows Table", price: 1250, image: "product-rows-table",
    category: "Dining tables", group: "tables", rooms: ["Dining room", "Living room"], colors: ["Beige"], materials: ["Walnut"],
    description: "A turned solid-wood side table with a round top and sculptural column, finished by hand.",
  },
  {
    slug: "pheaby-chairs-walnut", name: "Pheaby Chairs", price: 1890, image: "product-pheaby-chairs-walnut",
    category: "Lounge chairs", group: "seating", rooms: ["Living room", "Home office"], colors: ["Beige"], materials: ["Cotton", "Walnut"],
    description: "A deep lounge seat in natural bouclé resting on a curved walnut sled base.",
  },
  {
    slug: "getluky-chair", name: "Getluky Chair", price: 1850, image: "product-getluky-chair",
    category: "Armchairs", group: "seating", rooms: ["Living room"], colors: ["Olive"], materials: ["Velvet", "Metal"],
    description: "Channel-tufted green velvet on fine metal legs — an elegant accent chair with a retro spirit.",
  },
  {
    slug: "roc-keyvisual-chair", name: "Roc Keyvisual Chair", price: 2000, image: "product-roc-keyvisual-chair",
    category: "Lounge chairs", group: "seating", rooms: ["Living room", "Bedroom"], colors: ["Ivory"], materials: ["Cotton"],
    description: "A compact, cushioned lounge chair in cream bouclé with dark legs, made for reading corners.",
  },
  {
    slug: "swivel-accent-chair", name: "Swivel Accent Chair", price: 3250, image: "product-swivel-accent-chair",
    category: "Lounge chairs", group: "seating", rooms: ["Living room"], colors: [], materials: ["Velvet", "Metal"],
    description: "Rounded bolster cushions in vivid velvet on a black frame — a bold piece with a graphic silhouette.",
  },
  {
    slug: "fat-2-5-seater", name: "Fat 2.5-Seater", price: 2850, image: "product-fat-2-5-seater",
    category: "Sofas", group: "sofas", rooms: ["Living room"], colors: ["Olive"], materials: ["Cotton"],
    description: FAT_DESCRIPTION,
  },
  {
    slug: "fat-work-chair", name: "Fat Work Chair", price: 1840, image: "product-fat-work-chair",
    category: "Armchairs", group: "seating", rooms: ["Home office"], colors: [], materials: ["Velvet"],
    description: FAT_DESCRIPTION,
  },
  {
    slug: "luca-chairs-rose", name: "Luca Chairs", price: 850, image: "product-luca-chairs-rose",
    category: "Armchairs", group: "seating", rooms: ["Dining room"], colors: ["Pink"], materials: ["Cotton"],
    description: "An open-back chair in rose bouclé with a solid, sculpted base.",
  },
  {
    slug: "bubble-lounge-chair", name: "Bubble Lounge Chair", price: 2890, image: "product-bubble-lounge-chair",
    category: "Lounge chairs", group: "seating", rooms: ["Living room"], colors: ["Olive"], materials: ["Velvet"],
    description: "Quilted, bubble-like volumes in deep green create an iconic lounge chair that is as playful as it is comfortable.",
  },
  {
    slug: "orbit-swivel-chair", name: "Orbit Swivel Chair", price: 1640, image: "product-orbit-swivel-chair",
    category: "Lounge chairs", group: "seating", rooms: ["Living room", "Home office"], colors: ["Pink"], materials: ["Cotton"],
    description: "An open-back swivel chair in rose fabric on a flared pedestal base.",
  },
  {
    slug: "luna-swivel-chair", name: "Luna Swivel Chair", price: 1580, image: "product-luna-swivel-chair",
    category: "Lounge chairs", group: "seating", rooms: ["Bedroom", "Living room"], colors: ["Ivory", "White"], materials: ["Cotton", "Metal"],
    description: "Soft ivory bouclé on a polished swivel base — a cosy, cloud-like seat.",
  },
  {
    slug: "riva-lounge-chair", name: "Riva Lounge Chair", price: 1940, image: "product-riva-lounge-chair",
    category: "Lounge chairs", group: "seating", rooms: ["Living room"], colors: [], materials: ["Velvet", "Metal"],
    description: "A mid-century inspired wingback in teal velvet with tapered brass-finished legs.",
  },
  {
    slug: "sienna-lounge-chair", name: "Sienna Lounge Chair", price: 1290, image: "product-sienna-lounge-chair",
    category: "Lounge chairs", group: "seating", rooms: ["Living room", "Bedroom"], colors: [], materials: ["Cotton"],
    description: "A petal-shaped lounge chair in terracotta bouclé that wraps around the body.",
  },
  {
    slug: "arc-dining-chair", name: "Arc Dining Chair", price: 690, image: "product-arc-dining-chair",
    category: "Armchairs", group: "seating", rooms: ["Dining room"], colors: ["Pink"], materials: ["Velvet"],
    description: "Rounded tubular arms and a plum velvet finish give this dining chair a bold, architectural look.",
  },
  {
    slug: "roll-sofa", name: "Roll Sofa", price: 4120, image: "product-roll-sofa",
    category: "Sofas", group: "sofas", rooms: ["Living room"], colors: ["Olive"], materials: ["Cotton"],
    description: "Soft rolled volumes and a low profile in a muted sage fabric.",
  },
  {
    slug: "modulo-corner-sofa", name: "Modulo Corner Sofa", price: 5680, image: "product-modulo-corner-sofa",
    category: "Sofas", group: "sofas", rooms: ["Living room"], colors: ["Beige", "Ivory"], materials: ["Cotton"],
    description: "A modular corner sofa in natural fabric that adapts to any living space.",
  },
  {
    slug: "velvet-sculpted-armchair", name: "Velvet Sculpted Armchair", price: 1140, image: "product-velvet-sculpted-armchair",
    category: "Armchairs", group: "seating", rooms: ["Dining room", "Living room"], colors: ["Pink"], materials: ["Velvet"],
    description: "Thick, sculpted tubes upholstered in rich magenta velvet.",
  },
  {
    slug: "roll-mustard-chair", name: "Roll Mustard Chair", price: 3250, image: "product-roll-mustard-chair",
    category: "Lounge chairs", group: "seating", rooms: ["Living room"], colors: [], materials: ["Velvet", "Metal"],
    description: "Mustard velvet bolsters on a polished metal frame — a sunny statement chair.",
  },
  {
    slug: "emerald-shell-armchair", name: "Emerald Shell Armchair", price: 2650, image: "product-emerald-shell-armchair",
    category: "Armchairs", group: "seating", rooms: ["Living room", "Bedroom"], colors: ["Olive"], materials: ["Velvet", "Metal"],
    description: "A channelled shell back in deep emerald velvet on slim gold legs.",
  },
  {
    slug: "olive-classic-sofa", name: "Olive Classic Sofa", price: 4750, image: "product-olive-classic-sofa",
    category: "Sofas", group: "sofas", rooms: ["Living room"], colors: ["Olive"], materials: ["Velvet"],
    description: "A classic three-seater in olive velvet with loose back cushions.",
  },
];

export const bySlug = (slug: string): Product => {
  const p = products.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown product: ${slug}`);
  return p;
};

/** Home sections, in Figma order */
export const newArrivals = ["cloud-boucle-armchair", "luca-chairs", "navy-velvet-dining-chair", "blush-curve-sofa", "bloom-pouf"].map(bySlug);
export const homeTeaser = ["pheaby-chairs", "rows-table", "pheaby-chairs-walnut"].map(bySlug);
export const sales = ["getluky-chair", "roc-keyvisual-chair", "swivel-accent-chair", "orbit-swivel-chair", "emerald-shell-armchair"].map(bySlug);
export const alsoLike = ["fat-2-5-seater", "fat-work-chair", "luca-chairs-rose", "luna-swivel-chair", "riva-lounge-chair"].map(bySlug);

/** All products page order (first 8 = Figma grid, the rest appear under "More results") */
export const collectionOrder = [
  "bubble-lounge-chair", "orbit-swivel-chair", "luna-swivel-chair", "riva-lounge-chair", "sienna-lounge-chair", "arc-dining-chair",
  "roll-sofa", "modulo-corner-sofa", "fat-lounge-chair", "cloud-boucle-armchair", "luca-chairs", "navy-velvet-dining-chair",
  "blush-curve-sofa", "bloom-pouf", "pheaby-chairs", "rows-table", "pheaby-chairs-walnut", "getluky-chair", "roc-keyvisual-chair",
  "swivel-accent-chair", "fat-2-5-seater", "fat-work-chair", "luca-chairs-rose", "velvet-sculpted-armchair", "roll-mustard-chair",
  "emerald-shell-armchair", "olive-classic-sofa",
].map(bySlug);

/** Price formats used across the Figma screens */
export const euroPrefix = (n: number) => `€${n}`;              // product cards
export const euroSuffix = (n: number) => `${n} €`;             // cart, order summary
export const eurLong = (n: number) => `${n.toLocaleString("en-US")} EUR`; // product page

/** Minimal product data shipped to the browser for cart / wishlist rendering */
export const clientCatalog = Object.fromEntries(
  products.map((p) => [p.slug, { name: p.name, price: p.price, image: img(p.image).src }]),
);

// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Production address: makes canonical, og:url and og:image absolute (update after deploy)
  site: 'https://noire-furniture.vercel.app',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  // Products that shared a name were renamed; keep the old URLs working
  redirects: {
    '/product/luca-chairs': '/product/luca-lounge-chair/',
    '/product/luca-chairs-rose': '/product/luca-dining-chair/',
    '/product/pheaby-chairs': '/product/pheaby-pedestal-chair/',
    '/product/pheaby-chairs-walnut': '/product/pheaby-walnut-lounge-chair/',
  },
});

// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Production address: makes canonical, og:url and og:image absolute (update after deploy)
  site: 'https://noire-furniture.vercel.app',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});

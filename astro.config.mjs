// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
  site: 'https://jef.github.io',
  base: '/portfolio',
  output: 'static',
  integrations: [
    mermaid({
      autoTheme: true,
      enableLog: false,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'PageMap - Competitor Research Tool',
    description: 'Instant competitor website research tool for Marketing Strategists and UI/UX Designers.',
    version: '1.0.0',
    permissions: ['activeTab', 'scripting'],
    action: {
      default_title: 'PageMap - Competitor Research Tool',
    },
  },
});

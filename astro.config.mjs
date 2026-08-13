import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import ruleChecks from './src/integrations/rule-checks.mjs';

// trailingSlash defaults to 'ignore' in Astro 7. Set it to 'always', or the
// built URLs will not match the pattern in PROJECT_PLAN.md section 3.
export default defineConfig({
  site: 'https://bowmansbench.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [mdx(), sitemap(), ruleChecks()],
});

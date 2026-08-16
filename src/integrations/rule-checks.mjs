/**
 * Layer 3 rule checks. See the scaffold plan, section 5.
 *
 * These run over the built HTML, after every page is generated, and they check
 * structure rather than prose.
 *
 * Astro 7 compresses whitespace with JSX rules, so a text search over built
 * HTML is unreliable. Attribute and href matching is not affected, so only
 * structural rules live here. Text rules live in scripts/check-content.mjs.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/**
 * Pages under these prefixes are support guides. Every one of them must route
 * the reader to a comparison page. CLAUDE.md rule 6.
 */
const GUIDE_PREFIXES = ['guides/', 'start-here/'];

/**
 * A link into one of these is a route to a comparison page.
 * Keep in step with HUBS in src/lib/site.ts.
 */
const COMPARISON_PREFIXES = [
  '/bows/',
  '/risers/',
  '/limbs/',
  '/tabs/',
  '/plungers/',
  '/weights/',
  '/arrows/',
];

const HREF = /href="([^"]*)"/g;
const PLACEHOLDER = /data-affiliate-placeholder="([^"]*)"/g;
const MAIN = /<main[^>]*>([\s\S]*?)<\/main>/i;
const CITATION = /href="#(source-[^"]+)"/g;
const SOURCE_ID = /id="(source-[^"]+)"/g;

function matchAll(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

/**
 * The guide check must read the page content only, never the site chrome.
 *
 * BaseLayout's navigation links to every hub on every page, so a check over
 * the whole document would pass even for a guide that routes the reader
 * nowhere. That check could never fail, which makes it worthless.
 */
function mainContent(html) {
  return html.match(MAIN)?.[1] ?? '';
}

export default function ruleChecks() {
  return {
    name: 'thebowbench-rule-checks',
    hooks: {
      'astro:build:done': async ({ pages, dir, logger }) => {
        const failures = [];
        const placeholders = new Map();

        for (const page of pages) {
          const route = page.pathname.replace(/^\//, '');
          const suffix = route === '' || route.endsWith('/') ? '' : '/';
          const fileUrl = new URL(`${route}${suffix}index.html`, dir);
          const url = `/${route}`;

          let html;
          try {
            html = await readFile(fileURLToPath(fileUrl), 'utf8');
          } catch {
            failures.push(`${url}  no index.html was written for this route.`);
            continue;
          }

          /* CLAUDE.md rule 7: every page carries an email signup. */
          if (!html.includes('data-email-signup')) {
            failures.push(`${url}  no email signup on this page. CLAUDE.md rule 7.`);
          }

          /* CLAUDE.md rule 6: every guide links to a comparison page. */
          const isGuide = GUIDE_PREFIXES.some((prefix) => route.startsWith(prefix));
          if (isGuide) {
            const links = matchAll(mainContent(html), HREF);
            const routesOn = links.some((href) =>
              COMPARISON_PREFIXES.some((prefix) => href.startsWith(prefix)),
            );
            if (!routesOn) {
              failures.push(
                `${url}  this guide links to no comparison page. CLAUDE.md rule 6.`,
              );
            }
          }

          /* A citation must reach the source it names. A link to
             #source-wa-book-3 with no such source on the page is a broken
             citation, which is worse than no citation at all. */
          const declared = new Set(matchAll(html, SOURCE_ID));
          for (const citation of new Set(matchAll(html, CITATION))) {
            if (!declared.has(citation)) {
              failures.push(
                `${url}  citation links to #${citation}, which is not a source on this page.`,
              );
            }
          }

          /* CLAUDE.md rule 5: placeholders are reported, never failed. */
          for (const placeholder of matchAll(html, PLACEHOLDER)) {
            const seen = placeholders.get(placeholder) ?? [];
            placeholders.set(placeholder, [...seen, url]);
          }
        }

        if (placeholders.size > 0) {
          logger.warn(
            `${placeholders.size} affiliate link(s) are still placeholders:`,
          );
          for (const [placeholder, routes] of placeholders) {
            logger.warn(`  ${placeholder} on ${routes.length} page(s)`);
          }
        }

        if (failures.length > 0) {
          for (const failure of failures) logger.error(failure);
          throw new Error(
            `Rule checks failed on ${failures.length} page(s). See the errors above.`,
          );
        }

        logger.info(`Rule checks passed on ${pages.length} page(s).`);
      },
    },
  };
}

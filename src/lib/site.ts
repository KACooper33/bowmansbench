/**
 * One place for the facts that repeat across 27 pages.
 *
 * The author name is here, not in 26 frontmatter blocks, so it changes once.
 */

export const SITE = {
  /** Always with the apostrophe. CLAUDE.md. */
  name: "Bowman's Bench",
  url: 'https://bowmansbench.com',
  tagline: 'Archery gear for archers who shoot without a sight.',
  author: 'K. Adem Cooper',
  /**
   * The one-line bio in every page footer. The About page carries the longer
   * version.
   *
   * It says "new to barebow" on purpose. The authority this site claims is in
   * its method, not in the author's years, and a reader who finds out the
   * truth later trusts nothing else on the page.
   */
  authorBio:
    'New to barebow, learning it with my family, and measuring everything along the way.',
} as const;

/**
 * The comparison hubs. The URL uses the search term. The navigation label uses
 * the reader's word. PROJECT_PLAN.md section 3, naming rule.
 *
 * Phase 1 only. /strings/ and /tools/ arrive in Phase 2.
 */
export const HUBS = [
  { path: 'bows', label: 'Complete barebow setups' },
  { path: 'risers', label: 'Risers' },
  { path: 'limbs', label: 'Limbs' },
  { path: 'tabs', label: 'Tabs' },
  { path: 'plungers', label: 'Plungers' },
  { path: 'weights', label: 'Weight systems' },
  { path: 'arrows', label: 'Arrows' },
] as const;

/** Any link into one of these counts as a route to a comparison page. */
export const COMPARISON_ROUTE_PREFIXES = HUBS.map((hub) => `/${hub.path}/`);

/** FTC requires a clear disclosure near every affiliate link. */
export const AFFILIATE_DISCLOSURE =
  'Bowman’s Bench earns a commission on some links on this page. This costs you nothing and does not change which products are recommended.';

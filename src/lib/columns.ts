/**
 * The comparison table columns are fixed by PROJECT_PLAN.md section 4.
 *
 * Tables render from these lists, never by hand, so every page in a category
 * shows the same columns in the same order.
 *
 * Each string matches a spec `label` on the product record. A product with no
 * spec for a column renders an em dash, which makes the gap visible.
 */
export const SPEC_COLUMNS: Record<string, readonly string[]> = {
  riser: ['Length', 'Mass weight', 'Weight system', 'Passes 12.2 cm ring'],
  tab: ['Material', 'Face plate', 'Stringwalking marks', 'Left/right'],
  plunger: ['Adjustment type', 'Click detents', 'Spring range'],
  limb: ['Length', 'Draw weight', 'Material'],
  weight: ['Mass weight', 'Thread', 'Material'],
  arrow: ['Spine', 'Diameter', 'Grains per inch'],
  bow: ['Riser length', 'Limb length', 'Draw weight'],
};

/** Used when a category has no column list yet. */
export const FALLBACK_COLUMNS: readonly string[] = [];

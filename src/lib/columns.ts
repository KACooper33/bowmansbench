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
  /**
   * Youth and beginner bows, which are bought whole rather than as a riser
   * and limbs.
   *
   * "Takedown" and "Plunger threaded" are here because they answer the two
   * questions a parent actually has. Takedown decides whether heavier limbs
   * can be fitted as a child grows, on the same riser. Plunger threaded
   * decides whether the bow can take the one piece of barebow tuning gear
   * that is legal. No retail listing frames either as a buying decision.
   *
   * "Mass weight" is here for the opposite reason: almost nobody publishes it.
   * Of the eleven bows on this site, one maker states it and one figure was
   * weighed here. The column is mostly em dashes on purpose. A row of gaps is
   * the finding, and it is the same column the riser table leads with, so a
   * reader moving between the two tables compares like with like.
   *
   * It sits after "Draw weight" rather than second, as it does for risers,
   * because a bow buyer decides on draw weight first and a riser has none.
   */
  bow: ['Length', 'Draw weight', 'Mass weight', 'Takedown', 'Plunger threaded'],
};

/** Used when a category has no column list yet. */
export const FALLBACK_COLUMNS: readonly string[] = [];

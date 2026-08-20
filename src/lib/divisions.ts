/**
 * The equipment rules, as data.
 *
 * PROJECT_PLAN.md section 8 holds the division table, and until now every page
 * that needed it retyped it into prose. Duplicated facts diverge: that is how
 * this site drifted into treating barebow and traditional as one thing, and it
 * is why section 8 already carries a list of corrections. Facts live here once.
 *
 * Two rules for editing this file.
 *
 * 1. **Never invent an article number.** Every `article` below is quoted in
 *    PROJECT_PLAN.md section 8 or in the barebow vs traditional guide. Where a
 *    sub-article was never verified, the division article is used instead
 *    (`19.4` rather than a guessed `19.4.6`). A wrong citation is worse than a
 *    vague one, because a reader can check it.
 *
 * 2. **`practice` comes first and never mentions a rulebook.** Most people who
 *    buy a beginner recurve shoot in a garden and never enter anything.
 *    PROJECT_PLAN.md section 12.4 found the same thing from the search side:
 *    recurve is transactional and 25,222 a month, barebow is informational and
 *    743. So every item says what it does before it says who forbids it, and
 *    the competition rule reads as a conditional rather than as a verdict.
 *
 * Numbers are World Archery Book 4 Field and 3D, chapter 19. The barebow rules
 * are identical in Book 3 article 9.3, so a barebow archer reads the same
 * equipment rules for target, field and 3D.
 */

/**
 * `limited` means allowed with a condition attached, not "sort of allowed".
 * The condition always goes in `detail`, because a bare "limited" tells a
 * reader nothing they can act on.
 */
export type RuleStatus = 'permitted' | 'banned' | 'limited';

export interface DivisionRule {
  status: RuleStatus;
  /** What is actually allowed or forbidden. Shown in the table cell. */
  detail: string;
  /** Book 4 article. Division-level when the sub-article is unverified. */
  article: string;
  /**
   * The Book 3 Target Archery equivalent, barebow only, and only where the
   * number is quoted in PROJECT_PLAN.md section 8.
   *
   * Traditional and longbow have no Book 3 equivalent: they are Book 4 field
   * and 3D divisions. Barebow exists in both books with identical rules and a
   * different chapter number, so a target page cites 9.3.x where a field page
   * cites 19.3.x. Both are given rather than one being derived from the other,
   * because the sub-numbers happen to line up for most items and assuming that
   * holds everywhere is how a wrong citation gets published.
   */
  book3?: string;
}

export interface EquipmentItem {
  id: string;
  label: string;
  /**
   * What the item does, for someone who is not competing. No rulebook, no
   * division name, no verdict. This is the first thing a reader sees.
   */
  practice: string;
  barebow: DivisionRule;
  traditional: DivisionRule;
  longbow: DivisionRule;
  /**
   * Where the NFAA departs from World Archery. Only two items carry one, and
   * both cost money, so both are stated wherever the item is.
   */
  nfaa?: string;
}

export const DIVISIONS = [
  { id: 'barebow', label: 'Barebow', article: '19.3' },
  { id: 'traditional', label: 'Traditional', article: '19.4' },
  { id: 'longbow', label: 'Longbow', article: '19.5' },
] as const;

export type DivisionId = (typeof DIVISIONS)[number]['id'];

export const EQUIPMENT: readonly EquipmentItem[] = [
  {
    id: 'sight',
    label: 'Sight',
    practice:
      'The fastest way to start hitting what you aim at. A beginner shooting at home will group sooner with one than without.',
    barebow: { status: 'banned', detail: 'Not allowed', article: '19.3', book3: '9.3' },
    traditional: { status: 'banned', detail: 'Not allowed', article: '19.4' },
    longbow: { status: 'banned', detail: 'Not allowed', article: '19.5' },
  },
  {
    id: 'plunger',
    label: 'Adjustable plunger',
    practice:
      'A sprung pressure point that lets you tune how the arrow leaves the bow. The one adjustment that fixes arrows flying left or right.',
    barebow: {
      status: 'limited',
      detail:
        'Permitted, no further back than 2 cm from the grip pivot point',
      article: '19.3.3',
      book3: '9.3.3',
    },
    traditional: { status: 'banned', detail: 'Not permitted', article: '19.4.3' },
    longbow: { status: 'banned', detail: 'Not permitted', article: '19.5' },
  },
  {
    id: 'arrow-rest',
    label: 'Arrow rest',
    practice:
      'What the arrow sits on. Every bow needs one, or a shelf cut into the riser.',
    barebow: {
      status: 'permitted',
      detail: 'Adjustable pressure point allowed',
      article: '19.3.3',
      book3: '9.3.3',
    },
    traditional: {
      status: 'limited',
      detail: 'Non-adjustable rest, or the bow shelf, only',
      article: '19.4.3',
    },
    longbow: { status: 'limited', detail: 'The shelf only', article: '19.5' },
  },
  {
    id: 'string-walking',
    label: 'String walking',
    practice:
      'Moving your drawing fingers to measured positions down the string to change distance, keeping the same anchor on your face. A technique, not a part: it needs nothing fitted to the bow.',
    barebow: { status: 'permitted', detail: 'Permitted', article: '19.3.5', book3: '9.3.5' },
    traditional: {
      status: 'banned',
      detail: 'Not permitted, single anchor only',
      article: '19.4.5',
    },
    longbow: { status: 'banned', detail: 'Not permitted', article: '19.5.4' },
  },
  {
    id: 'face-walking',
    label: 'Face walking',
    practice:
      'Moving your anchor up or down your face to change distance, keeping the same grip on the string.',
    barebow: { status: 'permitted', detail: 'Permitted', article: '19.3.5', book3: '9.3.5' },
    traditional: { status: 'permitted', detail: 'Permitted', article: '19.4.5' },
    longbow: { status: 'banned', detail: 'Not permitted', article: '19.5.4' },
  },
  {
    id: 'tab-marks',
    label: 'Marks on the tab',
    practice:
      'Reference lines on the finger tab, so you can find the same crawl again. Useful the moment you start string walking.',
    barebow: {
      status: 'limited',
      detail: 'Permitted, uniform in size, shape and colour, up to two lengths',
      article: '19.3.7',
    },
    traditional: { status: 'banned', detail: 'Not permitted', article: '19.4.7' },
    longbow: { status: 'banned', detail: 'Not permitted', article: '19.5' },
  },
  {
    id: 'anchor-plate',
    label: 'Anchor plate on the tab',
    practice:
      'A ledge on the tab that sits against your jaw, so the anchor repeats.',
    barebow: { status: 'permitted', detail: 'Permitted', article: '19.3.7' },
    traditional: { status: 'banned', detail: 'Not permitted', article: '19.4.7' },
    longbow: { status: 'banned', detail: 'Not permitted', article: '19.5' },
  },
  {
    id: 'external-weights',
    label: 'External weights',
    practice:
      'Weights bolted to the riser to steady the bow and slow the aim. What a barebow archer uses instead of stabilisers.',
    barebow: {
      status: 'limited',
      detail:
        'Permitted below and above the grip. The whole bow must pass a 12.2 cm ring',
      article: '19.3.6',
      book3: '9.3.6',
    },
    traditional: {
      status: 'limited',
      detail: 'Internal only, installed at manufacture and invisible outside',
      article: '19.4.1',
    },
    longbow: {
      status: 'limited',
      detail: 'Internal only, installed at manufacture',
      article: '19.5.5',
    },
  },
  {
    id: 'vibration-dampeners',
    label: 'Vibration dampeners',
    practice:
      'Rubber inserts that soak up buzz after the shot. A smoother, quieter bow in the hand.',
    barebow: {
      status: 'permitted',
      detail: 'Permitted, in the riser or attached to it or to weights',
      article: '19.3.6',
      book3: '9.3.6',
    },
    traditional: {
      status: 'limited',
      detail: 'Limb dampeners only',
      article: '19.4',
    },
    longbow: { status: 'banned', detail: 'Not allowed', article: '19.5.5' },
  },
  {
    id: 'stabilisers',
    label: 'Stabilisers',
    practice:
      'Rods extending from the riser to steady the bow. Standard on Olympic recurve, and they do the same job in a garden.',
    barebow: { status: 'banned', detail: 'Not allowed', article: '19.3', book3: '9.3' },
    traditional: { status: 'banned', detail: 'Not permitted', article: '19.4' },
    longbow: { status: 'banned', detail: 'Not allowed', article: '19.5.5' },
    nfaa: 'The NFAA permits one straight stabiliser in its Traditional style, up to 12 inches measured from the back of the bow. World Archery permits none in any of these three divisions.',
  },
  {
    id: 'string-silencers',
    label: 'String silencers',
    practice:
      'Rubber or fur fitted to the string to damp the noise of the shot. A quieter bow over a long session, and less noise carrying to a neighbour.',
    barebow: { status: 'banned', detail: 'Not permitted', article: '19.3.2', book3: '9.3.2' },
    traditional: {
      status: 'limited',
      detail: 'Permitted, no closer than 30 cm from the nocking point',
      article: '19.4.2',
    },
    longbow: {
      status: 'limited',
      detail: 'Permitted, no closer than 30 cm from the nocking point',
      article: '19.5.2',
    },
    nfaa: 'The NFAA permits string silencers in Barebow Recurve, where World Archery does not. An archer moving between the two bodies has to take them off.',
  },
  {
    id: 'riser-material',
    label: 'Riser material',
    practice:
      'What the handle is made of. Aluminium and carbon are stiffer and take bolt-on weights; wood is lighter on the wallet and warmer to hold.',
    barebow: { status: 'permitted', detail: 'Not restricted', article: '19.3', book3: '9.3' },
    traditional: {
      status: 'limited',
      detail: 'Laminated wood, or one piece of wood',
      article: '19.4.1',
    },
    longbow: { status: 'limited', detail: 'Traditional longbow shape', article: '19.5' },
  },
  {
    id: 'draw-check',
    label: 'Draw check device, including clickers',
    practice:
      'A clicker tells you when you have reached the same draw length as last time. It is the usual cure for a draw that creeps short.',
    barebow: { status: 'banned', detail: 'Not permitted', article: '19.3', book3: '9.3.4' },
    traditional: { status: 'banned', detail: 'Not permitted', article: '19.4' },
    longbow: { status: 'banned', detail: 'Not permitted', article: '19.5' },
  },
];

/** Lookup by id, so a component or page cannot silently render nothing. */
export function equipment(id: string): EquipmentItem {
  const item = EQUIPMENT.find((candidate) => candidate.id === id);
  if (!item) {
    throw new Error(
      `No equipment item "${id}" in src/lib/divisions.ts. Add it there rather than writing the rule into a page.`,
    );
  }
  return item;
}

/**
 * Two divisions are deliberately absent, and both should stay absent.
 *
 * **Olympic recurve** is not one of these three. It permits a sight, a clicker
 * and stabilisers, which is exactly the equipment the three above give up. It
 * could be added as a fourth column, and /guides/olympic-recurve-vs-barebow/
 * still carries a hand-written table that would then come from here. It is not
 * added yet because PROJECT_PLAN.md section 8 records no article numbers for
 * it, and every other cell in this file carries one. Research the articles
 * first, then add the column.
 *
 * **Instinctive** is not a division at all and must never be given a column.
 * It describes how an archer aims, not what may be fitted to the bow. Section 8
 * records the five class lists checked on 12 August 2026, none of which runs
 * one, along with the deliberate limit on how far that claim goes.
 */

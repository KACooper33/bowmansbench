import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Layer 1 rule checks. See the scaffold plan, section 5.
 *
 * A schema failure stops the build and names the file. These rules therefore
 * cannot be forgotten, only broken loudly.
 */

/** Every number states where it came from. CLAUDE.md rule 4. */
const sourceMark = z.enum(['measured', 'maker']);

const spec = z.object({
  label: z.string().min(1),
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
  source: sourceMark,
});

const products = defineCollection({
  loader: glob({ base: './src/content/products', pattern: '**/*.yaml' }),
  schema: z.object({
    /** Always the full product name. Components print this, never a pronoun. CLAUDE.md rule 3. */
    name: z.string().min(1),
    maker: z.string().min(1),
    category: z.enum([
      'riser',
      'limb',
      'tab',
      'plunger',
      'weight',
      'arrow',
      'bow',
    ]),
    /** 'example' records are scaffold samples. Remove them before launch. */
    status: z.enum(['example', 'published']).default('published'),
    price: z.object({
      value: z.number().nonnegative(),
      currency: z.string().default('USD'),
      source: sourceMark,
      checked_on: z.coerce.date(),
    }),
    specs: z.array(spec).min(1),
    affiliate: z.object({
      merchant: z.string().min(1),
      /** An invented link cannot pass as a placeholder. CLAUDE.md rule 5. */
      placeholder: z.string().startsWith('[AFFILIATE:'),
      url: z.string().url().optional(),
    }),
    limitation: z.string().min(1),
    suits: z.string().min(1),
    tradeoff: z.string().min(1),
  }),
});

/** PROJECT_PLAN.md section 4: the answer block is the first 60 words. */
const maxWords = (limit: number) => (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length <= limit;

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      /** The exact target keyword. The URL uses the search term. */
      title: z.string().min(1),
      /** The reader's word. PROJECT_PLAN.md section 3, naming rule. */
      nav_label: z.string().min(1),
      type: z.enum(['hub', 'comparison', 'head-to-head', 'guide', 'trust']),
      description: z.string().min(1),
      answer_block: z
        .string()
        .refine(maxWords(60), {
          message:
            'answer_block must be 60 words or fewer. PROJECT_PLAN.md section 4.',
        })
        .optional(),
      verdict: z
        .object({
          overall: z.string().min(1),
          budget: z.string().min(1),
          premium: z.string().min(1),
        })
        .optional(),
      /** Product ids, in display order. */
      products: z.array(z.string()).default([]),
      method: z.string().optional(),
      /** One sideways hub link. PROJECT_PLAN.md section 3, link rule 3. */
      related_hub: z.string().optional(),
      faq: z
        .array(z.object({ question: z.string(), answer: z.string() }))
        .default([]),
      /**
       * Outbound citations. PROJECT_PLAN.md section 9 asks for the governing
       * bodies to be cited correctly, and section 7 wants passages an answer
       * engine can verify.
       *
       * `checked_on` records the day the link was last confirmed to resolve.
       * Rulebook URLs carry a version in the path, so they rot when a new
       * version publishes. A dated check makes that visible instead of silent.
       */
      sources: z
        .array(
          z.object({
            title: z.string().min(1),
            url: z.string().url(),
            detail: z.string().optional(),
            checked_on: z.coerce.date(),
          }),
        )
        .default([]),
      updated_on: z.coerce.date(),
    })
    .superRefine((data, ctx) => {
      const require = (field: string, present: boolean, why: string) => {
        if (present) return;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required on ${data.type} pages. ${why}`,
        });
      };

      const isComparison =
        data.type === 'comparison' || data.type === 'head-to-head';

      if (isComparison) {
        const why = 'PROJECT_PLAN.md section 4.';
        require('answer_block', data.answer_block !== undefined, why);
        require('verdict', data.verdict !== undefined, why);
        require('method', data.method !== undefined, why);
      }

      /**
       * A guide needs a hub to point at, so GuideLayout can render the route to
       * a comparison page. CLAUDE.md rule 6 then holds by construction.
       */
      if (isComparison || data.type === 'guide') {
        require(
          'related_hub',
          data.related_hub !== undefined,
          'PROJECT_PLAN.md section 3, internal link rules 3 and 4.',
        );
      }
    }),
});

export const collections = { products, pages };

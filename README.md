# The Bow Bench

An affiliate site about archery gear, for archers who shoot without a sight.

Site: thebowbench.com (not yet registered)
Status: pre-launch

The core content type is the product comparison page. Revenue comes from SEO
traffic and affiliate links, and later from products of our own.

## Scope

Phase 1 covers barebow, recurve, and longbow gear. Phase 2 adds traditional,
instinctive, field, and 3D archery.

Bowhunting, compound bows, and crossbows stay out of scope permanently.

## Status

Built on Astro 7. 27 routes, no JavaScript shipped to the reader.

Nothing is published yet, and the domain is not bought.

## Running it

```
npm install
npm run dev      # local server on port 4321
npm run build    # runs the content checks first, then builds
```

## Rules are checked, not remembered

The content rules fail the build rather than relying on a writer to recall
them. They run in three places:

1. `src/content.config.ts` — the schema. Every specification carries a source
   of `measured`, `maker`, or `retailer`. Answer blocks are capped at 60 words.
2. `scripts/check-content.mjs` — a scan of the source text, before the build.
   Out-of-scope topics and the old brand name stop it here.
3. `src/integrations/rule-checks.mjs` — a scan of the built HTML. Confirms the
   email signup, and that every guide routes the reader to a comparison page.

The planning documents are kept outside this repository.

#!/usr/bin/env node
/**
 * Layer 2 rule checks. See the scaffold plan, section 5.
 *
 * These run over raw source text, before the Astro build.
 *
 * Astro 7 compresses whitespace with JSX rules by default, so a text search
 * over built HTML is not reliable. Text rules therefore live here, and only
 * structural rules live in the build integration.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';

const PROJECT_ROOT = new URL('..', import.meta.url).pathname;
const ROOTS = ['src', 'public'];

const TEXT_EXTENSIONS = new Set([
  '.md', '.mdx', '.astro', '.ts', '.js', '.mjs',
  '.yaml', '.yml', '.json', '.css', '.txt',
]);

/**
 * Permanently out of scope. PROJECT_PLAN.md sections 1 and 10, and CLAUDE.md.
 * Matched without case, against text and against file paths.
 */
const BANNED_TERMS = [
  'bowhunt',
  'bow hunt',
  'hunting',
  'hunter',
  'compound bow',
  'crossbow',
  'broadhead',
];

/** The brand keeps its apostrophe in all text. CLAUDE.md. */
const BRAND_WITHOUT_APOSTROPHE = /Bowmans\s+Bench/i;

/**
 * A single line may name an out-of-scope topic on purpose.
 *
 * The About and disclosure pages have to say what this site does not cover,
 * and a reader is better served by the plain words than by a euphemism. Mark
 * that line and only that line:
 *
 *   - Write about compound bows or crossbows. <!-- allow-scope-terms -->
 *
 * The marker is per line and must be written deliberately, so it cannot
 * exempt a page by accident. Every use is reported at the end of the run.
 */
const SCOPE_EXEMPTION = '<!-- allow-scope-terms -->';

/**
 * Proper nouns that contain a banned term but are not out-of-scope topics.
 *
 * Some target and field archery equipment carries hunting-flavoured branding.
 * A takedown recurve is in scope whatever its maker called it, and a reader is
 * better served by the product's real name than by a euphemism.
 *
 * This is an allowlist of exact strings, not a relaxation of the rule. The
 * banned terms still block everywhere else, including inside these same files.
 * Every match is reported on each build so the list stays visible and cannot
 * grow unnoticed.
 *
 * Add a name here only when the product itself is in scope. Never add one to
 * make a page about hunting build.
 */
const ALLOWED_NAMES = [
  // Blackhunter Archery takedown recurves, sold by the maker for target and
  // field archery. Three spellings are needed: the product name as written,
  // the joined form used in the domain and in anchor ids, and the hyphenated
  // form used in product ids and file names.
  'Black Hunter',
  'blackhunter',
  'black-hunter',
  // Samick's store URL and brand string. The Sage is a target takedown recurve.
  'samickhunting.com',
  'Samick Hunting',
];

const failures = [];
const exemptions = [];
const allowedNameHits = [];

/**
 * Removes allowed proper nouns before the banned-term scan, so the terms
 * inside them cannot trigger. Anything outside a listed name still counts.
 */
function withoutAllowedNames(line) {
  let out = line;
  for (const name of ALLOWED_NAMES) {
    if (!out.toLowerCase().includes(name.toLowerCase())) continue;
    allowedNameHits.push(name);
    out = out.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), ' ');
  }
  return out;
}

function firstBannedTerm(haystack) {
  const lower = haystack.toLowerCase();
  return BANNED_TERMS.find((term) => lower.includes(term));
}

function checkPath(relativePath) {
  const term = firstBannedTerm(withoutAllowedNames(relativePath));
  if (term) {
    failures.push(
      `${relativePath}  banned term "${term}" in the file path. This topic is out of scope permanently.`,
    );
  }
}

function checkText(relativePath, text) {
  text.split('\n').forEach((line, index) => {
    const lineNumber = index + 1;

    const term = firstBannedTerm(withoutAllowedNames(line));
    if (term && line.includes(SCOPE_EXEMPTION)) {
      exemptions.push(`${relativePath}:${lineNumber}  names "${term}" on purpose`);
    } else if (term) {
      failures.push(
        `${relativePath}:${lineNumber}  banned term "${term}". This topic is out of scope permanently.`,
      );
    }

    if (BRAND_WITHOUT_APOSTROPHE.test(line)) {
      failures.push(
        `${relativePath}:${lineNumber}  the brand needs its apostrophe. Write "Bowman's Bench".`,
      );
    }
  });
}

async function collectFiles(root) {
  let entries;
  try {
    entries = await readdir(join(PROJECT_ROOT, root), {
      recursive: true,
      withFileTypes: true,
    });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name))
    .filter((path) => TEXT_EXTENSIONS.has(extname(path)));
}

const files = (await Promise.all(ROOTS.map(collectFiles))).flat();

for (const absolutePath of files) {
  const relativePath = relative(PROJECT_ROOT, absolutePath);
  checkPath(relativePath);
  checkText(relativePath, await readFile(absolutePath, 'utf8'));
}

if (failures.length > 0) {
  console.error(`\ncheck:content failed. ${failures.length} problem(s):\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  console.error('');
  process.exit(1);
}

if (exemptions.length > 0) {
  console.log(
    `\ncheck:content: ${exemptions.length} line(s) name an out-of-scope topic deliberately:`,
  );
  for (const exemption of exemptions) console.log(`  ${exemption}`);
  console.log('');
}

if (allowedNameHits.length > 0) {
  const counts = new Map();
  for (const name of allowedNameHits) counts.set(name, (counts.get(name) ?? 0) + 1);
  console.log(
    `\ncheck:content: ${counts.size} allowed product name(s) contain a banned term:`,
  );
  for (const [name, count] of counts) console.log(`  ${name}  ${count} line(s)`);
  console.log('');
}

console.log(`check:content passed. ${files.length} file(s) scanned.`);

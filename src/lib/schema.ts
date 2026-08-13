/**
 * Basic Product and Article JSON-LD. Nothing more.
 *
 * PROJECT_PLAN.md section 7 and CLAUDE.md both forbid schema beyond these two.
 * Do not add FAQPage, BreadcrumbList, Review, or Organization markup here.
 */
import type { CollectionEntry } from 'astro:content';
import { SITE } from './site';

export function articleSchema(page: {
  title: string;
  description: string;
  updatedOn: Date;
  url: URL;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.description,
    dateModified: page.updatedOn.toISOString().slice(0, 10),
    author: { '@type': 'Person', name: SITE.author },
    publisher: { '@type': 'Organization', name: SITE.name },
    mainEntityOfPage: page.url.href,
  };
}

export function productSchema(product: CollectionEntry<'products'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.data.name,
    brand: { '@type': 'Brand', name: product.data.maker },
    offers: {
      '@type': 'Offer',
      price: product.data.price.value,
      priceCurrency: product.data.price.currency,
    },
  };
}

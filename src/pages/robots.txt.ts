import type { APIRoute } from 'astro';
import { publicUrl } from '../data/site';

export const GET: APIRoute = () => {
  const sitemap = publicUrl('/sitemap.xml');
  const rules = sitemap ? `Allow: /\nSitemap: ${sitemap}` : 'Disallow: /';
  return new Response(`User-agent: *\n${rules}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

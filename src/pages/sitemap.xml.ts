import type { APIRoute } from 'astro';
import { publicUrl } from '../data/site';

export const GET: APIRoute = () => {
  const home = publicUrl('/');
  // Черновые юридические страницы не включаем в индекс.
  const entry = home ? `\n  <url><loc>${home}</loc></url>\n` : '';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entry}</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

import { mkdir, readFile, writeFile } from 'node:fs/promises';

const project = new URL('../', import.meta.url);
const dist = new URL('dist/', project);
const preview = new URL('.local-preview/', project);
const base = (process.env.SITE_BASE || '/').replace(/\/+$/, '') + '/';
const documents = ['privacy'];

await mkdir(preview, { recursive: true });

for (const page of [...documents, '']) {
  const assetPrefix = page ? '../dist/' : './dist/';
  const home = page ? '../index.html' : './index.html';
  const documentPrefix = page ? './' : './.local-preview/';
  let html = await readFile(new URL(page ? `${page}/index.html` : 'index.html', dist), 'utf8');

  html = html
    .replaceAll(base + '_astro/', assetPrefix + '_astro/')
    .replaceAll(`href="${base}favicon.svg"`, `href="${assetPrefix}favicon.svg"`)
    .replaceAll(`href="${base}"`, `href="${home}"`)
    .replaceAll(`href="${base}#`, `href="${home}#`);

  for (const document of documents) {
    html = html.replaceAll(`href="${base}${document}/"`, `href="${documentPrefix}${document}.html"`);
  }

  for (const match of html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)) {
    const href = match[1];
    if (!href.startsWith(assetPrefix + '_astro/')) continue;
    const css = await readFile(new URL(href.slice(assetPrefix.length), dist), 'utf8');
    const localCss = css.replaceAll('url(' + base + '_astro/', 'url(' + assetPrefix + '_astro/');
    html = html.replace(match[0], () => `<style>${localCss}</style>`);
  }

  await writeFile(new URL(page ? `${page}.html` : 'index.html', page ? preview : project), html);
}

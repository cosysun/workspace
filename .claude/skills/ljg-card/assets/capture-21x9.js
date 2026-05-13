#!/usr/bin/env node
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const html = process.argv[2];
  const out = process.argv[3];
  const w = parseInt(process.argv[4]) || 2100;
  const h = parseInt(process.argv[5]) || 900;
  if (!html || !out) {
    console.error('Usage: capture-21x9.js <html> <png> [w] [h]');
    process.exit(1);
  }
  const fileUrl = 'file://' + path.resolve(html);
  console.log('Loading:', fileUrl);
  console.log('HTML size:', fs.statSync(path.resolve(html)).size, 'bytes');

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: w, height: h },
    bypassCSP: true,
  });
  const page = await context.newPage();
  page.on('pageerror', err => console.log('[page error]', err.message));

  await page.goto(fileUrl, { waitUntil: 'load', timeout: 25000 }).catch(e => console.log('[goto err]', e.message));
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(3000);

  const meta = await page.evaluate(() => ({
    title: document.title,
    slideCount: document.querySelectorAll('section.slide').length,
    layout: document.querySelector('section.slide')?.dataset?.layout || null,
    firstH1: document.querySelector('h1')?.textContent?.slice(0, 80) || null,
  }));
  console.log('Page meta:', JSON.stringify(meta));

  await page.screenshot({ path: out, type: 'png', fullPage: false });
  await browser.close();
  console.log('OK:', out);
})();

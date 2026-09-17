// One-time (or re-runnable) sync: reads the REAL <title> and meta description
// already live in each HTML file, and writes them into the website_pages table
// in Supabase — so the admin panel reflects what's actually on the site.
//
// Uses the service role key (bypasses RLS) because this is a trusted local
// script, not the public site. Never expose this key in browser code.

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// pulse-page-generator is one level inside pulse-website, so HTML files live one directory up
const SITE_ROOT = path.join(__dirname, '..');

function extractTitle(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractMetaDescription(html) {
  const match = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i);
  return match ? match[1].trim() : null;
}

async function main() {
  console.log('Fetching website_pages rows from Supabase...\n');

  const { data: pages, error } = await supabase.from('website_pages').select('*');
  if (error) {
    console.error('Failed to fetch website_pages:', error.message);
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;

  for (const page of pages) {
    const filePath = path.join(SITE_ROOT, page.file_path);

    if (!fs.existsSync(filePath)) {
      console.log(`  [skip] ${page.page_name} — file not found: ${page.file_path}`);
      skipped++;
      continue;
    }

    const html = fs.readFileSync(filePath, 'utf-8');
    const title = extractTitle(html);
    const description = extractMetaDescription(html);

    if (!title && !description) {
      console.log(`  [skip] ${page.page_name} — no <title> or meta description found in ${page.file_path}`);
      skipped++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('website_pages')
      .update({
        meta_title: title || page.meta_title,
        meta_description: description || page.meta_description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', page.id);

    if (updateError) {
      console.log(`  [error] ${page.page_name} — ${updateError.message}`);
      continue;
    }

    console.log(`  [ok] ${page.page_name}`);
    console.log(`       title: ${title || '(kept existing)'}`);
    console.log(`       description: ${description ? description.slice(0, 70) + (description.length > 70 ? '...' : '') : '(kept existing)'}`);
    updated++;
  }

  console.log(`\nDone. Updated ${updated} page(s), skipped ${skipped}.`);
}

main();

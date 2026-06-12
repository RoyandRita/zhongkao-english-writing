// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN AUDIT — Automated Design Token Compliance Checker
// ═══════════════════════════════════════════════════════════════════════════════
//
// 用法:
//   1. 启动 dev server:  npm run dev
//   2. 运行审计:         node screenshots/audit-tokens.mjs
//   3. 查看报告:         cat screenshots/token-report.md
//
// 浏览器会将所有颜色归一化为 rgb()/rgba() 格式，审计时需要反向归一化比较。
// ═══════════════════════════════════════════════════════════════════════════════

import { chromium } from '@playwright/test';

const BASE_URL = 'http://localhost:5175';
const OUTPUT_DIR = 'screenshots';

// ── Color normalization ──
// Convert hex/rgb/rgba → canonical "r,g,b" string for comparison
function normalizeColor(colorStr) {
  if (!colorStr) return null;

  // hex → rgb
  const hexMatch = colorStr.match(/^#([0-9a-fA-F]{3,8})$/);
  if (hexMatch) {
    let h = hexMatch[1];
    if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    if (h.length === 6) h = h + 'ff'; // no alpha → opaque
    return [
      parseInt(h.slice(0,2), 16),
      parseInt(h.slice(2,4), 16),
      parseInt(h.slice(4,6), 16),
    ].join(',');
  }

  // rgb(r, g, b) / rgba(r, g, b, a)
  const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return [rgbMatch[1], rgbMatch[2], rgbMatch[3]].join(',');
  }

  // transparent → special
  if (colorStr === 'transparent') return '0,0,0';

  return null;
}

// All valid colors from designTokens — converted to canonical RGB form
const VALID_HEX = [
  // page/surface
  '#f8fafc','#ffffff','#fafbfc','#fafcfd','#fdfaf9','#fdfdff',
  // text
  '#1e293b','#1a1a2e','#475569','#334155','#94a3b8','#cbd5e1','#64748b','#a8b4c2','#d0d5dd',
  // border
  '#e2e8f0','#eef0f2','#f1f5f9','#e8ecf0',
  // success
  '#15803d','#14532d','#f0fdf4','#86efac','#dcfce7',
  // warning
  '#b45309','#fffbeb','#fde68a','#fef3c7','#78350f','#8b6d3f','#854d0e','#fefce8','#fde047',
  // danger
  '#be123c','#fff1f2','#fca5a5','#ffe4e6',
  // brand
  '#1d4ed8','#312e81','#1e1b4b','#dbeafe','#eff6ff','#7c3aed','#f5f3ff','#4338ca','#eef2ff',
  // mode
  '#0891b2','#f3f7f9','#c2410c','#faf7f5',
  // dimension
  '#3b7d5a','#f0f7f2','#c5dfce','#4a6d8c','#f2f5f9','#c8d6e4',
  '#faf7f0','#e0d5c0','#675d8a','#f5f3fa','#d5d0e8','#8c5a62','#faf5f6','#e0cdd2',
  // grammar
  '#5a7d9a','#f3f6fa','#5a8a6c','#f2f8f4','#7a6358','#7d6b72','#faf6f7',
  '#7a6d96','#f6f4fa','#6d5f89','#f3f1f8','#8b6a5a','#faf7f3','#688bab',
  '#f5f8fb','#7d8b5a','#f7f8f2','#5a8a7d','#f2f8f5','#6d8a7a','#f4f9f6',
  // misc
  '#f3f4f6','#7e22ce','#4a7c8c','#8c6a5a',
  // topic accent colors (from topicData, used dynamically)
  '#16a34a','#c2410c','#be123c','#7e22ce',
  // overlays
  'rgba(255,255,255,0.15)','rgba(255,255,255,0.18)','rgba(255,255,255,0.2)',
  'rgba(255,255,255,0.25)','rgba(255,255,255,0.4)','rgba(255,255,255,0.5)',
  'rgba(255,255,255,0.7)','rgba(255,255,255,0.75)','rgba(255,255,255,0.85)',
  'rgba(255,255,255,0.9)',
  'rgba(0,0,0,0.04)',
  'transparent',
];

const VALID_RGB = new Set(
  VALID_HEX.map(normalizeColor).filter(Boolean)
);

// Topic accent colors can appear with any opacity (e.g., #16a34a20 → rgba(22,163,74,0.125))
// These base RGB values are always valid (opacity is irrelevant for accent colors)
const ACCENT_BASES = new Set([
  '22,163,74',   // #16a34a (topic 1 green)
  '29,78,216',   // #1d4ed8 (topic 2 blue)
  '194,65,12',   // #c2410c (topic 3 orange)
  '126,34,206',  // #7e22ce (topic 4 purple)
  '190,18,60',   // #be123c (topic 5 red)
]);

function isValidColor(computedColor) {
  // Strip leading/trailing spaces
  const c = computedColor.trim();
  const rgb = normalizeColor(c);
  if (!rgb) return true; // can't parse, skip

  if (VALID_RGB.has(rgb)) return true;

  // Check if this is a valid accent color with any opacity
  if (ACCENT_BASES.has(rgb)) return true;

  return false;
}

// ── Font size validation (new scale: 9,11,14,16,20,24,32,36,40,64) ──
const VALID_FONT_SIZES = new Set([
  '9px','11px','14px','16px','18px','20px','22px','24px','28px','32px','36px','40px','64px',
  // Legacy values still used through aliases
  '10px','10.5px','11.5px','12px','12.5px','13px','13.5px','15px',
]);

// ── Radius validation ──
const VALID_RADII = new Set([
  '0px','3px','4px','5px','6px','7px','8px','9px','10px','12px',
  '14px','16px','18px','20px','22px','24px','50%','9999px',
]);

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('🔍 Token Compliance Audit\n');

  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(500);

  // ── Extract all inline styles ──
  const styleData = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('[style]').forEach((el) => {
      const style = el.getAttribute('style');
      const tagName = el.tagName.toLowerCase();
      const text = (el.textContent || '').trim().slice(0, 50);
      const props = {};
      style.split(';').forEach(decl => {
        const [prop, val] = decl.split(':').map(s => s.trim());
        if (prop && val) props[prop] = val;
      });
      if (Object.keys(props).length > 0) {
        results.push({ tagName, text, props });
      }
    });
    return results;
  });

  // ── Audit ──
  const violations = { colors: [], fontSizes: [], radii: [] };
  const seenColors = new Set(); // deduplicate

  for (const el of styleData) {
    const ctx = `<${el.tagName}> "${el.text}"`;

    for (const [prop, val] of Object.entries(el.props)) {
      // Check colors (background, border, color, box-shadow)
      if (/(color|background|border|shadow)/i.test(prop)) {
        const colorMatches = val.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|transparent)/g);
        if (colorMatches) {
          for (const cm of colorMatches) {
            if (!isValidColor(cm)) {
              const key = `${cm}`;
              if (!seenColors.has(key)) {
                seenColors.add(key);
                violations.colors.push(`${ctx}  → ${prop}: ${cm}  ❌`);
              }
            }
          }
        }
      }

      // Check font-size
      if (prop === 'font-size' && !VALID_FONT_SIZES.has(val)) {
        violations.fontSizes.push(`${ctx}  → font-size: ${val}`);
      }

      // Check border-radius
      if (prop === 'border-radius' && !VALID_RADII.has(val)) {
        violations.radii.push(`${ctx}  → border-radius: ${val}`);
      }
    }
  }

  // ── Report ──
  const total = violations.colors.length + violations.fontSizes.length + violations.radii.length;

  console.log('═══════════════════════════════════════');
  if (total === 0) {
    console.log('✅ ALL CLEAN — 零令牌违规');
    console.log(`   检查了 ${styleData.length} 个元素的样式`);
  } else {
    console.log(`❌ ${total} 个违规 (${violations.colors.length}色/${violations.fontSizes.length}字/${violations.radii.length}圆角)\n`);
    if (violations.colors.length > 0) {
      console.log(`🔴 颜色 (${violations.colors.length}):`);
      violations.colors.slice(0, 10).forEach(v => console.log(`   ${v}`));
      if (violations.colors.length > 10) console.log(`   ... +${violations.colors.length - 10} more`);
    }
    if (violations.fontSizes.length > 0) {
      console.log(`\n🔵 字号 (${violations.fontSizes.length}):`);
      violations.fontSizes.forEach(v => console.log(`   ${v}`));
    }
    if (violations.radii.length > 0) {
      console.log(`\n🟡 圆角 (${violations.radii.length}):`);
      violations.radii.forEach(v => console.log(`   ${v}`));
    }
  }

  // ── Write markdown ──
  const fs = await import('fs');
  const reportMd = [
    `# Token Compliance Report`,
    `_${new Date().toISOString().slice(0,19)}_`,
    '',
    `| Metric | Count |`,
    `|--------|-------|`,
    `| Elements scanned | ${styleData.length} |`,
    `| Color violations | ${violations.colors.length} |`,
    `| Font size violations | ${violations.fontSizes.length} |`,
    `| Radius violations | ${violations.radii.length} |`,
    `| **Total violations** | **${total}** |`,
    '',
    total === 0 ? '✅ **PASS**' : '❌ **FAIL** — see details below.',
    '',
    ...(violations.colors.length ? ['### Color Violations', ...violations.colors.map(v => `- ${v}`)] : []),
    ...(violations.fontSizes.length ? ['### Font Size Violations', ...violations.fontSizes.map(v => `- ${v}`)] : []),
    ...(violations.radii.length ? ['### Radius Violations', ...violations.radii.map(v => `- ${v}`)] : []),
    '',
    '---',
    'Run `node screenshots/audit-tokens.mjs` to re-check.',
  ].join('\n');

  fs.writeFileSync(`${OUTPUT_DIR}/token-report.md`, reportMd);
  console.log(`\n📄 ${OUTPUT_DIR}/token-report.md`);

  await browser.close();
}

run().catch(console.error);

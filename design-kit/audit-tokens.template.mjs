// ═══════════════════════════════════════════════════════════════════════════════
// TOKEN AUDIT — Automated Design Token Compliance Checker
// ═══════════════════════════════════════════════════════════════════════════════
//
// 用法:
//   1. 复制此文件到项目 screenshots/audit-tokens.mjs
//   2. 替换 [FILL] 占位符
//   3. 填 VALID_HEX 数组（从 designTokens.js 收集所有 hex 值）
//   4. 运行: node screenshots/audit-tokens.mjs
//
// 核心规律:
//   - 浏览器会将所有颜色归一化为 rgb()/rgba() 格式
//   - 审计时必须做色彩归一化对比，否则 100% 误报
//   - normalizeColor() 函数是跨项目完全可复用的基础设施
// ═══════════════════════════════════════════════════════════════════════════════

import { chromium } from '@playwright/test';

const BASE_URL = '[FILL: dev server URL, e.g. http://localhost:5173]';
const OUTPUT_DIR = 'screenshots';

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR NORMALIZATION — universal, no changes needed
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Convert any CSS color string (hex, rgb, rgba, transparent) to canonical "r,g,b" format.
 * This handles the browser's automatic hex→rgb normalization.
 */
function normalizeColor(colorStr) {
  if (!colorStr) return null;

  // hex → canonical RGB
  const hexMatch = colorStr.match(/^#([0-9a-fA-F]{3,8})$/);
  if (hexMatch) {
    let h = hexMatch[1];
    if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
    if (h.length === 6) h = h + 'ff';
    return [
      parseInt(h.slice(0,2), 16),
      parseInt(h.slice(2,4), 16),
      parseInt(h.slice(4,6), 16),
    ].join(',');
  }

  // rgb(r, g, b) / rgba(r, g, b, a) → canonical RGB (ignoring alpha)
  const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return [rgbMatch[1], rgbMatch[2], rgbMatch[3]].join(',');
  }

  if (colorStr === 'transparent') return '0,0,0';
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALID COLOR DEFINITIONS — REPLACE WITH YOUR TOKEN VALUES
// ═══════════════════════════════════════════════════════════════════════════════
//
// 如何生成此列表:
//   从 designTokens.js 中提取所有 hex 值 + rgba 值。
//   包括: color.page, color.card, color.subtle, color.elevated, color.warm,
//         color.text.*, color.border.*, color.semantic.*.*, color.brand.*,
//         所有扩展色组, 所有 overlay 值。
//
//   动态主题色（如 topic.accent）的基础 hex 也要加入 ACCENT_BASES。

const VALID_HEX = [
  // ── Page/Surface ──
  '[FILL: tokens.color.page]',
  '[FILL: tokens.color.card]',
  '[FILL: tokens.color.subtle]',

  // ── Text ──
  '[FILL: tokens.color.text.primary]',
  '[FILL: tokens.color.text.secondary]',
  '[FILL: tokens.color.text.body]',
  '[FILL: tokens.color.text.label]',
  '[FILL: tokens.color.text.muted]',
  '[FILL: tokens.color.text.faded]',

  // ── Border ──
  '[FILL: tokens.color.border.default]',
  '[FILL: tokens.color.border.light]',
  '[FILL: tokens.color.border.subtle]',
  '[FILL: tokens.color.border.dashed]',

  // ── Semantic ──
  '[FILL: tokens.color.semantic.success.*]',
  '[FILL: tokens.color.semantic.warning.*]',
  '[FILL: tokens.color.semantic.danger.*]',
  '[FILL: tokens.color.semantic.info.*]',

  // ── Brand ──
  '[FILL: tokens.color.brand.*]',

  // ── Overlays ──
  'rgba(255,255,255,0.15)',
  'rgba(255,255,255,0.2)',
  'rgba(255,255,255,0.5)',
  'rgba(255,255,255,0.75)',
  'rgba(255,255,255,0.85)',
  'rgba(255,255,255,0.9)',
  'rgba(0,0,0,0.04)',
  'transparent',

  // ── [FILL: project-specific color groups] ──
  // e.g. mode colors, dimension colors, grammar highlight colors, grade colors
];

const VALID_RGB = new Set(
  VALID_HEX.filter(h => h && !h.startsWith('[')).map(normalizeColor).filter(Boolean)
);

/**
 * Dynamic accent colors — base RGB values that are always valid regardless of opacity.
 * Used for colors applied via topic.accent + "20" (opacity suffix) patterns.
 * Add your project's dynamic accent RGB bases here.
 */
const ACCENT_BASES = new Set([
  // '[FILL: "r,g,b" of dynamic accent color 1]',
  // '[FILL: "r,g,b" of dynamic accent color 2]',
]);

function isValidColor(computedColor) {
  const c = computedColor.trim();
  const rgb = normalizeColor(c);
  if (!rgb) return true; // unparseable → skip (false positive avoidance)
  if (VALID_RGB.has(rgb)) return true;
  if (ACCENT_BASES.has(rgb)) return true;
  return false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALID FONT SIZES — match your tokens.font.size values
// ═══════════════════════════════════════════════════════════════════════════════

const VALID_FONT_SIZES = new Set([
  // [FILL: all px values from tokens.font.size — e.g. '11px','14px','16px','20px','24px','32px']
  '11px', '14px', '16px', '20px', '24px', '32px', '36px', '40px', '64px',
]);

// ═══════════════════════════════════════════════════════════════════════════════
// VALID BORDER RADII — match your tokens.radius values
// ═══════════════════════════════════════════════════════════════════════════════

const VALID_RADII = new Set([
  // [FILL: all px values from tokens.radius — e.g. '4px','8px','12px','16px','20px']
  '0px', '4px', '8px', '12px', '16px', '20px', '24px', '50%', '9999px',
]);

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIT ENGINE — universal, no changes needed below this line
// ═══════════════════════════════════════════════════════════════════════════════

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('🔍 Token Compliance Audit\n');

  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(500);

  // Extract all inline styles from the DOM
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

  // Audit each property
  const violations = { colors: [], fontSizes: [], radii: [] };
  const seenColors = new Set();

  for (const el of styleData) {
    const ctx = `<${el.tagName}> "${el.text}"`;

    for (const [prop, val] of Object.entries(el.props)) {
      // ── Colors ──
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

      // ── Font sizes ──
      if (prop === 'font-size' && !VALID_FONT_SIZES.has(val)) {
        violations.fontSizes.push(`${ctx}  → font-size: ${val}`);
      }

      // ── Border radii ──
      if (prop === 'border-radius' && !VALID_RADII.has(val)) {
        violations.radii.push(`${ctx}  → border-radius: ${val}`);
      }
    }
  }

  // ── Output ──
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

  // ── Write markdown report ──
  const fs = await import('fs');
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

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
    `| **Total** | **${total}** |`,
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

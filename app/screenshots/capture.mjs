// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN REVIEW — Screenshot Capture Script
// ═══════════════════════════════════════════════════════════════════════════════
//
// 用法:
//   1. 先启动 dev server:  npm run dev
//   2. 运行截图:          node screenshots/capture.mjs [--output=before|after]
//   3. 查看截图:          open screenshots/before/
//   4. 对照清单审查:      cat design-review.md
//
// 输出:  screenshots/{before,after}/home-{width}.png
//        screenshots/{before,after}/discovery-{width}.png
//        screenshots/{before,after}/write-{width}.png
// ═══════════════════════════════════════════════════════════════════════════════

import { chromium } from '@playwright/test';

const BASE_URL = 'http://localhost:5178';
const VIEWPORTS = [
  { name: 'laptop',  width: 1440, height: 900 },
  { name: 'compact', width: 1280, height: 800 },
];

const SCREENS = [
  // Each screen: { id, description, clickPath (array of selectors to click) }
  { id: 'home',       description: '首页 · 主题选择',                     clickPath: [] },
  { id: 'discovery',  description: '发现模式 · AB句对比标注',              clickPath: ['text=开始认知发现'] },
  { id: 'write-full', description: '写作模式 · 全辅助（含推理链+帮助面板）', clickPath: ['text=开始认知发现', 'text=预览', 'text=进入写作模式'] },
];

const OUTPUT_SUBDIR = process.argv.find(a => a.startsWith('--output='))?.split('=')[1] || 'before';
const OUTPUT_DIR = `screenshots/${OUTPUT_SUBDIR}`;

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // Clear old screenshots
  const fs = await import('fs');
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  console.log('📸 Design Review Screenshot Capture');
  console.log('═══════════════════════════════════\n');

  for (const vp of VIEWPORTS) {
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    console.log(`\n🔲 Viewport: ${vp.name} (${vp.width}×${vp.height})`);
    console.log('─'.repeat(50));

    for (const screen of SCREENS) {
      try {
        // Navigate to base URL
        await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(500); // Let fonts load

        // Click through to target screen
        for (const selector of screen.clickPath) {
          const btn = page.locator(selector).first();
          if (await btn.isVisible({ timeout: 3000 })) {
            await btn.click();
            await page.waitForTimeout(600);
          } else {
            console.log(`  ⚠️  Selector not found: "${selector}" — skipping`);
          }
        }

        await page.waitForTimeout(300); // Let animations settle

        // Capture full-page screenshot
        const filename = `${OUTPUT_DIR}/${screen.id}-${vp.name}.png`;
        await page.screenshot({ path: filename, fullPage: true });
        console.log(`  ✅ ${screen.id.padEnd(14)} → ${filename}`);

      } catch (err) {
        console.log(`  ❌ ${screen.id}: ${err.message.slice(0, 80)}`);
      }
    }

    await page.close();
  }

  await browser.close();
  console.log('\n═══════════════════════════════════');
  console.log(`📁 Screenshots saved to ${OUTPUT_DIR}/`);
  console.log('📋 Next: review against design-review.md checklist');
}

run().catch(console.error);

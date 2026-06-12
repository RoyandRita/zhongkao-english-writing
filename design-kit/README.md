# Design Kit — 可复用设计约束基础设施

三份模板 + 一套规律。复制到新项目，填值即用。

## 包含什么

| 文件 | 用途 | 需要改什么 |
|------|------|-----------|
| `designTokens.template.js` | 设计令牌 — 颜色/字体/间距/圆角/阴影的唯一真相源 | 替换 `[FILL]` 占位符为项目的实际颜色和值 |
| `design-review.template.md` | 结构化审查清单 — A-F 6大维度 + before/after diff 流程 | A-E 节可直接用；F 节按项目页面自定义 |
| `audit-tokens.template.mjs` | 自动化令牌合规审计 — Playwright 驱动，色彩归一化对比 | 填 `VALID_HEX` / `ACCENT_BASES` / `BASE_URL` |

## 使用方式

```bash
# 1. 复制模板
cp design-kit/designTokens.template.js src/designTokens.js
cp design-kit/design-review.template.md design-review.md
cp design-kit/audit-tokens.template.mjs screenshots/audit-tokens.mjs

# 2. 填值
#    - designTokens.js: 替换所有 [FILL] 占位符
#    - audit-tokens.mjs: 把 VALID_HEX 数组替换为 token 中的所有 hex 值
#    - audit-tokens.mjs: 改 BASE_URL
#    - design-review.md: 自定义 F 节 (逐页审查)

# 3. 安装依赖
npm install -D @playwright/test
npx playwright install chromium

# 4. 运行
npm run dev &
node screenshots/audit-tokens.mjs    # 自动审计
node screenshots/capture.mjs         # 截图（需单独创建 capture 脚本）
```

## 内化的设计规律

这些规律来自本项目的三阶段重构经验，已编码进模板中：

1. **Token 先行原则** — 先建 token 文件再写 UI，避免后期重构。值可以用错，但不能没有结构。
2. **6 层字号法则** — caption(11) → body(14) → subhead(16) → h3(20) → h2(24) → h1(32)，每级差 ≥2px，消灭 1px 假精度。
3. **色彩四层基底** — page → card → border → text。这四层覆盖 90% 的 UI 色彩需求。再加 semantic（成功/警告/错误）+ brand（品牌色），就够用了。
4. **审计必须归一化** — 浏览器会把 hex 转成 rgb()，审计脚本的 `normalizeColor()` 函数处理这个转换。不归一化 = 100% 误报。
5. **before/after diff > 单图审查** — 单张截图的自我批判产生确认偏误。修改前后的对比才能暴露布局退化。这条已编码进 checklist 的 G 节。
6. **内化约束 > 外部工具** — Token 文件、checklist、审计脚本是项目资产，不随 MCP/Skill/API Provider 的变化而失效。外部工具是加速器，这些是安全带。

## 开销估算

| | 从零开始（有模板） | 已有 inline style 项目（需重构） |
|---|---|---|
| Token 文件 | 15 min（复制 + 填值） | 1h（设计 + 编码） |
| 样式收敛 | 0（从第一天就用 token） | 3h（脚本 + 人工校验） |
| Playwright 脚本 | 10 min（改 URL） | 30 min（首次配置） |
| 审查清单 | 10 min（改 F 节） | 30 min（首次建立） |
| 审计脚本 | 5 min（改 VALID_HEX） | 1h（含归一化调试） |
| **合计** | **40 min** | **6h** |

差距不在复杂度，在于你在哪个时点引入约束。

# DESIGN REVIEW CHECKLIST — 结构化视觉审查
#
# 用法:
#   1. 复制此文件到项目根目录 design-review.md
#   2. A-D 节可直接使用（通用维度）
#   3. F 节按项目页面结构自定义
#   4. G 节的 before/after diff 流程是强制的——不跳过
#
# 规律：单张截图的自批判 = 确认偏误，before/after diff = 暴露退化。

## A. TOKEN COMPLIANCE（令牌合规）

自动检查项（运行 `node screenshots/audit-tokens.mjs` 验证）：

- [ ] 零裸 hex 值 — 所有颜色引用 `tokens.color.*`
- [ ] 零裸字号 — 所有 fontSize 引用 `tokens.font.size.*`
- [ ] 零裸圆角 — 所有 borderRadius 引用 `tokens.radius.*`
- [ ] 零裸阴影 — 所有 boxShadow 引用 `tokens.shadow.*`
- [ ] 零裸过渡 — 所有 transition 引用 `tokens.transition.*`

## B. VISUAL HIERARCHY（视觉层级）

在截图中检查三层信息是否可辨：

- [ ] **第1层（标题/hero）**：字号 20+，与第2层间距 >= 24px，最先被看到
- [ ] **第2层（操作/内容）**：字号 14-16，卡片有明确边界（shadow + radius），视觉权重适中
- [ ] **第3层（辅助/元信息）**：字号 11-12，颜色 muted/label 级别，不抢夺焦点
- [ ] 屏幕内同时存在 <= 3 种显著颜色（排除品牌 accent 色）
- [ ] 浅色卡片在 `tokens.color.page` 背景上有足够边界感（阴影不可或缺）

## C. TYPOGRAPHY（字体）

- [ ] 正文字号统一在 body(14px) ±1px 范围内
- [ ] 标签/辅助字号统一在 caption(11px) 附近
- [ ] 同一页面内使用的字号 <= 5 种（来自 token scale）
- [ ] 自定义字体加载正常，无 fallback 字体跳动
- [ ] 行高 >= 1.6（normal）确保中英文混排可读性
- [ ] 字号层级差值均 >= 2px（无 1px 假精度）

## D. SPACING & LAYOUT（间距与布局）

- [ ] 1440px 宽度下无横向滚动，内容区无挤压
- [ ] 1280px 宽度下主内容区可视宽度 >= 500px
- [ ] 卡片内部 padding 在 14-20px 范围内
- [ ] 组件间 margin/gap 使用 4px 基准体系（4/8/12/16/20/24）
- [ ] 无明显"亲吻"（两个组件边缘贴在一起无间距）
- [ ] 信息密度：无单屏出现 3 列以上文字内容

## E. COMPONENT QUALITY（组件质量）

- [ ] 按钮有清晰的 visual affordance（颜色区分、hover 状态可辨识）
- [ ] 输入框有清晰边界（border 2px + token color）
- [ ] 进度条高度一致
- [ ] 标签/徽章（badge）尺寸统一，圆角一致
- [ ] 反馈卡片（成功/警告/错误）颜色来自 `tokens.color.semantic.*`
- [ ] 拖拽/交互元素的视觉提示明显但不抢占注意力

## F. SCREEN-BY-SCREEN（逐页审查）

<!--
  按项目页面结构自定义此节。
  每个页面列出 3-5 个关键检查项。

  示例：
  ### F1. Home
  - [ ] Hero 区域视觉冲击力足够
  - [ ] 卡片 hover 效果流畅（translateY + shadow）
  - [ ] 网格对齐，无浮动元素

  ### F2. Detail
  - [ ] 主内容区 vs 侧边栏比例合理（≥ 2:1）
  - [ ] 表单标签对齐一致性
  - [ ] 错误状态 vs 正常状态的视觉区分
-->

### F1. [PAGE_NAME]
- [ ] [FILL]
- [ ] [FILL]

### F2. [PAGE_NAME]
- [ ] [FILL]
- [ ] [FILL]

## G. REVIEW WORKFLOW（审查流程）

### 核心原则：永远 Compare Before/After

```
┌─────────────────────────────────────────────────────────────┐
│  1. 修改前截图 → screenshots/before/                         │
│     $ node screenshots/capture.mjs --output=before           │
│                                                             │
│  2. 修改代码                                                │
│                                                             │
│  3. 修改后截图 → screenshots/after/                          │
│     $ node screenshots/capture.mjs --output=after            │
│                                                             │
│  4. Diff 对比（同 viewport、同 screen）                       │
│     □ 是否有意外的布局位移？                                   │
│     □ 是否有颜色/字号的非预期变化？                              │
│     □ 是否在修 A 的同时破坏了 B？                              │
│                                                             │
│  5. 运行自动审计                                            │
│     $ node screenshots/audit-tokens.mjs                      │
│     → 必须输出 "ALL CLEAN — 零令牌违规"                       │
│                                                             │
│  6. 逐项核对清单 A-F                                          │
│                                                             │
│  7. 记录问题 → screenshots/issues.md                         │
│                                                             │
│  8. 修复 → 回到步骤 1                                        │
└─────────────────────────────────────────────────────────────┘
```

### 为什么这个流程有效

> 单张截图的自我批判会产生确认偏误——AI 倾向于说"看起来还行"。
> Before/after 对比才能暴露：布局位移、非预期字号变化、颜色退化、间距塌陷。
> 没有 diff，自批判是空中楼阁。

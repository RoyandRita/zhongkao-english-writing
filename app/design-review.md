# DESIGN REVIEW CHECKLIST — 结构化视觉审查
#
# 每次 UI 修改后运行此清单，逐项核对。
# "通过" = 符合令牌体系，视觉层级清晰。
# "待修" = 偏离设计系统，需要修正。

## A. TOKEN COMPLIANCE（令牌合规）

自动检查项（运行 `node screenshots/audit-tokens.mjs` 验证）：

- [ ] 零裸 hex 值 — 所有颜色引用 `tokens.color.*`
- [ ] 零裸字号 — 所有 fontSize 引用 `tokens.font.size.*`
- [ ] 零裸圆角 — 所有 borderRadius 引用 `tokens.radius.*`
- [ ] 零裸阴影 — 所有 boxShadow 引用 `tokens.shadow.*`
- [ ] 零裸过渡 — 所有 transition 引用 `tokens.transition.*`
- [ ] 所有 fontWeight 引用 `tokens.font.weight.*`

## B. VISUAL HIERARCHY（视觉层级）

在截图中检查三层信息是否可辨：

- [ ] **第1层（标题/hero）**：字号 18+，与第2层间距 >= 24px，最先被看到
- [ ] **第2层（操作/内容）**：字号 13-14，卡片有明确边界（shadow + radius），视觉权重适中
- [ ] **第3层（辅助/元信息）**：字号 10-12，颜色 muted/label 级别，不抢夺焦点
- [ ] 屏幕内同时存在 <= 3 种显著颜色（排除主题 accent 色）
- [ ] 白色卡片在 `#f8fafc` 页面上有足够边界感（阴影不可或缺）

## C. TYPOGRAPHY（字体）

- [ ] 正文字号统一在 13px（body）±1px 范围内
- [ ] 标签/辅助字号统一在 11-12px（caption/sm）
- [ ] 同一页面内使用的字号 <= 5 种（from token scale）
- [ ] Noto Sans SC 加载正常，无 fallback 字体跳动
- [ ] 行高 >= 1.6（normal）确保中英文混排可读性

## D. SPACING & LAYOUT（间距与布局）

- [ ] 1440px 宽度下，三栏（nav + center + help）无明显拥挤
- [ ] 1280px 宽度下，center 区可视宽度 >= 500px
- [ ] 卡片内部 padding 在 14-20px 范围内（xl-xxxl）
- [ ] 组件间 margin/gap 使用 8px 体系（8/12/16/20）
- [ ] 无明显"亲吻"（两个组件边缘贴在一起无间距）

## E. COMPONENT QUALITY（组件质量）

- [ ] 按钮有清晰的 visual affordance（颜色区分、hover 状态可辨识）
- [ ] 输入框有清晰边界（border 2px + token color）
- [ ] 进度条高度一致（5-8px）
- [ ] 标签/徽章（badge）尺寸统一，圆角一致
- [ ] 拖拽手柄（⠿）视觉明显但不抢占注意力
- [ ] 反馈卡片（成功/警告/错误）颜色来自 semantic token

## F. SCREEN-BY-SCREEN（逐页审查）

### F1. Home 首页
- [ ] Hero 区域视觉冲击力足够，渐变自然
- [ ] Topic 卡片 hover 效果流畅（translateY + shadow）
- [ ] 5 个 feature 卡片网格对齐

### F2. Discovery 发现页
- [ ] A/B 句卡片区分明确（色温不同）
- [ ] 高亮文字状态明确（normal → hover → clicked → drag-over）
- [ ] 拖拽标签面板不过度拥挤
- [ ] 标注区（annotation lane）空间充足
- [ ] 右侧 legend 面板信息密度合理

### F3. Write 写作页
- [ ] 推理链（ReasoningChain）在卡片内部不过度扩展
- [ ] textarea 与周围元素间距合理
- [ ] AI 反馈区颜色编码正确（绿=好，红=改，蓝=语法）
- [ ] 右侧帮助面板标签切换自然
- [ ] 全辅/半辅/自主三级按钮视觉清晰

### F4. Report 报告页
- [ ] 分数概览信息清晰，一眼可知等级
- [ ] 维度分布条图颜色正确
- [ ] 亮点/改进区域视觉对立（绿/红背景）
- [ ] 逐句明细可滚动，不截断

## G. REVIEW WORKFLOW（审查流程）

### 核心原则：永远 Compare Before/After

单张截图的自我批判会产生确认偏误——AI 倾向于说"看起来还行"。
Before/after 对比才能暴露：布局位移、非预期字号变化、颜色退化、间距塌陷。

```
┌─────────────────────────────────────────────────────────────┐
│  1. 修改前截图 → screenshots/before/                         │
│  2. 修改代码                                                │
│  3. 修改后截图 → screenshots/after/                          │
│  4. Diff 对比（同 viewport、同 screen）                       │
│     □ 是否有意外的布局位移？                                   │
│     □ 是否有颜色/字号的非预期变化？                              │
│     □ 是否在修 A 的同时破坏了 B？                              │
│  5. 逐项核对清单 A-F                                          │
│  6. 记录问题 → screenshots/issues.md                         │
│  7. 修复 → 回到步骤 1                                        │
│                                                             │
│  命令：                                                      │
│  $ node screenshots/capture.mjs --output=before              │
│  $ # ... 修改代码 ...                                        │
│  $ node screenshots/capture.mjs --output=after               │
│  $ diff -r screenshots/before screenshots/after              │
└─────────────────────────────────────────────────────────────┘
```

### 自动审计

每次修改后运行令牌合规检查，确认没有裸值逃逸：

```bash
node screenshots/audit-tokens.mjs
cat screenshots/token-report.md
```

报告应显示 `Violations: 0`，否则先修复违规再进入人工审查。

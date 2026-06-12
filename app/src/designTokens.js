// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — 单一来源的可视化设计决策
// ═══════════════════════════════════════════════════════════════════════════════
//
// 约束：所有 UI 值必须取自本文件，禁止硬编码 hex/px。
// 新增主题色在 topicData.js 的 accent/light 字段中定义（每个主题独立），
// 但引用方式必须通过本文件的 tokens.topic.* 占位符统一。
//
// 审美的本质不是发明新值，而是在有限的选择中做出一致的选择。
// ═══════════════════════════════════════════════════════════════════════════════

const color = {
  // ── 页面底色层级 ──
  page:        "#f8fafc",   // 全局页面背景
  card:        "#ffffff",   // 卡片白
  subtle:      "#fafbfc",   // 微弱灰底（分隔区、hover 提示）
  elevated:    "#fafcfd",   // 微高于页面的层（A 句卡片背景）
  warm:        "#fdfaf9",   // 暖白（B 句卡片背景）

  // ── 文字层级 ──
  text:        {
    primary:   "#1e293b",   // 主阅读文字
    secondary: "#475569",   // 辅助说明
    body:      "#334155",   // 正文段落
    label:     "#64748b",   // 标签/注释/辅助信息
    muted:     "#94a3b8",   // 占位/禁用/弱提示
    faded:     "#cbd5e1",   // 更弱一级（未填写文字）
  },

  // ── 边框/分隔 ──
  border:      {
    default:   "#e2e8f0",   // 标准边框
    light:     "#eef0f2",   // 弱边框（面板分隔）
    subtle:    "#f1f5f9",   // 极弱（表格底纹、section 分隔）
    dashed:    "#e8ecf0",   // 虚线提示区
  },

  // ── 语义色 ──
  semantic:    {
    success:   { fg: "#15803d", dark: "#14532d", bg: "#f0fdf4", border: "#86efac", strong: "#dcfce7" },
    warning:   { fg: "#b45309", bg: "#fffbeb", border: "#fde68a", strong: "#fef3c7" },
    danger:    { fg: "#be123c", bg: "#fff1f2", border: "#fca5a5", strong: "#ffe4e6" },
    info:      { fg: "#1d4ed8", bg: "#eff6ff", border: "#dbeafe" },
  },

  // ── 品牌蓝（非主题色场景：链接、选中、按钮） ──
  brand:       {
    primary:   "#1d4ed8",
    dark:      "#312e81",
    darkest:   "#1e1b4b",
    light:     "#dbeafe",
    lighter:   "#eff6ff",
    purple:    "#7c3aed",
    purpleBg:  "#f5f3ff",
  },

  // ── 学习模式色（A/B 对比选择） ──
  mode:        {
    a:         "#0891b2",  // A 风格 — 青色
    aBg:       "#f3f7f9",
    b:         "#c2410c",  // B 风格 — 橙色
    bBg:       "#faf7f5",
  },

  // ── 语法标注维度色（SCORE_DIMENSIONS） ──
  dimension:   {
    vocab:     { fg: "#3b7d5a", bg: "#f0f7f2", border: "#c5dfce" },
    syntax:    { fg: "#4a6d8c", bg: "#f2f5f9", border: "#c8d6e4" },
    logic:     { fg: "#8b6d3f", bg: "#faf7f0", border: "#e0d5c0" },
    cognition: { fg: "#675d8a", bg: "#f5f3fa", border: "#d5d0e8" },
    emotion:   { fg: "#8c5a62", bg: "#faf5f6", border: "#e0cdd2" },
  },

  // ── 语法高亮类型色（HIGHLIGHT_TYPES） ──
  grammar:     {
    nonFinite:      { fg: "#5a7d9a", bg: "#f3f6fa" },
    adverb:         { fg: "#5a8a6c", bg: "#f2f8f4" },
    nonRestrictive: { fg: "#7a6358", bg: "#faf7f5" },
    concreteImagery:{ fg: "#7d6b72", bg: "#faf6f7" },
    changeVerb:     { fg: "#7a6d96", bg: "#f6f4fa" },
    mindVerb:       { fg: "#6d5f89", bg: "#f3f1f8" },
    connector:      { fg: "#8b6a5a", bg: "#faf7f3" },
    objectClause:   { fg: "#688bab", bg: "#f5f8fb" },
    concreteFeeling:{ fg: "#8c5a62", bg: "#faf5f6" },
    specificDetail: { fg: "#7d8b5a", bg: "#f7f8f2" },
    adverbAction:   { fg: "#5a8a7d", bg: "#f2f8f5" },
    adjNoun:        { fg: "#6d8a7a", bg: "#f4f9f6" },
  },

  // ── 评分等级色 ──
  score:       {
    3:           { fg: "#3b7d5a", bg: "#f0f7f2" },  // 优秀
    2:           { fg: "#4a6d8c", bg: "#f2f5f9" },  // 良好
    1:           { fg: "#8b6d3f", bg: "#faf7f0" },  // 基础
    0:           { fg: "#8c5a62", bg: "#faf5f6" },  // 无效
  },

  // ── 报告页等级色 ──
  grade:       {
    A:           "#15803d",
    B:           "#1d4ed8",
    C:           "#b45309",
    D:           "#be123c",
  },

  // ── 透明色（用于叠加） ──
  overlay:      {
    white15:    "rgba(255,255,255,0.15)",
    white18:    "rgba(255,255,255,0.18)",
    white20:    "rgba(255,255,255,0.2)",
    white25:    "rgba(255,255,255,0.25)",
    white40:    "rgba(255,255,255,0.4)",
    white50:    "rgba(255,255,255,0.5)",
    white75:    "rgba(255,255,255,0.75)",
    white85:    "rgba(255,255,255,0.85)",
    white90:    "rgba(255,255,255,0.9)",
  },
};

// ───────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY
// ───────────────────────────────────────────────────────────────────────────────
const font = {
  family:      "'Noto Sans SC', 'Segoe UI', system-ui, -apple-system, sans-serif",

  size:        {
    // ── 规范字号（6 层主要 + 3 层展示，每级差值 ≥2px）──
    // AI 和人类都从这里选择。更少选项 = 更低选错概率。
    caption:    11,     // 辅助文字：标签、提示、进度、nav
    body:       14,     // 正文标准：阅读、编辑、段落
    subhead:    16,     // 段落标题：卡片标题、bar 标题
    h3:         20,     // 中标题：topic 卡标题、对话标题
    h2:         24,     // 大标题：section 标题
    h1:         32,     // 主标题：hero 标题、报告等级
    hero:       36,     // 首页大标题
    display:    40,     // emoji 展示
    mega:       64,     // 报告页等级字母

    // ── 已废弃别名（仅向后兼容，不用于新代码）──
    fineprint:   9,     // → 仅预览样式标签，勿用于正文
    xs:         11,     // → caption
    sm:         14,     // → body
    lead:       14,     // → body
    h5:         16,     // → subhead
    h4:         16,     // → subhead
  },

  weight:       {
    normal:     400,
    medium:     500,
    semibold:   600,
    bold:       700,
    extrabold:  800,
    black:      900,
  },

  letterSpacing:{
    tight:      "0.01em",
    normal:     "0.02em",
    wide:       "0.5px",
    wider:      "1px",
    widest:     "2px",
  },

  lineHeight:   {
    tight:      1.5,
    normal:     1.6,
    relaxed:    1.7,
    loose:      1.8,
    wide:       2.1,
    widest:     2.3,
    mega:       2.6,
  },
};

// ───────────────────────────────────────────────────────────────────────────────
// SPACING — 4px 基准体系
// ───────────────────────────────────────────────────────────────────────────────
const space = {
  0:           0,
  xs:          4,
  sm:          6,
  md:          8,
  lg:          12,
  xl:          14,
  xxl:         16,
  xxxl:        20,
  huge:        24,
  massive:     28,
  giant:       32,
};

// ───────────────────────────────────────────────────────────────────────────────
// RADIUS — 合并为 6 档
// ───────────────────────────────────────────────────────────────────────────────
const radius = {
  none:        0,
  tight:       4,     // 小标签、inline chip
  pill:        8,     // 按钮、输入框
  card:        12,    // 卡片
  elevated:    14,    // 组件（含阴影）
  section:     16,    // 大区域
  floating:    20,    // 浮动层
  round:       24,    // 胶囊
  full:        9999,   // 圆形/药丸
};

// ───────────────────────────────────────────────────────────────────────────────
// SHADOW
// ───────────────────────────────────────────────────────────────────────────────
const shadow = {
  none:         "none",
  hairline:     "0 1px 3px rgba(0,0,0,0.03)",
  subtle:       "0 1px 8px rgba(0,0,0,0.05)",
  card:         "0 2px 12px rgba(0,0,0,0.06)",
  elevated:     "0 4px 20px rgba(0,0,0,0.08)",
};

// ───────────────────────────────────────────────────────────────────────────────
// TRANSITION
// ───────────────────────────────────────────────────────────────────────────────
const transition = {
  fast:         "0.15s ease",
  normal:       "0.2s ease",
  slow:         "0.3s ease",
  reveal:       "0.4s ease",
  chart:        "0.6s ease",
  delayed:      "0.8s ease",
};

// ───────────────────────────────────────────────────────────────────────────────
// LAYOUT
// ───────────────────────────────────────────────────────────────────────────────
const layout = {
  navWidth:     148,
  helpWidth:    260,
  maxCenter:    820,
  maxContent:   700,
  maxPage:      900,
  maxReport:    860,
  barHeight:    52,
};

// ───────────────────────────────────────────────────────────────────────────────
// EXPORT
// ───────────────────────────────────────────────────────────────────────────────
export const tokens = {
  color,
  font,
  space,
  radius,
  shadow,
  transition,
  layout,
};

export default tokens;

// ═══════════════════════════════════════════════════════════════════════════════
// USAGE EXAMPLE (how AI & human devs should reference these):
//
//   import tokens from "./designTokens.js"
//
//   // Before (hardcoded):
//   //   background: "#f8fafc"
//   //   fontSize: 14
//   //   borderRadius: 12
//   //   padding: "14px 18px"
//   //   boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
//
//   // After (token-based):
//   //   background: tokens.color.page
//   //   fontSize: tokens.font.size.lead
//   //   borderRadius: tokens.radius.card
//   //   padding: `${tokens.space.xl}px ${tokens.space.xxl}px`
//   //   boxShadow: tokens.shadow.card
// ═══════════════════════════════════════════════════════════════════════════════

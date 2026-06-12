// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — 单一来源的可视化设计决策
// ═══════════════════════════════════════════════════════════════════════════════
//
// 用法:
//   1. 复制此文件到项目 src/designTokens.js
//   2. 替换 [FILL] 占位符为项目实际值
//   3. 所有 UI 代码引用 tokens.*，禁止硬编码 hex/px
//
// 设计规律（已验证，建议遵守）：
//   - 字号：每级差值 ≥2px，消灭 1px 假精度。推荐 11/14/16/20/24/32
//   - 色彩：四层基底 (page→card→border→text) + semantic + brand，覆盖 90% 场景
//   - 间距：4px 基准体系，只用 4/8/12/16/20/24/32
//   - 圆角：4/8/12/16/20/24，不超过 6 档
//   - 阴影：hairline/subtle/card/elevated 四级，够用
// ═══════════════════════════════════════════════════════════════════════════════

const color = {
  // ── 页面底色层级（四层基底：必填）──
  page:        "[FILL: 全局页面背景，如 #f8fafc]",
  card:        "[FILL: 卡片白，如 #ffffff]",
  subtle:      "[FILL: 微弱灰底，如 #fafbfc]",
  elevated:    "[FILL: 略高于页面的层，如 #fafcfd]",
  warm:        "[FILL: 暖白变体，如 #fdfaf9]",

  // ── 文字层级（必填）──
  text:        {
    primary:   "[FILL: 主阅读文字，如 #1e293b]",
    secondary: "[FILL: 辅助说明，如 #475569]",
    body:      "[FILL: 正文段落，如 #334155]",
    label:     "[FILL: 标签/注释，如 #64748b]",
    muted:     "[FILL: 占位/禁用/弱提示，如 #94a3b8]",
    faded:     "[FILL: 更弱一级，如 #cbd5e1]",
  },

  // ── 边框/分隔（必填）──
  border:      {
    default:   "[FILL: 标准边框，如 #e2e8f0]",
    light:     "[FILL: 弱边框/面板分隔，如 #eef0f2]",
    subtle:    "[FILL: 极弱/表格底纹，如 #f1f5f9]",
    dashed:    "[FILL: 虚线提示区，如 #e8ecf0]",
  },

  // ── 语义色（必填）──
  semantic:    {
    success:   { fg: "[FILL]", bg: "[FILL]", border: "[FILL]", strong: "[FILL]" },
    warning:   { fg: "[FILL]", bg: "[FILL]", border: "[FILL]", strong: "[FILL]" },
    danger:    { fg: "[FILL]", bg: "[FILL]", border: "[FILL]", strong: "[FILL]" },
    info:      { fg: "[FILL]", bg: "[FILL]", border: "[FILL]" },
  },

  // ── 品牌色（必填）──
  brand:       {
    primary:   "[FILL: 主品牌色，如 #2563eb]",
    dark:      "[FILL: 深色变体，如 #1e40af]",
    light:     "[FILL: 浅色变体，如 #dbeafe]",
  },

  // ── 扩展：项目特有的色组（可选，按需增减）──
  // mode:       { a: "[FILL]", aBg: "[FILL]", b: "[FILL]", bBg: "[FILL]" },
  // dimension:  { ... },
  // grammar:    { ... },
  // score:      { 3: {...}, 2: {...}, 1: {...}, 0: {...} },
  // grade:      { A: "[FILL]", B: "[FILL]", C: "[FILL]", D: "[FILL]" },
  // overlay:    { white15: "rgba(255,255,255,0.15)", ... },
};

// ───────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY
// ───────────────────────────────────────────────────────────────────────────────
const font = {
  family:      "[FILL: 字体栈，如 'Noto Sans SC', 'Segoe UI', sans-serif]",

  // 6 层规范字号（推荐，每级差 ≥2px）
  size:        {
    caption:    11,
    body:       14,
    subhead:    16,
    h3:         20,
    h2:         24,
    h1:         32,
    // 展示层级（按需保留）
    hero:       36,
    display:    40,
    mega:       64,
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
  },

  lineHeight:   {
    tight:      1.5,
    normal:     1.6,
    relaxed:    1.7,
    loose:      1.8,
    wide:       2.1,
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
  giant:       32,
};

// ───────────────────────────────────────────────────────────────────────────────
// RADIUS — 合并为 6 档
// ───────────────────────────────────────────────────────────────────────────────
const radius = {
  none:        0,
  tight:       4,
  pill:        8,
  card:        12,
  section:     16,
  floating:    20,
  full:        9999,
};

// ───────────────────────────────────────────────────────────────────────────────
// SHADOW — 四级海拔
// ───────────────────────────────────────────────────────────────────────────────
const shadow = {
  none:         "none",
  hairline:     "[FILL: 如 0 1px 3px rgba(0,0,0,0.03)]",
  subtle:       "[FILL: 如 0 1px 8px rgba(0,0,0,0.05)]",
  card:         "[FILL: 如 0 2px 12px rgba(0,0,0,0.06)]",
  elevated:     "[FILL: 如 0 4px 20px rgba(0,0,0,0.08)]",
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
};

// ───────────────────────────────────────────────────────────────────────────────
// LAYOUT（项目特有，按需定义）
// ───────────────────────────────────────────────────────────────────────────────
const layout = {
  // navWidth:   [FILL],
  // helpWidth:  [FILL],
  // maxContent: [FILL],
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

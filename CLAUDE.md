# CLAUDE.md — 强制工作规则

## 核心原则

AI 默认走语言推理路径（零摩擦），不会主动调用工具（有等待成本）。
本文件的目的是**迫使 AI 在正确的时间调用正确的工具**。

---

## 一、任务类型 → 验证工具映射表

| 任务类型 | 正确性判据 | 验证方式 | 禁止用 |
|---------|-----------|---------|--------|
| UI 布局/样式改动 | 渲染位置·尺寸正确 | Playwright DOM 检查 | curl+grep |
| 逻辑/算法/数据处理 | 单测通过·类型正确 | `vite build` + 手动测试 | 只读代码 |
| 部署确认 | 线上版本更新 | `curl` 查 HTML 中的 JS hash | 凭感觉 |

**关键认知**：`vite build` 通过只证明语法正确，不等于位置正确。

---

## 二、UI 布局改动强制三步流程

触发条件（满足任一即强制执行全部三步）：
- 涉及 CSS 布局属性：display / position / flex / grid / width / margin / padding / top / left / right / bottom
- 组件位置调整
- 响应式/视口适配
- 用户说"位置不对""没变化""看不到"

### 第 1 步：确认目标（防理解偏差）

用一句话 + ASCII 结构图向用户确认，等回复"对"再动手。

格式：
```
我理解你要的是：[一句话描述]。

布局结构：
┌──────────┬──────────────────┬──────────┐
│  左导航   │  例句区（撑满）   │  胶囊区  │
└──────────┴──────────────────┴──────────┘

是否正确？
```

### 第 2 步：改代码

### 第 3 步：Playwright 验证（防盲改）

```bash
npm run dev &
node -e "
import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:PORT');
// ... 检查目标元素的 getBoundingClientRect()
// 确认：无重叠、位置正确、尺寸合理
await browser.close();
"
```

验证通过 → commit + push。
验证不通过 → 回到第 2 步。

---

## 三、熔断机制

以下条件触发熔断——立即停止改代码，转入调查模式：

1. 同一问题连续收到 **2 次**"没变化"或"不对"
2. 已进行 **3 次**以上改动但问题未解决

调查模式流程：
1. 运行 Playwright，获取目标元素的实际 DOM 位置和尺寸
2. 用一句话陈述"我看到的"vs"用户期望的"差异
3. 提出至多 2 个假设，让用户选择方向
4. 用户确认后再动手

---

## 四、工具触发词典

| 用户说了... | 必须先调用... |
|-----------|-------------|
| 位置/布局/移到/靠右/居中/全局/左边/右边/上面/下面 | Playwright DOM 检查 |
| 没变化/看不到变化/还是一样/没变/还是 | Playwright DOM 检查 |
| 重叠/挤压/挡住了/太小/太大 | Playwright 截图 |
| 这个接口/请求/返回值 | `curl` 实际调用 |
| 部署了没/上线了没 | `curl` 查 HTML 中的 JS hash |

---

## 五、禁止行为

- ❌ 用 `curl` + `grep` 验证布局正确性
- ❌ 连续 2 次 commit 之间未运行 Playwright 验证
- ❌ 收到"没变化"反馈后不检查 DOM 直接猜原因
- ❌ 布局任务跳过第 1 步（确认目标）直接写代码
- ❌ 改动 `vite.config.js` 的 base path / output dir（已有 Cloudflare Pages 部署）

---

## 六、项目技术上下文

- **框架**：Vite + React (JSX)
- **样式**：inline style，全部引用 `tokens` from `designTokens.js`
- **部署**：GitHub → Cloudflare Pages 自动部署（main 分支）
- **验证工具**：Playwright（已安装，`app/screenshots/capture.mjs`）
- **本地 dev**：`npm run dev`（默认端口 5173）
- **设计系统**：`app/src/designTokens.js`（颜色/字体/间距/圆角/阴影/过渡/布局的唯一来源）
- **审查清单**：`app/design-review.md`
- **设计工具包**：`design-kit/`（可复用模板）

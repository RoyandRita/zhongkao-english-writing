// ─────────────────────────────────────────────────────────────────────────────
// REASONING CHAINS — Pre-writing thinking scaffolds
// 基于 0509 初中英语写作引导 + 0529 中考英语作文辅导 + 认知语言学
// ─────────────────────────────────────────────────────────────────────────────
//
// 5 种链型（合并自 9 种句子功能）：
//   论证链   argument    主题句/观点、理由展开
//   画面链   imagery     景色描写、情感深化
//   因果链   causality   活动过程、具体回忆
//   对比链   contrast    转折让步
//   时间层链 time-layer  升华感悟、结论收尾、展望/心愿
//
// MVP 实现：论证链、画面链、因果链

// ─────────────────────────────────────────────────────────────────────────────
// CHAIN TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

const CHAIN_TYPES = {
  // ═══════════════════════════════════════════════════════════════════════════
  // 论证链：立场 → 理由 → 经历（时间+动作+结果）→ 认识
  // 适用：主题句/观点、理由展开
  // 来源：0509 卡2 观点建议类 + 0529 "论证建筑师工作台"
  // ═══════════════════════════════════════════════════════════════════════════
  argument: {
    name: "论证链",
    icon: "🧠",
    description: "帮你想清楚：你的观点是什么 + 为什么这么想 + 有什么经历证明",
    // 追问序列 — 每个 step 是一个追问
    steps: [
      {
        id: "position",
        label: "第1步：立场",
        question: (topicTitle, sentRole) =>
          `关于「${topicTitle}」，在「${sentRole}」这句话里，你最想表达的一个看法是什么？用一句话说清楚。`,
        hint: "比如：春天让我感觉充满希望 / 真正的朋友会在困难时站在你身边",
        answerType: "short",
        lang: "zh",
      },
      {
        id: "reason",
        label: "第2步：理由",
        question: (topicTitle, sentRole, prevAnswers) => {
          const position = prevAnswers?.position || "你的看法";
          return `你说"${position}"——为什么你这么想？说一个最核心的理由。`;
        },
        hint: "比如：因为春天过后一切都会重新开始 / 因为朋友帮我度过了最难的时候",
        answerType: "short",
        lang: "zh",
      },
      {
        id: "experience",
        label: "第3步：经历的证明",
        question: (topicTitle, sentRole, prevAnswers) => {
          const reason = prevAnswers?.reason || "这个理由";
          return `能想起一个具体的时刻，证明"${reason}"吗？是什么时候？发生了什么？`;
        },
        hint: "用时间词开头：去年 / 上个月 / 有一次 / 那天下午 / 考试前",
        answerType: "short",
        lang: "zh",
        timeRequired: true, // 提示必须有具体时间词
      },
      {
        id: "insight",
        label: "第4步：你认识到了什么",
        question: (topicTitle, sentRole, prevAnswers) => {
          const exp = prevAnswers?.experience || "这个经历";
          return `"${exp}"——这件事让你认识到什么？或者改变了你什么想法？`;
        },
        hint: "比如：我意识到... / 从那时起我明白了... / 这件事教会我...",
        answerType: "short",
        lang: "zh",
      },
    ],
    // 思路总结模板
    synthesis: {
      format: "→→→".repeat(3),
      template: (answers) =>
        `观点：${answers.position || "?"}\n→ 理由：${answers.reason || "?"}\n→ 经历：${answers.experience || "?"}\n→ 认识：${answers.insight || "?"}`,
    },
    // 英文关键词桥接提示
    bridgePrompt: (answers) =>
      `基于以下中文思路，提取5-8个英文关键词/短语，帮助一个初三学生把这段思路写成英文句子。只输出关键词列表，用逗号分隔：\n${JSON.stringify(answers)}`,
    // 功能句型推荐（全辅模式）
    patterns: [
      "I believe that ___, because ___.",
      "What I have come to realize is that ___.",
      "___ taught me that ___.",
    ],
    // 稳句/亮句风险评估
    riskNote:
      "⚖️ 亮句策略：这一句如果是全文唯一的「论点金句」，可以用一个复杂结构。如果前面已经有亮句了，这里用简单稳句。",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 画面链：静态画面 → 动态元素 → 感官细节 → 感受词
  // 适用：景色描写、情感深化
  // 来源：0509 卡1 画面链 + 0529 "锁定画面→激活画面→挖掘内心→升华主题"
  // ═══════════════════════════════════════════════════════════════════════════
  imagery: {
    name: "画面链",
    icon: "🎨",
    description: "帮你想清楚：你看到了什么 + 听到了/闻到了什么 + 什么在动 + 这让你什么感觉",
    steps: [
      {
        id: "still",
        label: "第1步：静态画面",
        question: (topicTitle, sentRole) =>
          `在「${sentRole}」这个部分，闭上眼睛想一想：你最先"看到"的是什么画面？有哪些静止的东西？用 2-3 个词形容它们。`,
        hint: "比如：金色的银杏叶 / 安静的教学楼 / 绿色的长椅 / 蓝天白云",
        answerType: "short",
        lang: "zh",
      },
      {
        id: "motion",
        label: "第2步：动态元素",
        question: (topicTitle, sentRole, prevAnswers) => {
          const still = prevAnswers?.still || "你看到的画面";
          return `在"${still}"这个画面里，有什么东西在动吗？是人、是风、是阳光、还是什么？它们在做什么？`;
        },
        hint: "比如：树叶在风中飘落 / 学生们在笑着聊天 / 阳光穿过树叶在晃动",
        answerType: "short",
        lang: "zh",
      },
      {
        id: "senses",
        label: "第3步：其他感官",
        question: (topicTitle, sentRole, prevAnswers) => {
          const motion = prevAnswers?.motion || "那些在动的东西";
          return `除了眼睛看到的，你在这个画面里还能听到什么声音？闻到什么气味？或者感受到什么温度/触感？`;
        },
        hint: "比如：闻到青草的味道 / 听到远处篮球的声音 / 微风拂过皮肤",
        answerType: "short",
        lang: "zh",
      },
      {
        id: "feeling",
        label: "第4步：心里的感觉",
        question: (topicTitle, sentRole, prevAnswers) => {
          const senses = prevAnswers?.senses || "这些感受";
          return `"${senses}"——这个画面和这些感官细节，让你心里产生什么感觉？用一个具体的感受词。`;
        },
        hint: "不要用 happy/sad。试试：平静 peaceful / 有活力 energetic / 温暖 warm / 自由 free",
        answerType: "short",
        lang: "zh",
      },
    ],
    synthesis: {
      format: "→".repeat(3),
      template: (answers) =>
        `画面：${answers.still || "?"}\n→ 动态：${answers.motion || "?"}\n→ 感官：${answers.senses || "?"}\n→ 感受：${answers.feeling || "?"}`,
    },
    bridgePrompt: (answers) =>
      `基于以下中文画面描写，提取5-8个英文关键词/短语（含感官形容词和动词），用逗号分隔：\n${JSON.stringify(answers)}`,
    patterns: [
      "There are ___ everywhere, and the air smells of ___.",
      "When ___, the whole world seems to ___.",
      "Looking at ___, I feel completely ___.",
    ],
    riskNote:
      "⚖️ 画面句策略：先让读者看见，再让读者相信你的感受。如果感受词前面没有具体画面，这句需要重写。",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 因果链：做什么 → 困难/细节 → 结果/反应 → 意义
  // 适用：活动过程、具体回忆
  // 来源：0509 卡1 活动类因果链 + 卡3 情绪推进链
  // ═══════════════════════════════════════════════════════════════════════════
  causality: {
    name: "因果链",
    icon: "🔗",
    description: "帮你想清楚：发生了什么 + 有什么困难或细节 + 结果怎样 + 这意味着什么",
    steps: [
      {
        id: "action",
        label: "第1步：核心动作",
        question: (topicTitle, sentRole) =>
          `在「${sentRole}」这个部分，最核心的一件事是什么？一个具体的动作。谁做了什么？`,
        hint: "比如：我和家人在公园放风筝 / 我参加了学校的才艺表演 / 李华陪我坐在窗边",
        answerType: "short",
        lang: "zh",
      },
      {
        id: "detail",
        label: "第2步：困难或细节",
        question: (topicTitle, sentRole, prevAnswers) => {
          const action = prevAnswers?.action || "这件事";
          return `"${action}"——过程中有什么困难吗？或者有什么让你印象特别深的细节？`;
        },
        hint: "比如：一开始风筝总是掉下来 / 上台前我的手一直在抖 / 他什么都没说，只是安静地坐着",
        answerType: "short",
        lang: "zh",
      },
      {
        id: "result",
        label: "第3步：结果或别人的反应",
        question: (topicTitle, sentRole, prevAnswers) => {
          const detail = prevAnswers?.detail || "这个过程";
          return `"${detail}"——后来呢？结果是什么？或者旁边的人有什么反应？`;
        },
        hint: "比如：最后风筝飞得很高，我们都笑了 / 观众开始鼓掌 / 从那天起我开始慢慢变好",
        answerType: "short",
        lang: "zh",
      },
      {
        id: "meaning",
        label: "第4步：这件事的意义",
        question: (topicTitle, sentRole, prevAnswers) => {
          const result = prevAnswers?.result || "这个结果";
          return `"${result}"——这件事让你明白了什么？或者对你来说意味着什么？`;
        },
        hint: "比如：我意识到坚持比天赋更重要 / 原来朋友的支持真的能改变一个人",
        answerType: "short",
        lang: "zh",
      },
    ],
    synthesis: {
      format: "→→→",
      template: (answers) =>
        `动作：${answers.action || "?"}\n→ 细节/困难：${answers.detail || "?"}\n→ 结果/反应：${answers.result || "?"}\n→ 意义：${answers.meaning || "?"}`,
    },
    bridgePrompt: (answers) =>
      `基于以下中文事件叙述，提取5-8个英文关键词/短语（含动作动词和结果形容词），用逗号分隔：\n${JSON.stringify(answers)}`,
    patterns: [
      "I remember the time when ___, and ___.",
      "___ happened, which turned out to be ___.",
      "After ___, I finally ___, and felt ___.",
    ],
    riskNote:
      "⚖️ 叙述句策略：动作→细节→结果→意义，四个环节至少写三个。不要把四个都塞进一句话——选最重要的环节展开。",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 对比链（Phase 2 实现）
  // ═══════════════════════════════════════════════════════════════════════════
  contrast: {
    name: "对比链",
    icon: "⚖️",
    description: "对比链 — Phase 2 实现",
    steps: [],
    synthesis: { template: () => "", format: "" },
    bridgePrompt: () => "",
    patterns: [],
    riskNote: "",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 时间层链（Phase 2 实现）
  // ═══════════════════════════════════════════════════════════════════════════
  "time-layer": {
    name: "时间层链",
    icon: "⏳",
    description: "时间层链 — Phase 2 实现",
    steps: [],
    synthesis: { template: () => "", format: "" },
    bridgePrompt: () => "",
    patterns: [],
    riskNote: "",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the chain definition for a given chain type
 */
export function getChain(chainType) {
  return CHAIN_TYPES[chainType] || CHAIN_TYPES.argument; // fallback to argument
}

/**
 * Get the steps for a given chain type, optionally limited by helpLevel
 * helpLevel 2 (全辅) = all steps
 * helpLevel 1 (半辅) = first 2 steps
 * helpLevel 0 (自主) = 0 steps (skip)
 */
export function getSteps(chainType, helpLevel = 2) {
  const chain = getChain(chainType);
  if (helpLevel === 0) return [];
  if (helpLevel === 1) return chain.steps.slice(0, 2);
  return chain.steps;
}

/**
 * Map a sentence role to its optimal chain type
 * Based on analysis from 0509 + 0529 training documents
 */
export function mapRoleToChainType(role) {
  const ROLE_MAP = {
    // 论证链 — 需要表达观点、给出理由
    "主题句": "argument",
    "引出人物": "argument",
    "点题引出": "argument",
    "点明爱好": "argument",
    "理由展开": "argument",
    "性格特点": "argument",
    "朋友的影响": "argument",
    "爱好的益处": "argument",

    // 画面链 — 需要描写场景、表达感受
    "景色描写": "imagery",
    "情感深化": "imagery",
    "情感收获": "imagery",
    "个人情感": "imagery",

    // 因果链 — 需要叙述事件过程
    "户外活动": "causality",
    "另一活动/节日": "causality",
    "具体回忆": "causality",
    "难忘经历": "causality",
    "共同爱好": "causality",
    "活动过程①": "causality",
    "活动过程②/高潮": "causality",
    "个人参与": "causality",
    "同伴反应/合作": "causality",
    "现状近况": "causality",
    "爱好起源": "causality",
    "具体描写①": "causality",
    "具体描写②": "causality",
    "与他人分享": "causality",
    "克服困难": "causality",

    // 对比链 — 需要转折让步（Phase 2）
    "转折让步": "contrast",
    "与众不同之处": "contrast",

    // 时间层链 — 需要升华/展望/收尾（Phase 2）
    "升华感悟": "time-layer",
    "结论收尾": "time-layer",
    "结论点题": "time-layer",
    "展望/心愿": "time-layer",
    "对家乡的期望": "time-layer",
    "活动的意义": "time-layer",
    "真友谊的内涵": "time-layer",
    "爱好的更深意义": "time-layer",
  };

  return ROLE_MAP[role] || "argument"; // default to argument chain
}

/**
 * Generate a bridge keyword prompt for Claude API
 * Takes student's Chinese answers → returns English keywords
 */
export function buildBridgePrompt(chainType, answers) {
  const chain = getChain(chainType);
  return chain.bridgePrompt(answers);
}

/**
 * Get recommended sentence patterns for a chain type
 */
export function getPatterns(chainType) {
  const chain = getChain(chainType);
  return chain.patterns || [];
}

/**
 * Get risk awareness note for a chain type
 */
export function getRiskNote(chainType) {
  const chain = getChain(chainType);
  return chain.riskNote || "";
}

/**
 * Format the synthesis card text from student answers
 */
export function formatSynthesis(chainType, answers) {
  const chain = getChain(chainType);
  return chain.synthesis.template(answers);
}

export default CHAIN_TYPES;

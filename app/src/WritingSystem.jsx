import { useState, useRef, useCallback } from "react";
import TOPICS from "./topicData.js";
import { getChain, getSteps, mapRoleToChainType, getPatterns, getRiskNote } from "./reasoningChains.js";

// ─────────────────────────────────────────────────────────────────────────────
// REASONING CHAIN — Pre-writing thinking scaffold
// ─────────────────────────────────────────────────────────────────────────────
function ReasoningChain({ chainType, sentData, topicTitle, helpLevel, onComplete, onSkip }) {
  const chain = getChain(chainType);
  const steps = getSteps(chainType, helpLevel);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSynthesis, setShowSynthesis] = useState(false);
  const inputRef = useRef(null);

  // No steps for 自主 mode — just skip
  if (steps.length === 0) return null;

  const step = steps[currentStep];
  const isLastStep = currentStep >= steps.length - 1;
  const totalSteps = steps.length;

  const handleNext = () => {
    if (!inputValue.trim()) return;
    const newAnswers = { ...answers, [step.id]: inputValue.trim() };
    setAnswers(newAnswers);

    if (isLastStep) {
      setShowSynthesis(true);
      // Auto-focus textarea after brief delay
      setTimeout(() => onComplete && onComplete(newAnswers), 100);
    } else {
      setCurrentStep(currentStep + 1);
      setInputValue("");
      // Auto-focus input after render
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setInputValue(answers[steps[currentStep - 1]?.id] || "");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const progressPercent = Math.round(((currentStep + (inputValue.trim() ? 1 : 0)) / totalSteps) * 100);

  if (isCollapsed) {
    return (
      <div style={RC.collapsedBar} onClick={() => setIsCollapsed(false)}>
        <span style={RC.collapsedIcon}>{chain.icon}</span>
        <span style={RC.collapsedText}>
          {chain.name}思路展开
          {showSynthesis ? " ✅ 已完成" : ` (${currentStep}/${totalSteps})`}
        </span>
        <span style={RC.collapsedArrow}>▼ 展开</span>
      </div>
    );
  }

  return (
    <div style={RC.shell}>
      {/* Header */}
      <div style={RC.header}>
        <div style={RC.headerLeft}>
          <span style={RC.headerIcon}>{chain.icon}</span>
          <span style={RC.headerTitle}>{chain.name} · 思路展开</span>
          <span style={RC.headerDesc}>{chain.description}</span>
        </div>
        <div style={RC.headerRight}>
          <div style={RC.progressTrack}>
            <div style={{ ...RC.progressFill, width: `${progressPercent}%` }} />
          </div>
          <span style={RC.stepCount}>{currentStep + 1}/{totalSteps}</span>
          <button onClick={() => { setIsCollapsed(true); onSkip && onSkip(); }} style={RC.skipBtn}>
            跳过 →
          </button>
        </div>
      </div>

      {/* Step indicator dots */}
      <div style={RC.stepDots}>
        {steps.map((s, i) => (
          <div key={s.id} style={{
            ...RC.dot,
            background: i < currentStep ? "#15803d" : i === currentStep ? "#1d4ed8" : "#e2e8f0",
            color: i <= currentStep ? "#fff" : "#94a3b8",
            fontWeight: i === currentStep ? 800 : 500,
          }}>
            {i < currentStep ? "✓" : i + 1}
          </div>
        ))}
      </div>

      {/* Synthesis card — shown after all steps complete */}
      {showSynthesis && (
        <div style={RC.synthesisCard}>
          <div style={RC.synthesisTitle}>✅ 思路已整理</div>
          <div style={RC.synthesisChain}>
            {steps.map((s, i) => (
              <span key={s.id}>
                <span style={RC.synthesisLabel}>{s.label.replace(/第\d步：/, "")}</span>
                <span style={RC.synthesisAnswer}>{answers[s.id] || "..."}</span>
                {i < steps.length - 1 && <span style={RC.synthesisArrow}> → </span>}
              </span>
            ))}
          </div>
          <div style={RC.synthesisActions}>
            <span style={RC.synthesisHint}>💡 上面是你的中文思路，下面用你自己的英文写出来</span>
            {helpLevel >= 1 && (
              <button onClick={() => {
                setShowSynthesis(false);
                setCurrentStep(0);
                setAnswers({});
                setInputValue("");
              }} style={RC.resetBtn}>
                🔄 重新思考
              </button>
            )}
          </div>
        </div>
      )}

      {/* Current step Q&A — only shown when not in synthesis view */}
      {!showSynthesis && (
        <div style={RC.qaArea}>
          {/* Question bubble */}
          <div style={RC.questionBubble}>
            <div style={RC.questionAvatar}>{chain.icon}</div>
            <div style={RC.questionContent}>
              <div style={RC.questionStep}>{step.label}</div>
              <div style={RC.questionText}>
                {step.question(topicTitle, sentData.role, answers)}
              </div>
              {step.hint && (
                <div style={RC.questionHint}>💡 {step.hint}</div>
              )}
              {step.timeRequired && (
                <div style={RC.timeRequired}>
                  ⏰ 请包含一个具体的时间词（如：去年 / 上个月 / 有一次 / 那天）
                </div>
              )}
            </div>
          </div>

          {/* Answer input */}
          <div style={RC.answerArea}>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="用中文或简单英文写你的想法...（按 Enter 继续）"
              style={RC.answerInput}
              rows={2}
              autoFocus
            />
            <div style={RC.answerActions}>
              {currentStep > 0 && (
                <button onClick={handlePrev} style={RC.prevBtn}>← 上一步</button>
              )}
              <button
                onClick={handleNext}
                disabled={!inputValue.trim()}
                style={{
                  ...RC.nextBtn,
                  opacity: inputValue.trim() ? 1 : 0.5,
                  cursor: inputValue.trim() ? "pointer" : "not-allowed",
                }}
              >
                {isLastStep ? "✅ 完成思路展开" : "下一步 →"}
              </button>
            </div>
            <div style={RC.enterHint}>按 Enter 继续 · Shift+Enter 换行</div>
          </div>
        </div>
      )}

      {/* Risk awareness note */}
      {helpLevel >= 1 && (
        <div style={RC.riskNote}>
          {getRiskNote(chainType) || "⚖️ 牢记：高分作文 = 80% 稳句 + 20% 亮句。一篇只留 1-2 个亮句。"}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AI FEEDBACK  via Anthropic API
// ─────────────────────────────────────────────────────────────────────────────
async function getAIFeedback(sentence, sentData, topicTitle, allSentences, helpLevel) {
  const contextStr = Object.entries(allSentences)
    .map(([k,v]) => v ? `Sentence ${k}: ${v}` : null)
    .filter(Boolean).join("\n");

  const systemPrompt = `You are an expert ESL teacher and Chinese middle school (初中/中考) English examiner in Wuhan.
Your job: analyse ONE student-written English sentence and give structured feedback in Chinese.

EFFECTIVE SENTENCE FRAMEWORK (有效句诊断框架):
An effective sentence at this position must demonstrate:
1. POSITION AWARENESS: This sentence serves a "${sentData.role}" function.
2. ADVERB LAYER: Does the sentence use an adverb (carefully, gradually, completely, deeply, etc.)? Missing adverbs = hallmark of template writing.
3. STRUCTURAL TARGET: Target grammar is: ${sentData.grammar}
4. SPECIFICITY: Must have concrete details, not generic statements.
5. NUCLEAR VERBS: Change verbs (improve, develop, become, change, grow) and Mind verbs (understand, realize, believe, learn) make writing mature.

RULES:
- Be concise, kind, and specific. No generic praise.
- Identify if the sentence is "有效句" (effective) or "无效句/基础句" (ineffective/basic).
- An EFFECTIVE sentence must: (1) have appropriate connectors/subordinators, (2) use at least one adjective or adverb, (3) match the target grammar point, (4) be specific (not template-like), (5) be 10+ words.
- Output VALID JSON only. No markdown fences. No extra text.

JSON schema:
{
  "verdict": "优秀句" | "良好句" | "基础句" | "无效句",
  "score": 3 | 2 | 1 | 0,
  "issues": ["string", ...],
  "strengths": ["string", ...],
  "suggestion": "one improved version of the sentence in English",
  "grammarNote": "brief Chinese note about grammar point used or missing"
}`;

  const userPrompt = `Topic: "${topicTitle}"
Sentence role: ${sentData.role} (Sentence #${sentData.id} in the essay)
Target grammar: ${sentData.grammar}
Writing tip: ${sentData.tip}

Student wrote: "${sentence}"

Essay context so far:
${contextStr || "(no other sentences yet)"}

Please evaluate ONLY the sentence the student wrote. Return JSON.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY || "" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    const data = await response.json();
    const raw = data.content?.map(b => b.text || "").join("") || "{}";
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch(e) {
    return {
      verdict:"基础句", score:1,
      issues:["AI反馈暂时不可用，请检查网络或API配置。"],
      strengths:[], suggestion:"", grammarNote:""
    };
  }
}

async function getAIFullEval(topic, sentences, opening) {
  const essay = [opening, ...topic.sentences.map(s => sentences[s.id] || "")].filter(Boolean).join(" ");

  const systemPrompt = `You are a Chinese middle school 中考 English examiner. Evaluate a student's full essay.
Output VALID JSON only. No markdown.

JSON schema:
{
  "overallScore": number (0-15, matching 中考 writing rubric),
  "grade": "A" | "B" | "C" | "D",
  "contentScore": number (0-5),
  "languageScore": number (0-5),
  "structureScore": number (0-5),
  "strengths": ["string",...],
  "weaknesses": ["string",...],
  "topSuggestion": "string (most important single thing to improve)",
  "improvedOpening": "string (rewrite the weakest sentence better)"
}`;

  const userPrompt = `Topic: "${topic.title}" (${topic.theme})
Full essay:
${essay}

Evaluate based on 中考 standards. Return JSON.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY || "" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    const data = await response.json();
    const raw = data.content?.map(b => b.text || "").join("") || "{}";
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch(e) {
    return {
      overallScore:0, grade:"N/A", contentScore:0, languageScore:0, structureScore:0,
      strengths:[], weaknesses:["全文评估暂时不可用，请检查网络或API配置。"], topSuggestion:"", improvedOpening:""
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const SCORE_META = {
  3: { label:"优秀句", color:"#15803d", bg:"#dcfce7", icon:"🌟" },
  2: { label:"良好句", color:"#1d4ed8", bg:"#dbeafe", icon:"👍" },
  1: { label:"基础句", color:"#b45309", bg:"#fef3c7", icon:"⚠️" },
  0: { label:"无效句", color:"#be123c", bg:"#ffe4e6", icon:"❌" },
};

const HIGHLIGHT_TYPES = {
  "non-finite":       { label:"非谓语动词", color:"#7c3aed", bg:"#f5f3ff" },
  "adverb":           { label:"副词层", color:"#0891b2", bg:"#ecfeff" },
  "non-restrictive":  { label:"非限定定语从句", color:"#c2410c", bg:"#fff7ed" },
  "concrete-imagery": { label:"具象化描写", color:"#15803d", bg:"#f0fdf4" },
  "change-verb":      { label:"Change核动词", color:"#b45309", bg:"#fffbeb" },
  "mind-verb":        { label:"Mind核动词", color:"#1d4ed8", bg:"#eff6ff" },
  "connector":        { label:"逻辑连接词", color:"#be123c", bg:"#fff1f2" },
  "object-clause":    { label:"宾语从句", color:"#7e22ce", bg:"#fdf4ff" },
  "concrete-feeling": { label:"具象感受词", color:"#0369a1", bg:"#f0f9ff" },
  "specific-detail":  { label:"具体细节", color:"#4d7c0f", bg:"#f7fee7" },
  "adverb-action":    { label:"副词+动作", color:"#0e7490", bg:"#ecfeff" },
  "adj-noun":         { label:"形容词+名词修饰", color:"#9333ea", bg:"#faf5ff" },
};

// ─────────────────────────────────────────────────────────────────────────────
// HIGHLIGHT SENTENCE COMPONENT — with drag-and-drop from right legend panel
// ─────────────────────────────────────────────────────────────────────────────
function HighlightSentence({ text, highlights, clickedIds, onToggle, onDrop, accentColor, side, dragOverZone, setDragOverZone }) {
  const sortedHL = [...highlights].sort((a,b) => a.start - b.start);

  // Build segments array: { text, isHighlight, hlIndex, type, label }
  const segments = [];
  let cursor = 0;
  sortedHL.forEach((hl, idx) => {
    if (hl.start > cursor) {
      segments.push({ text: text.slice(cursor, hl.start), isHighlight: false });
    }
    segments.push({
      text: text.slice(hl.start, hl.end),
      isHighlight: true,
      hlIndex: idx,
      type: hl.type,
      label: hl.label,
    });
    cursor = hl.end;
  });
  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), isHighlight: false });
  }

  const sideLabel = side === "a" ? "A · 副词 + 非谓语侧重" : "B · 非限定从句 + 具象化侧重";
  const sideColor = side === "a" ? "#0891b2" : "#c2410c";
  const sideBg = side === "a" ? "#ecfeff" : "#fff7ed";
  const sideEmoji = side === "a" ? "🔵" : "🟠";

  const totalClicked = highlights.filter((_, i) => clickedIds.has(i)).length;

  // Build list of marked labels for display below sentence
  const markedLabels = [];
  sortedHL.forEach((hl, idx) => {
    if (clickedIds.has(idx)) {
      const typeMeta = HIGHLIGHT_TYPES[hl.type] || { color: accentColor, bg: accentColor + "20", label: hl.type };
      markedLabels.push({ hlIndex: idx, type: hl.type, label: hl.label, color: typeMeta.color, bg: typeMeta.bg, typeLabel: typeMeta.label });
    }
  });

  const handleDragOver = (e, hlIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOverZone && setDragOverZone(`${side}-${hlIndex}`);
  };

  const handleDragLeave = () => {
    setDragOverZone && setDragOverZone(null);
  };

  const handleDrop = (e, hlIndex) => {
    e.preventDefault();
    setDragOverZone && setDragOverZone(null);
    const dragType = e.dataTransfer.getData("application/highlight-type");
    if (dragType) {
      onDrop && onDrop(hlIndex, dragType);
    }
  };

  return (
    <div style={{
      ...DS.sentenceCard,
      borderColor: accentColor + "30",
      background: "#fff",
    }}>
      {/* Side tag header */}
      <div style={DS.sentenceCardHeader}>
        <span style={{ ...DS.sideTag, background: sideBg, color: sideColor, border: `1px solid ${sideColor}30` }}>
          {sideEmoji} {sideLabel}
        </span>
        <span style={DS.markCount}>
          已标记 {totalClicked}/{highlights.length}
          {totalClicked >= 2 && <span style={{ color: "#15803d", marginLeft: 4 }}>✓</span>}
        </span>
      </div>

      {/* Sentence text with highlight zones */}
      <div style={DS.sentenceText}>
        {segments.map((seg, i) => {
          if (!seg.isHighlight) {
            return <span key={i} style={{ color: "#334155" }}>{seg.text}</span>;
          }
          const isClicked = clickedIds.has(seg.hlIndex);
          const isDragOver = dragOverZone === `${side}-${seg.hlIndex}`;
          const typeMeta = HIGHLIGHT_TYPES[seg.type] || { color: accentColor, bg: accentColor + "20" };
          return (
            <span
              key={i}
              onClick={() => onToggle(seg.hlIndex)}
              onDragOver={(e) => handleDragOver(e, seg.hlIndex)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, seg.hlIndex)}
              style={{
                ...DS.highlightZone,
                background: isDragOver
                  ? typeMeta.bg
                  : isClicked
                    ? `linear-gradient(180deg, transparent 60%, ${typeMeta.bg} 60%)`
                    : "transparent",
                borderBottom: isClicked
                  ? `2.5px solid ${typeMeta.color}`
                  : isDragOver
                    ? `2.5px dashed ${typeMeta.color}`
                    : `2px dotted #cbd5e1`,
                cursor: "pointer",
                position: "relative",
                transition: "all 0.25s ease",
                padding: "2px 3px",
                borderRadius: isClicked || isDragOver ? 4 : 3,
                boxShadow: isDragOver ? `0 0 0 3px ${typeMeta.bg}` : "none",
                transform: isDragOver ? "scale(1.03)" : "scale(1)",
              }}
              title={
                isClicked
                  ? `✓ ${typeMeta.label} — 点击取消`
                  : "👆 点击标记，或从右侧拖入标签"
              }
            >
              {seg.text}
            </span>
          );
        })}
      </div>

      {/* Marked labels area — shown below sentence text */}
      {markedLabels.length > 0 && (
        <div style={DS.markedLabelsArea}>
          <div style={DS.markedLabelsTitle}>📌 已标记的结构</div>
          <div style={DS.markedLabelsList}>
            {markedLabels.map((ml) => (
              <span
                key={ml.hlIndex}
                style={{
                  ...DS.markedLabelChip,
                  background: ml.bg,
                  color: ml.color,
                  border: `1px solid ${ml.color}40`,
                }}
                onClick={() => onToggle(ml.hlIndex)}
                title="点击移除标记"
              >
                <span style={DS.markedLabelType}>{ml.typeLabel}</span>
                <span style={DS.markedLabelText}>{ml.label.split("—")[0]?.trim() || ml.label.slice(0, 25)}</span>
                <span style={DS.markedLabelRemove}>×</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hint when nothing marked */}
      {totalClicked === 0 && (
        <div style={DS.emptyMarkHint}>
          💡 点击句中虚线标注的文字，或从右侧 <strong>技巧图例</strong> 拖入标签来标记亮点
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DISCOVERY ESSAY PREVIEW (shown after all 9 sentences completed)
// ─────────────────────────────────────────────────────────────────────────────
function DiscoveryEssayPreview({ topic, discoveryChoices, onEnterWrite, onRestart }) {
  const sentences = topic.sentences;
  const essay = [topic.opening, ...sentences.map(s => {
    const choice = discoveryChoices[s.id];
    if (!choice) return "[未选择]";
    return s.discovery[choice].text;
  })];
  const fullText = essay.join(" ");
  const wc = fullText.trim().split(/\s+/).filter(w => w.length > 0).length;

  const aCount = Object.values(discoveryChoices).filter(c => c === "a").length;
  const bCount = Object.values(discoveryChoices).filter(c => c === "b").length;

  return (
    <div style={DS.previewShell}>
      <div style={DS.previewHero}>
        <div style={DS.previewHeroIcon}>🎉</div>
        <div style={DS.previewHeroTitle}>恭喜完成认知发现！</div>
        <div style={DS.previewHeroSub}>
          你从每句位置的两个优质表达中选择了自己喜欢的风格，
          组合成了一篇完整的文章。
        </div>
        <div style={DS.previewStats}>
          <span style={DS.previewStat}>📝 {wc} 词</span>
          <span style={DS.previewStat}>🔵 A风格 ×{aCount}</span>
          <span style={DS.previewStat}>🟠 B风格 ×{bCount}</span>
        </div>
      </div>

      <div style={DS.previewEssayCard}>
        <div style={DS.previewEssayTitle}>📄 你的发现版文章</div>
        <div style={DS.previewEssayBody}>
          <span style={{ color: topic.accent, fontWeight: 700 }}>{topic.opening} </span>
          {sentences.map((s, i) => {
            const choice = discoveryChoices[s.id];
            const styleColor = choice === "a" ? "#0891b2" : "#c2410c";
            return (
              <span key={s.id}>
                <span style={{
                  ...DS.previewStyleTag,
                  background: styleColor,
                }}>
                  {choice === "a" ? "A" : "B"}
                </span>
                <span style={{ color: "#1e293b" }}>
                  {s.discovery[choice]?.text || "[未选择]"}{" "}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      <div style={DS.previewActions}>
        <button onClick={onEnterWrite} style={{ ...DS.previewBtn, background: topic.accent }}>
          ✍️ 进入写作模式 — 用自己的语言写一遍
        </button>
        <button onClick={onRestart} style={{ ...DS.previewBtn, background: "#64748b" }}>
          🔄 重新发现
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DISCOVERY SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function DiscoveryScreen({ topic, onComplete, onBack }) {
  const sentences = topic.sentences;
  const [curIdx, setCurIdx] = useState(0);
  const [choices, setChoices] = useState({});   // { [sentId]: "a" | "b" }
  const [highlights, setHighlights] = useState({}); // { [sentId]: { a: Set, b: Set } }
  const [showPreview, setShowPreview] = useState(false);
  const [dragOverZone, setDragOverZone] = useState(null); // track which zone has drag hover

  const sentData = sentences[curIdx];
  const discovery = sentData.discovery;
  const currentHL = highlights[sentData.id] || { a: new Set(), b: new Set() };

  const aClicked = currentHL.a || new Set();
  const bClicked = currentHL.b || new Set();
  const totalClicked = aClicked.size + bClicked.size;
  const canChoose = totalClicked >= 2;

  const handleHighlightToggle = (side, hlIdx) => {
    setHighlights(prev => {
      const current = prev[sentData.id] || { a: new Set(), b: new Set() };
      const sideSet = new Set(current[side]);
      if (sideSet.has(hlIdx)) {
        sideSet.delete(hlIdx);
      } else {
        sideSet.add(hlIdx);
      }
      return { ...prev, [sentData.id]: { ...current, [side]: sideSet } };
    });
  };

  // Handle drop from legend panel onto a highlight zone
  const handleDropOnZone = (side, hlIdx, dragType) => {
    // Mark the zone regardless of whether the dragged type matches
    setHighlights(prev => {
      const current = prev[sentData.id] || { a: new Set(), b: new Set() };
      const sideSet = new Set(current[side]);
      sideSet.add(hlIdx);
      return { ...prev, [sentData.id]: { ...current, [side]: sideSet } };
    });
  };

  const handleChoose = (side) => {
    if (!canChoose) return;
    setChoices(prev => ({ ...prev, [sentData.id]: side }));
    if (curIdx < sentences.length - 1) {
      setCurIdx(curIdx + 1);
    } else {
      onComplete(choices);
    }
  };

  const completedCount = Object.keys(choices).length;
  const total = sentences.length;

  // If all done, show preview
  if (showPreview || completedCount === total) {
    return (
      <DiscoveryEssayPreview
        topic={topic}
        discoveryChoices={choices}
        onEnterWrite={() => onComplete(choices)}
        onRestart={() => { setChoices({}); setHighlights({}); setCurIdx(0); setShowPreview(false); }}
      />
    );
  }

  return (
    <div style={S.shell}>
      {/* Header */}
      <div style={{ ...S.bar, background: topic.accent }}>
        <div style={S.barLeft}>
          <button onClick={onBack} style={S.backBtn}>← 返回</button>
          <span style={S.barTitle}>{topic.emoji} {topic.title}</span>
          <span style={S.barSub}>{topic.year} · 认知发现模式</span>
        </div>
        <div style={S.barRight}>
          <div style={S.progTrack}>
            <div style={{ ...S.progFill, width: `${(completedCount/total)*100}%`, background: "rgba(255,255,255,0.9)" }} />
          </div>
          <span style={S.progLabel}>{completedCount}/{total}句</span>
          {completedCount > 0 && (
            <button onClick={() => setShowPreview(true)} style={{ ...S.helpBtn, background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 11, padding: "4px 10px" }}>
              📄 预览
            </button>
          )}
        </div>
      </div>

      <div style={S.body}>
        {/* Left Nav */}
        <div style={S.nav}>
          <div style={S.navLabel}>发现进度</div>
          <div style={{ ...S.navItem, background: topic.light, borderLeft: `3px solid ${topic.accent}`, cursor: "default" }}>
            <span style={{ ...S.navNum, background: topic.accent }}>①</span>
            <span style={S.navRole}>开头句（已给）</span>
            <span style={{ color: "#15803d" }}>✓</span>
          </div>
          {sentences.map((s, i) => {
            const chosen = choices[s.id];
            const active = i === curIdx;
            return (
              <button
                key={s.id}
                onClick={() => !chosen && setCurIdx(i)}
                style={{
                  ...S.navItem,
                  ...(active ? { background: topic.light, borderLeft: `3px solid ${topic.accent}` } : {}),
                  ...(chosen && !active ? { background: "#f0fdf4" } : {}),
                  cursor: chosen ? "default" : "pointer",
                }}
              >
                <span style={{
                  ...S.navNum,
                  background: active ? topic.accent : chosen ? "#15803d" : "#e2e8f0",
                  color: (active || chosen) ? "#fff" : "#64748b",
                }}>
                  {i + 2}
                </span>
                <span style={{ ...S.navRole, fontWeight: active ? 700 : 400 }}>{s.role}</span>
                {chosen && <span style={{ fontSize: 11, color: chosen === "a" ? "#0891b2" : "#c2410c", fontWeight: 700 }}>{chosen === "a" ? "A" : "B"}</span>}
              </button>
            );
          })}
        </div>

        {/* Center */}
        <div style={S.center}>
          {/* Given sentence */}
          <div style={{ ...S.givenBox, borderColor: topic.accent, background: topic.light }}>
            <span style={{ ...S.givenTag, background: topic.accent }}>①题目已给</span>
            <span style={S.givenText}>{topic.opening}</span>
          </div>

          {/* Position header */}
          <div style={DS.positionHeader}>
            <span style={{ ...DS.positionBadge, background: topic.accent }}>
              第 {curIdx + 2} 句 · {sentData.role}
            </span>
            <span style={DS.positionHint}>
              💡 仔细阅读AB两句，点击标亮文字或从右侧拖入标签来标记亮点。每句至少标记 2 个。
            </span>
          </div>

          {/* Two sentences — stacked vertically */}
          <div style={DS.compareCol}>
            <HighlightSentence
              text={discovery.a.text}
              highlights={discovery.a.highlights}
              clickedIds={aClicked}
              onToggle={(idx) => handleHighlightToggle("a", idx)}
              onDrop={(idx, type) => handleDropOnZone("a", idx, type)}
              accentColor="#0891b2"
              side="a"
              dragOverZone={dragOverZone}
              setDragOverZone={setDragOverZone}
            />
            <div style={DS.sentenceDivider}>
              <span style={DS.dividerLine} />
              <span style={DS.dividerText}>对比选择</span>
              <span style={DS.dividerLine} />
            </div>
            <HighlightSentence
              text={discovery.b.text}
              highlights={discovery.b.highlights}
              clickedIds={bClicked}
              onToggle={(idx) => handleHighlightToggle("b", idx)}
              onDrop={(idx, type) => handleDropOnZone("b", idx, type)}
              accentColor="#c2410c"
              side="b"
              dragOverZone={dragOverZone}
              setDragOverZone={setDragOverZone}
            />
          </div>

          {/* Style choice buttons */}
          <div style={DS.choiceRow}>
            <button
              onClick={() => handleChoose("a")}
              disabled={!canChoose}
              style={{
                ...DS.choiceBtn,
                background: canChoose ? "#0891b2" : "#e2e8f0",
                color: canChoose ? "#fff" : "#94a3b8",
                cursor: canChoose ? "pointer" : "not-allowed",
                opacity: canChoose ? 1 : 0.6,
              }}
            >
              🔵 选择 A 风格（副词 + 非谓语侧重）
            </button>
            <button
              onClick={() => handleChoose("b")}
              disabled={!canChoose}
              style={{
                ...DS.choiceBtn,
                background: canChoose ? "#c2410c" : "#e2e8f0",
                color: canChoose ? "#fff" : "#94a3b8",
                cursor: canChoose ? "pointer" : "not-allowed",
                opacity: canChoose ? 1 : 0.6,
              }}
            >
              🟠 选择 B 风格（非限定从句 + 具象化侧重）
            </button>
          </div>
          {!canChoose && (
            <div style={DS.choiceHint}>
              ⚠️ 请先在两句中标记至少 {2 - totalClicked} 个亮点，才能选择风格
            </div>
          )}

          {/* Navigation */}
          <div style={DS.navRow}>
            {curIdx > 0 && (
              <button onClick={() => setCurIdx(i => i - 1)} style={S.ghostBtn}>
                ← 上一句
              </button>
            )}
            {curIdx < total - 1 && (
              <button
                onClick={() => setCurIdx(i => i + 1)}
                style={S.ghostBtn}
              >
                跳过，下一句 →
              </button>
            )}
          </div>
        </div>

        {/* Right legend — with draggable marker chips */}
        <div style={S.help}>
          <div style={S.helpBody}>
            <div style={S.helpTitle}>📚 技巧图例（可拖入标记）</div>
            <div style={DS.legendHint}>
              👆 拖拽标签到句中标亮文字上，或直接点击文字标记
            </div>
            {Object.entries(HIGHLIGHT_TYPES).slice(0, 8).map(([key, meta]) => (
              <div
                key={key}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/highlight-type", key);
                  e.dataTransfer.effectAllowed = "copy";
                  e.currentTarget.style.opacity = "0.5";
                }}
                onDragEnd={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
                style={DS.draggableLegendItem}
                title={`拖拽 "${meta.label}" 到句子中的标亮区域`}
              >
                <span style={{ ...DS.legendDot, background: meta.color }} />
                <span style={DS.legendLabel}>{meta.label}</span>
                <span style={DS.dragHandle}>⠿</span>
              </div>
            ))}

            <div style={{ ...S.helpTitle, marginTop: 16 }}>🔍 标记进度</div>
            <div style={DS.legendCount}>
              <div style={DS.progressRow}>
                <span style={{ ...DS.progressDot, background: "#0891b2" }} />
                <span>A 句：{aClicked.size}/{discovery.a.highlights.length}</span>
              </div>
              <div style={{ ...DS.progressRow, marginTop: 6 }}>
                <span style={{ ...DS.progressDot, background: "#c2410c" }} />
                <span>B 句：{bClicked.size}/{discovery.b.highlights.length}</span>
              </div>
              <div style={{ marginTop: 10, fontWeight: 700, color: canChoose ? "#15803d" : "#be123c", fontSize: 13 }}>
                {canChoose ? "✅ 可以选择了！" : `⚠️ 还需标记 ${2 - totalClicked} 个`}
              </div>
            </div>

            <div style={{ ...S.helpTitle, marginTop: 16 }}>💡 当前句子功能</div>
            <div style={DS.legendCount}>
              <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 13 }}>{sentData.role}</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{sentData.tip}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function WritingSystem() {
  const [screen, setScreen] = useState("home"); // home | discovery | write | report
  const [topicIdx, setTopicIdx] = useState(null);
  const [curIdx, setCurIdx] = useState(0);
  const [sentences, setSentences] = useState({});
  const [feedback, setFeedback] = useState({});
  const [checking, setChecking] = useState({});
  const [helpLevel, setHelpLevel] = useState(2);
  const [activeTab, setActiveTab] = useState("vocab");
  const [fullEval, setFullEval] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [discoveryChoices, setDiscoveryChoices] = useState(null); // saved after discovery mode
  const [reasoningAnswers, setReasoningAnswers] = useState({}); // { [sentId]: { answers } }

  const topic = topicIdx !== null ? TOPICS[topicIdx] : null;

  const wordCount = useCallback(() => {
    if (!topic) return 0;
    const all = [topic.opening, ...topic.sentences.map(s => sentences[s.id] || "")].join(" ");
    return all.trim().split(/\s+/).filter(w => w.length > 0).length;
  }, [topic, sentences]);

  const completedCount = useCallback(() => {
    if (!topic) return 0;
    return topic.sentences.filter(s => (sentences[s.id] || "").trim().length > 5).length;
  }, [topic, sentences]);

  // ── Discovery flow ──
  const startDiscovery = (idx) => {
    setTopicIdx(idx);
    setCurIdx(0);
    setSentences({});
    setFeedback({});
    setChecking({});
    setFullEval(null);
    setShowPreview(false);
    setDiscoveryChoices(null);
    setReasoningAnswers({});
    setScreen("discovery");
  };

  const onDiscoveryComplete = (choices) => {
    setDiscoveryChoices(choices);
    // Transition to write mode
    setCurIdx(0);
    setSentences({});
    setFeedback({});
    setChecking({});
    setFullEval(null);
    setShowPreview(false);
    setReasoningAnswers({});
    setScreen("write");
  };

  // ── Direct write flow (skip discovery) ──
  const startWrite = (idx) => {
    setTopicIdx(idx);
    setCurIdx(0);
    setSentences({});
    setFeedback({});
    setChecking({});
    setFullEval(null);
    setShowPreview(false);
    setDiscoveryChoices(null);
    setReasoningAnswers({});
    setScreen("write");
  };

  const checkSentence = async (sentData) => {
    const text = (sentences[sentData.id] || "").trim();
    if (text.length < 3) return;
    setChecking(p => ({ ...p, [sentData.id]: true }));
    try {
      const result = await getAIFeedback(text, sentData, topic.title, sentences, helpLevel);
      setFeedback(p => ({ ...p, [sentData.id]: result }));
    } catch(e) {
      setFeedback(p => ({ ...p, [sentData.id]: {
        verdict:"基础句", score:1,
        issues:["AI反馈暂时不可用，请检查网络。"],
        strengths:[], suggestion:"", grammarNote:""
      }}));
    }
    setChecking(p => ({ ...p, [sentData.id]: false }));
  };

  const runFullEval = async () => {
    setEvalLoading(true);
    try {
      const result = await getAIFullEval(topic, sentences, topic.opening);
      setFullEval(result);
      setScreen("report");
    } catch(e) {
      setFullEval({ overallScore:0, grade:"N/A", contentScore:0, languageScore:0, structureScore:0,
        strengths:[], weaknesses:["全文评估暂时不可用，请检查网络。"], topSuggestion:"", improvedOpening:"" });
      setScreen("report");
    }
    setEvalLoading(false);
  };

  // ── Screen routing ──
  if (screen === "home") return (
    <HomeScreen
      topics={TOPICS}
      helpLevel={helpLevel}
      setHelpLevel={setHelpLevel}
      onStartDiscovery={startDiscovery}
    />
  );

  if (screen === "discovery") return (
    <DiscoveryScreen
      topic={topic}
      onComplete={onDiscoveryComplete}
      onBack={() => setScreen("home")}
    />
  );

  if (screen === "report") return (
    <ReportScreen
      topic={topic}
      sentences={sentences}
      fullEval={fullEval}
      feedback={feedback}
      discoveryChoices={discoveryChoices}
      onBack={() => setScreen("write")}
      onHome={() => setScreen("home")}
    />
  );

  // ── Write screen ──
  const sentData = topic.sentences[curIdx];
  const wc = wordCount();
  const cc = completedCount();
  const total = topic.sentences.length;
  const fb = feedback[sentData.id];
  const isChecking = checking[sentData.id];
  const wcColor = wc >= 100 && wc <= 125 ? "#15803d" : wc > 125 ? "#b45309" : "#be123c";

  return (
    <div style={S.shell}>
      {/* ── HEADER ── */}
      <div style={{ ...S.bar, background: topic.accent }}>
        <div style={S.barLeft}>
          <button onClick={() => setScreen("home")} style={S.backBtn}>← 返回</button>
          <span style={S.barTitle}>{topic.emoji} {topic.title}</span>
          <span style={S.barSub}>{topic.year} · {topic.theme}</span>
          {discoveryChoices && (
            <span style={{ fontSize: 10, background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: 8, color: "#fff" }}>
              📖 已通过认知发现
            </span>
          )}
        </div>
        <div style={S.barRight}>
          <span style={{ ...S.wcBadge, color: wcColor, background: "#fff" }}>{wc} 词</span>
          <div style={S.progTrack}>
            <div style={{ ...S.progFill, width:`${(cc/total)*100}%`, background:"rgba(255,255,255,0.9)" }} />
          </div>
          <span style={S.progLabel}>{cc}/{total}句</span>
          <div style={S.helpToggle}>
            {[2,1,0].map(l => (
              <button key={l} onClick={() => setHelpLevel(l)}
                style={{ ...S.helpBtn, ...(helpLevel===l ? { background:"#fff", color:topic.accent, fontWeight:700 } : {}) }}>
                {l===2?"全辅":l===1?"半辅":"自主"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={S.body}>
        {/* ── LEFT NAV ── */}
        <div style={S.nav}>
          <div style={S.navLabel}>句子进度</div>
          <div style={{ ...S.navItem, background: topic.light, borderLeft:`3px solid ${topic.accent}`, cursor:"default" }}>
            <span style={{ ...S.navNum, background:topic.accent }}>①</span>
            <span style={S.navRole}>开头句（已给）</span>
            <span style={{ color:"#15803d" }}>✓</span>
          </div>
          {topic.sentences.map((s, i) => {
            const done = (sentences[s.id]||"").trim().length > 5;
            const sfb = feedback[s.id];
            const active = i === curIdx;
            return (
              <button key={s.id} onClick={() => setCurIdx(i)} style={{
                ...S.navItem,
                ...(active ? { background:topic.light, borderLeft:`3px solid ${topic.accent}` } : {}),
                ...(done && !active ? { background:"#f8fafc" } : {}),
              }}>
                <span style={{ ...S.navNum, background: active ? topic.accent : done ? "#94a3b8" : "#e2e8f0", color: (active||done) ? "#fff" : "#64748b" }}>{i+2}</span>
                <span style={{ ...S.navRole, fontWeight: active ? 700 : 400 }}>{s.role}</span>
                {sfb && <span style={{ fontSize:13 }}>{SCORE_META[sfb.score]?.icon}</span>}
              </button>
            );
          })}
          <button onClick={() => setShowPreview(p => !p)} style={{ ...S.navItem, marginTop:8, justifyContent:"center", background:"#f1f5f9", border:"1px dashed #cbd5e1" }}>
            {showPreview ? "▲ 收起预览" : "▼ 全文预览"}
          </button>
        </div>

        {/* ── CENTER ── */}
        <div style={S.center}>
          {/* Given sentence */}
          <div style={{ ...S.givenBox, borderColor: topic.accent, background: topic.light }}>
            <span style={{ ...S.givenTag, background: topic.accent }}>①题目已给</span>
            <span style={S.givenText}>{topic.opening}</span>
          </div>

          {/* Editor card */}
          <div style={{ ...S.card, borderTop:`4px solid ${topic.accent}` }}>
            <div style={S.cardHead}>
              <span style={{ ...S.numBadge, background:topic.accent }}>第 {curIdx+2} 句</span>
              <span style={S.roleBadge}>{sentData.role}</span>
              {helpLevel >= 1 && <span style={S.gramTag}>📌 {sentData.grammar}</span>}
            </div>

            {helpLevel >= 1 && (
              <div style={S.tipRow}>
                <span style={S.tipIcon}>💡</span>
                <span style={S.tipText}>{sentData.tip}</span>
              </div>
            )}

            {/* Reasoning Chain — pre-writing thinking scaffold */}
            {helpLevel >= 1 && sentData.chainType && (
              <ReasoningChain
                chainType={sentData.chainType}
                sentData={sentData}
                topicTitle={topic.title}
                helpLevel={helpLevel}
                onComplete={(answers) => {
                  setReasoningAnswers(prev => ({ ...prev, [sentData.id]: answers }));
                }}
                onSkip={() => {}}
              />
            )}

            <textarea
              value={sentences[sentData.id] || ""}
              onChange={e => setSentences(p => ({ ...p, [sentData.id]: e.target.value }))}
              placeholder={`在此写第 ${curIdx+2} 句（${sentData.role}）...`}
              style={{ ...S.ta, borderColor: fb ? (SCORE_META[fb.score]?.color || "#e2e8f0") : "#e2e8f0" }}
              rows={3}
            />

            <div style={S.actions}>
              <button
                onClick={() => checkSentence(sentData)}
                disabled={isChecking || !(sentences[sentData.id]||"").trim()}
                style={{ ...S.primaryBtn, background: topic.accent, opacity: isChecking||!(sentences[sentData.id]||"").trim() ? 0.5 : 1 }}>
                {isChecking ? "🔄 AI分析中..." : "🔍 AI检测有效句"}
              </button>
              {curIdx > 0 && <button onClick={() => setCurIdx(i=>i-1)} style={S.ghostBtn}>← 上一句</button>}
              {curIdx < total-1 && <button onClick={() => setCurIdx(i=>i+1)} style={S.ghostBtn}>下一句 →</button>}
              {curIdx === total-1 && (
                <button onClick={runFullEval} disabled={evalLoading} style={{ ...S.primaryBtn, background:"#15803d", opacity:evalLoading?0.5:1 }}>
                  {evalLoading ? "⏳ 评估中..." : "📊 全文AI评估"}
                </button>
              )}
            </div>

            {/* AI Feedback */}
            {fb && (
              <div style={{ ...S.fbBox, background: SCORE_META[fb.score]?.bg, borderColor: SCORE_META[fb.score]?.color }}>
                <div style={S.fbHeader}>
                  <span style={{ ...S.fbVerdict, color: SCORE_META[fb.score]?.color }}>
                    {SCORE_META[fb.score]?.icon} {fb.verdict}
                  </span>
                  <span style={S.fbStars}>{"★".repeat(fb.score)}{"☆".repeat(3-fb.score)}</span>
                </div>
                {fb.strengths?.length > 0 && (
                  <div style={S.fbSection}>
                    <div style={S.fbSectionTitle}>✅ 优点</div>
                    {fb.strengths.map((s,i) => <div key={i} style={{ ...S.fbItem, color:"#15803d" }}>{s}</div>)}
                  </div>
                )}
                {fb.issues?.length > 0 && (
                  <div style={S.fbSection}>
                    <div style={S.fbSectionTitle}>⚠️ 问题</div>
                    {fb.issues.map((s,i) => <div key={i} style={{ ...S.fbItem, color:"#be123c" }}>{s}</div>)}
                  </div>
                )}
                {fb.grammarNote && (
                  <div style={S.fbGrammar}>📚 语法点：{fb.grammarNote}</div>
                )}
                {fb.suggestion && helpLevel >= 1 && (
                  <div style={S.fbSuggest}>
                    <span style={S.fbSuggestLabel}>✏️ 改写参考（请用自己的语言改写）：</span>
                    <span style={S.fbSuggestText}>{fb.suggestion}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Essay preview */}
          {showPreview && (
            <div style={S.previewCard}>
              <div style={S.previewTitle}>📝 全文预览</div>
              <div style={S.previewText}>
                <span style={{ color:topic.accent, fontWeight:600 }}>{topic.opening} </span>
                {topic.sentences.map((s,i) => (
                  <span key={s.id} style={{ color: sentences[s.id] ? "#1e293b" : "#cbd5e1", fontStyle: sentences[s.id] ? "normal" : "italic" }}>
                    {sentences[s.id] || `[第${i+2}句]`}{" "}
                  </span>
                ))}
              </div>
              <div style={S.previewWC}>字数：<strong style={{ color: wcColor }}>{wc}</strong> / 目标 100-120 词</div>
            </div>
          )}
        </div>

        {/* ── RIGHT HELP PANEL ── */}
        {helpLevel >= 1 && (
          <div style={S.help}>
            <div style={S.helpTabs}>
              {[["vocab","📚 词汇"],["pattern","✏️ 句型"],["grammar","🔧 语法"]].map(([k,label]) => (
                <button key={k} onClick={() => setActiveTab(k)}
                  style={{ ...S.helpTab, ...(activeTab===k ? { borderBottom:`2px solid ${topic.accent}`, color:topic.accent, fontWeight:700 } : {}) }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={S.helpBody}>
              {activeTab === "vocab" && (
                <>
                  <div style={S.helpTitle}>本句核心词汇</div>
                  {sentData.vocab.map((grp, gi) => (
                    <div key={gi} style={S.chipRow}>
                      {grp.split(",").map(w => w.trim()).filter(Boolean).map(w => (
                        <span key={w} style={{ ...S.chip, background: topic.light, color: topic.accent }}>{w}</span>
                      ))}
                    </div>
                  ))}
                </>
              )}
              {activeTab === "pattern" && (
                <>
                  <div style={S.helpTitle}>推荐句型</div>
                  {sentData.patterns.map((p,i) => (
                    <div key={i} style={S.patItem}>
                      <span style={{ ...S.patNum, background:topic.accent }}>{i+1}</span>
                      <span style={S.patText}>{p}</span>
                    </div>
                  ))}
                  {helpLevel === 2 && (
                    <div style={S.patHint}>
                      <span style={S.patHintIcon}>🤖</span>
                      <span style={S.patHintText}>以上句型仅供参考框架，请加入自己的具体内容并用自己的语言改写！</span>
                    </div>
                  )}
                </>
              )}
              {activeTab === "grammar" && (
                <>
                  <div style={S.helpTitle}>本句语法目标</div>
                  <div style={{ ...S.gramBox, borderColor: topic.accent, background: topic.light }}>
                    <div style={{ fontWeight:700, marginBottom:6, color: topic.accent }}>🎯 目标语法点</div>
                    <div style={{ fontSize:13, color:"#1e293b", lineHeight:1.7 }}>{sentData.grammar}</div>
                  </div>
                  <div style={S.helpTitle}>有效句 vs 无效句</div>
                  <table style={{ width:"100%", fontSize:12, borderCollapse:"collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ background:"#dcfce7", padding:"6px 8px", textAlign:"left", borderRadius:"4px 0 0 0" }}>✅ 有效句特征</th>
                        <th style={{ background:"#ffe4e6", padding:"6px 8px", textAlign:"left", borderRadius:"0 4px 0 0" }}>❌ 无效句特征</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["含有连词/关系词","无连词，句子孤立"],
                        ["有副词/形容词修饰","干燥，无任何修饰"],
                        ["体现目标语法点","与语法目标无关"],
                        ["具体细节，非模板","'I like...It is good'"],
                        ["10词以上，信息丰富","过短，信息量极少"],
                      ].map(([good,bad],i) => (
                        <tr key={i} style={{ background: i%2===0?"#f8fafc":"#fff" }}>
                          <td style={{ padding:"5px 8px", color:"#15803d" }}>{good}</td>
                          <td style={{ padding:"5px 8px", color:"#be123c" }}>{bad}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function HomeScreen({ topics, helpLevel, setHelpLevel, onStartDiscovery }) {
  return (
    <div style={{ fontFamily:"'Noto Sans SC','Segoe UI',sans-serif", background:"#f8fafc", minHeight:"100vh" }}>
      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1d4ed8 100%)", padding:"40px 32px 32px", color:"#fff" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ fontSize:36, fontWeight:900, letterSpacing:2, marginBottom:8 }}>✍️ 中考英语写作训练营</div>
          <div style={{ fontSize:15, opacity:0.8, marginBottom:24 }}>Wuhan ZHONGKAO Writing Pro · 认知发现 → 自主写作 → AI智能评估</div>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ fontSize:13, opacity:0.7 }}>辅助强度：</span>
            {[2,1,0].map(l => (
              <button key={l} onClick={() => setHelpLevel(l)} style={{
                padding:"6px 18px", borderRadius:20, border:"1.5px solid rgba(255,255,255,0.5)",
                background: helpLevel===l ? "#fff" : "transparent",
                color: helpLevel===l ? "#1e1b4b" : "#fff",
                fontWeight: helpLevel===l ? 700 : 400, cursor:"pointer", fontSize:13,
              }}>
                {l===2?"🌟 全辅助":l===1?"💡 半辅助":"🏋️ 自主模式"}
              </button>
            ))}
            <span style={{ fontSize:12, opacity:0.6, marginLeft:8 }}>
              {helpLevel===2?"提供完整词汇/句型/语法提示 + AI反馈":helpLevel===1?"提供部分提示 + AI反馈":"仅AI反馈，适合备考冲刺"}
            </span>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ fontSize:20, fontWeight:700, color:"#1e293b", marginBottom:6 }}>选择题目 · Choose a Topic</div>
        <div style={{ fontSize:13, color:"#64748b", marginBottom:24 }}>
          每题包含两个学习阶段：<strong>认知发现</strong>（观察AB优质表达，点击或拖拽标记亮点）→ <strong>自主写作</strong>（用自己的语言写，AI评估）
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:20 }}>
          {topics.map((t,i) => (
            <div key={t.id} onClick={() => onStartDiscovery(i)} style={{
              background:"#fff", border:`2px solid ${t.accent}20`, borderRadius:16, padding:24,
              cursor:"pointer", transition:"all 0.15s",
              boxShadow:"0 2px 12px rgba(0,0,0,0.05)",
            }}
              onMouseEnter={e => e.currentTarget.style.transform="translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
            >
              <div style={{ fontSize:40, marginBottom:12 }}>{t.emoji}</div>
              <div style={{ fontSize:11, color:t.accent, fontWeight:700, letterSpacing:1, marginBottom:4 }}>{t.year}</div>
              <div style={{ fontSize:18, fontWeight:800, color:"#1e293b", marginBottom:6 }}>{t.title}</div>
              <div style={{ fontSize:12, color:"#64748b", lineHeight:1.6, marginBottom:16 }}>{t.theme}</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
                {["🔍认知发现","✍️自主写作","🤖AI点评"].map(tag => (
                  <span key={tag} style={{ background:`${t.accent}15`, color:t.accent, padding:"2px 10px", borderRadius:10, fontSize:11, fontWeight:600 }}>{tag}</span>
                ))}
              </div>
              <div style={{ background:t.accent, color:"#fff", padding:"8px 0", borderRadius:10, textAlign:"center", fontSize:13, fontWeight:700 }}>
                开始认知发现 →
              </div>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div style={{ marginTop:40, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
          {[
            ["🔍","认知发现","先观察每句A/B两种优质表达，从右侧拖拽或点击标亮文字标记亮点（副词/非谓语/从句等），培养句型位置感"],
            ["✍️","逐句引导","按9-10句结构逐步完成，每句有专属思路提示和语法目标"],
            ["📚","智能词库","根据句子位置和主题自动推送核心词汇、搭配、句型模板"],
            ["🤖","AI有效句检测","写完后AI即时判断是否有效句，并给出具体改进建议和修改示例"],
            ["📊","全文AI评分","完成后AI按中考评分标准给出内容/语言/结构三维分析报告"],
          ].map(([icon,title,desc]) => (
            <div key={title} style={{ background:"#fff", borderRadius:14, padding:20, boxShadow:"0 1px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize:28, marginBottom:10 }}>{icon}</div>
              <div style={{ fontWeight:700, fontSize:14, color:"#1e293b", marginBottom:6 }}>{title}</div>
              <div style={{ fontSize:12, color:"#64748b", lineHeight:1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORT SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function ReportScreen({ topic, sentences, fullEval, feedback, discoveryChoices, onBack, onHome }) {
  const e = fullEval || {};
  const gradeColor = { A:"#15803d", B:"#1d4ed8", C:"#b45309", D:"#be123c" }[e.grade] || "#64748b";
  const essay = [topic.opening, ...topic.sentences.map(s => sentences[s.id] || "")].filter(Boolean).join(" ");
  const wc = essay.trim().split(/\s+/).filter(w=>w.length>0).length;

  return (
    <div style={{ fontFamily:"'Noto Sans SC','Segoe UI',sans-serif", background:"#f8fafc", minHeight:"100vh" }}>
      <div style={{ background:"linear-gradient(135deg,#14532d,#15803d)", padding:"24px 32px", color:"#fff", display:"flex", alignItems:"center", gap:16 }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.4)", color:"#fff", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:13 }}>← 返回修改</button>
        <button onClick={onHome} style={{ background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.4)", color:"#fff", padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:13 }}>🏠 首页</button>
        <div>
          <div style={{ fontWeight:800, fontSize:20 }}>📊 全文AI评估报告</div>
          <div style={{ fontSize:12, opacity:0.8 }}>{topic.emoji} {topic.title} · {topic.year}</div>
        </div>
        {discoveryChoices && (
          <div style={{ marginLeft:"auto", fontSize:11, background:"rgba(255,255,255,0.15)", padding:"4px 10px", borderRadius:8 }}>
            📖 已完成认知发现
          </div>
        )}
      </div>

      <div style={{ maxWidth:860, margin:"0 auto", padding:"28px 24px", display:"flex", flexDirection:"column", gap:20 }}>

        {/* Score overview */}
        <div style={{ background:"#fff", borderRadius:16, padding:24, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", gap:20, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ textAlign:"center", minWidth:100 }}>
            <div style={{ fontSize:64, fontWeight:900, color:gradeColor, lineHeight:1 }}>{e.grade || "?"}</div>
            <div style={{ fontSize:13, color:"#64748b", marginTop:4 }}>综合等级</div>
          </div>
          <div style={{ flex:1, display:"flex", gap:16, flexWrap:"wrap" }}>
            {[
              ["内容分", e.contentScore, 5, "#1d4ed8"],
              ["语言分", e.languageScore, 5, "#15803d"],
              ["结构分", e.structureScore, 5, "#7e22ce"],
              ["总分", e.overallScore, 15, "#b45309"],
              ["字数", wc, 120, "#0891b2"],
            ].map(([label, val, max, color]) => (
              <div key={label} style={{ minWidth:90, flex:"1 1 90px" }}>
                <div style={{ fontSize:11, color:"#94a3b8", marginBottom:4 }}>{label}</div>
                <div style={{ height:8, background:"#f1f5f9", borderRadius:4, overflow:"hidden", marginBottom:4 }}>
                  <div style={{ height:"100%", width:`${Math.min(100,((val||0)/max)*100)}%`, background:color, borderRadius:4, transition:"width 0.8s" }} />
                </div>
                <div style={{ fontWeight:800, fontSize:18, color }}>{val ?? "?"}<span style={{ fontSize:11, color:"#94a3b8", fontWeight:400 }}>/{max}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:14, padding:18 }}>
            <div style={{ fontWeight:700, color:"#15803d", marginBottom:12 }}>✅ 作文亮点</div>
            {(e.strengths||["(暂无)"]).map((s,i) => <div key={i} style={{ fontSize:13, color:"#1e293b", marginBottom:6, lineHeight:1.6 }}>• {s}</div>)}
          </div>
          <div style={{ background:"#fff1f2", border:"1px solid #fca5a5", borderRadius:14, padding:18 }}>
            <div style={{ fontWeight:700, color:"#be123c", marginBottom:12 }}>⚠️ 需要改进</div>
            {(e.weaknesses||["(暂无)"]).map((s,i) => <div key={i} style={{ fontSize:13, color:"#1e293b", marginBottom:6, lineHeight:1.6 }}>• {s}</div>)}
          </div>
        </div>

        {/* Top suggestion */}
        {e.topSuggestion && (
          <div style={{ background:"#fefce8", border:"1px solid #fde047", borderRadius:14, padding:18 }}>
            <div style={{ fontWeight:700, color:"#854d0e", marginBottom:8 }}>🏆 最重要的一个改进建议</div>
            <div style={{ fontSize:14, color:"#1e293b", lineHeight:1.7 }}>{e.topSuggestion}</div>
          </div>
        )}

        {/* Sentence-by-sentence breakdown */}
        <div style={{ background:"#fff", borderRadius:16, padding:20, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:16, color:"#1e293b" }}>📋 逐句得分明细</div>
          {topic.sentences.map((s, i) => {
            const sfb = feedback[s.id];
            const text = sentences[s.id] || "";
            const meta = sfb ? SCORE_META[sfb.score] : null;
            return (
              <div key={s.id} style={{ padding:"12px 0", borderBottom:"1px solid #f1f5f9" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:text ? 6 : 0 }}>
                  <span style={{ background: meta?.color || "#e2e8f0", color:"#fff", fontSize:11, padding:"2px 8px", borderRadius:8, fontWeight:700, whiteSpace:"nowrap" }}>
                    第{i+2}句 · {s.role}
                  </span>
                  {meta && <span style={{ color:meta.color, fontSize:12, fontWeight:700 }}>{meta.icon} {meta.label}</span>}
                  {!sfb && <span style={{ color:"#94a3b8", fontSize:12 }}>（未检测）</span>}
                </div>
                {text ? <div style={{ fontSize:13, color:"#334155", lineHeight:1.7 }}>{text}</div>
                       : <div style={{ fontSize:13, color:"#cbd5e1", fontStyle:"italic" }}>(未填写)</div>}
                {sfb?.issues?.length > 0 && (
                  <div style={{ marginTop:6 }}>
                    {sfb.issues.map((iss,j) => <div key={j} style={{ fontSize:12, color:"#be123c" }}>↳ {iss}</div>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Full essay */}
        <div style={{ background:"#fff", borderRadius:16, padding:20, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:12, color:"#1e293b" }}>📄 完整作文</div>
          <div style={{ fontSize:14, lineHeight:2.2, color:"#334155" }}>
            <span style={{ color:topic.accent, fontWeight:600 }}>{topic.opening} </span>
            {topic.sentences.map(s => (
              <span key={s.id} style={{ color: sentences[s.id] ? "#1e293b" : "#cbd5e1" }}>
                {sentences[s.id] || `[第${topic.sentences.indexOf(s)+2}句]`}{" "}
              </span>
            ))}
          </div>
          <div style={{ marginTop:12, fontSize:12, color:"#64748b" }}>
            总字数：<strong style={{ color: wc>=100&&wc<=125?"#15803d":"#be123c" }}>{wc}</strong> 词（目标：100-120词）
          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const S = {
  shell: { fontFamily:"'Noto Sans SC','Segoe UI',sans-serif", background:"#f8fafc", minHeight:"100vh", display:"flex", flexDirection:"column" },
  bar: { padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, flexShrink:0 },
  barLeft: { display:"flex", alignItems:"center", gap:12 },
  barRight: { display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" },
  backBtn: { background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.4)", color:"#fff", padding:"5px 12px", borderRadius:8, cursor:"pointer", fontSize:12 },
  barTitle: { fontWeight:800, fontSize:16, color:"#fff" },
  barSub: { fontSize:11, color:"rgba(255,255,255,0.75)" },
  wcBadge: { fontWeight:800, fontSize:14, padding:"4px 12px", borderRadius:12 },
  progTrack: { width:100, height:7, background:"rgba(255,255,255,0.25)", borderRadius:4, overflow:"hidden" },
  progFill: { height:"100%", borderRadius:4, transition:"width 0.3s" },
  progLabel: { fontSize:12, color:"rgba(255,255,255,0.85)" },
  helpToggle: { display:"flex", background:"rgba(255,255,255,0.15)", borderRadius:20, padding:2, gap:2 },
  helpBtn: { border:"none", borderRadius:18, padding:"4px 12px", cursor:"pointer", fontSize:11, color:"rgba(255,255,255,0.85)", background:"transparent" },
  body: { display:"flex", flex:1, overflow:"hidden", height:"calc(100vh - 52px)" },
  nav: { width:156, background:"#fff", borderRight:"1px solid #e2e8f0", overflowY:"auto", padding:"12px 8px", flexShrink:0 },
  navLabel: { fontSize:10, fontWeight:700, color:"#94a3b8", letterSpacing:1, padding:"0 6px 8px", textTransform:"uppercase" },
  navItem: { display:"flex", alignItems:"center", gap:6, padding:"7px 8px", borderRadius:8, marginBottom:3, border:"none", borderLeft:"3px solid transparent", cursor:"pointer", background:"transparent", width:"100%", textAlign:"left" },
  navNum: { width:22, height:22, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 },
  navRole: { flex:1, fontSize:11, color:"#475569" },
  center: { flex:1, overflowY:"auto", padding:18, display:"flex", flexDirection:"column", gap:14 },
  givenBox: { border:"2px solid", borderRadius:12, padding:"10px 14px", display:"flex", gap:10, alignItems:"flex-start" },
  givenTag: { color:"#fff", padding:"2px 10px", borderRadius:10, fontSize:11, fontWeight:700, whiteSpace:"nowrap", marginTop:1, flexShrink:0 },
  givenText: { fontSize:14, fontWeight:600, lineHeight:1.7 },
  card: { background:"#fff", borderRadius:14, padding:18, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" },
  cardHead: { display:"flex", gap:8, alignItems:"center", marginBottom:10, flexWrap:"wrap" },
  numBadge: { color:"#fff", padding:"3px 12px", borderRadius:10, fontSize:12, fontWeight:800 },
  roleBadge: { fontSize:13, fontWeight:600, color:"#334155" },
  gramTag: { fontSize:11, color:"#7c3aed", background:"#f5f3ff", padding:"2px 10px", borderRadius:10, marginLeft:"auto" },
  tipRow: { background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"10px 14px", marginBottom:12, display:"flex", gap:8 },
  tipIcon: { fontSize:16, flexShrink:0 },
  tipText: { fontSize:13, color:"#78350f", lineHeight:1.7 },
  ta: { width:"100%", padding:"12px 14px", fontSize:14, border:"2px solid", borderRadius:10, resize:"vertical", fontFamily:"inherit", lineHeight:1.8, outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" },
  actions: { display:"flex", gap:8, marginTop:10, flexWrap:"wrap" },
  primaryBtn: { color:"#fff", border:"none", borderRadius:9, padding:"9px 18px", cursor:"pointer", fontWeight:700, fontSize:13, transition:"opacity 0.2s" },
  ghostBtn: { background:"#f1f5f9", border:"1px solid #e2e8f0", borderRadius:9, padding:"9px 14px", cursor:"pointer", fontSize:13, color:"#475569" },
  fbBox: { marginTop:14, padding:"14px 16px", borderRadius:12, border:"1.5px solid" },
  fbHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 },
  fbVerdict: { fontWeight:800, fontSize:15 },
  fbStars: { fontSize:18, letterSpacing:2 },
  fbSection: { marginBottom:10 },
  fbSectionTitle: { fontWeight:700, fontSize:12, color:"#475569", marginBottom:5 },
  fbItem: { fontSize:13, lineHeight:1.7, marginBottom:3 },
  fbGrammar: { fontSize:13, color:"#4338ca", background:"#eef2ff", padding:"6px 10px", borderRadius:8, marginTop:8 },
  fbSuggest: { marginTop:10, padding:"10px 12px", background:"rgba(255,255,255,0.7)", borderRadius:9 },
  fbSuggestLabel: { fontSize:12, fontWeight:700, color:"#475569", display:"block", marginBottom:4 },
  fbSuggestText: { fontSize:13, color:"#1e293b", lineHeight:1.7, fontStyle:"italic" },
  previewCard: { background:"#fff", borderRadius:14, padding:16, boxShadow:"0 1px 8px rgba(0,0,0,0.05)" },
  previewTitle: { fontWeight:700, fontSize:13, color:"#475569", marginBottom:10 },
  previewText: { fontSize:13, lineHeight:2.1 },
  previewWC: { fontSize:12, color:"#94a3b8", marginTop:10 },
  help: { width:252, background:"#fff", borderLeft:"1px solid #e2e8f0", display:"flex", flexDirection:"column", overflowY:"auto", flexShrink:0 },
  helpTabs: { display:"flex", borderBottom:"1px solid #e2e8f0", flexShrink:0 },
  helpTab: { flex:1, padding:"10px 2px", border:"none", borderBottom:"2px solid transparent", background:"none", cursor:"pointer", fontSize:11, fontWeight:600, color:"#94a3b8" },
  helpBody: { padding:14, flex:1, overflowY:"auto" },
  helpTitle: { fontSize:11, fontWeight:700, color:"#94a3b8", letterSpacing:0.5, marginBottom:10, textTransform:"uppercase" },
  chipRow: { display:"flex", flexWrap:"wrap", gap:5, marginBottom:8 },
  chip: { padding:"3px 10px", borderRadius:12, fontSize:11.5, fontWeight:500 },
  patItem: { display:"flex", gap:8, marginBottom:12, alignItems:"flex-start" },
  patNum: { color:"#fff", borderRadius:"50%", width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0, marginTop:1 },
  patText: { fontSize:12.5, color:"#334155", lineHeight:1.75, fontStyle:"italic" },
  patHint: { background:"#fffbeb", border:"1px solid #fde68a", borderRadius:8, padding:"8px 10px", display:"flex", gap:6, marginTop:8 },
  patHintIcon: { fontSize:14 },
  patHintText: { fontSize:11, color:"#78350f", lineHeight:1.6 },
  gramBox: { border:"1.5px solid", borderRadius:10, padding:"10px 12px", marginBottom:14 },
};

// ── Discovery-specific styles ──
const DS = {
  positionHeader: { display:"flex", alignItems:"center", gap:12, marginBottom:4 },
  positionBadge: { color:"#fff", padding:"4px 14px", borderRadius:10, fontSize:13, fontWeight:800 },
  positionHint: { fontSize:12, color:"#64748b", lineHeight:1.6 },
  compareCol: { display:"flex", flexDirection:"column", gap:0 },
	  sentenceDivider: { display:"flex", alignItems:"center", gap:12, padding:"6px 0", margin:"4px 0" },
	  dividerLine: { flex:1, height:1, background:"linear-gradient(to right, transparent, #e2e8f0, transparent)" },
	  dividerText: { fontSize:11, color:"#94a3b8", fontWeight:600, whiteSpace:"nowrap" },
  sentenceCard: {
    background:"#fff", borderRadius:14, padding:18, border:"2px solid",
    boxShadow:"0 2px 8px rgba(0,0,0,0.04)", position:"relative",
  },
  sideTag: {
    display:"inline-block", padding:"2px 10px", borderRadius:8,
    fontSize:10, fontWeight:700, marginBottom:10, letterSpacing:0.5,
  },
  sentenceText: {
    fontSize:14.5, lineHeight:2.1, color:"#1e293b", marginBottom:8,
  },
  highlightZone: {
    padding:"1px 2px", borderRadius:3, margin:"0 1px",
  },
  markedLabelsArea: {

    marginTop:16, paddingTop:16,

    borderTop:"1.5px solid #f1f5f9",

  },

  markedLabelsTitle: {

    fontSize:11, fontWeight:700, color:"#64748b", marginBottom:10,

    letterSpacing:0.5, textTransform:"uppercase",

  },

  markedLabelsList: {

    display:"flex", flexWrap:"wrap", gap:8,

  },

  markedLabelChip: {

    display:"inline-flex", alignItems:"center", gap:6,

    padding:"5px 10px", borderRadius:10,

    fontSize:11.5, fontWeight:600,

    cursor:"pointer", transition:"all 0.2s",

    userSelect:"none",

  },

  markedLabelType: {

    fontSize:10, padding:"1px 6px", borderRadius:6,

    background:"rgba(255,255,255,0.7)", fontWeight:700,

  },

  markedLabelText: {

    maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",

  },

  markedLabelRemove: {

    fontSize:14, fontWeight:700, opacity:0.5, marginLeft:2,

  },

  emptyMarkHint: {

    marginTop:14, padding:"10px 14px", background:"#f8fafc",

    borderRadius:10, fontSize:12, color:"#94a3b8",

    textAlign:"center", lineHeight:1.6, border:"1px dashed #e2e8f0",

  },
  choiceRow: { display:"flex", flexDirection:"column", gap:10, marginTop:16 },
  choiceBtn: {
    width:"100%", padding:"14px 20px", borderRadius:14, border:"none",
    fontWeight:700, fontSize:13.5, transition:"all 0.25s",
    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
    letterSpacing:0.3, boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
  },
  choiceHint: {
    textAlign:"center", fontSize:12, color:"#b45309", marginTop:8,
    background:"#fffbeb", padding:"10px 14px", borderRadius:10,
    border:"1px solid #fde68a",
  },
  navRow: { display:"flex", gap:8, marginTop:10, flexWrap:"wrap" },

  // Preview styles
  previewShell: { fontFamily:"'Noto Sans SC','Segoe UI',sans-serif", background:"#f8fafc", minHeight:"100vh" },
  previewHero: { background:"linear-gradient(135deg,#14532d,#15803d)", padding:"48px 32px", color:"#fff", textAlign:"center" },
  previewHeroIcon: { fontSize:64, marginBottom:16 },
  previewHeroTitle: { fontSize:28, fontWeight:900, marginBottom:8 },
  previewHeroSub: { fontSize:14, opacity:0.85, maxWidth:500, margin:"0 auto", lineHeight:1.7 },
  previewStats: { display:"flex", gap:16, justifyContent:"center", marginTop:20, flexWrap:"wrap" },
  previewStat: { background:"rgba(255,255,255,0.15)", padding:"6px 16px", borderRadius:12, fontSize:13 },
  previewEssayCard: { maxWidth:700, margin:"-20px auto 0", background:"#fff", borderRadius:16, padding:24, boxShadow:"0 4px 20px rgba(0,0,0,0.08)", position:"relative", zIndex:1 },
  previewEssayTitle: { fontWeight:700, fontSize:14, color:"#475569", marginBottom:16, paddingBottom:12, borderBottom:"1px solid #f1f5f9" },
  previewEssayBody: { fontSize:14, lineHeight:2.3, color:"#334155" },
  previewStyleTag: { display:"inline-block", color:"#fff", fontSize:9, padding:"1px 5px", borderRadius:4, marginRight:4, fontWeight:700, verticalAlign:"middle" },
  previewActions: { maxWidth:700, margin:"24px auto", display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", padding:"0 32px 48px" },
  previewBtn: { color:"#fff", border:"none", borderRadius:12, padding:"14px 28px", cursor:"pointer", fontWeight:700, fontSize:14 },

  // Draggable legend items


  draggableLegendItem: {


    display:"flex", alignItems:"center", gap:8, marginBottom:6,


    padding:"8px 12px", borderRadius:10,


    background:"#fff", border:"1.5px solid #e2e8f0",


    cursor:"grab", transition:"all 0.2s",


    userSelect:"none",


  },


  dragHandle: {


    fontSize:12, color:"#cbd5e1", marginLeft:"auto", letterSpacing:1,


  },


  legendHint: {


    fontSize:11, color:"#94a3b8", marginBottom:12,


    padding:"8px 10px", background:"#f8fafc", borderRadius:8,


    lineHeight:1.5, textAlign:"center", border:"1px dashed #e2e8f0",


  },



  // Progress tracking in legend


  progressRow: { display:"flex", alignItems:"center", gap:8, fontSize:12 },


  progressDot: { width:8, height:8, borderRadius:"50%", flexShrink:0 },



  // Legend styles
  legendItem: { display:"flex", alignItems:"center", gap:8, marginBottom:6 },
  legendDot: { width:10, height:10, borderRadius:"50%", flexShrink:0 },
  legendLabel: { fontSize:11, color:"#475569", fontWeight:500 },
  legendCount: { background:"#f8fafc", borderRadius:12, padding:"12px 14px", fontSize:12, color:"#334155", lineHeight:1.6 },
};
  // ── Reasoning Chain styles ──
  const RC = {
    shell: { background:"#fff", borderRadius:14, border:"1.5px solid #e2e8f0", marginBottom:14, overflow:"hidden", boxShadow:"0 1px 8px rgba(0,0,0,0.03)" },
    collapsedBar: { display:"flex", alignItems:"center", gap:8, padding:"10px 16px", background:"#f8fafc", border:"1px dashed #cbd5e1", borderRadius:10, cursor:"pointer", marginBottom:14, userSelect:"none", transition:"background 0.2s" },
    collapsedIcon: { fontSize:18 },
    collapsedText: { flex:1, fontSize:13, fontWeight:600, color:"#475569" },
    collapsedArrow: { fontSize:11, color:"#94a3b8" },
    header: { display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:"16px 18px 12px", borderBottom:"1px solid #f1f5f9", flexWrap:"wrap", gap:10 },
    headerLeft: { display:"flex", flexDirection:"column", gap:4, flex:1 },
    headerIcon: { fontSize:22 },
    headerTitle: { fontSize:14, fontWeight:800, color:"#1e293b" },
    headerDesc: { fontSize:11.5, color:"#64748b", lineHeight:1.5 },
    headerRight: { display:"flex", alignItems:"center", gap:8, flexShrink:0 },
    progressTrack: { width:60, height:5, background:"#f1f5f9", borderRadius:3, overflow:"hidden" },
    progressFill: { height:"100%", background:"#15803d", borderRadius:3, transition:"width 0.4s ease" },
    stepCount: { fontSize:11, fontWeight:700, color:"#64748b", whiteSpace:"nowrap" },
    skipBtn: { background:"none", border:"none", color:"#94a3b8", cursor:"pointer", fontSize:11, fontWeight:600, padding:"2px 8px" },
    stepDots: { display:"flex", justifyContent:"center", gap:24, padding:"14px 18px", background:"#fafbfc" },
    dot: { width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, transition:"all 0.3s", flexShrink:0 },
    qaArea: { padding:"16px 18px" },
    questionBubble: { display:"flex", gap:10, marginBottom:14 },
    questionAvatar: { width:32, height:32, borderRadius:"50%", background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 },
    questionContent: { flex:1 },
    questionStep: { fontSize:10, fontWeight:700, color:"#94a3b8", letterSpacing:0.5, textTransform:"uppercase", marginBottom:4 },
    questionText: { fontSize:14, fontWeight:600, color:"#1e293b", lineHeight:1.7, marginBottom:6 },
    questionHint: { fontSize:12, color:"#64748b", lineHeight:1.5, background:"#fffbeb", padding:"6px 10px", borderRadius:8, border:"1px solid #fde68a" },
    timeRequired: { fontSize:11, color:"#b45309", marginTop:6, background:"#fef3c7", padding:"4px 10px", borderRadius:6, display:"inline-block" },
    answerArea: { marginLeft:42 },
    answerInput: { width:"100%", padding:"10px 14px", fontSize:13.5, fontFamily:"inherit", border:"2px solid #e2e8f0", borderRadius:10, resize:"vertical", lineHeight:1.7, outline:"none", boxSizing:"border-box", transition:"border-color 0.2s", background:"#fafbfc" },
    answerActions: { display:"flex", gap:8, marginTop:8, justifyContent:"flex-end" },
    prevBtn: { background:"#f1f5f9", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:12, color:"#475569", fontWeight:600 },
    nextBtn: { background:"#1d4ed8", border:"none", borderRadius:8, padding:"8px 18px", cursor:"pointer", fontSize:12.5, color:"#fff", fontWeight:700, transition:"opacity 0.2s" },
    enterHint: { fontSize:10.5, color:"#cbd5e1", textAlign:"right", marginTop:4 },
    synthesisCard: { padding:"16px 18px", background:"#f0fdf4", borderTop:"2px solid #86efac", borderBottom:"2px solid #86efac" },
    synthesisTitle: { fontSize:12, fontWeight:700, color:"#15803d", marginBottom:12, letterSpacing:0.5 },
    synthesisChain: { fontSize:13, color:"#334155", lineHeight:2, marginBottom:14, background:"#fff", padding:"12px 14px", borderRadius:10, border:"1px solid #dcfce7" },
    synthesisLabel: { fontWeight:700, color:"#1d4ed8", fontSize:10.5, display:"inline-block", padding:"1px 6px", background:"#dbeafe", borderRadius:4, marginRight:4 },
    synthesisAnswer: { color:"#1e293b" },
    synthesisArrow: { color:"#86efac", fontWeight:700, margin:"0 2px" },
    synthesisActions: { display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 },
    synthesisHint: { fontSize:11.5, color:"#15803d", fontWeight:500 },
    resetBtn: { background:"#fff", border:"1px solid #86efac", borderRadius:8, padding:"4px 12px", cursor:"pointer", fontSize:11, color:"#15803d", fontWeight:600 },
    riskNote: { padding:"10px 18px 12px", fontSize:11, color:"#64748b", lineHeight:1.6, borderTop:"1px solid #f1f5f9", background:"#fafbfc" },
  };

import { useState, useRef, useCallback } from "react";
import TOPICS from "./topicData.js";
import { getChain, getSteps, mapRoleToChainType, getPatterns, getRiskNote } from "./reasoningChains.js";
import tokens from "./designTokens.js";

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
            background: i < currentStep ? tokens.color.semantic.success.fg : i === currentStep ? tokens.color.brand.primary : tokens.color.border.default,
            color: i <= currentStep ? tokens.color.card : tokens.color.text.muted,
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
  3: { label:"优秀句", color:tokens.color.dimension.vocab.fg, bg:tokens.color.dimension.vocab.bg, icon:"🌟" },
  2: { label:"良好句", color:tokens.color.dimension.syntax.fg, bg:tokens.color.dimension.syntax.bg, icon:"👍" },
  1: { label:"基础句", color:tokens.color.dimension.logic.fg, bg:tokens.color.dimension.logic.bg, icon:"⚠️" },
  0: { label:"无效句", color:tokens.color.dimension.emotion.fg, bg:tokens.color.dimension.emotion.bg, icon:"❌" },
};

const HIGHLIGHT_TYPES = {
  "non-finite":       { label:"非谓语动词", color: tokens.color.grammar.nonFinite.fg, bg: tokens.color.grammar.nonFinite.bg },
  "adverb":           { label:"副词层", color: tokens.color.grammar.adverb.fg, bg: tokens.color.grammar.adverb.bg },
  "non-restrictive":  { label:"非限定定语从句", color: tokens.color.grammar.nonRestrictive.fg, bg: tokens.color.grammar.nonRestrictive.bg },
  "concrete-imagery": { label:"具象化描写", color: tokens.color.grammar.concreteImagery.fg, bg: tokens.color.grammar.concreteImagery.bg },
  "change-verb":      { label:"Change核动词", color: tokens.color.grammar.changeVerb.fg, bg: tokens.color.grammar.changeVerb.bg },
  "mind-verb":        { label:"Mind核动词", color: tokens.color.grammar.mindVerb.fg, bg: tokens.color.grammar.mindVerb.bg },
  "connector":        { label:"逻辑连接词", color: tokens.color.grammar.connector.fg, bg: tokens.color.grammar.connector.bg },
  "object-clause":    { label:"宾语从句", color: tokens.color.grammar.objectClause.fg, bg: tokens.color.grammar.objectClause.bg },
  "concrete-feeling": { label:"具象感受词", color: tokens.color.grammar.concreteFeeling.fg, bg: tokens.color.grammar.concreteFeeling.bg },
  "specific-detail":  { label:"具体细节", color: tokens.color.grammar.specificDetail.fg, bg: tokens.color.grammar.specificDetail.bg },
  "adverb-action":    { label:"副词+动作", color: tokens.color.grammar.adverbAction.fg, bg: tokens.color.grammar.adverbAction.bg },
  "adj-noun":         { label:"形容词+名词修饰", color: tokens.color.grammar.adjNoun.fg, bg: tokens.color.grammar.adjNoun.bg },
};

// ── Five Score Dimensions (得分点五维体系) ──
// Each dimension answers "why this sentence scores" rather than "what grammar it has"
const SCORE_DIMENSIONS = {
  vocab:     { key:"vocab",     icon:"📗", label:"词汇亮点", shortLabel:"词汇", desc:"高级词汇·短语·搭配，体现词汇深度", color:tokens.color.dimension.vocab.fg, bg:tokens.color.dimension.vocab.bg, border:tokens.color.dimension.vocab.border },
  syntax:    { key:"syntax",    icon:"📘", label:"句法结构", shortLabel:"句法", desc:"从句·非谓语·倒装，体现句法多样", color:tokens.color.dimension.syntax.fg, bg:tokens.color.dimension.syntax.bg, border:tokens.color.dimension.syntax.border },
  logic:     { key:"logic",     icon:"📙", label:"逻辑衔接", shortLabel:"逻辑", desc:"衔接词·转折·呼应，体现篇章逻辑", color:tokens.color.dimension.logic.fg, bg:tokens.color.dimension.logic.bg, border:tokens.color.dimension.logic.border },
  cognition: { key:"cognition", icon:"📒", label:"认知升华", shortLabel:"认知", desc:"感悟·哲理·升华，体现思想深度", color:tokens.color.dimension.cognition.fg, bg:tokens.color.dimension.cognition.bg, border:tokens.color.dimension.cognition.border },
  emotion:   { key:"emotion",   icon:"📓", label:"情感真实", shortLabel:"情感", desc:"个人细节·感官，体现真实情感", color:tokens.color.dimension.emotion.fg, bg:tokens.color.dimension.emotion.bg, border:tokens.color.dimension.emotion.border },
};

// Map each grammar highlight type to its primary score dimension
const TYPE_TO_DIMENSION = {
  "non-finite":       "syntax",
  "adverb":           "vocab",
  "non-restrictive":  "syntax",
  "concrete-imagery": "emotion",
  "change-verb":      "cognition",
  "mind-verb":        "cognition",
  "connector":        "logic",
  "object-clause":    "syntax",
  "concrete-feeling": "emotion",
  "specific-detail":  "emotion",
  "adverb-action":    "vocab",
  "adj-noun":         "vocab",
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
  const sideColor = side === "a" ? tokens.color.mode.a : tokens.color.mode.b;
  const sideBg = side === "a" ? tokens.color.mode.aBg : tokens.color.mode.bBg;
  const sideEmoji = side === "a" ? "🔵" : "🟠";

  const totalClicked = highlights.filter((_, i) => clickedIds.has(i)).length;

  // Compute which score dimensions this sentence hits (from all its highlights)
  const dimensionHits = {};
  sortedHL.forEach(hl => {
    const dim = TYPE_TO_DIMENSION[hl.type];
    if (dim) dimensionHits[dim] = (dimensionHits[dim] || 0) + 1;
  });
  const totalDimensionsHit = Object.keys(dimensionHits).length;

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
    // Accept both grammar types and score dimensions
    const dragType = e.dataTransfer.getData("application/highlight-type")
                  || e.dataTransfer.getData("application/score-dimension");
    if (dragType) {
      onDrop && onDrop(hlIndex, dragType);
    }
  };

  // Build ordered list of marked annotations (preserve text order for chip row)
  const markedAnnotations = [];
  sortedHL.forEach((hl, idx) => {
    if (clickedIds.has(idx)) {
      const dimKey = TYPE_TO_DIMENSION[hl.type];
      const dimMeta = dimKey ? SCORE_DIMENSIONS[dimKey] : null;
      const typeMeta = HIGHLIGHT_TYPES[hl.type] || { color: accentColor, bg: accentColor + "20" };
      markedAnnotations.push({
        hlIndex: idx, text: hl.label.split("—")[0]?.trim() || text.slice(hl.start, hl.end),
        dimKey, dimMeta, typeMeta,
      });
    }
  });

  return (
    <div style={{
      ...DS.sentenceCard,
      background: side === "a" ? tokens.color.elevated : tokens.color.warm,
    }}>
      {/* Header — compact side tag */}
      <div style={DS.sentenceCardHeader}>
        <span style={{ ...DS.sideTag, background: sideBg, color: sideColor, border: `1px solid ${sideColor}20` }}>
          {sideEmoji} {sideLabel}
        </span>
        <span style={DS.markCount}>
          已标记 {totalClicked}/{highlights.length}
          {totalClicked >= 2 && <span style={{ color: tokens.color.semantic.success.fg, marginLeft: 4 }}>✓</span>}
        </span>
      </div>

      {/* ── Sentence text — the hero. All spans display:inline so words never split ── */}
      <div style={DS.sentenceText}>
        {segments.map((seg, i) => {
          if (!seg.isHighlight) {
            return <span key={i} style={{ color: tokens.color.text.primary }}>{seg.text}</span>;
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
                    ? `linear-gradient(180deg, transparent 55%, ${typeMeta.bg} 55%)`
                    : "transparent",
                borderBottom: isClicked
                  ? `3px solid ${typeMeta.color}`
                  : isDragOver
                    ? `3px dashed ${typeMeta.color}`
                    : `2px dotted ${tokens.color.text.faded}`,
                cursor: "pointer",
                borderRadius: isClicked || isDragOver ? tokens.radius.tight : 3,
                boxShadow: isDragOver ? `0 0 0 6px ${typeMeta.bg}` : "none",
                transform: isDragOver ? "scale(1.04)" : "scale(1)",
                transition: `all ${tokens.transition.normal}`,
                userSelect: "none",
                // No display override — stays inline, words flow naturally
              }}
              title={
                isClicked
                  ? `✓ ${typeMeta.label} — 点击取消`
                  : isDragOver
                    ? "松开放置得分维度"
                    : "👆 点击标记，或从右侧拖入维度标签"
              }
            >
              {seg.text}
            </span>
          );
        })}
      </div>

      {/* ── Annotation chip row — compact pills below sentence, in text order ── */}
      {markedAnnotations.length > 0 && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: tokens.space.md,
          paddingBottom: tokens.space.lg,
        }}>
          {markedAnnotations.map((ma) => (
            <span
              key={ma.hlIndex}
              onClick={() => onToggle(ma.hlIndex)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 8px",
                borderRadius: tokens.radius.pill,
                fontSize: tokens.font.size.caption,
                fontWeight: tokens.font.weight.medium,
                lineHeight: 1.5,
                whiteSpace: "nowrap",
                cursor: "pointer",
                background: ma.typeMeta.bg,
                color: ma.typeMeta.color,
                border: `1px solid ${ma.typeMeta.color}40`,
                transition: `all ${tokens.transition.fast}`,
                userSelect: "none",
              }}
              title={`${ma.dimMeta?.label || ""} — ${ma.typeMeta.label} — 点击移除`}
            >
              {ma.dimMeta && (
                <span style={{ fontSize: 12, lineHeight: 1 }}>{ma.dimMeta.icon}</span>
              )}
              <span style={{ fontWeight: tokens.font.weight.semibold }}>
                {ma.dimMeta?.shortLabel || ma.typeMeta.label}
              </span>
              <span style={{
                fontSize: tokens.font.size.caption,
                color: tokens.color.text.muted,
                maxWidth: 120,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {ma.text}
              </span>
            </span>
          ))}
        </div>
      )}

      {/* ── Footer — single compact hint line ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingTop: tokens.space.lg,
        borderTop: `1px solid ${tokens.color.border.subtle}`,
        fontSize: tokens.font.size.caption,
        color: totalClicked === 0 ? tokens.color.text.muted : tokens.color.dimension.vocab.fg,
        fontWeight: tokens.font.weight.medium,
        lineHeight: tokens.font.lineHeight.tight,
      }}>
        <span>
          {totalClicked === 0
            ? "💡 点击句中虚线文字标记得分点，或从右侧面板拖入维度标签"
            : `覆盖 ${totalDimensionsHit}/5 得分维度 · ${totalClicked} 处标记`
          }
        </span>
        {totalClicked > 0 && (
          <span style={{ color: tokens.color.text.muted, fontSize: tokens.font.size.caption }}>
            点击标记可移除
          </span>
        )}
      </div>
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

  // Compute aggregate five-dimension distribution across all chosen sentences
  const dimensionTotal = { vocab: 0, syntax: 0, logic: 0, cognition: 0, emotion: 0 };
  sentences.forEach(s => {
    const choice = discoveryChoices[s.id];
    if (!choice) return;
    const highlights = s.discovery[choice].highlights || [];
    highlights.forEach(hl => {
      const dim = TYPE_TO_DIMENSION[hl.type];
      if (dim) dimensionTotal[dim]++;
    });
  });
  const maxDimCount = Math.max(...Object.values(dimensionTotal), 1);
  const activeDimensions = Object.values(dimensionTotal).filter(v => v > 0).length;

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
            const styleColor = choice === "a" ? tokens.color.mode.a : tokens.color.mode.b;
            return (
              <span key={s.id}>
                <span style={{
                  ...DS.previewStyleTag,
                  background: styleColor,
                }}>
                  {choice === "a" ? "A" : "B"}
                </span>
                <span style={{ color: tokens.color.text.primary }}>
                  {s.discovery[choice]?.text || "[未选择]"}{" "}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Five-Dimension Distribution Card */}
      <div style={DS.previewDimCard}>
        <div style={DS.previewDimTitle}>🎯 得分维度分布</div>
        <div style={DS.previewDimSub}>
          你的发现版文章覆盖了 <strong>{activeDimensions}/5</strong> 个得分维度，共 <strong>{Object.values(dimensionTotal).reduce((a,b)=>a+b,0)}</strong> 处得分点
        </div>
        <div style={DS.previewDimBars}>
          {Object.entries(SCORE_DIMENSIONS).map(([dimKey, dim]) => {
            const count = dimensionTotal[dimKey] || 0;
            const barWidth = Math.round((count / maxDimCount) * 100);
            return (
              <div key={dimKey} style={DS.previewDimRow}>
                <div style={DS.previewDimLabel}>
                  <span>{dim.icon}</span>
                  <span style={{ fontWeight: tokens.font.weight.semibold, fontSize: tokens.font.size.sm, color:tokens.color.text.body }}>{dim.label}</span>
                </div>
                <div style={DS.previewDimBarTrack}>
                  <div style={{
                    ...DS.previewDimBarFill,
                    width:`${barWidth}%`,
                    background: count > 0 ? dim.color : tokens.color.border.default,
                  }} />
                </div>
                <span style={{
                  ...DS.previewDimCount,
                  color: count > 0 ? dim.color : tokens.color.text.muted,
                  fontWeight: count > 0 ? 700 : 400,
                }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
        {activeDimensions < 3 && (
          <div style={DS.previewDimTip}>
            💡 提示：尝试选择不同风格的句子，以覆盖更多得分维度，让文章更丰富
          </div>
        )}
      </div>

      <div style={DS.previewActions}>
        <button onClick={onEnterWrite} style={{ ...DS.previewBtn, background: topic.accent }}>
          ✍️ 进入写作模式 — 用自己的语言写一遍
        </button>
        <button onClick={onRestart} style={{ ...DS.previewBtn, background: tokens.color.text.label }}>
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
            <div style={{ ...S.progFill, width: `${(completedCount/total)*100}%`, background: tokens.color.overlay.white90 }} />
          </div>
          <span style={S.progLabel}>{completedCount}/{total}句</span>
          {completedCount > 0 && (
            <button onClick={() => setShowPreview(true)} style={{ ...S.helpBtn, background: tokens.color.overlay.white20, color: tokens.color.card, fontSize: 11, padding: "4px 10px" }}>
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
            <span style={{ color: tokens.color.semantic.success.fg }}>✓</span>
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
                  ...(chosen && !active ? { background: tokens.color.semantic.success.bg } : {}),
                  cursor: chosen ? "default" : "pointer",
                }}
              >
                <span style={{
                  ...S.navNum,
                  background: active ? topic.accent : chosen ? tokens.color.semantic.success.fg : tokens.color.border.default,
                  color: (active || chosen) ? tokens.color.card : tokens.color.text.label,
                }}>
                  {i + 2}
                </span>
                <span style={{ ...S.navRole, fontWeight: active ? 700 : 400 }}>{s.role}</span>
                {chosen && <span style={{ fontSize: 11, color: chosen === "a" ? tokens.color.mode.a : tokens.color.mode.b, fontWeight: 700 }}>{chosen === "a" ? "A" : "B"}</span>}
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
              accentColor={tokens.color.mode.a}
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
              accentColor={tokens.color.mode.b}
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
                background: canChoose ? tokens.color.mode.a : tokens.color.border.default,
                color: canChoose ? tokens.color.card : tokens.color.text.muted,
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
                background: canChoose ? tokens.color.mode.b : tokens.color.border.default,
                color: canChoose ? tokens.color.card : tokens.color.text.muted,
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

        {/* Right legend — two-tier: score dimensions (upper) + grammar types (lower) */}
        <div style={S.help}>
          <div style={S.helpBody}>
            {/* ── Tier 1: Score Dimensions 得分维度 ── */}
            <div style={S.helpTitle}>🎯 得分维度（拖入标记）</div>
            <div style={DS.legendHint}>
              拖拽得分维度到句中对应文字，标记"为什么能得分"
            </div>
            {Object.entries(SCORE_DIMENSIONS).map(([dimKey, dim]) => (
              <div
                key={dimKey}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/score-dimension", dimKey);
                  e.dataTransfer.effectAllowed = "copy";
                  e.currentTarget.style.opacity = "0.5";
                }}
                onDragEnd={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
                style={{
                  ...DS.draggableLegendItem,
                  background: dim.bg,
                  border: `1px solid ${dim.border}`,
                }}
                title={`拖拽"${dim.label}"到句子中的对应文字\n${dim.desc}`}
              >
                <span style={{ fontSize:15 }}>{dim.icon}</span>
                <span style={{ ...DS.legendLabel, fontWeight: tokens.font.weight.bold, color:dim.color }}>{dim.label}</span>
                <span style={{ fontSize: tokens.font.size.xs, color:tokens.color.text.muted, marginLeft:"auto" }}>{dim.shortLabel}</span>
                <span style={DS.dragHandle}>⠿</span>
              </div>
            ))}

            {/* Divider */}
            <div style={{
              margin:"12px 0", borderTop: `1px solid ${tokens.color.border.light}`,
              display:"flex", justifyContent:"center",
            }}>
              <span style={{
                position:"relative", top:-8, background:tokens.color.subtle,
                padding:"0 8px", fontSize: tokens.font.size.xs, color:tokens.color.text.muted, fontWeight: tokens.font.weight.medium,
              }}>
                语法技巧标签
              </span>
            </div>

            {/* ── Tier 2: Grammar Types 语法技巧 ── */}
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
                <span style={{ ...DS.legendLabel, color: meta.color, fontWeight:600 }}>{meta.label}</span>
                <span style={DS.dragHandle}>⠿</span>
              </div>
            ))}

            <div style={{ ...S.helpTitle, marginTop: 16 }}>🔍 标记进度</div>
            <div style={DS.legendCount}>
              <div style={DS.progressRow}>
                <span style={{ ...DS.progressDot, background: tokens.color.mode.a }} />
                <span>A 句：{aClicked.size}/{discovery.a.highlights.length}</span>
              </div>
              <div style={{ ...DS.progressRow, marginTop: 6 }}>
                <span style={{ ...DS.progressDot, background: tokens.color.mode.b }} />
                <span>B 句：{bClicked.size}/{discovery.b.highlights.length}</span>
              </div>
              <div style={{ marginTop: 10, fontWeight: 700, color: canChoose ? tokens.color.semantic.success.fg : tokens.color.semantic.danger.fg, fontSize: 13 }}>
                {canChoose ? "✅ 可以选择了！" : `⚠️ 还需标记 ${2 - totalClicked} 个`}
              </div>
            </div>

            <div style={{ ...S.helpTitle, marginTop: 16 }}>💡 当前句子功能</div>
            <div style={DS.legendCount}>
              <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 13 }}>{sentData.role}</div>
              <div style={{ fontSize: 12, color: tokens.color.text.label, lineHeight: 1.6 }}>{sentData.tip}</div>
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
  const wcColor = wc >= 100 && wc <= 125 ? tokens.color.semantic.success.fg : wc > 125 ? tokens.color.semantic.warning.fg : tokens.color.semantic.danger.fg;

  return (
    <div style={S.shell}>
      {/* ── HEADER ── */}
      <div style={{ ...S.bar, background: topic.accent }}>
        <div style={S.barLeft}>
          <button onClick={() => setScreen("home")} style={S.backBtn}>← 返回</button>
          <span style={S.barTitle}>{topic.emoji} {topic.title}</span>
          <span style={S.barSub}>{topic.year} · {topic.theme}</span>
          {discoveryChoices && (
            <span style={{ fontSize: 10, background: tokens.color.overlay.white20, padding: "2px 8px", borderRadius: 8, color: tokens.color.card }}>
              📖 已通过认知发现
            </span>
          )}
        </div>
        <div style={S.barRight}>
          <span style={{ ...S.wcBadge, color: wcColor, background: tokens.color.card }}>{wc} 词</span>
          <div style={S.progTrack}>
            <div style={{ ...S.progFill, width:`${(cc/total)*100}%`, background:tokens.color.overlay.white90 }} />
          </div>
          <span style={S.progLabel}>{cc}/{total}句</span>
          <div style={S.helpToggle}>
            {[2,1,0].map(l => (
              <button key={l} onClick={() => setHelpLevel(l)}
                style={{ ...S.helpBtn, ...(helpLevel===l ? { background:tokens.color.card, color:topic.accent, fontWeight:700 } : {}) }}>
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
            <span style={{ color:tokens.color.semantic.success.fg }}>✓</span>
          </div>
          {topic.sentences.map((s, i) => {
            const done = (sentences[s.id]||"").trim().length > 5;
            const sfb = feedback[s.id];
            const active = i === curIdx;
            return (
              <button key={s.id} onClick={() => setCurIdx(i)} style={{
                ...S.navItem,
                ...(active ? { background:topic.light, borderLeft:`3px solid ${topic.accent}` } : {}),
                ...(done && !active ? { background:tokens.color.page } : {}),
              }}>
                <span style={{ ...S.navNum, background: active ? topic.accent : done ? tokens.color.text.muted : tokens.color.border.default, color: (active||done) ? tokens.color.card : tokens.color.text.label }}>{i+2}</span>
                <span style={{ ...S.navRole, fontWeight: active ? 700 : 400 }}>{s.role}</span>
                {sfb && <span style={{ fontSize:13 }}>{SCORE_META[sfb.score]?.icon}</span>}
              </button>
            );
          })}
          <button onClick={() => setShowPreview(p => !p)} style={{ ...S.navItem, marginTop:8, justifyContent:"center", background:tokens.color.border.subtle, border: `1px dashed ${tokens.color.text.faded}` }}>
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
              style={{ ...S.ta, borderColor: fb ? (SCORE_META[fb.score]?.color || tokens.color.border.default) : tokens.color.border.default }}
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
                <button onClick={runFullEval} disabled={evalLoading} style={{ ...S.primaryBtn, background:tokens.color.semantic.success.fg, opacity:evalLoading?0.5:1 }}>
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
                    {fb.strengths.map((s,i) => <div key={i} style={{ ...S.fbItem, color:tokens.color.semantic.success.fg }}>{s}</div>)}
                  </div>
                )}
                {fb.issues?.length > 0 && (
                  <div style={S.fbSection}>
                    <div style={S.fbSectionTitle}>⚠️ 问题</div>
                    {fb.issues.map((s,i) => <div key={i} style={{ ...S.fbItem, color:tokens.color.semantic.danger.fg }}>{s}</div>)}
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
                  <span key={s.id} style={{ color: sentences[s.id] ? tokens.color.text.primary : tokens.color.text.faded, fontStyle: sentences[s.id] ? "normal" : "italic" }}>
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
                    <div style={{ fontWeight: tokens.font.weight.bold, marginBottom:6, color: topic.accent }}>🎯 目标语法点</div>
                    <div style={{ fontSize: tokens.font.size.body, color:tokens.color.text.primary, lineHeight:1.7 }}>{sentData.grammar}</div>
                  </div>
                  <div style={S.helpTitle}>有效句 vs 无效句</div>
                  <table style={{ width:"100%", fontSize: tokens.font.size.sm, borderCollapse:"collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ background:tokens.color.semantic.success.strong, padding:"6px 8px", textAlign:"left", borderRadius:"4px 0 0 0" }}>✅ 有效句特征</th>
                        <th style={{ background:tokens.color.semantic.danger.strong, padding:"6px 8px", textAlign:"left", borderRadius:"0 4px 0 0" }}>❌ 无效句特征</th>
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
                        <tr key={i} style={{ background: i%2===0?tokens.color.page:tokens.color.card }}>
                          <td style={{ padding:"5px 8px", color:tokens.color.semantic.success.fg }}>{good}</td>
                          <td style={{ padding:"5px 8px", color:tokens.color.semantic.danger.fg }}>{bad}</td>
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
    <div style={{ fontFamily:"'Noto Sans SC','Segoe UI',sans-serif", background:tokens.color.page, minHeight:"100vh" }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${tokens.color.brand.darkest} 0%, ${tokens.color.brand.dark} 50%, ${tokens.color.brand.primary} 100%)`, padding:"40px 32px 32px", color:tokens.color.card }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ fontSize: tokens.font.size.hero, fontWeight: tokens.font.weight.black, letterSpacing: tokens.font.letterSpacing.widest, marginBottom:8 }}>✍️ 中考英语写作训练营</div>
          <div style={{ fontSize: tokens.font.size.h5, opacity:0.8, marginBottom:24 }}>Wuhan ZHONGKAO Writing Pro · 认知发现 → 自主写作 → AI智能评估</div>
          <div style={{ display:"flex", gap: tokens.space.md, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ fontSize: tokens.font.size.body, opacity:0.7 }}>辅助强度：</span>
            {[2,1,0].map(l => (
              <button key={l} onClick={() => setHelpLevel(l)} style={{
                padding:"6px 18px", borderRadius: tokens.radius.floating, border:"1.5px solid rgba(255,255,255,0.5)",
                background: helpLevel===l ? tokens.color.card : "transparent",
                color: helpLevel===l ? tokens.color.brand.darkest : tokens.color.card,
                fontWeight: helpLevel===l ? 700 : 400, cursor:"pointer", fontSize: tokens.font.size.body,
              }}>
                {l===2?"🌟 全辅助":l===1?"💡 半辅助":"🏋️ 自主模式"}
              </button>
            ))}
            <span style={{ fontSize: tokens.font.size.sm, opacity:0.6, marginLeft:8 }}>
              {helpLevel===2?"提供完整词汇/句型/语法提示 + AI反馈":helpLevel===1?"提供部分提示 + AI反馈":"仅AI反馈，适合备考冲刺"}
            </span>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ fontSize:20, fontWeight: tokens.font.weight.bold, color:tokens.color.text.primary, marginBottom:6 }}>选择题目 · Choose a Topic</div>
        <div style={{ fontSize: tokens.font.size.body, color:tokens.color.text.label, marginBottom:24 }}>
          每题包含两个学习阶段：<strong>认知发现</strong>（观察AB优质表达，点击或拖拽标记亮点）→ <strong>自主写作</strong>（用自己的语言写，AI评估）
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:20 }}>
          {topics.map((t,i) => (
            <div key={t.id} onClick={() => onStartDiscovery(i)} style={{
              background:tokens.color.card, border:`2px solid ${t.accent}20`, borderRadius: tokens.radius.section, padding:24,
              cursor:"pointer", transition: `all ${tokens.transition.fast}`,
              boxShadow: tokens.shadow.card,
            }}
              onMouseEnter={e => e.currentTarget.style.transform="translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
            >
              <div style={{ fontSize: tokens.font.size.display, marginBottom:12 }}>{t.emoji}</div>
              <div style={{ fontSize: tokens.font.size.caption, color:t.accent, fontWeight: tokens.font.weight.bold, letterSpacing: tokens.font.letterSpacing.wider, marginBottom:4 }}>{t.year}</div>
              <div style={{ fontSize: tokens.font.size.h3, fontWeight: tokens.font.weight.extrabold, color:tokens.color.text.primary, marginBottom:6 }}>{t.title}</div>
              <div style={{ fontSize: tokens.font.size.sm, color:tokens.color.text.label, lineHeight: tokens.font.lineHeight.normal, marginBottom:16 }}>{t.theme}</div>
              <div style={{ display:"flex", gap: tokens.space.md, flexWrap:"wrap", marginBottom:16 }}>
                {["🔍认知发现","✍️自主写作","🤖AI点评"].map(tag => (
                  <span key={tag} style={{ background:`${t.accent}15`, color:t.accent, padding:"2px 10px", borderRadius: tokens.radius.pill, fontSize: tokens.font.size.caption, fontWeight:600 }}>{tag}</span>
                ))}
              </div>
              <div style={{ background:t.accent, color:tokens.color.card, padding:"8px 0", borderRadius: tokens.radius.pill, textAlign:"center", fontSize: tokens.font.size.body, fontWeight:700 }}>
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
            <div key={title} style={{ background:tokens.color.card, borderRadius: tokens.radius.elevated, padding:20, boxShadow:"0 1px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: tokens.font.size.h1, marginBottom:10 }}>{icon}</div>
              <div style={{ fontWeight: tokens.font.weight.bold, fontSize: tokens.font.size.lead, color:tokens.color.text.primary, marginBottom:6 }}>{title}</div>
              <div style={{ fontSize: tokens.font.size.sm, color:tokens.color.text.label, lineHeight:1.7 }}>{desc}</div>
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
  const gradeColor = { A:tokens.color.semantic.success.fg, B:tokens.color.brand.primary, C:tokens.color.semantic.warning.fg, D:tokens.color.semantic.danger.fg }[e.grade] || tokens.color.text.label;
  const essay = [topic.opening, ...topic.sentences.map(s => sentences[s.id] || "")].filter(Boolean).join(" ");
  const wc = essay.trim().split(/\s+/).filter(w=>w.length>0).length;

  // Compute dimension distribution from discovery choices if available
  const dimTotal = { vocab: 0, syntax: 0, logic: 0, cognition: 0, emotion: 0 };
  if (discoveryChoices) {
    topic.sentences.forEach(s => {
      const choice = discoveryChoices[s.id];
      if (!choice) return;
      const highlights = s.discovery[choice].highlights || [];
      highlights.forEach(hl => {
        const dim = TYPE_TO_DIMENSION[hl.type];
        if (dim) dimTotal[dim]++;
      });
    });
  }
  const dimMax = Math.max(...Object.values(dimTotal), 1);
  const dimActive = Object.values(dimTotal).filter(v => v > 0).length;

  return (
    <div style={{ fontFamily:"'Noto Sans SC','Segoe UI',sans-serif", background:tokens.color.page, minHeight:"100vh" }}>
      <div style={{ background: `linear-gradient(135deg, ${tokens.color.semantic.success.dark}, ${tokens.color.semantic.success.fg})`, padding:"24px 32px", color:tokens.color.card, display:"flex", alignItems:"center", gap:16 }}>
        <button onClick={onBack} style={{ background:tokens.color.overlay.white15, border:"1px solid rgba(255,255,255,0.4)", color:tokens.color.card, padding:"6px 14px", borderRadius: tokens.radius.pill, cursor:"pointer", fontSize:13 }}>← 返回修改</button>
        <button onClick={onHome} style={{ background:tokens.color.overlay.white15, border:"1px solid rgba(255,255,255,0.4)", color:tokens.color.card, padding:"6px 14px", borderRadius: tokens.radius.pill, cursor:"pointer", fontSize:13 }}>🏠 首页</button>
        <div>
          <div style={{ fontWeight: tokens.font.weight.extrabold, fontSize:20 }}>📊 全文AI评估报告</div>
          <div style={{ fontSize: tokens.font.size.sm, opacity:0.8 }}>{topic.emoji} {topic.title} · {topic.year}</div>
        </div>
        {discoveryChoices && (
          <div style={{ marginLeft:"auto", fontSize: tokens.font.size.caption, background:tokens.color.overlay.white15, padding:"4px 10px", borderRadius:8 }}>
            📖 已完成认知发现
          </div>
        )}
      </div>

      <div style={{ maxWidth:860, margin:"0 auto", padding:"28px 24px", display:"flex", flexDirection:"column", gap:20 }}>

        {/* Score overview */}
        <div style={{ background:tokens.color.card, borderRadius: tokens.radius.section, padding:24, boxShadow: tokens.shadow.card, display:"flex", gap:20, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ textAlign:"center", minWidth:100 }}>
            <div style={{ fontSize: tokens.font.size.mega, fontWeight: tokens.font.weight.black, color:gradeColor, lineHeight:1 }}>{e.grade || "?"}</div>
            <div style={{ fontSize: tokens.font.size.body, color:tokens.color.text.label, marginTop:4 }}>综合等级</div>
          </div>
          <div style={{ flex:1, display:"flex", gap: tokens.space.xxl, flexWrap:"wrap" }}>
            {[
              ["内容分", e.contentScore, 5, tokens.color.brand.primary],
              ["语言分", e.languageScore, 5, tokens.color.semantic.success.fg],
              ["结构分", e.structureScore, 5, tokens.color.brand.purple],
              ["总分", e.overallScore, 15, tokens.color.semantic.warning.fg],
              ["字数", wc, 120, tokens.color.mode.a],
            ].map(([label, val, max, color]) => (
              <div key={label} style={{ minWidth:90, flex:"1 1 90px" }}>
                <div style={{ fontSize: tokens.font.size.caption, color:tokens.color.text.muted, marginBottom:4 }}>{label}</div>
                <div style={{ height:8, background:tokens.color.border.subtle, borderRadius: tokens.radius.tight, overflow:"hidden", marginBottom:4 }}>
                  <div style={{ height:"100%", width:`${Math.min(100,((val||0)/max)*100)}%`, background:color, borderRadius: tokens.radius.tight, transition: `width ${tokens.transition.delayed}` }} />
                </div>
                <div style={{ fontWeight: tokens.font.weight.extrabold, fontSize: tokens.font.size.h3, color }}>{val ?? "?"}<span style={{ fontSize: tokens.font.size.caption, color:tokens.color.text.muted, fontWeight:400 }}>/{max}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* Five-Dimension Distribution (from discovery) */}
        {discoveryChoices && (
          <div style={{ background:tokens.color.card, borderRadius: tokens.radius.section, padding:20, boxShadow: tokens.shadow.card }}>
            <div style={{ fontWeight: tokens.font.weight.bold, fontSize: tokens.font.size.lead, color:tokens.color.text.primary, marginBottom:4 }}>🎯 认知发现 · 得分维度分布</div>
            <div style={{ fontSize: tokens.font.size.sm, color:tokens.color.text.label, marginBottom:14 }}>
              你的发现版文章覆盖了 <strong>{dimActive}/5</strong> 个得分维度
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {Object.entries(SCORE_DIMENSIONS).map(([dimKey, dim]) => {
                const count = dimTotal[dimKey] || 0;
                const barWidth = Math.round((count / dimMax) * 100);
                return (
                  <div key={dimKey} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:90, flexShrink:0, display:"flex", alignItems:"center", gap: tokens.space.xs, fontSize:12 }}>
                      <span>{dim.icon}</span>
                      <span style={{ fontWeight: tokens.font.weight.medium, color:tokens.color.text.body }}>{dim.label}</span>
                    </div>
                    <div style={{ flex:1, height:14, background:tokens.color.border.subtle, borderRadius:7, overflow:"hidden" }}>
                      <div style={{
                        height:"100%", width:`${barWidth}%`, borderRadius:7,
                        background: count > 0 ? dim.color : tokens.color.border.default,
                        transition: `width ${tokens.transition.chart}`,
                      }} />
                    </div>
                    <span style={{
                      width:28, textAlign:"right", fontSize: tokens.font.size.sm, fontWeight: tokens.font.weight.bold, flexShrink:0,
                      color: count > 0 ? dim.color : tokens.color.text.muted,
                    }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
            {dimActive < 3 && (
              <div style={{ marginTop:12, padding:"8px 12px", background:tokens.color.semantic.warning.bg, borderRadius: tokens.radius.pill, fontSize: tokens.font.size.sm, color:tokens.color.semantic.warning.fg, border: `1px solid ${tokens.color.semantic.warning.border}` }}>
                💡 不同句子位置可侧重不同得分维度，尝试让全文覆盖更多维度以丰富表达层次
              </div>
            )}
          </div>
        )}

        {/* Strengths & Weaknesses */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div style={{ background:tokens.color.semantic.success.bg, border: `1px solid ${tokens.color.semantic.success.border}`, borderRadius: tokens.radius.elevated, padding:18 }}>
            <div style={{ fontWeight: tokens.font.weight.bold, color:tokens.color.semantic.success.fg, marginBottom:12 }}>✅ 作文亮点</div>
            {(e.strengths||["(暂无)"]).map((s,i) => <div key={i} style={{ fontSize: tokens.font.size.body, color:tokens.color.text.primary, marginBottom:6, lineHeight:1.6 }}>• {s}</div>)}
          </div>
          <div style={{ background:tokens.color.semantic.danger.bg, border: `1px solid ${tokens.color.semantic.danger.border}`, borderRadius: tokens.radius.elevated, padding:18 }}>
            <div style={{ fontWeight: tokens.font.weight.bold, color:tokens.color.semantic.danger.fg, marginBottom:12 }}>⚠️ 需要改进</div>
            {(e.weaknesses||["(暂无)"]).map((s,i) => <div key={i} style={{ fontSize: tokens.font.size.body, color:tokens.color.text.primary, marginBottom:6, lineHeight:1.6 }}>• {s}</div>)}
          </div>
        </div>

        {/* Top suggestion */}
        {e.topSuggestion && (
          <div style={{ background: tokens.color.semantic.warning.bg, border: `1px solid ${tokens.color.semantic.warning.border}`, borderRadius: tokens.radius.elevated, padding:18 }}>
            <div style={{ fontWeight: tokens.font.weight.bold, color: tokens.color.semantic.warning.fg, marginBottom:8 }}>🏆 最重要的一个改进建议</div>
            <div style={{ fontSize: tokens.font.size.lead, color:tokens.color.text.primary, lineHeight:1.7 }}>{e.topSuggestion}</div>
          </div>
        )}

        {/* Sentence-by-sentence breakdown */}
        <div style={{ background:tokens.color.card, borderRadius: tokens.radius.section, padding:20, boxShadow: tokens.shadow.card }}>
          <div style={{ fontWeight: tokens.font.weight.bold, fontSize: tokens.font.size.h5, marginBottom:16, color:tokens.color.text.primary }}>📋 逐句得分明细</div>
          {topic.sentences.map((s, i) => {
            const sfb = feedback[s.id];
            const text = sentences[s.id] || "";
            const meta = sfb ? SCORE_META[sfb.score] : null;
            return (
              <div key={s.id} style={{ padding:"12px 0", borderBottom: `1px solid ${tokens.color.border.subtle}` }}>
                <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:text ? 6 : 0 }}>
                  <span style={{ background: meta?.color || tokens.color.border.default, color:tokens.color.card, fontSize: tokens.font.size.caption, padding:"2px 8px", borderRadius: tokens.radius.pill, fontWeight: tokens.font.weight.bold, whiteSpace:"nowrap" }}>
                    第{i+2}句 · {s.role}
                  </span>
                  {meta && <span style={{ color:meta.color, fontSize: tokens.font.size.sm, fontWeight:700 }}>{meta.icon} {meta.label}</span>}
                  {!sfb && <span style={{ color:tokens.color.text.muted, fontSize:12 }}>（未检测）</span>}
                </div>
                {text ? <div style={{ fontSize: tokens.font.size.body, color:tokens.color.text.body, lineHeight:1.7 }}>{text}</div>
                       : <div style={{ fontSize: tokens.font.size.body, color:tokens.color.text.faded, fontStyle:"italic" }}>(未填写)</div>}
                {sfb?.issues?.length > 0 && (
                  <div style={{ marginTop:6 }}>
                    {sfb.issues.map((iss,j) => <div key={j} style={{ fontSize: tokens.font.size.sm, color:tokens.color.semantic.danger.fg }}>↳ {iss}</div>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Full essay */}
        <div style={{ background:tokens.color.card, borderRadius: tokens.radius.section, padding:20, boxShadow: tokens.shadow.card }}>
          <div style={{ fontWeight: tokens.font.weight.bold, fontSize: tokens.font.size.h5, marginBottom:12, color:tokens.color.text.primary }}>📄 完整作文</div>
          <div style={{ fontSize: tokens.font.size.lead, lineHeight:2.2, color:tokens.color.text.body }}>
            <span style={{ color:topic.accent, fontWeight:600 }}>{topic.opening} </span>
            {topic.sentences.map(s => (
              <span key={s.id} style={{ color: sentences[s.id] ? tokens.color.text.primary : tokens.color.text.faded }}>
                {sentences[s.id] || `[第${topic.sentences.indexOf(s)+2}句]`}{" "}
              </span>
            ))}
          </div>
          <div style={{ marginTop:12, fontSize: tokens.font.size.sm, color:tokens.color.text.label }}>
            总字数：<strong style={{ color: wc>=100&&wc<=125?tokens.color.semantic.success.fg:tokens.color.semantic.danger.fg }}>{wc}</strong> 词（目标：100-120词）
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
  shell: { fontFamily:"'Noto Sans SC','Segoe UI',sans-serif", background:tokens.color.page, minHeight:"100vh", display:"flex", flexDirection:"column" },
  bar: { padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap: tokens.space.md, flexShrink:0 },
  barLeft: { display:"flex", alignItems:"center", gap:12 },
  barRight: { display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" },
  backBtn: { background:tokens.color.overlay.white18, border:"1px solid rgba(255,255,255,0.4)", color:tokens.color.card, padding:"5px 12px", borderRadius: tokens.radius.pill, cursor:"pointer", fontSize:12 },
  barTitle: { fontWeight: tokens.font.weight.extrabold, fontSize: tokens.font.size.h4, color:tokens.color.card },
  barSub: { fontSize: tokens.font.size.caption, color:tokens.color.overlay.white75 },
  wcBadge: { fontWeight: tokens.font.weight.extrabold, fontSize: tokens.font.size.lead, padding:"4px 12px", borderRadius:12 },
  progTrack: { width:100, height:7, background:tokens.color.overlay.white25, borderRadius: tokens.radius.tight, overflow:"hidden" },
  progFill: { height:"100%", borderRadius: tokens.radius.tight, transition: `width ${tokens.transition.slow}` },
  progLabel: { fontSize: tokens.font.size.sm, color:tokens.color.overlay.white85 },
  helpToggle: { display:"flex", background:tokens.color.overlay.white15, borderRadius: tokens.radius.floating, padding:2, gap:2 },
  helpBtn: { border:"none", borderRadius: tokens.radius.section, padding:"4px 12px", cursor:"pointer", fontSize: tokens.font.size.caption, color:tokens.color.overlay.white85, background:"transparent" },
  body: { display:"flex", flex:1, overflow:"hidden", height:"calc(100vh - 52px)" },
  nav: { width:148, background:tokens.color.card, borderRight: `1px solid ${tokens.color.border.light}`, overflowY:"auto", padding:"12px 8px", flexShrink:0 },
  navLabel: { fontSize: tokens.font.size.xs, fontWeight: tokens.font.weight.bold, color:tokens.color.text.muted, letterSpacing: tokens.font.letterSpacing.wider, padding:"0 6px 8px", textTransform:"uppercase" },
  navItem: { display:"flex", alignItems:"center", gap:6, padding:"7px 8px", borderRadius: tokens.radius.pill, marginBottom:3, border:"none", borderLeft:"3px solid transparent", cursor:"pointer", background:"transparent", width:"100%", textAlign:"left" },
  navNum: { width:22, height:22, borderRadius: tokens.radius.full, display:"flex", alignItems:"center", justifyContent:"center", fontSize: tokens.font.size.caption, fontWeight: tokens.font.weight.bold, flexShrink:0 },
  navRole: { flex:1, fontSize: tokens.font.size.caption, color:tokens.color.text.secondary },
  center: { flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap: tokens.space.xxl, maxWidth:820 },
  givenBox: { border:"2px solid", borderRadius: tokens.radius.card, padding:"10px 14px", display:"flex", gap:10, alignItems:"flex-start" },
  givenTag: { color:tokens.color.card, padding:"2px 10px", borderRadius: tokens.radius.pill, fontSize: tokens.font.size.caption, fontWeight: tokens.font.weight.bold, whiteSpace:"nowrap", marginTop:1, flexShrink:0 },
  givenText: { fontSize: tokens.font.size.lead, fontWeight: tokens.font.weight.semibold, lineHeight:1.7 },
  card: { background:tokens.color.card, borderRadius: tokens.radius.elevated, padding:18, boxShadow: tokens.shadow.card },
  cardHead: { display:"flex", gap: tokens.space.md, alignItems:"center", marginBottom:10, flexWrap:"wrap" },
  numBadge: { color:tokens.color.card, padding:"3px 12px", borderRadius: tokens.radius.pill, fontSize: tokens.font.size.sm, fontWeight:800 },
  roleBadge: { fontSize: tokens.font.size.body, fontWeight: tokens.font.weight.semibold, color:tokens.color.text.body },
  gramTag: { fontSize: tokens.font.size.caption, color:tokens.color.brand.purple, background:tokens.color.brand.purpleBg, padding:"2px 10px", borderRadius: tokens.radius.pill, marginLeft:"auto" },
  tipRow: { background:tokens.color.semantic.warning.bg, border: `1px solid ${tokens.color.semantic.warning.border}`, borderRadius: tokens.radius.pill, padding:"10px 14px", marginBottom:12, display:"flex", gap:8 },
  tipIcon: { fontSize: tokens.font.size.h4, flexShrink:0 },
  tipText: { fontSize: tokens.font.size.body, color:tokens.color.semantic.warning.fg, lineHeight:1.7 },
  ta: { width:"100%", padding:"12px 14px", fontSize: tokens.font.size.lead, border:"2px solid", borderRadius: tokens.radius.pill, resize:"vertical", fontFamily:"inherit", lineHeight: tokens.font.lineHeight.loose, outline:"none", boxSizing:"border-box", transition: `border-color ${tokens.transition.normal}` },
  actions: { display:"flex", gap: tokens.space.md, marginTop:10, flexWrap:"wrap" },
  primaryBtn: { color:tokens.color.card, border:"none", borderRadius:9, padding:"9px 18px", cursor:"pointer", fontWeight: tokens.font.weight.bold, fontSize: tokens.font.size.body, transition: `opacity ${tokens.transition.normal}` },
  ghostBtn: { background:tokens.color.border.subtle, border: `1px solid ${tokens.color.border.default}`, borderRadius:9, padding:"9px 14px", cursor:"pointer", fontSize: tokens.font.size.body, color:tokens.color.text.secondary },
  fbBox: { marginTop:14, padding:"14px 16px", borderRadius: tokens.radius.card, border:"1.5px solid" },
  fbHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 },
  fbVerdict: { fontWeight: tokens.font.weight.extrabold, fontSize:15 },
  fbStars: { fontSize: tokens.font.size.h3, letterSpacing:2 },
  fbSection: { marginBottom:10 },
  fbSectionTitle: { fontWeight: tokens.font.weight.bold, fontSize: tokens.font.size.sm, color:tokens.color.text.secondary, marginBottom:5 },
  fbItem: { fontSize: tokens.font.size.body, lineHeight: tokens.font.lineHeight.relaxed, marginBottom:3 },
  fbGrammar: { fontSize: tokens.font.size.body, color:tokens.color.brand.purple, background:tokens.color.brand.purpleBg, padding:"6px 10px", borderRadius: tokens.radius.pill, marginTop:8 },
  fbSuggest: { marginTop:10, padding:"10px 12px", background:"rgba(255,255,255,0.7)", borderRadius:9 },
  fbSuggestLabel: { fontSize: tokens.font.size.sm, fontWeight: tokens.font.weight.bold, color:tokens.color.text.secondary, display:"block", marginBottom:4 },
  fbSuggestText: { fontSize: tokens.font.size.body, color:tokens.color.text.primary, lineHeight: tokens.font.lineHeight.relaxed, fontStyle:"italic" },
  previewCard: { background:tokens.color.card, borderRadius: tokens.radius.elevated, padding:16, boxShadow: tokens.shadow.subtle },
  previewTitle: { fontWeight: tokens.font.weight.bold, fontSize: tokens.font.size.body, color:tokens.color.text.secondary, marginBottom:10 },
  previewText: { fontSize: tokens.font.size.body, lineHeight:2.1 },
  previewWC: { fontSize: tokens.font.size.sm, color:tokens.color.text.muted, marginTop:10 },
  help: { width:260, background:tokens.color.subtle, borderLeft: `1px solid ${tokens.color.border.light}`, display:"flex", flexDirection:"column", overflowY:"auto", flexShrink:0 },
  helpTabs: { display:"flex", borderBottom: `1px solid ${tokens.color.border.default}`, flexShrink:0 },
  helpTab: { flex:1, padding:"10px 2px", border:"none", borderBottom:"2px solid transparent", background:"none", cursor:"pointer", fontSize: tokens.font.size.caption, fontWeight: tokens.font.weight.semibold, color:tokens.color.text.muted },
  helpBody: { padding:"12px 14px", flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10 },
  helpTitle: { fontSize: tokens.font.size.caption, fontWeight: tokens.font.weight.bold, color:tokens.color.text.muted, letterSpacing: tokens.font.letterSpacing.wide, marginBottom:10, textTransform:"uppercase" },
  chipRow: { display:"flex", flexWrap:"wrap", gap:5, marginBottom:8 },
  chip: { padding:"3px 10px", borderRadius: tokens.radius.card, fontSize: tokens.font.size.caption, fontWeight:500 },
  patItem: { display:"flex", gap: tokens.space.md, marginBottom:12, alignItems:"flex-start" },
  patNum: { color:tokens.color.card, borderRadius: tokens.radius.full, width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize: tokens.font.size.caption, fontWeight: tokens.font.weight.bold, flexShrink:0, marginTop:1 },
  patText: { fontSize: tokens.font.size.sm, color:tokens.color.text.body, lineHeight:1.75, fontStyle:"italic" },
  patHint: { background:tokens.color.semantic.warning.bg, border: `1px solid ${tokens.color.semantic.warning.border}`, borderRadius: tokens.radius.pill, padding:"8px 10px", display:"flex", gap:6, marginTop:8 },
  patHintIcon: { fontSize:14 },
  patHintText: { fontSize: tokens.font.size.caption, color:tokens.color.semantic.warning.fg, lineHeight:1.6 },
  gramBox: { border:"1.5px solid", borderRadius: tokens.radius.pill, padding:"10px 12px", marginBottom:14 },
};

// ── Discovery-specific styles ──
const DS = {
  positionHeader: { display:"flex", alignItems:"center", gap: tokens.space.lg, marginBottom:4 },
  positionBadge: { color:tokens.color.card, padding:"4px 14px", borderRadius: tokens.radius.pill, fontSize: tokens.font.size.body, fontWeight:800 },
  positionHint: { fontSize: tokens.font.size.sm, color:tokens.color.text.muted, lineHeight: tokens.font.lineHeight.normal, fontWeight:400 },
  compareCol: { display:"flex", flexDirection:"column", gap:0 },
	  sentenceDivider: { display:"flex", alignItems:"center", gap: tokens.space.lg, padding:"8px 0", margin:"2px 0" },
	  dividerLine: { flex:1, height:1, background: `linear-gradient(to right, transparent, ${tokens.color.border.dashed}, transparent)` },
	  dividerText: { fontSize: tokens.font.size.caption, color:tokens.color.text.muted, fontWeight: tokens.font.weight.medium, whiteSpace:"nowrap" },
  sentenceCard: {
    background:tokens.color.card, borderRadius: tokens.radius.floating, padding:"24px 32px 20px", border:"none",
    boxShadow: tokens.shadow.hairline, position:"relative",
  },
  sentenceCardHeader: {
    display:"flex", alignItems:"center", justifyContent:"space-between",
    marginBottom:4, flexWrap:"wrap", gap: tokens.space.md,
  },
  markCount: {
    fontSize: tokens.font.size.caption, color:tokens.color.text.muted, fontWeight: tokens.font.weight.medium,
  },
  sideTag: {
    display:"inline-flex", alignItems:"center", gap:6,
    padding:"4px 14px", borderRadius: tokens.radius.floating,
    fontSize: tokens.font.size.caption, fontWeight: tokens.font.weight.semibold, marginBottom:16,
    letterSpacing: tokens.font.letterSpacing.normal,
  },
  sentenceText: {
    fontSize: 20, lineHeight: 2.0, color: tokens.color.text.primary,
    fontWeight: tokens.font.weight.medium, letterSpacing: tokens.font.letterSpacing.tight,
    paddingBottom: tokens.space.xxl,
  },
  highlightZone: {
    padding:"0 1px", borderRadius: tokens.radius.tight, margin:"0",
  },
  markedLabelsArea: {

    marginTop:16, paddingTop:16,

    borderTop: `1.5px solid ${tokens.color.border.subtle}`,

  },

  markedLabelsTitle: {

    fontSize: tokens.font.size.caption, fontWeight: tokens.font.weight.bold, color:tokens.color.text.label, marginBottom:10,

    letterSpacing: tokens.font.letterSpacing.wide, textTransform:"uppercase",

  },

  markedLabelsList: {

    display:"flex", flexWrap:"wrap", gap: tokens.space.md,

  },

  markedLabelChip: {
    display:"inline-flex", alignItems:"center", gap:6,
    padding:"6px 14px", borderRadius:22,
    fontSize: tokens.font.size.sm, fontWeight: tokens.font.weight.medium,
    cursor:"pointer", transition: `all ${tokens.transition.fast}`,
    userSelect:"none",
  },

  markedLabelType: {
    fontSize: tokens.font.size.xs, padding:"2px 7px", borderRadius:6,
    background:"rgba(0,0,0,0.04)", fontWeight: tokens.font.weight.semibold,
  },

  markedLabelText: {
    maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
  },

  markedLabelRemove: {
    fontSize: tokens.font.size.h5, fontWeight: tokens.font.weight.medium, opacity:0.35, marginLeft:2,
  },

  emptyMarkHint: {
    marginTop:18, padding:"12px 16px", background:tokens.color.subtle,
    borderRadius: tokens.radius.card, fontSize: tokens.font.size.sm, color:tokens.color.text.muted,
    textAlign:"center", lineHeight: tokens.font.lineHeight.normal, border: `1px dashed ${tokens.color.border.dashed}`,
  },
  choiceRow: { display:"flex", flexDirection:"column", gap:10, marginTop:20 },
  choiceBtn: {
    width:"100%", padding:"12px 24px", borderRadius: tokens.radius.card, border:"none",
    fontWeight: tokens.font.weight.semibold, fontSize: tokens.font.size.lead, transition: `all ${tokens.transition.fast}`,
    display:"flex", alignItems:"center", justifyContent:"center", gap: tokens.space.md,
    letterSpacing: tokens.font.letterSpacing.normal,
  },
  choiceHint: {
    textAlign:"center", fontSize: tokens.font.size.sm, color:tokens.color.dimension.logic.fg, marginTop:10,
    background:tokens.color.dimension.logic.bg, padding:"10px 14px", borderRadius: tokens.radius.card,
    border: `1px solid ${tokens.color.dimension.logic.border}`,
  },
  navRow: { display:"flex", gap: tokens.space.md, marginTop:10, flexWrap:"wrap" },

  // Preview styles
  previewShell: { fontFamily:"'Noto Sans SC','Segoe UI',sans-serif", background:tokens.color.page, minHeight:"100vh" },
  previewHero: { background: `linear-gradient(135deg, ${tokens.color.semantic.success.dark}, ${tokens.color.semantic.success.fg})`, padding:"48px 32px", color:tokens.color.card, textAlign:"center" },
  previewHeroIcon: { fontSize: tokens.font.size.mega, marginBottom:16 },
  previewHeroTitle: { fontSize: tokens.font.size.h1, fontWeight: tokens.font.weight.black, marginBottom:8 },
  previewHeroSub: { fontSize: tokens.font.size.lead, opacity:0.85, maxWidth:500, margin:"0 auto", lineHeight:1.7 },
  previewStats: { display:"flex", gap: tokens.space.xxl, justifyContent:"center", marginTop:20, flexWrap:"wrap" },
  previewStat: { background:tokens.color.overlay.white15, padding:"6px 16px", borderRadius: tokens.radius.card, fontSize:13 },
  previewEssayCard: { maxWidth:700, margin:"-20px auto 0", background:tokens.color.card, borderRadius: tokens.radius.section, padding:24, boxShadow: tokens.shadow.elevated, position:"relative", zIndex:1 },
  previewEssayTitle: { fontWeight: tokens.font.weight.bold, fontSize: tokens.font.size.lead, color:tokens.color.text.secondary, marginBottom:16, paddingBottom:12, borderBottom: `1px solid ${tokens.color.border.subtle}` },
  previewEssayBody: { fontSize: tokens.font.size.lead, lineHeight: tokens.font.lineHeight.widest, color:tokens.color.text.body },
  previewStyleTag: { display:"inline-block", color:tokens.color.card, fontSize:9, padding:"1px 5px", borderRadius: tokens.radius.tight, marginRight:4, fontWeight: tokens.font.weight.bold, verticalAlign:"middle" },
  previewActions: { maxWidth:700, margin:"24px auto", display:"flex", gap: tokens.space.lg, justifyContent:"center", flexWrap:"wrap", padding:"0 32px 48px" },
  previewBtn: { color:tokens.color.card, border:"none", borderRadius: tokens.radius.card, padding:"14px 28px", cursor:"pointer", fontWeight: tokens.font.weight.bold, fontSize:14 },

  // ── Preview dimension distribution card ──
  previewDimCard: {
    maxWidth:700, margin:"0 auto", background:tokens.color.card, borderRadius: tokens.radius.section,
    padding:20, boxShadow: tokens.shadow.card,
  },
  previewDimTitle: { fontWeight: tokens.font.weight.bold, fontSize: tokens.font.size.lead, color:tokens.color.text.primary, marginBottom:4 },
  previewDimSub: { fontSize: tokens.font.size.sm, color:tokens.color.text.label, marginBottom:16 },
  previewDimBars: { display:"flex", flexDirection:"column", gap:10 },
  previewDimRow: { display:"flex", alignItems:"center", gap:10 },
  previewDimLabel: { width:100, flexShrink:0, display:"flex", alignItems:"center", gap:6, fontSize:12 },
  previewDimBarTrack: { flex:1, height:14, background: tokens.color.border.subtle, borderRadius:7, overflow:"hidden" },
  previewDimBarFill: { height:"100%", borderRadius:9, transition: `width ${tokens.transition.chart}`, minWidth:0 },
  previewDimCount: { width:32, textAlign:"right", fontSize: tokens.font.size.body, fontWeight: tokens.font.weight.semibold, flexShrink:0 },
  previewDimTip: {
    marginTop:14, padding:"10px 14px", background:tokens.color.semantic.warning.bg,
    borderRadius: tokens.radius.pill, fontSize: tokens.font.size.sm, color:tokens.color.semantic.warning.fg, lineHeight: tokens.font.lineHeight.tight,
    border: `1px solid ${tokens.color.semantic.warning.border}`,
  },

  // ── Drag Palette styles (inline below sentence text) ──
  dragPalette: {
    marginTop:4, marginBottom:6,
    padding:"12px 16px",
    background:tokens.color.subtle, borderRadius: tokens.radius.elevated,
    border: `1.5px dashed ${tokens.color.border.default}`,
  },
  dragPaletteLabel: {
    fontSize: tokens.font.size.caption, fontWeight: tokens.font.weight.semibold, color:tokens.color.text.label,
    marginBottom:10, textAlign:"center",
  },
  dragPalettePills: {
    display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap",
  },
  dragPill: {
    display:"inline-flex", alignItems:"center", gap:6,
    padding:"8px 16px", borderRadius: tokens.radius.round,
    fontSize: tokens.font.size.body, fontWeight: tokens.font.weight.semibold,
    cursor:"grab", transition: `all ${tokens.transition.fast}`,
    userSelect:"none",
  },
  dragPillIcon: {
    fontSize: tokens.font.size.h5, lineHeight:1,
  },
  dragPillLabel: {
    fontSize: tokens.font.size.body, lineHeight:1,
  },
  dragPillHandle: {
    fontSize: tokens.font.size.body, opacity:0.4, marginLeft:2, letterSpacing: tokens.font.letterSpacing.widest,
  },

  // ── Annotation Lane styles (marked labels drop zone) ──
  annotationLane: {
    marginTop:4, padding:"14px 16px",
    background:tokens.color.card, borderRadius: tokens.radius.elevated,
    border: `1.5px solid ${tokens.color.border.dashed}`,
    minHeight:50,
  },
  annotationLaneTitle: {
    fontSize: tokens.font.size.caption, fontWeight: tokens.font.weight.semibold, color:tokens.color.text.label,
    marginBottom:8, letterSpacing: tokens.font.letterSpacing.normal,
  },
  annotationLaneHint: {
    fontSize: tokens.font.size.sm, color:tokens.color.text.muted,
    textAlign:"center", lineHeight: tokens.font.lineHeight.loose,
  },

  // ── Compact dimension summary (replaces old full bar) ──
  dimensionBarSummary: {
    marginTop:8, fontSize: tokens.font.size.caption, color:tokens.color.dimension.vocab.fg,
    textAlign:"right", fontWeight: tokens.font.weight.medium,
  },

  // Draggable legend items


  draggableLegendItem: {
    display:"flex", alignItems:"center", gap: tokens.space.md,
    padding:"7px 12px", borderRadius: tokens.radius.pill,
    background:tokens.color.card, border: `1px solid ${tokens.color.border.light}`,
    cursor:"grab", transition: `all ${tokens.transition.fast}`,
    userSelect:"none", marginBottom:0,
  },


  dragHandle: {
    fontSize: tokens.font.size.caption, color:tokens.color.text.faded, marginLeft:"auto", letterSpacing: tokens.font.letterSpacing.wider,
    opacity:0.6,
  },


  legendHint: {
    fontSize: tokens.font.size.caption, color:tokens.color.text.muted, marginBottom:8,
    padding:"8px 10px", background:tokens.color.subtle, borderRadius: tokens.radius.pill,
    lineHeight: tokens.font.lineHeight.tight, textAlign:"center", border: `1px solid ${tokens.color.border.light}`,
  },



  // Progress tracking in legend


  progressRow: { display:"flex", alignItems:"center", gap: tokens.space.md, fontSize:12 },


  progressDot: { width:8, height:8, borderRadius: tokens.radius.full, flexShrink:0 },



  // Legend styles
  legendItem: { display:"flex", alignItems:"center", gap: tokens.space.md, marginBottom:6 },
  legendDot: { width:10, height:10, borderRadius: tokens.radius.full, flexShrink:0 },
  legendLabel: { fontSize: tokens.font.size.caption, color:tokens.color.text.secondary, fontWeight:500 },
  legendCount: { background:tokens.color.page, borderRadius: tokens.radius.card, padding:"12px 14px", fontSize: tokens.font.size.sm, color:tokens.color.text.body, lineHeight:1.6 },
};
  // ── Reasoning Chain styles ──
  const RC = {
    shell: { background:tokens.color.card, borderRadius: tokens.radius.elevated, border: `1.5px solid ${tokens.color.border.default}`, marginBottom:14, overflow:"hidden", boxShadow: tokens.shadow.hairline },
    collapsedBar: { display:"flex", alignItems:"center", gap: tokens.space.md, padding:"10px 16px", background:tokens.color.page, border: `1px dashed ${tokens.color.text.faded}`, borderRadius: tokens.radius.pill, cursor:"pointer", marginBottom:14, userSelect:"none", transition: `background ${tokens.transition.normal}` },
    collapsedIcon: { fontSize:18 },
    collapsedText: { flex:1, fontSize: tokens.font.size.body, fontWeight: tokens.font.weight.semibold, color:tokens.color.text.secondary },
    collapsedArrow: { fontSize: tokens.font.size.caption, color:tokens.color.text.muted },
    header: { display:"flex", alignItems:"flex-start", justifyContent:"space-between", padding:"16px 18px 12px", borderBottom: `1px solid ${tokens.color.border.subtle}`, flexWrap:"wrap", gap:10 },
    headerLeft: { display:"flex", flexDirection:"column", gap: tokens.space.xs, flex:1 },
    headerIcon: { fontSize:22 },
    headerTitle: { fontSize: tokens.font.size.lead, fontWeight: tokens.font.weight.extrabold, color:tokens.color.text.primary },
    headerDesc: { fontSize: tokens.font.size.caption, color:tokens.color.text.label, lineHeight:1.5 },
    headerRight: { display:"flex", alignItems:"center", gap: tokens.space.md, flexShrink:0 },
    progressTrack: { width:60, height:5, background:tokens.color.border.subtle, borderRadius:3, overflow:"hidden" },
    progressFill: { height:"100%", background:tokens.color.semantic.success.fg, borderRadius:3, transition: `width ${tokens.transition.reveal}` },
    stepCount: { fontSize: tokens.font.size.caption, fontWeight: tokens.font.weight.bold, color:tokens.color.text.label, whiteSpace:"nowrap" },
    skipBtn: { background:"none", border:"none", color:tokens.color.text.muted, cursor:"pointer", fontSize: tokens.font.size.caption, fontWeight: tokens.font.weight.semibold, padding:"2px 8px" },
    stepDots: { display:"flex", justifyContent:"center", gap: tokens.space.huge, padding:"14px 18px", background:tokens.color.subtle },
    dot: { width:28, height:28, borderRadius: tokens.radius.full, display:"flex", alignItems:"center", justifyContent:"center", fontSize: tokens.font.size.caption, fontWeight: tokens.font.weight.semibold, transition: `all ${tokens.transition.slow}`, flexShrink:0 },
    qaArea: { padding:"16px 18px" },
    questionBubble: { display:"flex", gap:10, marginBottom:14 },
    questionAvatar: { width:32, height:32, borderRadius: tokens.radius.full, background:tokens.color.border.subtle, display:"flex", alignItems:"center", justifyContent:"center", fontSize: tokens.font.size.h4, flexShrink:0 },
    questionContent: { flex:1 },
    questionStep: { fontSize: tokens.font.size.xs, fontWeight: tokens.font.weight.bold, color:tokens.color.text.muted, letterSpacing: tokens.font.letterSpacing.wide, textTransform:"uppercase", marginBottom:4 },
    questionText: { fontSize: tokens.font.size.lead, fontWeight: tokens.font.weight.semibold, color:tokens.color.text.primary, lineHeight: tokens.font.lineHeight.relaxed, marginBottom:6 },
    questionHint: { fontSize: tokens.font.size.sm, color:tokens.color.text.label, lineHeight: tokens.font.lineHeight.tight, background:tokens.color.semantic.warning.bg, padding:"6px 10px", borderRadius: tokens.radius.pill, border: `1px solid ${tokens.color.semantic.warning.border}` },
    timeRequired: { fontSize: tokens.font.size.caption, color:tokens.color.semantic.warning.fg, marginTop:6, background:tokens.color.semantic.warning.strong, padding:"4px 10px", borderRadius:6, display:"inline-block" },
    answerArea: { marginLeft:42 },
    answerInput: { width:"100%", padding:"10px 14px", fontSize: tokens.font.size.body, fontFamily:"inherit", border: `2px solid ${tokens.color.border.default}`, borderRadius: tokens.radius.pill, resize:"vertical", lineHeight: tokens.font.lineHeight.relaxed, outline:"none", boxSizing:"border-box", transition: `border-color ${tokens.transition.normal}`, background:tokens.color.subtle },
    answerActions: { display:"flex", gap: tokens.space.md, marginTop:8, justifyContent:"flex-end" },
    prevBtn: { background:tokens.color.border.subtle, border: `1px solid ${tokens.color.border.default}`, borderRadius: tokens.radius.pill, padding:"6px 14px", cursor:"pointer", fontSize: tokens.font.size.sm, color:tokens.color.text.secondary, fontWeight:600 },
    nextBtn: { background:tokens.color.brand.primary, border:"none", borderRadius: tokens.radius.pill, padding:"8px 18px", cursor:"pointer", fontSize: tokens.font.size.sm, color:tokens.color.card, fontWeight: tokens.font.weight.bold, transition: `opacity ${tokens.transition.normal}` },
    enterHint: { fontSize: tokens.font.size.xs, color:tokens.color.text.faded, textAlign:"right", marginTop:4 },
    synthesisCard: { padding:"16px 18px", background:tokens.color.semantic.success.bg, borderTop: `2px solid ${tokens.color.semantic.success.border}`, borderBottom: `2px solid ${tokens.color.semantic.success.border}` },
    synthesisTitle: { fontSize: tokens.font.size.sm, fontWeight: tokens.font.weight.bold, color:tokens.color.semantic.success.fg, marginBottom:12, letterSpacing:0.5 },
    synthesisChain: { fontSize: tokens.font.size.body, color:tokens.color.text.body, lineHeight:2, marginBottom:14, background:tokens.color.card, padding:"12px 14px", borderRadius: tokens.radius.pill, border: `1px solid ${tokens.color.semantic.success.strong}` },
    synthesisLabel: { fontWeight: tokens.font.weight.bold, color:tokens.color.brand.primary, fontSize: tokens.font.size.xs, display:"inline-block", padding:"1px 6px", background:tokens.color.brand.light, borderRadius: tokens.radius.tight, marginRight:4 },
    synthesisAnswer: { color:tokens.color.text.primary },
    synthesisArrow: { color:tokens.color.semantic.success.border, fontWeight: tokens.font.weight.bold, margin:"0 2px" },
    synthesisActions: { display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 },
    synthesisHint: { fontSize: tokens.font.size.caption, color:tokens.color.semantic.success.fg, fontWeight:500 },
    resetBtn: { background:tokens.color.card, border: `1px solid ${tokens.color.semantic.success.border}`, borderRadius: tokens.radius.pill, padding:"4px 12px", cursor:"pointer", fontSize: tokens.font.size.caption, color:tokens.color.semantic.success.fg, fontWeight:600 },
    riskNote: { padding:"10px 18px 12px", fontSize: tokens.font.size.caption, color:tokens.color.text.label, lineHeight: tokens.font.lineHeight.normal, borderTop: `1px solid ${tokens.color.border.subtle}`, background:tokens.color.subtle },
  };

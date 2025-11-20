// pipeline.js
// VCC Pipeline v2
// Input -> preprocess -> pattern match -> lite sentiment -> confidence score -> final response -> metrics hook

import { VibeEngine } from "./pmrs-v2.js";
import patterns from "./patterns-v2.json" assert { type: "json" };
import sentimentLex from "./sentiment-lex.json" assert { type: "json" };

export class VCCPipeline {
  constructor({ patternsList = patterns, synonyms = {}, metricsHook = null } = {}) {
    this.engine = new VibeEngine(patternsList, synonyms);
    this.metricsHook = typeof metricsHook === "function" ? metricsHook : () => {};
    // lightweight sentiment lexicons
    this.pos = new Set(sentimentLex.positive || []);
    this.neg = new Set(sentimentLex.negative || []);
  }

  // normalize and trim, keep punctuation for phrase detection
  preprocess(raw) {
    if (!raw || typeof raw !== "string") return "";
    let t = raw.trim();
    t = t.replace(/\s+/g, " ");
    return t;
  }

  // Very small sentiment analyser (counts positive vs negative tokens)
  liteSentiment(text) {
    const clean = text.toLowerCase().replace(/[^\w\s]/g, "");
    const tokens = clean.split(/\s+/).filter(Boolean);
    let posCount = 0, negCount = 0;
    for (const tk of tokens) {
      if (this.pos.has(tk)) posCount++;
      if (this.neg.has(tk)) negCount++;
    }
    const score = posCount - negCount; // -inf..+inf (small integers)
    // normalized polarity -1..1
    const polarity = score === 0 ? 0 : score > 0 ? Math.min(1, score / 4) : Math.max(-1, score / 4);
    return { score, polarity, posCount, negCount };
  }

  // confidence combiner: uses engineScore estimate (if available) + sentiment match bonus
  computeConfidence(engineScore = 0, sentimentPolarity = 0, categoryPriority = 1) {
    // engineScore ~ raw number (from pmrs scoring). Normalize it roughly:
    const normalizedEngine = Math.tanh(engineScore / 4); // -1..1
    // blend: engine 70% + sentiment 20% + priority 10%
    const raw = (0.7 * normalizedEngine) + (0.2 * sentimentPolarity) + (0.1 * (categoryPriority / 2));
    // scale to 0..100
    const conf = Math.round(((raw + 1) / 2) * 100);
    return Math.max(0, Math.min(100, conf));
  }

  // Runs the full pipeline; returns a structured result
  run(rawInput) {
    const input = this.preprocess(rawInput);
    // Step 1: pattern analysis (returns best entry object and roughly its score via engine internals)
    // Using private-like access: engine.analyze returns response only; we need score. We'll call engine.scoreMatch for each entry.
    // But VibeEngine API gives scoreMatch in C; to avoid touching private we can replicate lightweight scoring using engine.scoreMatch if available.
    // Assume VibeEngine has scoreMatch and preprocess methods (from module C). Use them.
    const engine = this.engine;
    const cleaned = engine.preprocess(input);
    let best = { score: 0, entry: null };

    // iterate patterns stored inside engine (pattern list)
    for (const entry of engine.patterns) {
      const r = engine.scoreMatch(cleaned, entry); // returns {score, triggered} per module C implementation
      if (r.triggered && r.score > best.score) {
        best = { score: r.score, entry };
      }
    }

    // fallback if nothing matched
    if (!best.entry) {
      // log metric and return fallback
      this.metricsHook({ input, matched: false, timestamp: Date.now() });
      return {
        ok: true,
        matched: false,
        input,
        category: "none",
        response: "No detectable vibe signature.",
        confidence: 15,
        engineScore: 0,
        sentiment: { score: 0, polarity: 0 }
      };
    }

    // sentiment check
    const sentiment = this.liteSentiment(input);

    // compute confidence
    const categoryPriority = best.entry.priority ?? 1;
    const confidence = this.computeConfidence(best.score, sentiment.polarity, categoryPriority);

    // final resolver: allow slight overrides (eg: if sentiment polarity contradicts category, reduce confidence)
    // If category is 'sad' but sentimentPolarity > 0.5 => lower confidence
    let finalConfidence = confidence;
    if ((best.entry.category === "sad" || best.entry.category === "angry") && sentiment.polarity > 0.5) {
      finalConfidence = Math.round(confidence * 0.55);
    }
    if ((best.entry.category === "hype") && sentiment.polarity < -0.4) {
      finalConfidence = Math.round(confidence * 0.6);
    }

    // prepare result
    const result = {
      ok: true,
      matched: true,
      input,
      category: best.entry.category,
      response: best.entry.response,
      confidence: finalConfidence,      // 0..100
      engineScore: best.score,
      sentiment
    };

    // metrics logging hook
    try {
      this.metricsHook({
        input,
        matched: true,
        category: result.category,
        confidence: result.confidence,
        engineScore: result.engineScore,
        sentiment: result.sentiment,
        timestamp: Date.now()
      });
    } catch (e) {
      // swallow metric hook errors (non-critical)
      console.warn("metricsHook failed:", e);
    }

    return result;
  }
}

// ------------------------------------------
// VCC MODULE C — Pattern Matching v2
// Smart, scored, zombie-proof matcher
// ------------------------------------------

export class VibeEngine {
    constructor(patterns, synonyms = {}) {
        this.patterns = patterns;
        this.synonyms = synonyms;
    }

    preprocess(text) {
        let t = text.toLowerCase().trim();
        t = t.replace(/\s+/g, " ");
        return t;
    }

    tokenize(text) {
        return text.split(" ").map(w => this.stem(w));
    }

    // super-light stemmer
    stem(word) {
        return word
            .replace(/ing$|ed$|s$/g, "")
            .replace(/ly$/g, "");
    }

    mapSynonyms(token) {
        return this.synonyms[token] || token;
    }

    detectNegation(tokens) {
        const negators = ["not", "no", "never", "nah"];
        return tokens.some(t => negators.includes(t));
    }

    scoreMatch(input, patternEntry) {
        const tokens = this.tokenize(input).map(t => this.mapSynonyms(t));

        let score = 0;
        let triggered = false;

        for (const trig of patternEntry.triggers) {
            const t = trig.toLowerCase();

            // multi-word trigger
            if (t.includes(" ")) {
                if (input.includes(t)) {
                    score += 3;
                    triggered = true;
                }
            } else {
                if (tokens.includes(this.stem(t))) {
                    score += 1.5;
                    triggered = true;
                }
            }
        }

        // category priority weight
        score *= patternEntry.priority ?? 1;

        // negation logic
        if (this.detectNegation(tokens)) {
            if (patternEntry.category === "sad") score = 0;
            if (patternEntry.category === "angry") score *= 0.3;
        }

        return { score, triggered };
    }

    analyze(input) {
        const clean = this.preprocess(input);

        let best = { score: 0, entry: null };

        for (const entry of this.patterns) {
            const result = this.scoreMatch(clean, entry);

            if (result.score > best.score) {
                best = { score: result.score, entry };
            }
        }

        return best.entry
            ? best.entry.response
            : "No detectable vibe signature.";
    }
}

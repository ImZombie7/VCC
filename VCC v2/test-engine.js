import { VibeEngine } from "./pmrs-v2.js";
import patterns from "./patterns-v2.json" assert { type: "json" };
import synonyms from "./synonyms.json" assert { type: "json" };

const engine = new VibeEngine(patterns, synonyms);

console.log(engine.analyze("Bro I'm not sad"));
console.log(engine.analyze("LETS GOOOOO"));
console.log(engine.analyze("Feeling kinda furious"));
console.log(engine.analyze("sup"));

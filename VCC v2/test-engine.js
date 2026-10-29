// test-engine.js
const { VibeEngine } = require("./pmrs-v2.js");
const patterns = require("./patterns-v2.json");
const synonyms = require("./synonyms.json");

const engine = new VibeEngine(patterns, synonyms);

console.log(engine.analyze("Bro I'm not sad"));
console.log(engine.analyze("LETS GOOOOO"));
console.log(engine.analyze("Feeling kinda furious"));
console.log(engine.analyze("sup"));

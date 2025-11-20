// pipeline-test.js
import { VCCPipeline } from "./pipeline.js";
import synonyms from "./synonyms.json" assert { type: "json" };

// simple in-memory metrics hook for demo
const metrics = [];
const metricsHook = (m) => metrics.push(m);

const pipeline = new VCCPipeline({ synonyms, metricsHook });

// sample inputs
const inputs = [
  "hey bro, I'm feeling kinda sad today",
  "lets goooo im hyped",
  "i am not sad at all",
  "this is so annoying and i'm furious"
];

for (const t of inputs) {
  const out = pipeline.run(t);
  console.log("INPUT:", t);
  console.log("OUT:", out);
  console.log("------");
}

console.log("METRICS SAMPLE:", metrics.slice(-5));

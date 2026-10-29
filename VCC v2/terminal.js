// VCC Terminal v2
// Interactive terminal interface for the VCC v2 pipeline

const { VCCPipeline } = require("./pipeline.js");
const synonyms = require("./synonyms.json");

// Initialize the pipeline with synonyms
const pipeline = new VCCPipeline({ synonyms });

// Simple in-memory metrics hook for demo
const metrics = [];
const metricsHook = (m) => metrics.push(m);

// Display help information
function showHelp() {
  console.log("\n=== VCC Terminal Help ===");
  console.log("Enter your message to analyze its vibe.");
  console.log("Commands:");
  console.log("  help     - Show this help message");
  console.log("  exit     - Exit the terminal");
  console.log("  clear    - Clear the screen");
  console.log("  metrics  - Show recent metrics");
  console.log("\nExamples:");
  console.log("  hello bro!");
  console.log("  I'm feeling sad today");
  console.log("  Let's goooo!");
  console.log("  I'm furious about this");
  console.log("  sup");
  console.log("======================\n");
}

// Display metrics
function showMetrics() {
  console.log("\n=== Recent Metrics ===");
  if (metrics.length === 0) {
    console.log("No metrics recorded yet.");
  } else {
    const recent = metrics.slice(-5);
    recent.forEach((m, i) => {
      console.log(
        `${i + 1}. [${new Date(m.timestamp).toLocaleTimeString()}] ` +
          `Input: "${m.input}" | Matched: ${m.matched ? m.category : "none"} | Confidence: ${m.confidence || 0}%`,
      );
    });
  }
  console.log("======================\n");
}

// Clear the screen (simple approach)
function clearScreen() {
  console.clear();
  showHelp();
}

// Main terminal loop
async function runTerminal() {
  console.clear();
  showHelp();

  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });

  readline.prompt();

  readline.on("line", async (input) => {
    const trimmed = input.trim();

    if (trimmed.toLowerCase() === "exit") {
      console.log("\nExiting VCC Terminal. Goodbye!");
      readline.close();
      return;
    }

    if (trimmed.toLowerCase() === "help") {
      showHelp();
      readline.prompt();
      return;
    }

    if (trimmed.toLowerCase() === "clear") {
      clearScreen();
      readline.prompt();
      return;
    }

    if (trimmed.toLowerCase() === "metrics") {
      showMetrics();
      readline.prompt();
      return;
    }

    if (!trimmed) {
      console.log("Please enter a message or command.");
      readline.prompt();
      return;
    }

    try {
      // Run the pipeline
      const result = pipeline.run(trimmed);

      // Display results
      console.log("\n=== VCC Analysis ===");
      console.log(`Input:    "${result.input}""`);
      console.log(`Category: ${result.category}`);
      console.log(`Response: ${result.response}`);
      console.log(`Confidence: ${result.confidence}%"`);
      console.log(`Engine Score: ${result.engineScore}`);
      console.log(
        `Sentiment: ${result.sentiment.polarity > 0 ? "Positive" : result.sentiment.polarity < 0 ? "Negative" : "Neutral"} (score: ${result.sentiment.score})"`,
      );
      console.log("==================\n");
    } catch (error) {
      console.error("Error processing input:", error.message);
    }

    readline.prompt();
  });

  readline.on("close", () => {
    process.exit(0);
  });
}

// Start the terminal
runTerminal();

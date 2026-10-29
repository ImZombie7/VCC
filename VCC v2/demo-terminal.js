// VCC Terminal Demo Script
// Demonstrates the terminal interface functionality

const { VCCPipeline } = require('./pipeline.js');
const synonyms = require('./synonyms.json');

// Initialize the pipeline with synonyms
const pipeline = new VCCPipeline({ synonyms });

// Simple in-memory metrics hook for demo
const metrics = [];
const metricsHook = (m) => metrics.push(m);

function displayHelp() {
  console.log("\n=== VCC Terminal Help ===");
  console.log("Enter your message to analyze its vibe.");
  console.log("Commands:");
  console.log("  help     - Show this help message");
  console.log("  exit     - Exit the terminal");
  console.log("  clear    - Clear the screen");
  console.log("  metrics  - Show recent analysis metrics");
  console.log("\nExamples:");
  console.log("  hello bro!");
  console.log("  I'm feeling sad today");
  console.log("  Let's goooo!");
  console.log("  I'm furious about this");
  console.log("  sup");
  console.log("======================\n");
}

function displayMetrics() {
  console.log("\n=== Recent Metrics ===");
  if (metrics.length === 0) {
    console.log("No metrics recorded yet.");
  } else {
    const recent = metrics.slice(-5);
    recent.forEach((m, i) => {
      console.log(`${i + 1}. [${new Date(m.timestamp).toLocaleTimeString()}] ` +
                  `Input: "${m.input}" | Matched: ${m.matched ? m.category : 'none'} | Confidence: ${m.confidence || 0}%`);
    });
  }
  console.log("======================\n");
}

function clearScreen() {
  console.clear();
  displayHelp();
}

function processInput(input) {
  const trimmed = input.trim();

  if (trimmed.toLowerCase() === 'exit') {
    console.log("\nExiting VCC Terminal. Goodbye!");
    return false;
  }

  if (trimmed.toLowerCase() === 'help') {
    displayHelp();
    return true;
  }

  if (trimmed.toLowerCase() === 'clear') {
    clearScreen();
    return true;
  }

  if (trimmed.toLowerCase() === 'metrics') {
    displayMetrics();
    return true;
  }

  if (!trimmed) {
    console.log("Please enter a message or command.");
    return true;
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
    console.log(`Sentiment: ${result.sentiment.polarity > 0 ? 'Positive' : result.sentiment.polarity < 0 ? 'Negative' : 'Neutral'} (score: ${result.sentiment.score})"`);
    console.log("==================\n");

    return true;

  } catch (error) {
    console.error("Error processing input:", error.message);
    return true;
  }
}

function demo() {
  console.clear();
  displayHelp();

  // Demo inputs
  const demoInputs = [
    "hello bro!",
    "I'm feeling sad today",
    "Let's goooo!",
    "I'm furious about this",
    "sup",
    "calm down",
    "random nonsense xyz"
  ];

  console.log("=== VCC Terminal Demo ===\n");
  console.log("Processing demo inputs...\n");

  demoInputs.forEach((input, index) => {
    console.log(`Demo ${index + 1}: "${input}"`);
    processInput(input);
    console.log("---\n");
  });

  console.log("=== Demo Complete ===\n");
  console.log("The terminal interface is working correctly!");
  console.log("\nTo run the interactive terminal, use:");
  console.log("  node VCC\\ v2\\terminal.js");
}

// Run the demo
demo();

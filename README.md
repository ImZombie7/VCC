# VCC

A Vibe-Check-by-prompt Neural-Terminal. Made by @ImZombie7 , GPT-5 &amp; Gemini 2.5 Flash

## Usage

VCC v2 provides a pattern-matching pipeline for detecting vibes in text. Here's how to use it:

### Command Line Interface

Run the terminal interface:

```bash
node VCC\ v2/terminal.js
```

The terminal will accept user input and display:

- Detected vibe category
- Response message
- Confidence score (0-100%)
- Engine score and sentiment analysis

### Commands

- `help` - Show this help message
- `exit` - Exit the terminal
- `clear` - Clear the screen
- `metrics` - Show recent analysis metrics

### Examples

```
> hello bro!
=== VCC Analysis ===
Input:    "hello bro!"
Category: greeting
Response: Yo fam, welcome back to the neon grid.
Confidence: 85%
Engine Score: 1.5
Sentiment: Positive (score: 1)
==================

> I'm feeling sad today
=== VCC Analysis ===
Input:    "I'm feeling sad today"
Category: sad
Response: Energy levels dropping... deploying morale boosters.
Confidence: 72%
Engine Score: 2.0
Sentiment: Negative (score: -1)
==================
```

### Programmatic Usage

Import the pipeline in your JavaScript code:

```javascript
import { VCCPipeline } from './VCC\ v2/pipeline.js';
import synonyms from './VCC\ v2/synonyms.json' assert { type: "json" };

const pipeline = new VCCPipeline({ synonyms });
const result = pipeline.run("your input text");
console.log(result);
```

The pipeline returns an object with:

- `category`: Detected vibe category
- `response`: Response message
- `confidence`: Confidence score (0-100%)
- `engineScore`: Raw engine score
- `sentiment`: Sentiment analysis results
- `input`: Processed input text

### VCC v2 Engine

VCC v2 includes:

- Pattern matching for 5 vibe categories: greeting, sad, angry, hype, chill
- Synonym mapping for better detection
- Sentiment analysis
- Confidence scoring
- Metrics tracking

See the `VCC\ v2/` directory for implementation details and test files.

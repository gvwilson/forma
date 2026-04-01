# forma

Forma (short for *formative assessment*) is a standalone JavaScript
package providing eight interactive assessment widgets:

| Widget | Description |
|---|---|
| MultipleChoice | Single-answer question with per-option explanations and immediate feedback |
| Flashcard | Spaced-repetition card deck with self-rating |
| Ordering | Drag-and-drop item sequencing |
| Matching | Drag-and-drop left-to-right pairing |
| Labeling | Drag numbered labels onto text lines |
| ConceptMap | Draw directed relationships between concept nodes |
| NumericEntry | Learner types a number; correct if within a configurable tolerance |
| PredictThenCheck | Predict code output via multiple choice, then reveal the actual output |

## Installation

```
npm install forma
```

Or load directly in HTML without a build step:

```html
<script src="https://cdn.jsdelivr.net/npm/@gvwilson/forma" type="module"></script>
```

## Usage

### Render via JavaScript

```js
import {
  renderMultipleChoice, renderFlashcard, renderOrdering,
  renderMatching, renderLabeling, renderConceptMap,
  renderNumericEntry, renderPredictThenCheck,
} from 'forma';

renderMultipleChoice(document.getElementById('target'), {
  question: 'What is 2 + 2?',
  options: ['Three', 'Four', 'Five'],
  correct_answer: 1,           // zero-based index
  explanations: [
    'Wrong: three is one less than four.',
    'Correct: two plus two equals four.',
    'Wrong: five is one more than four.',
  ],
  lang: 'en',
});
```

Each `renderXxx(el, config)` call mounts a widget into `el` using the
properties described below.

### Auto-mount from HTML

When the bundle is loaded, it scans the page for `div.forma-*` elements and
mounts the corresponding widget, replacing the markup. This lets you author
exercises in plain HTML or Markdown.

```html
<div class="forma-multiple-choice" data-lang="en">
  <p>What is 2 + 2?</p>
  <dl>
    <dt>Three</dt><dd>Wrong: three is one less than four.</dd>
    <dt>Four</dt><dd>Correct: two plus two equals four.</dd>
    <dt>Five</dt><dd>Wrong: five is one more than four.</dd>
  </dl>
</div>

<script type="module" src="forma.js"></script>
```

You can also call `autoMount()` manually on a subtree:

```js
import { autoMount } from 'forma';
autoMount(document.getElementById('exercises'));
```

## Widget Configuration

### Multiple Choice

For HTML and Markdown configuration, the `<dd>` whose text starts with
the word "Correct" (case-insensitive) identifies the correct option.
All other `<dd>` elements are shown for incorrect options.

#### JavaScript

```js
renderMultipleChoice(el, {
  question: 'string',
  options: ['option 0', 'option 1', ...],
  correct_answer: 0,            // zero-based index
  explanations: [               // shown after answering (one per option)
    'Why option 0 is wrong.',
    'Why option 1 is wrong.',
    ...
  ],
  explanation: 'string',        // fallback shown if explanations is omitted
  lang: 'en',                   // 'en' | 'fr' | 'es'
});
```

#### HTML

```html
<div class="forma-multiple-choice" data-lang="en">
  <p>Question text</p>
  <dl>
    <dt>Option A</dt><dd>Wrong: reason A is incorrect.</dd>
    <dt>Option B</dt><dd>Correct: reason B is right.</dd>
    <dt>Option C</dt><dd>Wrong: reason C is incorrect.</dd>
  </dl>
</div>
```

#### Markdown

```html
<div class="forma-multiple-choice" data-lang="en" markdown="1">

Question text

Option A
:   Wrong: reason A is incorrect.

Option B
:   Correct: reason B is right.

Option C:
:   Wrong: reason C is incorrect.

</div>
```

### Flashcard

Cards are shuffled automatically.

#### JavaScript

```js
renderFlashcard(el, {
  question: 'Deck title',
  cards: [{ front: 'Q1', back: 'A1' }, ...],
  shuffle: true,
  lang: 'en',
});
```

#### HTML

```html
<div class="forma-flashcard" data-lang="en">
  <p>Deck title</p>
  <dl>
    <dt>Front of card 1</dt><dd>Back of card 1</dd>
    <dt>Front of card 2</dt><dd>Back of card 2</dd>
  </dl>
</div>
```

#### Markdown

```html
<div class="forma-flashcard" data-lang="en" markdown="1">

Deck title

Front of card 1
:   Back of card 1

Front of card 2
:   Back of card 2

</div>
```

### Ordering

For HTML and Markdown configuration, the `<ol>` lists items in the
correct order. Items are shuffled automatically before display.

#### JavaScript

```js
renderOrdering(el, {
  question: 'string',
  items: ['step 1', 'step 2', ...],       // correct order
  current_order: ['step 3', 'step 1', ...], // order shown to student
  shuffle: true,
  lang: 'en',
});
```

#### HTML

```html
<div class="forma-ordering" data-lang="en">
  <p>Question text</p>
  <ol>
    <li>First step (correct position)</li>
    <li>Second step</li>
    <li>Third step</li>
  </ol>
</div>
```

#### Markdown

```html
<div class="forma-ordering" data-lang="en" markdown="1">

Question text

1.  First step (correct position)
1.  Second step
1.  Third step

</div>
```

### Matching

For HTML and Markdown configuration, each row in the table defines a
matched pair. The right column is shuffled automatically.  If a header
row is present, it is ignored (so that tables generated from Markdown
can be handled).

#### JavaScript

```js
renderMatching(el, {
  question: 'string',
  left:  ['A', 'B', 'C'],
  right: ['X', 'Y', 'Z'],   // order as displayed (pre-shuffle if desired)
  correct_matches: { 0: 2, 1: 0, 2: 1 }, // left index → right index
  lang: 'en',
});
```

#### HTML

```html
<div class="forma-matching" data-lang="en">
  <p>Question text</p>
  <table>
    <tr><td>Left item 1</td><td>Right item 1</td></tr>
    <tr><td>Left item 2</td><td>Right item 2</td></tr>
  </table>
</div>
```

#### Markdown

```html
<div class="forma-matching" data-lang="en" markdown="1">

Question text

| Item | Label |
| ---- | ----- |
| Left item 1 | Right item 1 |
| Left item 2 | Right item 2 |

</div>
```

### Labeling

For HTML and Markdown configuration, column 1 is the text to label,
and column 2 is the correct label name (or comma-separated list for
lines that accept multiple labels). The available label set is derived
automatically from unique names in column 2.  If a header row is
present, it is ignored (so that tables generated from Markdown can be
handled).

#### JavaScript

```js
renderLabeling(el, {
  question: 'string',
  labels: ['Label A', 'Label B', ...],
  text_lines: ['line 0', 'line 1', ...],
  correct_labels: {
    0: [0],    // line 0 → label index 0
    1: [1, 2], // line 1 → label indices 1 and 2
  },
  lang: 'en',
});
```

#### HTML

```html
<div class="forma-labeling" data-lang="en">
  <p>Question text</p>
  <table>
| Text line 1 | Label name |
| Text line 2 | Label A, Label B |
  </table>
</div>
```

#### Markdown

```html
<div class="forma-labeling" data-lang="en" markdown="1">

Question text

| Text | Label |
| ---- | ----- |
| Text line 1 | Label name |
| Text line 2 | Label A, Label B |

</div>
```

### Concept map

For HTML and Markdown configuration, each row defines one correct
directed edge. The node list and term list are inferred automatically
from the table in first-appearance order.  If a header row is present,
it is ignored (so that tables generated from Markdown can be handled).

#### JavaScript

```js
renderConceptMap(el, {
  question: 'string',
  concepts: ['Node A', 'Node B', 'Node C'],
  terms:    ['relationship 1', 'relationship 2'],
  correct_edges: [
    { from: 'Node A', label: 'relationship 1', to: 'Node B' },
  ],
  lang: 'en',
});
```

#### HTML

```html
<div class="forma-concept-map" data-lang="en">
  <p>Question text</p>
  <table>
| Source node | relationship | Target node |
| Node A</td>    <td>leads to</td>    <td>Node B |
  </table>
</div>
```

#### Markdown

```html
<div class="forma-concept-map" data-lang="en" markdown="1">

Question text

| From | Link | To |
| ---- | ---- | -- |
| Source node | relationship | Target node |
| Node A | leads to | Node B |

</div>
```

### Numeric entry

The answer is accepted as correct when
`|entered − correct_answer| < tolerance`.
The default tolerance is `1e-9`, suitable for exact integer answers.
For HTML and Markdown configuration, `data-correct` is the expected
numeric answer and `data-tolerance` is the acceptance window.
The learner can press Enter or click Submit to check their answer.

#### JavaScript

```js
renderNumericEntry(el, {
  question: 'string',
  correct_answer: 42,
  tolerance: 0.01,      // |entered - correct| must be less than this
  explanation: 'string', // shown after answering (optional)
  lang: 'en',
});
```

#### HTML

```html
<div class="forma-numeric-entry" data-correct="42" data-tolerance="0.01" data-lang="en">
  <p>Question text</p>
</div>
```

#### Markdown

```html
<div class="forma-numeric-entry" data-correct="42" data-tolerance="0.01" data-lang="en" markdown="1">

Question text

</div>
```

### Predict-Then-Check

The learner reads the code, selects their predicted output, and
receives immediate feedback with a per-option explanation. A Reveal
Output button (disabled after clicking) shows the actual output so the
learner can verify by running the code themselves.

For HTML and Markdown configuration, `<pre>` holds the code; `<samp>`
holds the actual output. Options and explanations come from `<dl>`
(same `<dd>` "Correct" prefix convention as MultipleChoice).

#### JavaScript

```js
renderPredictThenCheck(el, {
  question: 'string',
  code: 'x = 2 + 2\nprint(x)',   // code block shown to the learner
  output: '4',                    // actual output revealed on demand
  options: ['2', '4', '22'],
  correct_answer: 1,              // zero-based index
  explanations: [
    'Wrong: + is addition here, not string concatenation.',
    'Correct: 2 + 2 = 4.',
    'Wrong: that would require string concatenation.',
  ],
  explanation: 'string',          // fallback if explanations is omitted
  lang: 'en',
});
```

#### HTML

```html
<div class="forma-predict-then-check" data-lang="en">
  <p>Question text</p>
  <pre>x = 2 + 2
print(x)</pre>
  <dl>
    <dt>2</dt><dd>Wrong: + is addition here, not string concatenation.</dd>
    <dt>4</dt><dd>Correct: 2 + 2 = 4.</dd>
    <dt>22</dt><dd>Wrong: that would require string concatenation.</dd>
  </dl>
  <samp>4</samp>
</div>
```

#### Markdown

```html
<div class="forma-predict-then-check" data-lang="en" markdown="1">

Question text

```
x = 2 + 2
print(x)
```

2
:   Wrong: + is addition here, not string concatenation.

4
:   Correct: 2 + 2 = 4.

22
:   Wrong: that would require string concatenation.

<samp>4</samp>
</div>
```

## Development

```sh
npx playwright install chromium   # one-time browser install
npm install          # install esbuild and Playwright
npm run build        # build dist/forma.js and dist/widgets/
npm test             # build then run all Playwright tests
npm run serve        # and then go to http://localhost:7700/examples/index.html
```

-   During development, it is sometimes useful to visit
    <https://www.jsdelivr.com/tools/purge> to clear the CDN's cache so
    that pages load the most recently uploaded version of the package.

-   Use `uv run bin/md2html.py examples/markdown.md examples/markdown.html`
    to regenerate the HTML version of the Markdown examples.

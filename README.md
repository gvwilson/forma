# forma

**Forma** (short for *formative assessment*) is a standalone JavaScript package
providing six interactive assessment widgets:

| Widget | Description |
|---|---|
| MultipleChoice | Single-answer question with immediate feedback |
| Flashcard | Spaced-repetition card deck with self-rating |
| Ordering | Drag-and-drop item sequencing |
| Matching | Drag-and-drop left-to-right pairing |
| Labeling | Drag numbered labels onto text lines |
| ConceptMap | Draw directed relationships between concept nodes |

## Installation

```
npm install forma
```

Or load directly in HTML without a build step:

```html
<script type="module" src="https://unpkg.com/forma/dist/forma.js"></script>
```

## Usage

### Render via JavaScript

```js
import {
  renderMultipleChoice, renderFlashcard, renderOrdering,
  renderMatching, renderLabeling, renderConceptMap,
} from 'forma';

renderMultipleChoice(document.getElementById('target'), {
  question: 'What is 2 + 2?',
  options: ['Three', 'Four', 'Five'],
  correct_answer: 1,   // zero-based index
  explanation: 'Two plus two equals four.',
  lang: 'en',
});
```

Each `renderXxx(el, config)` call mounts a widget into `el` using the
properties described below.

### Auto-mount from HTML

When the bundle is loaded, it scans the page for `div.marimo-*` elements and
mounts the corresponding widget, replacing the markup. This lets you author
exercises in plain HTML or Markdown:

```html
<div class="marimo-multiple-choice" data-correct="1">
  <p>What is 2 + 2?</p>
  <ol>
    <li>Three</li>
    <li>Four (correct — zero-based index matches data-correct)</li>
    <li>Five</li>
  </ol>
</div>

<script type="module" src="forma.js"></script>
```

You can also call `autoMount()` manually on a subtree:

```js
import { autoMount } from 'forma';
autoMount(document.getElementById('exercises'));
```

## Widget configuration

### Multiple choice

**JavaScript**:
```js
renderMultipleChoice(el, {
  question: 'string',
  options: ['option 0', 'option 1', ...],
  correct_answer: 0,       // zero-based index
  explanation: 'string',   // shown after answering (optional)
  lang: 'en',              // 'en' | 'fr' | 'es'
});
```

**HTML**:
```html
<div class="marimo-multiple-choice" data-correct="2" data-lang="en">
  <p>Question text</p>
  <ol>
    <li>Option A</li>
    <li>Option B</li>
    <li>Option C  ← correct (index 2)</li>
  </ol>
</div>
```

`data-correct` is the zero-based index of the correct option.

### Flashcard

**JavaScript**:
```js
renderFlashcard(el, {
  question: 'Deck title',
  cards: [{ front: 'Q1', back: 'A1' }, ...],
  shuffle: true,
  lang: 'en',
});
```

**HTML**:
```html
<div class="marimo-flashcard" data-lang="en">
  <p>Deck title (optional)</p>
  <dl>
    <dt>Front of card 1</dt><dd>Back of card 1</dd>
    <dt>Front of card 2</dt><dd>Back of card 2</dd>
  </dl>
</div>
```

Cards are shuffled automatically.

### Ordering

**JavaScript**:
```js
renderOrdering(el, {
  question: 'string',
  items: ['step 1', 'step 2', ...],       // correct order
  current_order: ['step 3', 'step 1', ...], // order shown to student
  shuffle: true,
  lang: 'en',
});
```

**HTML**:
```html
<div class="marimo-ordering" data-lang="en">
  <p>Question text</p>
  <ol>
    <li>First step (correct position)</li>
    <li>Second step</li>
    <li>Third step</li>
  </ol>
</div>
```

The `<ol>` lists items in the **correct** order. Items are shuffled
automatically before display.

### Matching

**JavaScript**:
```js
renderMatching(el, {
  question: 'string',
  left:  ['A', 'B', 'C'],
  right: ['X', 'Y', 'Z'],   // order as displayed (pre-shuffle if desired)
  correct_matches: { 0: 2, 1: 0, 2: 1 }, // left index → right index
  lang: 'en',
});
```

**HTML**:
```html
<div class="marimo-matching" data-lang="en">
  <p>Question text</p>
  <table>
    <tr><td>Left item 1</td><td>Right item 1</td></tr>
    <tr><td>Left item 2</td><td>Right item 2</td></tr>
  </table>
</div>
```

Each row defines a matched pair. The right column is shuffled automatically.

### Labeling

**JavaScript**:
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

**HTML**:
```html
<div class="marimo-labeling" data-lang="en">
  <p>Question text</p>
  <table>
    <tr><td>Text line 1</td><td>Label name</td></tr>
    <tr><td>Text line 2</td><td>Label A, Label B</td></tr>
  </table>
</div>
```

Column 1 is the text to label; column 2 is the correct label name (or
comma-separated list for lines that accept multiple labels). The available label
set is derived automatically from unique names in column 2.

### Concept map

**JavaScript**:
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

**HTML**:
```html
<div class="marimo-concept-map" data-lang="en">
  <p>Question text</p>
  <table>
    <tr><td>Source node</td><td>relationship</td><td>Target node</td></tr>
    <tr><td>Node A</td>    <td>leads to</td>    <td>Node B</td></tr>
  </table>
</div>
```

Each row defines one correct directed edge. The node list and term list are
inferred automatically from the table in first-appearance order.

## Development

```sh
npm install          # install esbuild and Playwright
npm run build        # build dist/forma.js and dist/widgets/
npm test             # build then run all Playwright tests
npx playwright install chromium   # one-time browser install
```

## License

MIT

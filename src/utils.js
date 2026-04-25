import chotaCSS from './chota.css';
import formaCSS from './forma.css';

export function mk(tag, cls, txt) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (txt !== undefined) el.textContent = txt;
  return el;
}

export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Creates a minimal anywidget-compatible model backed by a plain JS object.
// Used by the standalone bundle so widget render functions work without Python.
export function createModel(data) {
  const state = { ...data };
  return {
    get: (k) => state[k],
    set: (k, v) => { state[k] = v; },
    save_changes: () => {},
    on: () => {},
  };
}

// Injects CSS, creates the .forma container, appends a question div if question
// is non-empty, and returns the container. Call el.appendChild(container) at
// the end of render() after populating it.
export function initWidget(el, question) {
  const s = mk('style');
  s.textContent = chotaCSS + formaCSS;
  el.appendChild(s);
  const container = mk('div', 'forma');
  if (question) container.appendChild(mk('div', 'forma-question', question));
  return container;
}

// Sets feedback text and class on feedbackEl, and optionally populates and
// shows explanationEl if explanation is truthy.
export function showFeedback(ok, feedbackEl, explanationEl, explanation) {
  feedbackEl.textContent = ok ? '✓ Correct!' : '✗ Incorrect';
  feedbackEl.className = `forma-feedback ${ok ? 'forma-correct' : 'forma-incorrect'}`;
  feedbackEl.style.display = 'block';
  if (explanation) {
    explanationEl.textContent = explanation;
    explanationEl.className = 'forma-explanation';
    explanationEl.style.display = 'block';
  }
}

// Builds a .forma-options div containing one radio+label div per option.
// onSelect(i, radio, opts) is called when an option is clicked or changed,
// where i is the index, radio is the input element, and opts is the container.
export function createOptions(options, onSelect) {
  const opts = mk('div', 'forma-options');
  options.forEach((text, i) => {
    const div = mk('div', 'forma-option');
    const radio = mk('input');
    radio.type = 'radio'; radio.name = 'answer'; radio.value = i;
    radio.id = `opt-${i}`; radio.style.marginRight = '10px';
    const lbl = mk('label');
    lbl.htmlFor = `opt-${i}`; lbl.textContent = text; lbl.style.cursor = 'pointer';
    div.append(radio, lbl);
    const select = () => onSelect(i, radio, opts);
    div.addEventListener('click', select);
    radio.addEventListener('change', select);
    opts.appendChild(div);
  });
  return opts;
}

// Wires dragover/dragleave/drop handlers on zone. isSubmitted() is called on
// each event; when true the event is ignored. onDrop(e) is called after
// preventDefault and drop-target class removal.
export function setupDropZone(zone, onDrop, isSubmitted) {
  zone.addEventListener('dragover', e => {
    if (isSubmitted()) return;
    e.preventDefault(); zone.classList.add('forma-drop-target');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('forma-drop-target'));
  zone.addEventListener('drop', e => {
    if (isSubmitted()) return;
    e.preventDefault(); zone.classList.remove('forma-drop-target');
    onDrop(e);
  });
}

// Creates a btnRow div, a primary submit button, and a hidden secondary
// Try Again button. Returns { btnRow, submitBtn, tryAgainBtn } so the caller
// can attach handlers and append buttons in widget-specific order.
export function createSubmitRow(submitLabel) {
  const btnRow = mk('div');
  const submitBtn = mk('button', 'forma-btn forma-btn-primary', submitLabel);
  submitBtn.style.marginRight = '12px';
  const tryAgainBtn = mk('button', 'forma-btn forma-btn-secondary', 'Try Again');
  tryAgainBtn.style.display = 'none';
  return { btnRow, submitBtn, tryAgainBtn };
}

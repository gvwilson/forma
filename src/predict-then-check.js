import styles from './styles.css';
import { addHelpButton } from './help.js';
import { mk } from './utils.js';

const HELP_TEXT = {
  en: 'Read the code, predict what it will output, then select your answer. Use the Reveal Output button to confirm by running it yourself.',
  fr: 'Lisez le code, prédisez ce qu\'il affichera, puis sélectionnez votre réponse. Utilisez le bouton Révéler pour confirmer en l\'exécutant vous-même.',
  es: 'Lea el código, prediga lo que mostrará, luego seleccione su respuesta. Use el botón Revelar para confirmar ejecutándolo usted mismo.',
};

function render({ model, el }) {
  const s = mk('style'); s.textContent = styles; el.appendChild(s);
  const container = mk('div', 'forma');
  container.appendChild(mk('div', 'forma-question', model.get('question')));

  // Code block display
  const code = model.get('code');
  if (code) {
    const pre = mk('pre', 'forma-code');
    const codeEl = mk('code');
    codeEl.textContent = code;
    pre.appendChild(codeEl);
    container.appendChild(pre);
  }

  const opts = mk('div', 'forma-options');
  const options = model.get('options');
  const correct = model.get('correct_answer');
  const explanations = model.get('explanations') || [];
  let answered = false;

  const feedbackEl = mk('div'); feedbackEl.style.display = 'none';
  const explanationEl = mk('div'); explanationEl.style.display = 'none';

  options.forEach((text, i) => {
    const div = mk('div', 'forma-option');
    const radio = mk('input'); radio.type = 'radio'; radio.name = 'answer'; radio.value = i; radio.id = `opt-${i}`; radio.style.marginRight = '10px';
    const lbl = mk('label'); lbl.htmlFor = `opt-${i}`; lbl.textContent = text; lbl.style.cursor = 'pointer';
    div.append(radio, lbl);

    const select = () => {
      if (answered) return;
      radio.checked = true;
      answered = true;
      [...opts.children].forEach((opt, j) => {
        opt.classList.add('forma-answered', j === correct ? 'forma-correct' : j === i ? 'forma-incorrect' : 'forma-faded');
      });
      const ok = i === correct;
      feedbackEl.textContent = ok ? '✓ Correct!' : '✗ Incorrect';
      feedbackEl.className = `forma-feedback ${ok ? 'forma-correct' : 'forma-incorrect'}`;
      feedbackEl.style.display = 'block';
      const expl = explanations[i] || model.get('explanation');
      if (expl) { explanationEl.textContent = expl; explanationEl.className = 'forma-explanation'; explanationEl.style.display = 'block'; }
      model.set('value', { selected: i, correct: ok, answered: true });
      model.save_changes();
    };

    div.addEventListener('click', select);
    radio.addEventListener('change', select);
    opts.appendChild(div);
  });

  container.append(opts, feedbackEl, explanationEl);

  // Reveal button lets the learner verify by seeing/running the actual output
  const output = model.get('output');
  if (output !== undefined && output !== null && output !== '') {
    const revealBtn = mk('button', 'forma-btn forma-btn-secondary forma-reveal-btn', 'Reveal Output');
    const outputEl = mk('pre', 'forma-output');
    outputEl.style.display = 'none';
    outputEl.textContent = output;

    revealBtn.addEventListener('click', () => {
      outputEl.style.display = 'block';
      revealBtn.disabled = true;
    });

    container.append(revealBtn, outputEl);
  }

  addHelpButton(container, model.get('lang'), HELP_TEXT);
  el.appendChild(container);
}

// Parse a <div class="forma-predict-then-check"> block.
// Question from <p>; code from <pre>; actual output from <samp>.
// Options/explanations from <dl> (dt=option, dd=explanation, "Correct" prefix = answer)
// or from <ol> with data-correct attribute (legacy, no per-option explanations).
export function parseHTML(div) {
  const question = div.querySelector('p')?.textContent.trim() ?? '';
  const lang = div.dataset.lang ?? 'en';
  const code = div.querySelector('pre')?.textContent ?? '';
  const output = div.querySelector('samp')?.textContent.trim() ?? '';

  const dl = div.querySelector('dl');
  if (dl) {
    const dts = [...dl.querySelectorAll('dt')];
    const dds = [...dl.querySelectorAll('dd')];
    const options = dts.map(dt => dt.textContent.trim());
    const explanations = dds.map(dd => dd.textContent.trim());
    const correct_answer = dds.findIndex(dd => /^correct\b/i.test(dd.textContent.trim()));
    return { question, options, correct_answer: correct_answer === -1 ? 0 : correct_answer, explanations, code, output, lang };
  }

  const options = [...div.querySelectorAll('li')].map(li => li.textContent.trim());
  const correct_answer = parseInt(div.dataset.correct ?? '0');
  return { question, options, correct_answer, code, output, lang };
}

export default { render };

import styles from './styles.css';
import { addHelpButton } from './help.js';
import { mk } from './utils.js';

const HELP_TEXT = {
  en: 'Select the answer you think is correct by clicking on it. Your answer is submitted immediately and you\'ll see whether you were right.',
  fr: 'Cliquez sur la réponse que vous pensez correcte. Votre réponse est soumise immédiatement et vous verrez si vous aviez raison.',
  es: 'Seleccione la respuesta que crea correcta haciendo clic en ella. Su respuesta se envía de inmediato y verá si acertó.',
};

function render({ model, el }) {
  const s = mk('style'); s.textContent = styles; el.appendChild(s);
  const container = mk('div', 'forma');
  container.appendChild(mk('div', 'forma-question', model.get('question')));

  const opts = mk('div', 'forma-options');
  const options = model.get('options');
  const correct = model.get('correct_answer');
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
      const explanations = model.get('explanations');
      const expl = (explanations && explanations[i]) || model.get('explanation');
      if (expl) { explanationEl.textContent = expl; explanationEl.className = 'forma-explanation'; explanationEl.style.display = 'block'; }
      model.set('value', { selected: i, correct: ok, answered: true });
      model.save_changes();
    };

    div.addEventListener('click', select);
    radio.addEventListener('change', select);
    opts.appendChild(div);
  });

  container.append(opts, feedbackEl, explanationEl);
  addHelpButton(container, model.get('lang'), HELP_TEXT);
  el.appendChild(container);
}

// Parse a <div class="forma-multiple-choice"> block.
// Question comes from the first <p>; options from <dt> elements in a <dl>;
// per-option explanations from <dd> elements. The correct answer is whichever
// <dd> starts with the word "Correct" (case-insensitive).
export function parseHTML(div) {
  const question = div.querySelector('p')?.textContent.trim() ?? '';
  const lang = div.dataset.lang ?? 'en';
  const dl = div.querySelector('dl');
  const dts = dl ? [...dl.querySelectorAll('dt')] : [];
  const dds = dl ? [...dl.querySelectorAll('dd')] : [];
  const options = dts.map(dt => dt.textContent.trim());
  const explanations = dds.map(dd => dd.textContent.trim());
  const correct_answer = dds.findIndex(dd => /^correct\b/i.test(dd.textContent.trim()));
  return { question, options, correct_answer: correct_answer === -1 ? 0 : correct_answer, explanations, lang };
}

export default { render };

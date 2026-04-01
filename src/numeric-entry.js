import styles from './styles.css';
import { addHelpButton } from './help.js';
import { mk } from './utils.js';

const HELP_TEXT = {
  en: 'Type a number and click Submit to check your answer. Click Try Again to reset and retry.',
  fr: 'Saisissez un nombre et cliquez sur Soumettre pour vérifier votre réponse. Cliquez sur Réessayer pour recommencer.',
  es: 'Escriba un número y haga clic en Enviar para verificar su respuesta. Haga clic en Reintentar para volver a intentarlo.',
};

// Default tolerance used when none is specified; treats two floats as equal
// when they differ by less than this amount (suitable for most integer answers).
const DEFAULT_TOLERANCE = 1e-9;

function render({ model, el }) {
  const s = mk('style'); s.textContent = styles; el.appendChild(s);
  const container = mk('div', 'forma');
  container.appendChild(mk('div', 'forma-question', model.get('question')));

  const input = mk('input');
  input.type = 'number';
  input.className = 'forma-numeric-input';
  input.placeholder = '…';

  const submitBtn = mk('button', 'forma-btn forma-btn-primary', 'Submit');
  const tryAgainBtn = mk('button', 'forma-btn forma-btn-secondary', 'Try Again');
  tryAgainBtn.style.cssText = 'display:none;margin-left:12px';
  const feedbackEl = mk('div'); feedbackEl.style.display = 'none';
  const explanationEl = mk('div'); explanationEl.style.display = 'none';

  const correct = model.get('correct_answer');
  const tolerance = model.get('tolerance') ?? DEFAULT_TOLERANCE;
  let answered = false;

  const submit = () => {
    if (answered || input.value === '') return;
    const entered = parseFloat(input.value);
    if (isNaN(entered)) return;
    answered = true;
    input.disabled = true;
    submitBtn.disabled = true;

    const ok = Math.abs(entered - correct) < tolerance;
    feedbackEl.textContent = ok ? '✓ Correct!' : '✗ Incorrect';
    feedbackEl.className = `forma-feedback ${ok ? 'forma-correct' : 'forma-incorrect'}`;
    feedbackEl.style.display = 'block';

    const expl = model.get('explanation');
    if (expl) { explanationEl.textContent = expl; explanationEl.className = 'forma-explanation'; explanationEl.style.display = 'block'; }

    tryAgainBtn.style.display = 'inline-block';
    model.set('value', { entered, correct, ok, answered: true });
    model.save_changes();
  };

  tryAgainBtn.addEventListener('click', () => {
    answered = false;
    input.disabled = false;
    input.value = '';
    submitBtn.disabled = false;
    feedbackEl.style.display = 'none';
    explanationEl.style.display = 'none';
    tryAgainBtn.style.display = 'none';
    model.set('value', { entered: null, correct: null, ok: false, answered: false });
    model.save_changes();
  });

  submitBtn.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });

  const row = mk('div', 'forma-numeric-row');
  row.append(input, submitBtn, tryAgainBtn);
  container.append(row, feedbackEl, explanationEl);
  addHelpButton(container, model.get('lang'), HELP_TEXT);
  el.appendChild(container);
}

// Parse a <div class="forma-numeric-entry" data-correct="N" data-tolerance="T"> block.
// Question comes from the first <p>.
export function parseHTML(div) {
  const question = div.querySelector('p')?.textContent.trim() ?? '';
  const correct_answer = parseFloat(div.dataset.correct ?? '0');
  const tolerance = div.dataset.tolerance !== undefined
    ? parseFloat(div.dataset.tolerance)
    : DEFAULT_TOLERANCE;
  return { question, correct_answer, tolerance, explanation: '', lang: div.dataset.lang ?? 'en' };
}

export default { render };

import { addHelpButton } from './help.js';
import { mk, initWidget, shuffle, createSubmitRow } from './utils.js';

const HELP_TEXT = {
  en: 'Drag the items up or down to arrange them in the correct order. Click Check Order to submit your answer, Reset to shuffle and start over, or Try Again after submitting.',
  fr: 'Faites glisser les éléments vers le haut ou le bas pour les mettre dans le bon ordre. Cliquez sur Vérifier l\'ordre pour soumettre, Réinitialiser pour recommencer, ou Réessayer après soumission.',
  es: 'Arrastre los elementos hacia arriba o abajo para ordenarlos correctamente. Haga clic en Verificar orden para enviar, Restablecer para mezclar de nuevo, o Reintentar después de enviar.',
};

function render({ model, el }) {
  const container = initWidget(el, model.get('question'));
  container.appendChild(mk('div', 'forma-instructions', 'Drag items to arrange them in the correct order:'));

  const correct = model.get('items');
  let current = model.get('current_order') || [...correct];
  let submitted = false;

  const itemsEl = mk('div', 'forma-ordering-items');
  const feedbackEl = mk('div'); feedbackEl.style.display = 'none';

  function renderItems() {
    itemsEl.innerHTML = '';
    current.forEach((text, i) => {
      const item = mk('div', 'forma-ordering-item');
      item.draggable = !submitted;
      item.append(mk('div', 'forma-position', i + 1), mk('div', 'forma-ordering-text', text));
      if (!submitted) {
        item.addEventListener('dragstart', e => { item.classList.add('forma-dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', i); });
        item.addEventListener('dragend', () => item.classList.remove('forma-dragging'));
        item.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (itemsEl.querySelector('.forma-dragging') !== item) item.classList.add('forma-drop-target'); });
        item.addEventListener('dragleave', () => item.classList.remove('forma-drop-target'));
        item.addEventListener('drop', e => {
          e.preventDefault(); item.classList.remove('forma-drop-target');
          const from = parseInt(e.dataTransfer.getData('text/plain'));
          if (from !== i) { current.splice(i, 0, current.splice(from, 1)[0]); renderItems(); sync(); }
        });
      }
      itemsEl.appendChild(item);
    });
  }

  renderItems();

  const { btnRow, submitBtn: checkBtn, tryAgainBtn } = createSubmitRow('Check Order');
  const resetBtn = mk('button', 'forma-btn forma-btn-secondary', 'Reset');
  resetBtn.style.marginRight = '12px';
  btnRow.style.marginBottom = '16px';

  checkBtn.addEventListener('click', () => {
    if (submitted) return;
    submitted = true; checkBtn.disabled = true; resetBtn.style.display = 'none';
    const ok = current.every((v, i) => v === correct[i]);
    [...itemsEl.querySelectorAll('.forma-ordering-item')].forEach((el, i) => {
      el.draggable = false; el.style.cursor = 'default';
      el.classList.add(current[i] === correct[i] ? 'forma-correct' : 'forma-incorrect');
    });
    feedbackEl.textContent = ok ? '✓ Correct order!' : '✗ Incorrect order';
    feedbackEl.className = `forma-feedback ${ok ? 'forma-correct' : 'forma-incorrect'}`;
    feedbackEl.style.display = 'block';
    tryAgainBtn.style.display = 'inline-block';
    model.set('value', { order: current, correct: ok }); model.save_changes();
  });

  resetBtn.addEventListener('click', () => {
    if (submitted) return;
    current = [...correct];
    if (model.get('shuffle')) shuffle(current);
    renderItems(); feedbackEl.style.display = 'none'; sync();
  });

  tryAgainBtn.addEventListener('click', () => {
    submitted = false;
    checkBtn.disabled = false;
    tryAgainBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
    current = [...correct];
    if (model.get('shuffle')) shuffle(current);
    renderItems();
    feedbackEl.style.display = 'none';
    sync();
  });

  btnRow.append(checkBtn, resetBtn, tryAgainBtn);
  container.append(itemsEl, btnRow, feedbackEl);
  addHelpButton(container, model.get('lang'), HELP_TEXT);
  el.appendChild(container);

  function sync() { if (!submitted) { model.set('value', { order: current, correct: false }); model.save_changes(); } }
}

// Parse a <div class="forma-ordering"> block.
// Question from the first <p>; correct order from <ol> list items.
// current_order is a shuffled copy shown to the student initially.
export function parseHTML(div) {
  const question = div.querySelector('p')?.textContent.trim() ?? '';
  const items    = [...div.querySelectorAll('ol li')].map(li => li.textContent.trim());
  const current_order = [...items];
  shuffle(current_order);
  return { question, items, current_order, shuffle: true, lang: div.dataset.lang ?? 'en' };
}

export default { render };

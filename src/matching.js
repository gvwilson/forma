import styles from './styles.css';
import { addHelpButton } from './help.js';
import { mk, shuffle } from './utils.js';

const HELP_TEXT = {
  en: 'Drag items from the right column and drop them into the matching slots in the middle column. Click a placed item to remove it and try again. All items must be matched before you can check your answers. Click Try Again to reset and retry.',
  fr: 'Faites glisser les éléments de la colonne droite et déposez-les dans les emplacements correspondants de la colonne centrale. Cliquez sur un élément placé pour le retirer. Tous les éléments doivent être appariés avant de vérifier. Cliquez sur Réessayer pour recommencer.',
  es: 'Arrastre los elementos de la columna derecha y suéltelos en las ranuras correspondientes de la columna central. Haga clic en un elemento colocado para eliminarlo. Todos los elementos deben estar emparejados antes de verificar. Haga clic en Reintentar para volver a intentarlo.',
};

function render({ model, el }) {
  const s = mk('style'); s.textContent = styles; el.appendChild(s);
  const container = mk('div', 'forma');
  container.appendChild(mk('div', 'forma-question', model.get('question')));
  container.appendChild(mk('div', 'forma-instructions', 'Drag labels from the right column to match with items on the left:'));

  const left = model.get('left'), right = model.get('right');
  const correctMap = Object.fromEntries(Object.entries(model.get('correct_matches')).map(([k, v]) => [+k, +v]));
  const matches = {};
  let submitted = false;

  const grid = mk('div', 'forma-matching-three-col');

  const leftItems = left.map(text => mk('div', 'forma-item-fixed', text));

  const zones = left.map((_, li) => {
    const z = mk('div', 'forma-drop-zone', '(drop here)');
    z.addEventListener('dragover', e => { if (submitted) return; e.preventDefault(); z.classList.add('forma-drop-target'); });
    z.addEventListener('dragleave', () => z.classList.remove('forma-drop-target'));
    z.addEventListener('drop', e => {
      if (submitted) return;
      e.preventDefault(); z.classList.remove('forma-drop-target');
      const ri = parseInt(e.dataTransfer.getData('text/plain'));
      z.textContent = right[ri]; z.className = 'forma-drop-zone forma-filled';
      matches[li] = ri; sync();
      z.addEventListener('click', () => {
        if (submitted) return;
        z.textContent = '(drop here)'; z.className = 'forma-drop-zone';
        delete matches[li]; sync();
      });
    });
    return z;
  });

  const rightItems = right.map((text, i) => {
    const d = mk('div', 'forma-item-draggable', text); d.draggable = true;
    d.addEventListener('dragstart', e => { if (submitted) return; d.classList.add('forma-dragging'); e.dataTransfer.effectAllowed = 'copy'; e.dataTransfer.setData('text/plain', i); });
    d.addEventListener('dragend', () => d.classList.remove('forma-dragging'));
    return d;
  });

  // Append in row order so the CSS grid places each trio on the same row,
  // giving all three cells in a row the same height.
  left.forEach((_, i) => grid.append(leftItems[i], zones[i], rightItems[i]));
  container.appendChild(grid);

  const btnRow = mk('div'); btnRow.style.marginBottom = '16px';
  const submitBtn = mk('button', 'forma-btn forma-btn-primary', 'Check Answers'); submitBtn.style.marginRight = '12px';
  const tryAgainBtn = mk('button', 'forma-btn forma-btn-secondary', 'Try Again'); tryAgainBtn.style.display = 'none';

  submitBtn.addEventListener('click', () => {
    if (submitted) return;
    if (Object.keys(matches).length !== left.length) { alert('Please match all items before checking answers.'); return; }
    submitted = true; submitBtn.disabled = true;
    rightItems.forEach(d => { d.draggable = false; d.style.cssText = 'cursor:default;opacity:.5'; });
    let score = 0;
    zones.forEach((z, li) => {
      const ok = matches[li] === correctMap[li];
      if (ok) score++;
      leftItems[li].classList.add(ok ? 'forma-correct' : 'forma-incorrect');
      z.classList.add(ok ? 'forma-correct' : 'forma-incorrect');
      z.appendChild(mk('span', ok ? 'forma-correct' : 'forma-incorrect', ok ? ' ✓' : ' ✗'));
    });
    container.appendChild(mk('div', `forma-feedback ${score === left.length ? 'forma-correct' : 'forma-incorrect'}`, `Score: ${score}/${left.length} correct`));
    tryAgainBtn.style.display = 'inline-block';
    model.set('value', { matches, correct: score === left.length, score, total: left.length });
    model.save_changes();
  });

  tryAgainBtn.addEventListener('click', () => {
    submitted = false;
    submitBtn.disabled = false;
    tryAgainBtn.style.display = 'none';
    Object.keys(matches).forEach(k => delete matches[k]);
    zones.forEach(z => { z.textContent = '(drop here)'; z.className = 'forma-drop-zone'; });
    leftItems.forEach(li => li.classList.remove('forma-correct', 'forma-incorrect'));
    rightItems.forEach(d => { d.draggable = true; d.style.cssText = ''; });
    const fb = container.querySelector('.forma-feedback');
    if (fb) fb.remove();
    sync();
  });

  btnRow.append(submitBtn, tryAgainBtn);
  container.appendChild(btnRow);
  addHelpButton(container, model.get('lang'), HELP_TEXT);
  el.appendChild(container);

  function sync() { model.set('value', { matches, correct: false, score: 0, total: left.length }); model.save_changes(); }
}

// Parse a <div class="forma-matching"> block.
// Question from the first <p>; each table row defines one left/right pair.
// The right column is shuffled; correct_matches is updated to reflect the new order.
export function parseHTML(div) {
  const question = div.querySelector('p')?.textContent.trim() ?? '';
  // Skip header rows (from <thead> or containing <th> cells) so that
  // Markdown-generated tables with a required header row parse correctly.
  const rows = [...div.querySelectorAll('tr')].filter(
    r => r.closest('thead') === null && r.querySelector('th') === null
  );
  const left         = rows.map(r => r.cells[0].textContent.trim());
  const rightOrdered = rows.map(r => r.cells[1].textContent.trim());
  const indices      = rightOrdered.map((_, i) => i);
  shuffle(indices);
  const right          = indices.map(i => rightOrdered[i]);
  const correct_matches = Object.fromEntries(left.map((_, i) => [i, indices.indexOf(i)]));
  return { question, left, right, correct_matches, lang: div.dataset.lang ?? 'en' };
}

export default { render };

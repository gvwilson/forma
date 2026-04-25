// Default label for the <summary> element
const DEFAULT_SUMMARY = 'Show explanation';

// Find all div.forma-show-hide elements under `root`, wrap their contents in a
// <details class="explanation"><summary>...</summary>...</details> block, and
// replace the original div.  The summary text can be customised with a
// data-summary attribute on the div.
export function mountShowHide(root = document) {
  root.querySelectorAll('.forma-show-hide').forEach(div => {
    const summary = document.createElement('summary');
    summary.textContent = div.dataset.summary ?? DEFAULT_SUMMARY;

    const details = document.createElement('details');
    details.className = 'explanation';
    details.appendChild(summary);

    while (div.firstChild) {
      details.appendChild(div.firstChild);
    }

    div.replaceWith(details);
  });
}

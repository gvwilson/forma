/**
 * Build script for Forma — formative assessment widgets.
 *
 * Two outputs:
 *   dist/widgets/  — per-widget ESM files for anywidget / marimo_learn
 *   dist/forma.js  — standalone bundle for npm / CDN use
 */

import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

// Per-widget builds consumed by the Python marimo_learn package (via npm install forma)
const widgetConfig = {
  entryPoints: [
    'src/concept-map.js',
    'src/flashcard.js',
    'src/labeling.js',
    'src/matching.js',
    'src/multiple-choice.js',
    'src/numeric-entry.js',
    'src/ordering.js',
    'src/predict-then-check.js',
  ],
  bundle: true,
  format: 'esm',
  outdir: 'dist/widgets',
  minify: false,
  sourcemap: true,
  logLevel: 'info',
  loader: { '.css': 'text' },
};

// Single standalone bundle for use without Python (npm / CDN)
const bundleConfig = {
  entryPoints: ['src/index.js'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/forma.js',
  minify: false,
  sourcemap: true,
  logLevel: 'info',
  loader: { '.css': 'text' },
};

async function build() {
  try {
    if (isWatch) {
      console.log('Watching for changes...');
      const [ctx1, ctx2] = await Promise.all([
        esbuild.context(widgetConfig),
        esbuild.context(bundleConfig),
      ]);
      await Promise.all([ctx1.watch(), ctx2.watch()]);
      console.log('Watch mode active');
    } else {
      console.log('Building JavaScript modules...');
      await Promise.all([
        esbuild.build(widgetConfig),
        esbuild.build(bundleConfig),
      ]);
      console.log('Build complete!');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();

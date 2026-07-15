const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = require('@noah-ji/lyra-ui');
const overlay = require('@noah-ji/lyra-ui/overlay');

if (!root.Button || !root.DataTable || !overlay.useOverlayZIndex) {
  throw new Error('CJS public exports are incomplete');
}

async function main() {
  const loadingButton = renderToStaticMarkup(
    React.createElement(root.Button, { loading: true }, '处理中'),
  );

  assert.match(loadingButton, /aria-busy="true"/);
  assert.match(loadingButton, /<svg(?:\s|>)/);

  const cjsFirst = overlay.acquireZIndex();
  const esmOverlay = await import('@noah-ji/lyra-ui/overlay');
  const esmSecond = esmOverlay.acquireZIndex();
  const cjsThird = overlay.acquireZIndex();
  const sequence = [cjsFirst, esmSecond, cjsThird];

  assert.deepEqual(sequence, [1601, 1602, 1603]);
  console.log(`mixed-format z-index sequence: ${sequence.join(' -> ')}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

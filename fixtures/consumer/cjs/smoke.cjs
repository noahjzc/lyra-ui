const assert = require('node:assert/strict');
const root = require('@noah-ji/lyra-ui');
const overlay = require('@noah-ji/lyra-ui/overlay');

if (!root.Button || !root.DataTable || !overlay.useOverlayZIndex) {
  throw new Error('CJS public exports are incomplete');
}

async function main() {
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

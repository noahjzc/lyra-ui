const root = require('@noah-ji/lyra-ui');
const overlay = require('@noah-ji/lyra-ui/overlay');

if (!root.Button || !root.DataTable || !overlay.useOverlayZIndex) {
  throw new Error('CJS public exports are incomplete');
}

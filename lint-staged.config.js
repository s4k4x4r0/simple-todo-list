/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{ts,tsx}': ['eslint --cache --fix', 'tsc --noEmit'],
  '*.{js,css,md}': ['prettier --write'],
};

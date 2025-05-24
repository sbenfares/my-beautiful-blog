import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Ajout d'une config custom pour forcer les single quotes
  {
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
    },
  },
];

export default eslintConfig;

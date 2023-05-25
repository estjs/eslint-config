import { fileURLToPath } from 'node:url';

export const CLASS_FIELDS = ['class', 'classname'];

export const distDir = fileURLToPath(new URL('../dist', import.meta.url));
